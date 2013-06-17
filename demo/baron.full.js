(function(window, undefined) {
    'use strict';

    if (!window) return; // Server side

var
    scrolls = [],
    _baron = window.baron, // Stored baron value for noConflict usage
    $ = window.jQuery, // Trying to use jQuery
    origin = {
        v: { // Vertical
            x: 'Y', pos: 'top', crossPos: 'left', size: 'height', crossSize: 'width',
            client: 'clientHeight', crossClient: 'clientWidth', offset: 'offsetHeight', crossOffset: 'offsetWidth', offsetPos: 'offsetTop',
            scroll: 'scrollTop', scrollSize: 'scrollHeight'
        },
        h: { // Horizontal
            x: 'X', pos: 'left', crossPos: 'top', size: 'width', crossSize: 'height',
            client: 'clientWidth', crossClient: 'clientHeight', offset: 'offsetWidth', crossOffset: 'offsetHeight', offsetPos: 'offsetLeft',
            scroll: 'scrollLeft', scrollSize: 'scrollWidth'
        }
    },

    each = function(obj, iterator) {
        var i = 0;

        if (obj.length === undefined || obj === window) obj = [obj];

        while (obj[i]) {
            iterator.call(this, obj[i], i);
            i++;
        }
    },

    baron = function(params) { // this - window or jQuery instance
        var jQueryMode = (this && this[0] && this[0].nodeType),
            roots,
            $;

        params = params || {};
        $ = params.$ || window.jQuery;

        if (jQueryMode) {
            params.root = roots = this;
        } else {
            roots = $(params.root || params.scroller);
        }

        return new baron.fn.constructor(roots, params, $);
    };

    baron.fn = {
        constructor: function(roots, input, $) {
            var params = validate(input);

            params.$ = $;    
            each.call(this, roots, function(root, i) {
                var localParams = clone(params);

                if (params.root && params.scroller) {
                    localParams.scroller = params.$(params.scroller, root);
                    if (!localParams.scroller.length) {
                        localParams.scroller = root;
                    }
                } else {
                    localParams.scroller = root;
                }
                

                // if (!params.root && params.scroller) {
                //     localParams.scroller = root;
                // }

                // if (!params.root && !params.scroller) {
                //     localParams.scroller = root;
                // }

                // if (params.root && !params.scroller) {
                //     localParams.scroller = root;
                // }

                localParams.root = root;
                this[i] = init(localParams);
                this.length = i + 1;
            });

            this.params = params;
        },

        dispose: function() {
            each(this, function(item) {
                manageEvents(item, item.event, 'off');
                item = null;
            });
            this.params = null;
        },

        update: function() {
            var i = 0;
            while (this[i]) this[i++].update();
        },

        baron: function(params) {
            params.root = [];
            params.scroller = this.params.scroller;

            each.call(this, this, function(elem) {
                params.root.push(elem.root);
            });
            params.direction = (this.params.direction == 'v') ? 'h' : 'v';
            params._chain = true;

            return baron(params);
        }
    };

    function manageEvents(item, event, mode) {
        item._eventHandlers = item._eventHandlers || { // Creating new functions for one baron item only one time
            onScroll: function(e) {
                item.scroll(e);
            },

            onMouseDown: function(e) {
                e.preventDefault(); // Text selection disabling in Opera... and all other browsers?
                item.selection(); // Disable text selection in ie8
                item.drag.now = 1; // Save private byte
            },

            onMouseUp: function() {
                item.selection(1); // Enable text selection
                item.drag.now = 0;
            },

            onCoordinateReset: function(e) {
                if (e.button != 2) { // Not RM
                    item._pos0(e);
                }
            },

            onMouseMove: function(e) {
                if (item.drag.now) {
                    item.drag(e);
                }
            },

            onResize: function() {
                item.update();
            }
        };

        if (item.scroller) {
            event(item.scroller, 'scroll', item._eventHandlers.onScroll, mode);
        }
        if (item.bar) {
            event(item.bar, 'touchstart mousedown', item._eventHandlers.onMouseDown, mode);
        }
        event(document, 'mouseup blur touchend', item._eventHandlers.onMouseUp, mode);
        event(document, 'touchstart mousedown', item._eventHandlers.onCoordinateReset, mode);
        event(document, 'mousemove touchmove', item._eventHandlers.onMouseMove, mode);
        event(window, 'resize', item._eventHandlers.onResize, mode);
        if (item.root) {
            event(item.root, 'sizeChange', item._eventHandlers.onResize, mode); // Custon event for alternate baron update mechanism
        }
    };

    function init(params) {
        if (params.root.getAttribute('data-baron-' + params.direction)) return;

        var out = new item.prototype.constructor(params); // __proto__ of returning object is baron.prototype

        manageEvents(out, params.event, 'on');

        out.root.setAttribute('data-baron-' + params.direction, 'inited');

        out.update();

        return out;
    };

    function clone(input) {
        var output = {};

        input = input || {};

        for (var key in input) {
            if (input.hasOwnProperty(key)) {
                output[key] = input[key];
            }
        }

        return output;
    };

    function validate(input) {
        var output = clone(input);

        output.direction = output.direction || 'v';

        var event = input.event || function(elem, event, func, mode) {
            output.$(elem)[mode || 'on'](event, func);
        };

        output.event = function(elems, e, func, mode) {
            each(elems, function(elem) {
                event(elem, e, func, mode);
            });
        };

        return output;
    };

    function fire(eventName) {
        if (this.events && this.events[eventName]) {
            for (var i = 0 ; i < this.events[eventName].length ; i++) {
                this.events[eventName][i].apply(this, Array.prototype.slice.call( arguments, 1 ));
            }
        }
    };

    var item = {};

    item.prototype = {
        constructor: function(params) {
            var $,
                barPos,
                scrollerPos0,
                track,
                resizePauseTimer,
                scrollPauseTimer,
                pause,
                scrollLastFire = new Date().getTime(),
                resizeLastFire = scrollLastFire;

            $ = this.$ = params.$;
            this.event = params.event;
            this.events = {};

            function getNode(sel, context) {
                return $(sel, context)[0]; // Can be undefined
            };

            // DOM elements
            this.root = params.root; // Always html node, not just selector
            this.scroller = getNode(params.scroller); // (params.scroller) ? getNode(params.scroller, this.root) : this.root;
            this.bar = getNode(params.bar, this.root);
            track = this.track = getNode(params.track, this.root);
            if (!this.track && this.bar) {
                track = this.bar.parentNode;
            }
            this.clipper = this.scroller.parentNode;

            // Parameters
            this.direction = params.direction;
            this.origin = origin[this.direction];
            this.barOnCls = params.barOnCls;
            this.barTopLimit = 0;
            pause = params.pause * 1000 || 0;

            // Updating height or width of bar
            function setBarSize(size) {
                var barMinSize = this.barMinSize || 20;

                if (size > 0 && size < this.barMinSize) {
                    size = this.barMinSize;
                }

                if (this.bar) {
                    $(this.bar).css(this.origin.size, parseInt(size) + 'px');
                }
            };

            // Updating top or left bar position
            function posBar(pos) {
                if (this.bar) {
                    $(this.bar).css(this.origin.pos, +pos + 'px');
                }
            };

            // Free path for bar
            function k() {
                return track[this.origin.client] - this.barTopLimit - this.bar[this.origin.offset];
            };

            // Relative content top position to bar top position
            function relToPos(r) {
                return r * k.call(this) + this.barTopLimit;
            };

            // Bar position to relative content position
            function posToRel(t) {
                return (t - this.barTopLimit) / k.call(this);
            };

            // Cursor position in main direction in px // Now with iOs support
            this.cursor = function(e) {
                return e['client' + this.origin.x] || (((e.originalEvent || e).touches || {})[0] || {})['page' + this.origin.x];
            };

            // Text selection pos preventing
            function dontPosSelect() {
                return false;
            };

            this.pos = function(x) { // Absolute scroller position in px
                var ie = 'page' + this.origin.x + 'Offset',
                    key = (this.scroller[ie]) ? ie : this.origin.scroll;

                if (x !== undefined) this.scroller[key] = x;

                return this.scroller[key];
            };

            this.rpos = function(r) { // Relative scroller position (0..1)
                var free = this.scroller[this.origin.scrollSize] - this.scroller[this.origin.client],
                    x;

                if (r) x = this.pos(r * free);
                else x = this.pos();

                return x / (free || 1);
            };

            // Switch on the bar by adding user-defined CSS classname to scroller
            this.barOn = function() {
                if (this.barOnCls) {
                    if (this.scroller[this.origin.client] < this.scroller[this.origin.scrollSize]) {
                        $(this.root).addClass(this.barOnCls);
                    } else {
                        $(this.root).removeClass(this.barOnCls);
                    }
                }
            };

            this._pos0 = function(e) {
                scrollerPos0 = this.cursor(e) - barPos;
            };

            this.drag = function(e) {
                this.scroller[this.origin.scroll] = posToRel.call(this, this.cursor(e) - scrollerPos0) * (this.scroller[this.origin.scrollSize] - this.scroller[this.origin.client]);
            };

            // Text selection preventing on drag
            this.selection = function(enable) {
                this.event(document, 'selectpos selectstart', dontPosSelect, enable ? 'off' : 'on');
            };

            // onResize & DOM modified handler
            this.resize = function() {
                var self = this,
                    delay = 0;

                if (new Date().getTime() - resizeLastFire < pause) {
                    clearTimeout(resizePauseTimer);
                    delay = pause;
                }

                function upd() {
                    var delta = self.scroller[self.origin.crossOffset] - self.scroller[self.origin.crossClient];

                    if (params.freeze && !self.clipper.style[self.origin.crossSize]) { // Sould fire only once
                        $(self.clipper).css(self.origin.crossSize, self.clipper[self.origin.crossClient] - delta + 'px');
                    }
                    $(self.scroller).css(self.origin.crossSize, self.clipper[self.origin.crossClient] + delta + 'px');
                    
                    Array.prototype.unshift.call( arguments, 'resize' );
                    fire.apply(self, arguments);

                    resizeLastFire = new Date().getTime();
                };

                if (delay) {
                    resizePauseTimer = setTimeout(upd, delay);
                } else {
                    upd();
                }
            }

            // onScroll handler
            this.scroll = function(e) {
                var scrollDelta, oldBarSize, newBarSize,
                    delay = 0,
                    self = this;

                if (new Date().getTime() - scrollLastFire < pause) {
                    clearTimeout(scrollPauseTimer);
                    delay = pause;
                }

                function upd() {
                    if (self.bar) {
                        newBarSize = (track[self.origin.client] - self.barTopLimit) * self.scroller[self.origin.client] / self.scroller[self.origin.scrollSize];

                        // Positioning bar
                        if (oldBarSize != newBarSize) {
                            setBarSize.call(self, newBarSize);
                            oldBarSize = newBarSize;
                        }
                        
                        barPos = relToPos.call(self, self.rpos());

                        posBar.call(self, barPos);
                    }

                    Array.prototype.unshift.call( arguments, 'scroll' );
                    fire.apply(self, arguments);

                    scrollLastFire = new Date().getTime();
                };

                if (delay) {
                    scrollPauseTimer = setTimeout(upd, delay);
                } else {
                    upd();
                }
                
            }

            return this;
        },

        update: function() {
            this.resize(1);
            this.barOn();
            this.scroll();

            return this;
        },

        on: function(eventName, func, arg) {
            var names = eventName.split(' ');

            for (var i = 0 ; i < names.length ; i++) {
                if (names[i] == 'init') {
                    func.call(this, arg);
                } else {
                    this.events[names[i]] = this.events[names[i]] || [];

                    this.events[names[i]].push(function() {
                        func.call(this, arg);
                    });
                }
            }
        }
    };

    baron.fn.constructor.prototype = baron.fn;
    item.prototype.constructor.prototype = item.prototype;

    // Use when you need "baron" global var for another purposes
    baron.noConflict = function() {
        window.baron = _baron; // Restoring original value of "baron" global var

        return baron;
    };

    baron.version = '0.6.3';

    if ($ && $.fn) { // Adding baron to jQuery as plugin
        $.fn.baron = baron;
    }
    window.baron = baron; // Use noConflict method if you need window.baron var for another purposes
    if (window['module'] && module.exports) {
        module.exports = baron.noConflict();
    }
})(window);

