/* https://github.com/Diokuz/baron */
(function($, undefined) {
    'use strict';

    var scrolls = [],
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
                scroll: 'scrollTop'
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
                scroll: 'scrollLeft'
            }
        };

    var baron = function() {
        var data,
            root;

        if (arguments[1] === undefined) { // jQuery plugin mode
            root = this;
            data = arguments[0] || {};
        } else {
            root = arguments[0];
            data = arguments[1];
        }

        scrolls.push(new constructor(root, data));
        return scrolls[scrolls.length - 1];
    };

    baron.u = function() {
        for (var i = 0 ; i < scrolls.length ; i++) {
            scrolls[i].u();
        }
    };

    // Main constructor returning baron collection object with u() method in proto
    var constructor = function(root, data) {
        var event,
            selector,
            dom;

        // gData - user defined data, not changed during baron work
        // Constructor!
        baron.init = function(root, gData) {
            var headers,
                viewPortSize, // Non-headers viewable content summary height
                headerTops, // Initial top positions of headers
                topHeights,
                rTimer,
                scroller,
                container,
                bar,
                track, // Bar parent
                barPos, // bar position
                hFixCls, // CSS to be added on fixed headers
                hFixFlag = [], // State of current header (top-fix, free, bottom-fix), change of state leads to dom manipulation
                dir,
                drag,
                scrollerY0,
                i, j;

            // Switch on the bar by adding user-defined CSS classname
            function barOn(on) {
                if (gData.barOnCls) {
                    if (on) {
                        dom(root).addClass(gData.barOnCls || '');
                    } else {
                        dom(root).removeClass(gData.barOnCls || '');
                    }
                }
            }

            function setBarSize(size) {
                var barMinSize = gData.barMinSize || 20;

                if (size > 0 && size < barMinSize) {
                    size = barMinSize;
                }

                dom(bar).css(dir.size, size + 'px');
            }

            function posBar(pos) {
                dom(bar).css(dir.pos, pos + 'px');
            }

            // (un)Fix headers[i]
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

            this.root = root;

            // Viewport (re)calculation
            var viewport = this.viewport = function(force) {
                // Setting scrollbar width BEFORE all other work
                dom(scroller).css(dir.crossSize, scroller.parentNode[dir.crossClient] + scroller[dir.crossOffset] - scroller[dir.crossClient] + 'px');

                headers = selector(gData.header, container);
                viewPortSize = scroller[dir.client];

                if (force) {
                    headerTops = [];
                }

                hFixFlag = [];
                topHeights = [];

                if (headers) {
                    for (i = 0 ; i < headers.length ; i++) {
                        // Summary headers height above current
                        topHeights[i] = (topHeights[i - 1] || 0);

                        if (headers[i - 1]) {
                            topHeights[i] += headers[i - 1][dir.offset];
                        }

                        // Between fixed headers
                        viewPortSize -= headers[i][dir.offset];

                        if (force) {
                            headerTops[i] = headers[i].parentNode[dir.offsetPos]; // No paddings for parentNode
                        }
                    }
                }
            }

            // Total positions data update, container size dependences included
            var updateScrollBar = this.updateScrollBar = function() {
                var containerPos, // Container virtual position
                    oldBarSize, newBarSize,
                    hTop,
                    fixState;

                newBarSize = track[dir.client] * scroller[dir.client] / container[dir.offset];

                // Positioning bar
                if (oldBarSize != newBarSize) {
                    setBarSize(newBarSize);
                    oldBarSize = newBarSize;
                }
                
                containerPos = -(scroller['page' + dir.x + 'Offset'] || scroller[dir.scroll]);
                barPos = relToPos(- containerPos / (container[dir.offset] - scroller[dir.client]));

                posBar(barPos);

                // Positioning headers
                if (headers) {
                    var change;
                    for (i = 0 ; i < headers.length ; i++) {
                        fixState = 0;
                        if (headerTops[i] + containerPos < topHeights[i]) {
                            // Header trying to go up
                            fixState = 1;
                            hTop = topHeights[i];
                        } else if (headerTops[i] + containerPos > topHeights[i] + viewPortSize) {
                            // Header trying to go down
                            fixState = 2;
                            hTop = topHeights[i] + viewPortSize;
                        } else {
                            // Header in viewport
                            fixState = 3;
                            hTop = undefined;
                        }
                        if (fixState !== hFixFlag[i]) {
                            fixHeader(i, hTop);
                            hFixFlag[i] = fixState;
                            change = true;
                        }
                    }

                    // Adding positioning classes (on last top and first bottom header)
                    if (change) { // At leats one change in headers flag structure occured
                        for (i = 0 ; i < headers.length ; i++) {
                            if (hFixFlag[i] !== hFixFlag[i + 1] && hFixFlag[i] === 1 && gData.hBeforeFixCls) {
                                dom(headers[i]).addClass(gData.hBeforeFixCls).removeClass(gData.hAfterFixCls + ''); // Last top fixed header
                            } else if (hFixFlag[i] !== hFixFlag[i - 1] && hFixFlag[i] === 2 && gData.hAfterFixCls) {
                                dom(headers[i]).addClass(gData.hAfterFixCls).removeClass(gData.hBeforeFixCls + ''); // First bottom fixed header
                            } else {
                                dom(headers[i]).removeClass(gData.hBeforeFixCls + '').removeClass(gData.hAfterFixCls + '');
                            }
                        }
                    }
                }
            }

            // DOM initialization
            if (gData.scroller !== undefined) {
                scroller = selector(gData.scroller, root)[0];
            } else {
                scroller = selector('*', root)[0];
            }
            if (gData.container) {
                container = selector(gData.container, scroller)[0];
            } else {
                container = selector('*', scroller)[0];
            }
            if (gData.bar) {
                bar = selector(gData.bar, scroller)[0];
            } else {
                bar = selector('*', scroller);
                bar = bar[bar.length - 1];
            }
            track = bar.parentNode;
            
            // DOM data
            if (!(scroller && container && bar)) {
                // console.error('acbar: no scroller, container or bar dectected');
                return;
            }

            // Prevent double-init
            root.setAttribute('data-baron', 'inited');

            dir = direction.vertical;
            if (gData.h) {
                dir = direction.horizontal;
            }

            barOn(scroller[dir.client] < container[dir.offset]);

            // Viewport height calculation
            viewport(1);

            hFixCls = gData.hFixCls;

            // Events initialization
            // onScroll
            event(scroller, 'scroll', updateScrollBar, 'on');

            // onMouseWheel bubbling in webkit
            event(headers, 'mousewheel', function(e) {
                try {
                    i = document.createEvent('WheelEvent'); // i - for extra byte
                    // evt.initWebKitWheelEvent(deltaX, deltaY, window, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey);
                    i.initWebKitWheelEvent(e.originalEvent.wheelDeltaX, e.originalEvent.wheelDeltaY);
                    scroller.dispatchEvent(i);
                    e.preventDefault();
                } catch (e) {};
            });

            // Reinit when resize
            function resize() {
                // Если новый ресайз произошёл быстро - отменяем предыдущий таймаут
                clearTimeout(rTimer);
                // И навешиваем новый
                rTimer = setTimeout(function() {
                    barOn(container[dir.offset] > scroller[dir.client]);
                    viewport();
                    updateScrollBar();
                }, 200);
            };

            event(window, 'resize', resize);
            event(root, 'heightChange', resize);

            // Drag
            event(bar, 'mousedown', function(e) {
                e.preventDefault(); // Text selection disabling in Opera... and all other browsers?
                selection(); // Disable text selection in ie8
                drag = 1; // Another one byte
            });

            event(document, 'mouseup blur', function() {
                selection(1); // Enable text selection
                drag = 0;
            });

            event(document, 'mousedown', function(e) { // document, not window, for ie8
                scrollerY0 = e.clientY - barPos;
            });

            event(document, 'mousemove', function(e) { // document, not window, for ie8
                if (drag) {
                    scroller.scrollTop = posToRel(e.clientY - scrollerY0) * (container[dir.offset] - scroller[dir.client]);
                }
            });

            // First update to initialize bar look
            updateScrollBar();

            return this;
        };

        baron.init.prototype.update = function() {
            this.viewport(1);
            this.updateScrollBar();
        };

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
            // console.error('baron: no DOM utility engine founc');
            return;
        }

        if (!root[0]) {
            root = [root];
        }

        for (var i = 0 ; i < root.length ; i++) {
            if (!root[i].getAttribute('data-baron')) {
                this[i] = new baron.init(root[i], data);
            } else {
                event(root[i], 'heightChange', undefined, 'trigger');
            }
        }

        return this;
    };

    constructor.prototype.u = function() {
        var i = -1;

        while (this[++i]) {
            this[i].update();
        } 
    };

    if ($ && $.fn) {
        $.fn.baron = baron;
    }

    window.baron = baron;
})(window.jQuery);