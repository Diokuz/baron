(function(window, undefined) {
    'use strict';

    if (!window) return; // Server side

var
    scrolls = [],
    _baron = window.baron, // Stored baron vaule for noConflict usage
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

        if (!obj.length) obj = [obj];

        while (obj[i]) {
            iterator.call(this, obj[i], i);
            i++;
        }
    },

    baron = function(params) { // this - window or jQuery instance
        var jQueryMode = (this && this[0] && this[0].nodeType && window.jQuery),
            scrollers,
            $;

        params = params || {};
        $ = params.$ || window.jQuery;

        if (jQueryMode) {
            scrollers = this;
        } else {
            scrollers = $(params.scroller);
        }

        return new baron.fn.constructor(scrollers, params, $);
    };

    baron.fn = {
        constructor: function(scrollers, input, $) {
            var params = validate(input);

            params.$ = $;
            each.call(this, scrollers, function(scroller, i) {
                params.scroller = scroller;
                this[i] = init(params);
                this.length = i + 1;
            });

            this.params = params;
        },

        update: function() {
            //each.call(this, this, this.update);
            var i = 0;
            while (this[i]) this[i++].update();
        },

        baron: function(params) {
            params.scroller = [];

            each.call(this, this, function(elem) {
                params.scroller.push(elem.scroller);
            });
            params.direction = (this.params.direction == 'v') ? 'h' : 'v';

            return baron(params);
        }
    };

    function init(params) {
        if (params.scroller.getAttribute('data-baron-' + params.direction)) return;

        var out = new item.prototype.constructor(params); // __proto__ of returning object is baron.prototype

        params.event(params.scroller, 'scroll', function(e) {
            out.scroll(e);
        });

        if (out.bar) {
            params.event(out.bar, 'touchstart mousedown', function(e) { // Bar drag
                e.preventDefault(); // Text selection disabling in Opera... and all other browsers?
                out.selection(); // Disable text selection in ie8
                out.drag.now = 1; // Save private byte
            });
        }

        params.event(document, 'mouseup blur touchend', function() { // Cancelling drag when mouse key goes up and when window loose its focus
            out.selection(1); // Enable text selection
            out.drag.now = 0;
        });

        // Starting drag when mouse key (LM) goes down at bar
        params.event(document, 'touchstart mousedown', function(e) { // document, not window, for ie8
            if (e.button != 2) { // Not RM
                out._pos0(e);
            }
        });

        params.event(document, 'mousemove touchmove', function(e) { // document, not window, for ie8
            if (out.drag.now) {
                out.drag(e);
            }
        });

        params.event(window, 'resize', function() {
            out.update();
        });

        params.event(out.scroller, 'sizeChange', function() {
            out.update();
        }); // Custon event for alternate baron update mechanism

        params.scroller.setAttribute('data-baron-' + params.direction, 'inited');

        out.update();

        return out;
    };

    function validate(input) {
        var output = {};

        input = input || {};

        for (var key in input) {
            if (input.hasOwnProperty(key)) {
                output[key] = input[key];
            }
        }

        output.direction = output.direction || 'v';

        var event = output.event || function(elem, event, func, mode) {
            output.$(elem)[mode || 'on'](event, func);
        };

        output.event = function(elems, e, func, mode) {
            each(elems, function(elem) {
                event(elem, e, func, mode);
            })
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
                pauseTimer,
                pause,
                newFire,
                lastFire = new Date().getTime();

            $ = this.$ = params.$;
            this.event = params.event;
            this.events = {};

            function getNode(sel, context) {
                return $(sel, context)[0]; // || $(sel, context); // orly?
            }

            // DOM elements
            this.scroller = params.scroller;
            this.clipper = this.scroller.parentNode;
            this.bar = getNode(params.bar, this.clipper);
            track = this.track = getNode(params.track, this.clipper);
            if (!this.track && this.bar) {
                track = this.bar.parentNode;
            }

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
            }

            // Free path for bar
            function k() {
                return track[this.origin.client] - this.barTopLimit - this.bar[this.origin.offset];
            }

            // Relative content top position to bar top position
            function relToPos(r) {
                return r * k.call(this) + this.barTopLimit;
            }

            // Bar position to relative content position
            function posToRel(t) {
                return (t - this.barTopLimit) / k.call(this);
            }

            // Cursor position in main direction in px // Now with iOs support
            this.cursor = function(e) {
                return e['client' + this.origin.x] || (((e.originalEvent || e).touches || {})[0] || {})['page' + this.origin.x];
            }

            // Text selection pos preventing
            function dontPosSelect() {
                return false;
            }

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
                        $(this.scroller).addClass(this.barOnCls);
                    } else {
                        $(this.scroller).removeClass(this.barOnCls);
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
            this.resize = function(force) {
                newFire = new Date().getTime();
                if (newFire - lastFire < pause) return;

                var delta = this.scroller[this.origin.crossOffset] - this.scroller[this.origin.crossClient];

                if (params.freeze && !this.clipper.style[this.origin.crossSize]) { // Sould fire only once
                    $(this.clipper).css(this.origin.crossSize, this.clipper[this.origin.crossClient] - delta + 'px');
                }
                $(this.scroller).css(this.origin.crossSize, this.clipper[this.origin.crossClient] + delta + 'px');
                
                Array.prototype.unshift.call( arguments, 'resize' );
                fire.apply(this, arguments);

                lastFire = new Date().getTime();
            }

            // onScroll handler
            this.scroll = function(e) {
                newFire = new Date().getTime();
                if (newFire - lastFire < pause) return;

                var scrollDelta, oldBarSize, newBarSize;

                if (this.bar) {
                    newBarSize = (track[this.origin.client] - this.barTopLimit) * this.scroller[this.origin.client] / this.scroller[this.origin.scrollSize];

                    // Positioning bar
                    if (oldBarSize != newBarSize) {
                        setBarSize.call(this, newBarSize);
                        oldBarSize = newBarSize;
                    }
                    
                    barPos = relToPos.call(this, this.rpos());

                    posBar.call(this, barPos);
                }

                Array.prototype.unshift.call( arguments, 'scroll' );
                fire.apply(this, arguments);

                lastFire = new Date().getTime();
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

    baron.version = '0.6.0';

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