/* Fixable elements plugin for baron 0.6+ */
(function(window, undefined) {
    var fix = function(params) {
        var elements, outside, before, after, elementSelector, radius, viewPortSize, minView, limiter,
            topHeights = [],
            headerTops = [],
            scroller = this.scroller;

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
            } catch (e) {};
        }

        function init(params) {
            var fixFlag = [],
                pos;

            if (params) {
                elementSelector = params.elements;
                outside = params.outside + '';
                before = params.before + '';
                after = params.after + '';
                radius = params.radius || 0;
                minView = params.minView || 0;
                limiter = params.limiter;
            }

            elements = this.$(elementSelector, this.scroller);

            if (elements) {
                viewPortSize = this.scroller[this.origin.client];
                for (var i = 0 ; i < elements.length ; i++) {
                    // Summary elements height above current
                    topHeights[i] = (topHeights[i - 1] || 0);

                    if (elements[i - 1]) {
                        topHeights[i] += elements[i - 1][this.origin.offset];
                    }

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

                    if ( !(i == 0 && headerTops[i] == 0)/* && force */) {
                        this.event(elements[i], 'mousewheel', bubbleWheel, 'off');
                        this.event(elements[i], 'mousewheel', bubbleWheel);
                    }
                }

                if (limiter) { // Bottom edge of first header as top limit for track
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
        }

        this.on('init', init, params);

        this.on('init scroll', function() {
            var fixState, hTop,
                fixFlag = [];

            if (elements) {
                var change;
                for (var i = 0 ; i < elements.length ; i++) {
                    fixState = 0;
                    if (headerTops[i] - this.pos() < topHeights[i] + radius) {
                        // Header trying to go up
                        fixState = 1;
                        hTop = topHeights[i];
                    } else if (headerTops[i] - this.pos() > topHeights[i] + viewPortSize - radius) {
                        // Header trying to go down
                        fixState = 2;
                        hTop = topHeights[i] + viewPortSize;
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
                        if (fixFlag[i] != fixFlag[i + 1] && fixFlag[i] == 1 && before) {
                            this.$(elements[i]).addClass(before).removeClass(after); // Last top fixed header
                        } else if (fixFlag[i] != fixFlag[i - 1] && fixFlag[i] == 2 && after) {
                            this.$(elements[i]).addClass(after).removeClass(before); // First bottom fixed header
                        } else {
                            this.$(elements[i]).removeClass(before).removeClass(after);
                            // Emply string for bonzo, which does not handles removeClass(undefined)
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
/* Controls plugin for baron 0.6+ */
(function(window, undefined) {
    var controls = function(params) {
        var forward, backward, track, screen, timer,
            self = this; // AAAAAA!!!!!11

        screen = params.screen || .9;

        if (params.forward) {
            forward = this.$(params.forward, this.clipper);

            this.event(forward, 'click', function() {
                var y = self.pos() - params.delta || 30;
                
                self.pos(y);
            });
        }

        if (params.backward) {
            backward = this.$(params.backward, this.clipper);

            this.event(backward, 'click', function() {
                var y = self.pos() + params.delta || 30;

                self.pos(y);
            });
        }

        if (params.track) {
            if (params.track === true) {
                track = this.track;
            } else {
                track = this.$(params.track, this.clipper)[0];
            }

            if (track) {
                this.event(track, 'mousedown', function(e) {
                    var x = e['offset' + self.origin.x],
                        xBar = self.bar[self.origin.offsetPos],
                        sign = 0;

                    if (x < xBar) {
                        sign = -1;
                    } else if (x > xBar + self.bar[self.origin.offset]) {
                        sign = 1;
                    }

                    var y = self.pos() + sign * screen * self.scroller[self.origin.client];
                    self.pos(y);
                });
            }
        }

    };

    baron.fn.controls = function(params) {
        var i = 0;

        while (this[i]) {
            controls.call(this[i], params);
            i++;
        }

        return this;
    };
})(window);
/* Autotests plugin for baron 0.6+ (for developers) */
(function(window, undefined) {
    var test = function(params) {
        var errCount = 0,
            totalCount = 0;

        var log = function(type, msg, obj) {
            var text = type + ': ' + msg;

            switch (type) {
                case 'log': css = 'color: #0b0'; break;
                case 'warn': css = 'color: #fc9'; break;
                case 'error': css = 'color: #f00'; break;
            }
            totalCount++;
            if (type == 'log') {
                errCount++;
            }

            console.log('%c ' + totalCount + '. ' + text, css);
            if (obj !== undefined) {
                console.log(obj);
            }
        }

        if (this.scroller && this.scroller.nodeType === 1) {
            log('log', 'Scroller defined and has proper nodeType value', this.scroller);
        } else {
            log('error', 'Scroller not defined or has wrong type (should be html node).', this.scroller);
        }

        if (this.$ && typeof this.$ == 'function') {
            log('log', 'Local $ defined and it is a function');
        } else {
            log('error', 'Local $ has wrong value or is not defined, or custom params.dom and params.selector not defined', params.$);
        }

        if (this.scroller.getAttribute('data-baron-v')) {
            log('log', 'Baron initialized in vertical direction', this.scroller.getAttribute('data-baron-v'));
            if (this.scroller.clientHeight < this.scroller.scrollHeight && this.scroller.getAttribute('data-baron-v')) {
                log('log', 'There are enought space for scrolling in vertical direction right now', this.scroller.scrollHeight - this.scroller.clientHeight + 'px');
            } else {
                log('log', 'There are not enought space for scrolling in vertical direction right now');
            }
        }
        if (this.scroller.getAttribute('data-baron-h')) {
            log('log', 'Baron initialized in horizontal direction', this.scroller.getAttribute('data-baron-h'));
            if (this.scroller.clientWidth < this.scroller.scrollWidth) {
                log('log', 'There are enought space for scrolling in horizontal direction right now', this.scroller.scrollWidth - this.scroller.clientWidth + 'px');
            } else {
                log('log', 'There are not enought space for scrolling in horizontal direction right now');
            }
        }

        if (this.bar && this.bar.nodeType === 1) {
            log('log', 'Bar defined and has proper nodeType value', this.bar);
        } else {
            log('warn', 'Bar not defined or has wrong type (should be html node).', this.bar);
        }
        
        if (this.barOnCls) {
            log('log', 'CSS classname barOnCls defined', this.barOnCls);
        } else {
            log('warn', 'barOnCls not defined - bar will be visible or not visible all the time', this.barOnCls);
        }

        // Preformance test
        var t1 = new Date().getTime(),
            x;
        for (var i = 0 ; i < 1000 ; i += 10) {
            x = i % (this.scroller[this.origin.scrollSize] - this.scroller[this.origin.client]);
            this.pos(x);
            this.event(this.scroller, 'scroll', undefined, 'trigger');
        }
        var t2 = new Date().getTime();
        log('log', 'Preformance test: ' + (t2 - t1) / 1000 + ' milliseconds per scroll event');
        
        log('log', 'Result is ' + errCount + ' / ' + totalCount + '\n');
    };

    baron.fn.test = function(params) {
        var i = 0;

        while (this[i]) {
            test.call(this[i], params);
            i++;
        }

        return this;
    };
})(window);
/* Pull to load plugin for baron 0.6+ */
(function(window, undefined) {
    var pull = function(params) {
        var prefix = params.prefix,
            block = this.$(params.block),
            size = params.size || this.origin.size,
            limit = params.limit || 80,
            callback = params.callback,
            elements = params.elements || [],
            inProgress = params.inProgress || '',
            self = this,
            _insistence = 0,
            _zeroXCount = 0,
            _interval,
            _x = 0,
            _called,
            _on;

        function getHeight() {
            return self.scroller[self.origin.scroll] + self.scroller[self.origin.offset];
        }

        function getScrollHeight() {
            return self.scroller[self.origin.scrollSize];
        }

        function step(x, force) {
            var k = x * .0005;
            
            return Math.floor(force - k * (x + 550));
        }

        function toggle(on) {
            _on = on;

            if (on) {
                update(); // First time with no delay
                _interval = setInterval(update, 200);
            } else {
                clearInterval(_interval);
            }
        }

        function update() {
            var pos = {},
                height = getHeight(),
                scrollHeight = getScrollHeight(),
                dx,
                op4,
                t2 = new Date().getTime();

            op4 = 0; // Возвращающая сила
            if (_insistence > 0) {
                op4 = 40;
            }
            if (_insistence) {
                dx = step(_x, op4);
                if (height >= scrollHeight - dx) {
                    _x += dx;
                } else {
                    _x = 0;
                }

                if (_x < 0) _x = 0;

                pos[size] = _x + 'px';
                self.$(block).css(pos);

                for (var i = 0 ; i < elements.length ; i++) {
                    self.$(elements[i].self).css(elements[i].property, Math.min(_x / limit * 100, 100) + '%');
                    if (inProgress) {
                        self.$(self.root).addClass(inProgress);
                    }
                }

                _insistence = -1;
            }

            if (callback && _x > limit && !_called) {
                callback();
                _called = true;
            }

            if (_x == 0) {
                _zeroXCount++;
            } else {
                _zeroXCount = 0;
            }
            if (_zeroXCount > 5) {
                toggle(false);
                _called = false;
                self.$(self.root).removeClass(inProgress);
            }
        }

        this.on('init', function() {
            toggle(true);
        });

        this.on('dispose', function() {
            toggle(false);
        });

        this.event(this.scroller, 'mousewheel DOMMouseScroll', function() {
            _insistence = 1;
            if (!_on && getHeight() >= getScrollHeight()) {
                toggle(true);
            }
        });
    };

    baron.fn.pull = function(params) {
        var i = 0;

        while (this[i]) {
            pull.call(this[i], params);
            i++;
        }

        return this;
    };
})(window);