/* Fixable elements plugin for baron 0.6+ */
(function(window, undefined) {
    var fix = function(params) {
        var elements, outside, before, after, past, future, elementSelector, radius, viewPortSize, minView, limiter,
            topFixHeights = [], // inline style for element
            topRealHeights = [], // real offset position when not fixed
            headerTops = [],
            scroller = this.scroller,
            eventManager = this.event,
            $ = this.$,
            self = this;

        function fixElement(i, pos) {
            if (viewPortSize < (minView || 0)) { // No headers fixing when no enought space for viewport
                pos = undefined;
            }

            if (pos !== undefined) {
                pos += 'px';
                this.$(elements[i]).css(this.origin.pos, pos).addClass(outside);
            } else {
                this.$(elements[i]).css(this.origin.pos, '').removeClass(outside);
            }
        }

        function bubbleWheel(e) {
            try {
                i = document.createEvent('WheelEvent'); // i - for extra byte
                // evt.initWebKitWheelEvent(deltaX, deltaY, window, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey);
                i.initWebKitWheelEvent(e.originalEvent.wheelDeltaX, e.originalEvent.wheelDeltaY);
                scroller.dispatchEvent(i);
                e.preventDefault();
            } catch (e) {}
        }

        function init(_params) {
            var pos;

            if (_params) {
                elementSelector = _params.elements;
                outside = _params.outside + '';
                before = _params.before + '';
                after = _params.after + '';
                past = _params.past + '';
                future = _params.future + '';
                radius = _params.radius || 0;
                minView = _params.minView || 0;
                limiter = _params.limiter;
            }

            elements = this.$(elementSelector, this.scroller);

            if (elements) {
                viewPortSize = this.scroller[this.origin.client];
                for (var i = 0 ; i < elements.length ; i++) {
                    // Variable header heights
                    pos = {};
                    pos[this.origin.size] = elements[i][this.origin.offset];
                    if (elements[i].parentNode !== this.scroller) {
                        this.$(elements[i].parentNode).css(pos);
                    }
                    pos = {};
                    pos[this.origin.crossSize] = elements[i].parentNode[this.origin.crossClient];
                    this.$(elements[i]).css(pos);

                    // Between fixed headers
                    viewPortSize -= elements[i][this.origin.offset];

                    headerTops[i] = elements[i].parentNode[this.origin.offsetPos]; // No paddings for parentNode

                    // Summary elements height above current
                    topFixHeights[i] = (topFixHeights[i - 1] || 0); // Not zero because of negative margins
                    topRealHeights[i] = (topRealHeights[i - 1] || Math.min(headerTops[i], 0));

                    if (elements[i - 1]) {
                        topFixHeights[i] += elements[i - 1][this.origin.offset];
                        topRealHeights[i] += elements[i - 1][this.origin.offset];
                    }

                    if ( !(i == 0 && headerTops[i] == 0)/* && force */) {
                        this.event(elements[i], 'mousewheel', bubbleWheel, 'off');
                        this.event(elements[i], 'mousewheel', bubbleWheel);
                    }
                }

                if (limiter && elements[0]) { // Bottom edge of first header as top limit for track
                    if (this.track && this.track != this.scroller) {
                        pos = {};
                        pos[this.origin.pos] = elements[0].parentNode[this.origin.offset];
                        this.$(this.track).css(pos);
                    } else {
                        this.barTopLimit = elements[0].parentNode[this.origin.offset];
                    }
                    // this.barTopLimit = elements[0].parentNode[this.origin.offset];
                    this.scroll();
                }
            }

            var event = {
                element: elements,
                
                handler: function() {
                    var parent = $(this)[0].parentNode,
                        top = parent.offsetTop,
                        num;

                    // finding num -> elements[num] === this
                    for (var i = 0 ; i < elements.length ; i++ ) {
                        if (elements[i] === this) num = i;
                    }

                    var pos = top - topFixHeights[num];

                    if (params.scroll) { // User defined callback
                        params.scroll({
                            x1: self.scroller.scrollTop,
                            x2: pos
                        });
                    } else {
                        self.scroller.scrollTop = pos;
                    }
                },

                type: 'click'
            };

            if (params.clickable) {
                this._eventHandlers.push(event); // For auto-dispose
                eventManager(event.element, event.type, event.handler, 'off');
                eventManager(event.element, event.type, event.handler, 'on');
            }
        }

        this.on('init', init, params);

        this.on('init scroll', function() {
            var fixState, hTop,
                fixFlag = []; // 1 - past, 2 - future, 3 - current (not fixed)

            if (elements) {
                var change;

                // fixFlag update
                for (var i = 0 ; i < elements.length ; i++) {
                    fixState = 0;
                    if (headerTops[i] - this.pos() < topRealHeights[i] + radius) {
                        // Header trying to go up
                        fixState = 1;
                        hTop = topFixHeights[i];
                    } else if (headerTops[i] - this.pos() > topRealHeights[i] + viewPortSize - radius) {
                        // Header trying to go down
                        fixState = 2;
                        hTop = topFixHeights[i] + viewPortSize;
                    } else {
                        // Header in viewport
                        fixState = 3;
                        hTop = undefined;
                    }
                    if (fixState != fixFlag[i]) {
                        fixElement.call(this, i, hTop);
                        fixFlag[i] = fixState;
                        change = true;
                    }
                }

                // Adding positioning classes (on last top and first bottom header)
                if (change) { // At leats one change in elements flag structure occured
                    for (i = 0 ; i < elements.length ; i++) {
                        if (fixFlag[i] == 1 && past) {
                            this.$(elements[i]).addClass(past).removeClass(future);
                        }

                        if (fixFlag[i] == 2 && future) {
                            this.$(elements[i]).addClass(future).removeClass(past);
                        }

                        if (fixFlag[i] == 3 && (future || past)) {
                            this.$(elements[i]).removeClass(past).removeClass(future);
                        }

                        if (fixFlag[i] != fixFlag[i + 1] && fixFlag[i] == 1 && before) {
                            this.$(elements[i]).addClass(before).removeClass(after); // Last top fixed header
                        } else if (fixFlag[i] != fixFlag[i - 1] && fixFlag[i] == 2 && after) {
                            this.$(elements[i]).addClass(after).removeClass(before); // First bottom fixed header
                        } else {
                            this.$(elements[i]).removeClass(before).removeClass(after);
                        }
                    }
                }
            }
        });

        this.on('resize', function() {
            init.call(this);
        });
    };

    baron.fn.fix = function(params) {
        var i = 0;

        while (this[i]) {
            fix.call(this[i], params);
            i++;
        }

        return this;
    };
})(window);