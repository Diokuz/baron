/* https://github.com/Diokuz/baron */
(function($, undefined) {
    'use strict';

    var scrolls = [];

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
                viewPortHeight, // Non-headers viewable content summary height
                headerTops, // Initial top positions of headers
                topHeights,
                rTimer,
                scroller,
                container,
                bar,
                barTop, // bar position
                hFixCls, // CSS to be added on fixed headers
                hFixFlag = [], // State of current header (top-fix, free, bottom-fix), change of state leads to dom manipulation
                drag,
                scrollerY0,
                i, j;

            // Switch on the bar by adding user-defined CSS classname
            function barOn(on) {
                if (on) {
                    dom(bar).addClass(gData.barOnCls || '');
                } else {
                    dom(bar).removeClass(gData.barOnCls || '');
                }
            }

            function heighBar(height) {
                var barMinHeight = gData.barMinHeight || 20;

                if (height > 0 && height < barMinHeight) {
                    height = barMinHeight;
                }

                dom(bar).css({height: height + 'px'});
            }

            function posBar(top, height) {
                dom(bar).css('top', top + 'px');
            }

            // (un)Fix headers[i]
            function fixHeader(i, top) {
                if (viewPortHeight < (gData.viewMinH || 0)) { // No headers fixing when no enought space for viewport
                    top = undefined;
                }

                if (top !== undefined) {
                    top += 'px';
                    dom(headers[i]).css({top: top}).addClass(hFixCls);
                } else {
                    dom(headers[i]).css({top: top}).removeClass(hFixCls);
                }
            }

            // Relation of bar top position to container relative top position
            function k() {
                return bar.parentNode.clientHeight - bar.offsetHeight;
            }

            // Relative container top position to bar top position
            function relToTop(r) {
                return r * k();
            }

            // Bar top position to relative container top position
            function topToRel(t) {
                return t / k();
            }

            // Text selection start preventing
            function dontStartSelect() {
                return false;
            }

            // Text selection preventing on drag
            function selection(enable) {
                event(document, 'selectstart', dontStartSelect, enable ? 'off' : 'on');
            }

            this.root = root;

            // Viewport (re)calculation
            var viewport = this.viewport = function(h) {
                headers = selector(gData.header, container);
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
                            headerTops[i] = headers[i].parentNode.offsetTop; // No paddings for parentNode
                        }
                    }
                }
            }

            // Total positions data update, container height dependences included
            var updateScrollBar = this.updateScrollBar = function() {
                var containerTop, // Container virtual top position
                    oldBarHeight, newBarHeight,
                    hTop,
                    fixState;

                newBarHeight = scroller.clientHeight * scroller.clientHeight / container.offsetHeight;

                if (scroller.clientHeight >= container.offsetHeight) {
                    // We dont need no scrollbar -> making bar 0px height
                    newBarHeight = 0;
                }

                // Positioning bar
                if (oldBarHeight !== newBarHeight) {
                    heighBar(newBarHeight);
                    oldBarHeight = newBarHeight;
                }
                
                containerTop = -(scroller.pageYOffset || scroller.scrollTop);
                barTop = relToTop(- containerTop / (container.offsetHeight - scroller.clientHeight));

                posBar(barTop);

                // Positioning headers
                if (headers) {
                    var change;
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
                            change = true;
                        }
                    }

                    // Adding positioning classes (on last top and first bottom header)
                    if (change) { // At leats one change in headers flag structure occured
                        for (i = 0 ; i < headers.length ; i++) {
                            if (hFixFlag[i] !== hFixFlag[i + 1] && hFixFlag[i] === 1 && gData.hTopFixCls) {
                                dom(headers[i]).addClass(gData.hTopFixCls).removeClass(gData.hBottomFixCls + ''); // Last top fixed header
                            } else if (hFixFlag[i] !== hFixFlag[i - 1] && hFixFlag[i] === 2 && gData.hBottomFixCls) {
                                dom(headers[i]).addClass(gData.hBottomFixCls).removeClass(gData.hTopFixCls + ''); // First bottom fixed header
                            } else {
                                dom(headers[i]).removeClass(gData.hTopFixCls + '').removeClass(gData.hBottomFixCls + '');
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
            
            // DOM data
            if (!(scroller && container && bar)) {
                // console.error('acbar: no scroller, container or bar dectected');
                return;
            }

            // Prevent double-init
            root.setAttribute('data-baron', 'inited');

            // Initialization. Setting scrollbar width BEFORE all other work
            barOn(scroller.clientHeight < container.offsetHeight);
            dom(scroller).css('width', scroller.parentNode.clientWidth + scroller.offsetWidth - scroller.clientWidth + 'px');

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
                    viewport();
                    updateScrollBar();
                    barOn(container.offsetHeight > scroller.clientHeight);
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
                scrollerY0 = e.clientY - barTop;
            });

            event(document, 'mousemove', function(e) { // document, not window, for ie8
                if (drag) {
                    scroller.scrollTop = topToRel(e.clientY - scrollerY0) * (container.offsetHeight - scroller.clientHeight);
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