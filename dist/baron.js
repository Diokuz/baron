/* https://github.com/Diokuz/baron */
(function(window, undefined) {
    'use strict';

    if (typeof window == 'undefined') return; // Server side

    var scrolls = [],
        stored = window.baron, // Stored baron vaule for noConflict usage
        $ = window.jQuery, // Trying to use jQuery
        direction = {
            vertical: {
                x: 'Y',
                pos: 'top',
                crossPos: 'left',
                size: 'height',
                crossSize: 'width',
                client: 'clientHeight',
                crossClient: 'clientWidth',
                offset: 'offsetHeight',
                crossOffset: 'offsetWidth',
                offsetPos: 'offsetTop',
                scroll: 'scrollTop',
                scrollSize: 'scrollHeight'
            },

            horizontal: {
                x: 'X',
                pos: 'left',
                crossPos: 'top',
                size: 'width',
                crossSize: 'height',
                client: 'clientWidth',
                crossClient: 'clientHeight',
                offset: 'offsetWidth',
                crossOffset: 'offsetHeight',
                offsetPos: 'offsetLeft',
                scroll: 'scrollLeft',
                scrollSize: 'scrollWidth'
            }
        };

    var baron = function(params) {
        var scrollGroup;

        params = params || {};
        params.scroller = params.scroller || this; // jQuery plugin mode

        scrollGroup = new constructor(params);
        scrollGroup.u();
        scrolls.push(scrollGroup);

        return scrollGroup;
    };

    baron.u = function() {
        for (var i = 0 ; i < scrolls.length ; i++) {
            scrolls[i].u();
        }
    };

    // Use when you need "baron" global var for another purposes
    baron.noConflict = function() {
        window.baron = stored; // Restoring original value of "baron" global var

        return baron; // Returning baron
    };

    baron.version = '0.4';

    // Main constructor returning baron collection object with u() method in proto
    var constructor = function(data) {
        var event,
            selector,
            dom,
            scroller;

        // Engines initialization
        selector = data.selector || $;
        if (!selector) {
            // console.error('baron: no query selector engine found');
            return;
        }

        event = data.event || function(elem, event, func, mode) {
            $(elem)[mode || 'on'](event, func);
        };
        if (!data.event && !$) {
            return;
        }

        dom = data.dom || $;
        if (!dom) {
            // console.error('baron: no DOM utility engine found');
            return;
        }

        scroller = selector(data.scroller);
        if (!scroller) {
            // console.error('baron: no scroller found');
            return;
        }

        if (!scroller[0]) {
            scroller = [scroller];
        }

        // gData - user defined data, not changed during baron work
        baron.init = function(gData) {
            var headers,
                viewPortSize, // Non-headers viewable content summary height
                headerTops, // Initial top positions of headers
                topHeights,
                rTimer,
                bar,
                track, // Bar parent
                barPos, // bar position
                hFixCls, // CSS to be added on fixed headers
                hFixFlag = [], // State of current header (top-fix, free, bottom-fix), change of state leads to dom manipulation
                dir,
                scroller,
                drag,
                scrollerY0,
                pos,
                fixRadius,
                i, j;

            // Switch on the bar by adding user-defined CSS classname to scroller
            function barOn(on) {
                if (gData.barOnCls) {
                    if (on) {
                        dom(scroller).addClass(gData.barOnCls);
                    } else {
                        dom(scroller).removeClass(gData.barOnCls);
                    }
                }
            }

            // Swinching bar on when scrollable content is too hight, and off when scroll is not possible because of lack on content
            function invalidateBar() {
                barOn(scroller[dir.client] < scroller[dir.scrollSize]);
            }

            // Updating height or width of bar
            function setBarSize(size) {
                var barMinSize = gData.barMinSize || 20;

                if (size > 0 && size < barMinSize) {
                    size = barMinSize;
                }

                dom(bar).css(dir.size, size + 'px');
            }

            // Updating top or left bar position
            function posBar(pos) {
                dom(bar).css(dir.pos, pos + 'px');
            }

            // Free path for bar
            function k() {
                return track[dir.client] - bar[dir.offset];
            }

            // Relative container top position to bar top position
            function relToPos(r) {
                return r * k();
            }

            // Bar position to relative container position
            function posToRel(t) {
                return t / k();
            }

            // Text selection pos preventing
            function dontPosSelect() {
                return false;
            }

            // Text selection preventing on drag
            function selection(enable) {
                event(document, 'selectpos', dontPosSelect, enable ? 'off' : 'on');
            }


            // fixing or unfixing headers[i]
            function fixHeader(i, pos) {
                if (viewPortSize < (gData.viewMinSize || 0)) { // No headers fixing when no enought space for viewport
                    pos = undefined;
                }

                if (pos !== undefined) {
                    pos += 'px';
                    dom(headers[i]).css(dir.pos, pos).addClass(hFixCls);
                } else {
                    dom(headers[i]).css(dir.pos, '').removeClass(hFixCls);
                }
            }

            // Webkit bug: scroll freezing when header goes to fixed state right under cursor
            function bubbleWheel(e) {
                try {
                    i = document.createEvent('WheelEvent'); // i - for extra byte
                    // evt.initWebKitWheelEvent(deltaX, deltaY, window, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey);
                    i.initWebKitWheelEvent(e.originalEvent.wheelDeltaX, e.originalEvent.wheelDeltaY);
                    scroller.dispatchEvent(i);
                    e.preventDefault();
                } catch (e) {};
            }
            // Viewport (re)calculation
            function viewport(force) {
                // Setting scrollbar width BEFORE all other work
                dom(scroller).css(dir.crossSize, scroller.parentNode[dir.crossClient] + scroller[dir.crossOffset] - scroller[dir.crossClient] + 'px');

                viewPortSize = scroller[dir.client];

                if (force) {
                    headerTops = [];
                }

                hFixFlag = [];
                topHeights = [];

                
                headers = selector(gData.header, scroller);
                if (headers) {
                    if (force) { // For instance: if headers length changed
                        // onMouseWheel bubbling in webkit
                        event(headers, 'mousewheel', bubbleWheel, 'off');
                        event(headers, 'mousewheel', bubbleWheel);
                    }

                    for (i = 0 ; i < headers.length ; i++) {
                        // Summary headers height above current
                        topHeights[i] = (topHeights[i - 1] || 0);

                        if (headers[i - 1]) {
                            topHeights[i] += headers[i - 1][dir.offset];
                        }

                        // Variable header heights
                        pos = {};
                        pos[dir.size] = headers[i][dir.offset];
                        dom(headers[i].parentNode).css(pos);
                        pos = {};
                        pos[dir.crossSize] = headers[i].parentNode[dir.crossClient];
                        dom(headers[i]).css(pos);

                        // Between fixed headers
                        viewPortSize -= headers[i][dir.offset];

                        headerTops[i] = headers[i].parentNode[dir.offsetPos]; // No paddings for parentNode
                    }

                    if (gData.trackSmartLim) { // Bottom edge of first header as top limit for track
                        pos = {};
                        pos[dir.pos] = headers[0].parentNode[dir.offset];
                        dom(track).css(pos);
                    }
                }
            }

            // Total positions data update, container size dependences included
            function updateScrollBar() {
                var scrollerPos, // Scroller content position
                    oldBarSize, newBarSize,
                    hTop,
                    fixState;

                newBarSize = track[dir.client] * scroller[dir.client] / scroller[dir.scrollSize];

                // Positioning bar
                if (oldBarSize != newBarSize) {
                    setBarSize(newBarSize);
                    oldBarSize = newBarSize;
                }
                
                scrollerPos = -(scroller['page' + dir.x + 'Offset'] || scroller[dir.scroll]);
                barPos = relToPos(- scrollerPos / (scroller[dir.scrollSize] - scroller[dir.client]));

                posBar(barPos);
                // Positioning headers
                if (headers) {
                    var change;
                    for (i = 0 ; i < headers.length ; i++) {
                        fixState = 0;
                        if (headerTops[i] + scrollerPos < topHeights[i] + fixRadius) {
                            // Header trying to go up
                            fixState = 1;
                            hTop = topHeights[i];
                        } else if (headerTops[i] + scrollerPos > topHeights[i] + viewPortSize - fixRadius) {
                            // Header trying to go down
                            fixState = 2;
                            hTop = topHeights[i] + viewPortSize;
                        } else {
                            // Header in viewport
                            fixState = 3;
                            hTop = undefined;
                        }
                        if (fixState != hFixFlag[i]) {
                            fixHeader(i, hTop);
                            hFixFlag[i] = fixState;
                            change = true;
                        }
                    }

                    // Adding positioning classes (on last top and first bottom header)
                    if (change) { // At leats one change in headers flag structure occured
                        for (i = 0 ; i < headers.length ; i++) {
                            if (hFixFlag[i] != hFixFlag[i + 1] && hFixFlag[i] == 1 && gData.hBeforeFixCls) {
                                dom(headers[i]).addClass(gData.hBeforeFixCls).removeClass(gData.hAfterFixCls + ''); // Last top fixed header
                            } else if (hFixFlag[i] != hFixFlag[i - 1] && hFixFlag[i] == 2 && gData.hAfterFixCls) {
                                dom(headers[i]).addClass(gData.hAfterFixCls).removeClass(gData.hBeforeFixCls + ''); // First bottom fixed header
                            } else {
                                dom(headers[i]).removeClass(gData.hBeforeFixCls + '').removeClass(gData.hAfterFixCls + '');
                                // Emply string for bonzo, which does not handles removeClass(undefined)
                            }
                        }
                    }
                }
            }

            // var initialization
            scroller = gData.scroller;
            this.invalidateBar = invalidateBar;
            this.viewport = viewport;
            this.updateScrollBar = updateScrollBar;

            // DOM initialization
            if (gData.bar) {
                bar = selector(gData.bar, scroller)[0];
            } else {
                bar = selector('*', scroller);
                bar = bar[bar.length - 1];
            }
            track = selector(gData.track, scroller)[0];
            track = track || bar.parentNode;
            if (!(scroller && bar)) {
                // console.error('acbar: no scroller or bar dectected');
                return;
            }

            // Prevent second initialization
            scroller.setAttribute('data-baron', 'inited');

            // Choosing scroll direction
            dir = direction.vertical;
            if (gData.h) {
                dir = direction.horizontal;
            }

            // Capturing radius for headers when fixing
            fixRadius = gData.fixRadius || 0;

            // CSS classname for fixed headers
            hFixCls = gData.hFixCls;

            // Events initialization
            // onScroll
            event(scroller, 'scroll', updateScrollBar);

            // Bar drag
            event(bar, 'mousedown', function(e) {
                e.preventDefault(); // Text selection disabling in Opera... and all other browsers?
                selection(); // Disable text selection in ie8
                drag = 1; // Save private byte
            });

            // Cancelling drag when mouse key goes up and when window loose its focus
            event(document, 'mouseup blur', function() {
                selection(1); // Enable text selection
                drag = 0;
            });

            // Starting drag when mouse key (LM) goes down at bar
            event(document, 'mousedown', function(e) { // document, not window, for ie8
                if (e.button != 2) { // Not RM
                    scrollerY0 = e.clientY - barPos;
                }
            });

            event(document, 'mousemove', function(e) { // document, not window, for ie8
                if (drag) {
                    scroller.scrollTop = posToRel(e.clientY - scrollerY0) * (scroller[dir.scrollSize] - scroller[dir.client]);
                }
            });

            event(window, 'resize', resize);
            event(scroller, 'sizeChange', resize); // Custon event for alternate baron update mechanism

            // Reinit when resize
            function resize() {
                // Если новый ресайз произошёл быстро - отменяем предыдущий таймаут
                clearTimeout(rTimer);
                // И навешиваем новый
                rTimer = setTimeout(function() {
                    viewport();
                    updateScrollBar();
                    invalidateBar();
                }, 200);
            };

            return this;
        };

        // Update method for one scroll group
        baron.init.prototype.update = function() {
            this.viewport(1);
            this.updateScrollBar();
            this.invalidateBar();
        };

        // Initializing scroll group, or updating it if already
        for (var i = 0 ; i < scroller.length ; i++) {
            if (!scroller[i].getAttribute('data-baron')) {
                data.scroller = scroller[i];
                this[i] = new baron.init(data);
            } else {
                event(scroller[i], 'sizeChange', undefined, 'trigger');
            }
        }

        return this;
    };

    // Updating all known baron scroll groups on page
    constructor.prototype.u = function() {
        var i = -1;

        while (this[++i]) {
            this[i].update();
        }
    };

    // Adding baron to jQuery as plugin
    if ($ && $.fn) {
        $.fn.baron = baron;
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = baron;
    } else {
        window.baron = baron; // Use noConflict method if you need window.baron var for another purposes
    }
})(window);