/* https://github.com/Diokuz/baron */
(function(window, undefined) {
    'use strict';

    function errGlobal() {};

    var scrolls = [],
        stored = window.baron, // Stored baron vaule for noConflict usage
        $ = window.jQuery, // Trying to use jQuery
        direction = {
            v: { // Vertical
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

            h: { // Horizontal
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
        },
        err;

    if (!window) return; // Server side

    function baron(params) {
        var scrollGroup,
            event,
            selector,
            dom,
            scroller;

        err = function(message) {
            errGlobal(message, params);
        }

        params = params || {};

        // Engines initialization
        selector = params.selector || $;
        if (!selector) {
            err(1);
        }

        event = params.event || function(elem, event, func, mode) {
            $(elem)[mode || 'on'](event, func);
        };
        if (!params.event && !$) {
            err(2);
        }

        dom = params.dom || $;
        if (!dom) {
            err(3);
        }

        scroller = selector(params.scroller || this);

        if (!scroller[0]) {
            scroller = [scroller];
        }

        if (!scroller[0].nodeType) {
            err(10);
        }

        // Main constructor returning baron collection object with u() method in proto
        function constructor(data) {
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
                    scrollerPos0,
                    pos,
                    fixRadius,
                    barTopLimit = 0,
                    i, j;

                // Switch on the bar by adding user-defined CSS classname to scroller
                function barOn() {
                    if (gData.barOnCls) {
                        if (scroller[dir.client] < scroller[dir.scrollSize]) {
                            dom(scroller).addClass(gData.barOnCls);
                        } else {
                            dom(scroller).removeClass(gData.barOnCls);
                        }
                    }
                }
                
                // Updating height or width of bar
                function setBarSize(size) {
                    var barMinSize = gData.barMinSize || 20;

                    if (size > 0 && size < barMinSize) {
                        size = barMinSize;
                    }

                    if (bar) {
                        dom(bar).css(dir.size, parseInt(size) + 'px');
                    }
                }

                // Updating top or left bar position
                function posBar(pos) {
                    if (bar) {
                        dom(bar).css(dir.pos, parseInt(pos) + 'px');
                    }
                }

                // Free path for bar
                function k() {
                    return track[dir.client] - barTopLimit - bar[dir.offset];
                }

                // Relative container top position to bar top position
                function relToPos(r) {
                    return r * k() + barTopLimit;
                }

                // Bar position to relative container position
                function posToRel(t) {
                    return (t - barTopLimit) / k();
                }

                // Cursor position in main direction in px // Now with iOs support
                function getCursorPos(e) {
                    return e['client' + dir.x] || (((e.originalEvent || e).touches || {})[0] || {})['page' + dir.x];
                }

                // Text selection pos preventing
                function dontPosSelect() {
                    return false;
                }

                // Text selection preventing on drag
                function selection(enable) {
                    event(document, 'selectpos selectstart', dontPosSelect, enable ? 'off' : 'on');
                }

                // Bubbling wheel event e to scroller (from headers and scrollbar)
                // Works only in webkit, because of lack of standarts :(
                function bubbleWheel(e) {
                    try {
                        i = document.createEvent('WheelEvent'); // i - for extra byte
                        // evt.initWebKitWheelEvent(deltaX, deltaY, window, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey);
                        i.initWebKitWheelEvent(e.originalEvent.wheelDeltaX, e.originalEvent.wheelDeltaY);
                        scroller.dispatchEvent(i);
                        e.preventDefault();
                    } catch (e) {};
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
                // Viewport (re)calculation
                function uView(force) {
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

                            if ( !(i == 0 && headerTops[i] == 0) && force) {
                                event(headers[i], 'mousewheel', bubbleWheel, 'off');
                                event(headers[i], 'mousewheel', bubbleWheel);
                            }
                        }

                        if (gData.trackSmartLim) { // Bottom edge of first header as top limit for track
                            if (track != scroller) {
                                pos = {};
                                pos[dir.pos] = headers[0].parentNode[dir.offset];
                                dom(track).css(pos);
                            } else {
                                barTopLimit = headers[0].parentNode[dir.offset];
                            }
                        }
                    }
                }

                // Total positions data update, container size dependences included
                function uBar() {
                    var scrollerPos, // Scroller content position
                        oldBarSize, newBarSize,
                        hTop,
                        fixState;

                    newBarSize = (track[dir.client] - barTopLimit) * scroller[dir.client] / scroller[dir.scrollSize];

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
                this._barOn = barOn;
                this._uView = uView;
                this._uBar = uBar;

                // DOM initialization
                if (gData.bar && gData.bar[0].nodeType) {
                    bar = gData.bar[0];
                }
                if (!bar) {
                    if (gData.bar) {
                        bar = selector(gData.bar, scroller)[0];
                    } else {
                        bar = selector('*', scroller);
                        bar = bar[bar.length - 1];
                    }
                }

                if (bar) {
                    track = selector(gData.track, scroller)[0];
                    track = track || bar.parentNode;
                } else {
                    track = scroller;
                }

                // Prevent second initialization
                scroller.setAttribute('data-baron', 'inited');

                // Choosing scroll direction
                dir = data.dir;

                fixRadius = gData.fixRadius || 0; // Capturing radius for headers when fixing

                hFixCls = gData.hFixCls; // CSS classname for fixed headers

                // Events initialization
                event(scroller, 'scroll', uBar);

                event(bar, 'touchstart mousedown', function(e) { // Bar drag
                    e.preventDefault(); // Text selection disabling in Opera... and all other browsers?
                    selection(); // Disable text selection in ie8
                    drag = 1; // Save private byte
                });

                event(document, 'mouseup blur touchend', function() { // Cancelling drag when mouse key goes up and when window loose its focus
                    selection(1); // Enable text selection
                    drag = 0;
                });

                // Starting drag when mouse key (LM) goes down at bar
                event(document, 'touchstart mousedown', function(e) { // document, not window, for ie8
                    if (e.button != 2) { // Not RM
                        scrollerPos0 = getCursorPos(e) - barPos;
                    }
                });

                event(document, 'mousemove touchmove', function(e) { // document, not window, for ie8
                    if (drag) {
                        scroller[dir.scroll] = posToRel(getCursorPos(e) - scrollerPos0) * (scroller[dir.scrollSize] - scroller[dir.client]);
                    }
                });

                event(window, 'resize', resize);
                event(scroller, 'sizeChange', resize); // Custon event for alternate baron update mechanism

                event(bar, 'mousewheel', bubbleWheel);
                // if (track && track != scroller) {
                //     event(track, 'mousewheel', bubbleWheel);
                // }

                // Reinit when resize
                function resize() {
                    // Limit the resize frenquency
                    clearTimeout(rTimer);
                    rTimer = setTimeout(function() {
                        uView();
                        uBar();
                        barOn();
                    }, 200);
                };

                return this;
            };

            // Update method for one scroll group
            baron.init.prototype.update = function() {
                this._uView(1);
                this._uBar();
                this._barOn();
            };

            // Initializing scroll group, or updating it if already
            var k = 0;
            for (var i = 0 ; i < scroller.length ; i++) {
                if (!scroller[i].getAttribute('data-baron')) {
                    data.scroller = scroller[i];
                    if (data.v !== false) {
                        data.dir = direction.v;
                        data.bar = data.vbar || data.bar;
                        this[k++] = new baron.init(data);
                    }
                    if (data.h) {
                        data.dir = direction.h;
                        data.bar = data.hbar;
                        this[k++] = new baron.init(data);
                    }
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

        return baron;
    };

    baron.version = '0.5.1';

    if ($ && $.fn) { // Adding baron to jQuery as plugin
        $.fn.baron = baron;
    }
    window.baron = baron; // Use noConflict method if you need window.baron var for another purposes
    if (window['module'] && module.exports) {
        module.exports = baron.noConflict();
    }
})(window);