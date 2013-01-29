!function(undefined) {
    "use strict";

    var baron = function(root, data) {
        if (!root[0]) {
            root = [root];
        }
        for (var i = 0 ; i < root.length ; i++) {
            new baron.init(root[i], data);
        }
    };

    // gData - user defined data, not changed during baron work
    baron.init = function(root, gData) {
        var headers,
            viewPortHeight, // Non-headers viewable content summary height
            headerTops, // Initial top positions of headers
            topHeights,
            rTimer,
            selector,
            event,
            dom,
            scroller,
            container,
            bar,
            barTop, // bar position
            headerFixedClass, // CSS to be added on fixed headers
            hFixFlag = [], // State of current header (top-fix, free, bottom-fix), change of state leads to dom manipulation
            drag,
            scrollerY0,
            i, j;

        // Switch on the bar by adding user-defined CSS classname
        function barOn(on) {
            if (on) {
                dom(bar).addClass(gData.barOnClass);
            } else {
                dom(bar).removeClass(gData.barOnClass);
            }
        }

        function posBar(top, height) {
            var barMinHeight = gData.barMinHeight || 20;

            dom(bar).css('top', top + 'px');
            if (height !== undefined) {
                if (height > 0 && height < barMinHeight) {
                    height = barMinHeight;
                }
                dom(bar).css('height', height + 'px');
            }
        }

        // (un)Fix headers[i]
        function fixHeader(i, top) {
            if (top !== undefined) {
                top += 'px';
            }
            dom(headers[i]).css({top: top})[((top === undefined) ? 'remove' : 'add') + 'Class'](headerFixedClass);
        }

        // Relation of bar top position to container relative top position
        function k() {
            return scroller.clientHeight - bar.offsetHeight - (gData.barTop || 0);
        }

        // Relative container top position to bar top position
        function relToTop(r) {
            return r * k() + (gData.barTop || 0);
        }

        // Bar top position to relative container top position
        function topToRel(t) {
            return (t - (gData.barTop || 0)) / k();
        }

        // Text selection start preventing
        function dontStartSelect() {
            return false;
        }

        // Text selection preventing on drag
        function selection(on) {
            // document.unselectable = on ? 'off' : 'on';
            event(document, "selectstart", dontStartSelect, on ? 'off' : '' );
            // dom(document.body).css('MozUserSelect', on ? '' : 'none' ); // Old versions of firefox
        }

        // Engines initialization
        var $ = window.jQuery;
        selector = gData.selector || $;
        if (!selector) {
            // console.error('baron: no query selector engine found');
            return;
        }
        event = gData.event || function(elem, event, func, off) {
            $(elem)[off||'on'](event, func);
        };
        if (!gData.event && !$) {
            return;
        }
        dom = gData.dom || $;
        if (!dom) {
            // console.error('baron: no DOM utility engine founc');
            return;
        }

        // DOM initialization
        scroller = selector(gData.scroller, root)[0];
        container = selector(gData.container, scroller)[0];
        bar = selector(gData.bar, scroller)[0];
        headers = selector(gData.header, container);

        // DOM data
        if (!(scroller && container && bar)) {
            // console.error('acbar: no scroller, container or bar dectected');
            return;
        }

        // Initialization. Setting scrollbar width BEFORE all other work
        barOn(scroller.clientHeight < container.offsetHeight);
        dom(scroller).css('width', scroller.parentNode.clientWidth + scroller.offsetWidth - scroller.clientWidth + 'px');

        // Viewport height calculation
        function viewport(h) {
            viewPortHeight = scroller.clientHeight;
            if (h) {
                headerTops = [];
            }
            hFixFlag = [];
            topHeights = [];
            if (headers) {
                for (i = 0 ; i < headers.length ; i++) {
                    // Summary headers height above current
                    topHeights[i] = (topHeights[i - 1] || 0);
                    if (headers[i - 1]) {
                        topHeights[i] += headers[i - 1].offsetHeight;
                    }
                    // Between fixed headers
                    viewPortHeight -= headers[i].offsetHeight;
                    if (h) {
                        headerTops[i] = headers[i].offsetTop; // No paddings for parentNode
                    }
                }
            }
        }
        viewport(1);

        headerFixedClass = gData.headerFixedClass;

        // Viewport must be positive to allow header fixing
        if (viewPortHeight < 1) {
            headers = 0; // undefined takes +1 byte :)
        }

        // Events initialization
        // onScroll
        event(scroller, 'scroll', updateScrollBar);

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

        // Resize
        event(window, 'resize', function() {
            // Если новый ресайз произошёл быстро - отменяем предыдущий таймаут
            clearTimeout(rTimer);
            // И навешиваем новый
            rTimer = setTimeout(function() {
                viewport();
                updateScrollBar();
                barOn(container.offsetHeight > scroller.clientHeight);
            }, 200);
        });

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
            scrollerY0 = e.clientY - barTop;
        });
        event(document, 'mousemove', function(e) { // document, not window, for ie8
            if (drag) {
                scroller.scrollTop = topToRel(e.clientY - scrollerY0) * (container.offsetHeight - scroller.clientHeight);
            }
        });

        // First update to initialize bar look
        updateScrollBar();

        // Total positions data update, container height dependences included
        function updateScrollBar() {
            var containerTop, // Container virtual top position
                oldBarHeight, newBarHeight,
                hTop,
                fixState; 

            containerTop = -(scroller.pageYOffset || scroller.scrollTop);
            barTop = relToTop(- containerTop / (container.offsetHeight - scroller.clientHeight));
            newBarHeight = scroller.clientHeight * scroller.clientHeight / container.offsetHeight;

            // We dont need no scrollbat -> making bar 0px height
            if (scroller.clientHeight >= container.offsetHeight) {
                newBarHeight = 0;
            }

            // Positioning bar
            if (oldBarHeight !== newBarHeight) {
                posBar(barTop, newBarHeight);
                oldBarHeight = newBarHeight;
            } else {
                posBar(barTop);
            }

            // Positioning headers
            if (headers) {
                for (i = 0 ; i < headers.length ; i++) {
                    fixState = 0;
                    if (headerTops[i] + containerTop < topHeights[i]) {
                        // Header trying to go up
                        fixState = 1;
                        hTop = topHeights[i];
                    } else if (headerTops[i] + containerTop > topHeights[i] + viewPortHeight) {
                        // Header trying to go down
                        fixState = 2;
                        hTop = topHeights[i] + viewPortHeight;
                    } else {
                        // Header in viewport
                        fixState = 3;
                        hTop = undefined;
                    }
                    if (fixState !== hFixFlag[i]) {
                        fixHeader(i, hTop);
                        hFixFlag[i] = fixState;
                    }
                }
            }
        }
    }

    window.baron = baron;
}()