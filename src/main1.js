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

                dom(bar).css(dir.size, parseInt(size) + 'px');
            }

            // Updating top or left bar position
            function posBar(pos) {
                dom(bar).css(dir.pos, parseInt(pos) + 'px');
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