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

                // Text selection pos preventing
                function dontPosSelect() {
                    return false;
                }

                // Text selection preventing on drag
                function selection(enable) {
                    event(document, 'selectpos', dontPosSelect, enable ? 'off' : 'on');
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