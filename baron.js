/* https://github.com/Diokuz/baron */
/*
1. Расширение барона плагинами - все основные переменные и методы засовываются в прототип
2. Плагины должны уметь получать доступ к объекту барон
3. За 1 раз инициализируется 1 направление скролла (?)
4. Отказ от скролл-групп (нах они были нужны?)

Что возвращать?

jQuery:

- Сохраняется общепринятый принцип плагинов
- Не ломается чейнинг
- Плагины барона становятся плагинами jQuery, что более универсально

Baron

- Не надо обрабатывать случай когда нет jQuery
- Есть прямой доступ к барон-объекту, что нужно для обновления состояния
*/
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

    baron = function(params) { // this - window or jQuery instance
        var jQueryMode = (this && this[0] && this[0].nodeType),
            $,
            scrollers;

        $ = window.jQuery || function(selector, context) {
            return params.dom(params.selector(selector, context));
        };

        if (jQueryMode) {
            scrollers = this;
        } else {
            scrollers = $(params.scroller);
        }

        return new baron.prototype.constructor(scrollers, params, $);
    };

    baron.prototype = {
        constructor: function(scrollers, input, $) {
            var params = validate(input),
                i = 0;

            params.$ = $;
            while (scrollers[i]) {
                params.scroller = scrollers[i];
                this[i] = init(params);
                i++;
            }

            this.params = params;
        },

        update: function() {
            var i = 0;

            while (this[i]) this[i++].update();
        },

        baron: function(params) {
            var i = 0;

            params.scroller = [];
            while (this[i]) {
                params.scroller.push(this[i].scroller);
                i++;
            }
            //params.scroller = this;
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
                out.pos0(e);
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
            //jQueryMode = (this && this[0] && this[0].nodeType);

        input = input || {};

        for (var key in input) {
            if (input.hasOwnProperty(key)) {
                output[key] = input[key];
            }
        }

        output.direction = output.direction || 'v';
        output.$ = input.$ || window.$;

        output.event = output.event || function(elem, event, func, mode) {
            output.$(elem)[mode || 'on'](event, func);
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
            var selector = this.selector = params.selector || params.$,
                barPos,
                scrollerPos0;

            this.dom = params.dom || params.$;
            this.event = params.event || function(elem, event, func, mode) {
                params.$(elem)[mode || 'on'](event, func);
            };
            this.events = {};

            function getNode(sel, context) {
                if (sel) {
                    return selector(sel, context)[0] || selector(sel, context);
                }
            }

            // DOM elements
            this.scroller = params.scroller;
            this.root = this.scroller.parentNode;
            this.bar = getNode(params.bar, this.root);
            this.track = getNode(params.track, this.root);
            if (!this.track && this.bar) {
                this.track = this.bar.parentNode;
            }
            this.clipper = this.scroller.parentNode;

            // Parameters
            this.direction = params.direction;
            this.origin = origin[this.direction];
            this.barOnCls = params.barOnCls;
            this.barTopLimit = params.barTopLimit || 0;

            // Switch on the bar by adding user-defined CSS classname to scroller
            this.barOn = function() {
                if (this.barOnCls) {
                    if (this.scroller[this.origin.client] < this.scroller[this.origin.scrollSize]) {
                        this.dom(this.scroller).addClass(this.barOnCls);
                    } else {
                        this.dom(this.scroller).removeClass(this.barOnCls);
                    }
                }
            };

            this.pos0 = function(e) {
                scrollerPos0 = this.getCursorPos(e) - barPos;
            };

            this.drag = function(e) {
                this.scroller[this.origin.scroll] = this.posToRel(this.getCursorPos(e) - scrollerPos0) * (this.scroller[this.origin.scrollSize] - this.scroller[this.origin.client]);
            };

            // Updating height or width of bar
            function setBarSize(size) {
                var barMinSize = this.barMinSize || 20;

                if (size > 0 && size < this.barMinSize) {
                    size = this.barMinSize;
                }

                if (this.bar) {
                    this.dom(this.bar).css(this.origin.size, parseInt(size) + 'px');
                }
            };

            // Updating top or left bar position
            function posBar(pos) {
                if (this.bar) {
                    this.dom(this.bar).css(this.origin.pos, +pos + 'px');
                }
            }

            // Free path for bar
            function k() {
                var out = this.track[this.origin.client] - this.barTopLimit - this.bar[this.origin.offset];

                return out;
            }

            // Relative container top position to bar top position
            function relToPos(r) {
                var out = r * k.call(this) + this.barTopLimit;

                return out;
            }

            // Bar position to relative container position
            this.posToRel = function(t) {
                return (t - this.barTopLimit) / k.call(this);
            }

            // Cursor position in main direction in px // Now with iOs support
            this.getCursorPos = function(e) {
                return e['client' + this.origin.x] || (((e.originalEvent || e).touches || {})[0] || {})['page' + dir.x];
            }

            // Text selection pos preventing
            function dontPosSelect() {
                return false;
            }

            // Text selection preventing on drag
            this.selection = function(enable) {
                this.event(document, 'selectpos selectstart', dontPosSelect, enable ? 'off' : 'on');
            };

            // Viewport (re)calculation
            this.resize = function(force) {
                this.dom(this.scroller).css(this.origin.crossSize, this.clipper[this.origin.crossClient] + this.scroller[this.origin.crossOffset] - this.scroller[this.origin.crossClient] + 'px');

                Array.prototype.unshift.call( arguments, 'resize' );
                fire.apply(this, arguments);
            }

            // Total positions data update, container size dependences included
            this.scroll = function(e) {
                var scrollDelta,
                    oldBarSize, newBarSize;

                this.pos = -(this.scroller['page' + this.origin.x + 'Offset'] || this.scroller[this.origin.scroll]);
                if (this.bar) {
                    newBarSize = (this.track[this.origin.client] - this.barTopLimit) * this.scroller[this.origin.client] / this.scroller[this.origin.scrollSize];

                    // Positioning bar
                    if (oldBarSize != newBarSize) {
                        setBarSize.call(this, newBarSize);
                        oldBarSize = newBarSize;
                    }
                    
                    scrollDelta = (this.scroller[this.origin.scrollSize] - this.scroller[this.origin.client]) || 1;
                    barPos = relToPos.call(this, -this.pos / scrollDelta);

                    posBar.call(this, barPos);
                }

                Array.prototype.unshift.call( arguments, 'scroll' )
                fire.apply(this, arguments);
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

    baron.prototype.constructor.prototype = baron.prototype;
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

(function(window, undefined) {
    var fix = function(params) {
        var elements, fixCls, beforeFixCls, afterFixCls, elementSelector, fixRadius, viewPortSize, viewMinSize,
            topHeights = [],
            headerTops = [];

        function fixElement(i, pos) {
            if (viewPortSize < (viewMinSize || 0)) { // No headers fixing when no enought space for viewport
                pos = undefined;
            }

            if (pos !== undefined) {
                pos += 'px';
                this.dom(elements[i]).css(this.origin.pos, pos).addClass(fixCls);
            } else {
                this.dom(elements[i]).css(this.origin.pos, '').removeClass(fixCls);
            }
        }

        function init(params) {
            var fixFlag = [],
                pos;

            if (params) {
                elementSelector = params.elements;
                fixCls = params.fixCls;
                beforeFixCls = params.beforeFixCls;
                afterFixCls = params.afterFixCls;
                fixRadius = params.fixRadius || 0;
            }

            elements = this.selector(elementSelector, this.scroller);

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
                        this.dom(elements[i].parentNode).css(pos);
                    }
                    pos = {};
                    pos[this.origin.crossSize] = elements[i].parentNode[this.origin.crossClient];
                    this.dom(elements[i]).css(pos);

                    // Between fixed headers
                    viewPortSize -= elements[i][this.origin.offset];

                    headerTops[i] = elements[i].parentNode[this.origin.offsetPos]; // No paddings for parentNode

                    // if ( !(i == 0 && headerTops[i] == 0) && force) {
                    //     event(elements[i], 'mousewheel', bubbleWheel, 'off');
                    //     event(elements[i], 'mousewheel', bubbleWheel);
                    // }
                }

                if (this.trackSmartLim) { // Bottom edge of first header as top limit for track
                    if (this.track != this.scroller) {
                        pos = {};
                        pos[this.origin.pos] = elements[0].parentNode[this.origin.offset];
                        this.dom(this.track).css(pos);
                    } else {
                        this.barTopLimit = elements[0].parentNode[this.origin.offset];
                    }
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
                    if (headerTops[i] + this.pos < topHeights[i] + fixRadius) {
                        // Header trying to go up
                        fixState = 1;
                        hTop = topHeights[i];
                    } else if (headerTops[i] + this.pos > topHeights[i] + viewPortSize - fixRadius) {
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
                        if (fixFlag[i] != fixFlag[i + 1] && fixFlag[i] == 1 && beforeFixCls) {
                            this.dom(elements[i]).addClass(beforeFixCls).removeClass(afterFixCls + ''); // Last top fixed header
                        } else if (fixFlag[i] != fixFlag[i - 1] && fixFlag[i] == 2 && afterFixCls) {
                            this.dom(elements[i]).addClass(afterFixCls).removeClass(beforeFixCls + ''); // First bottom fixed header
                        } else {
                            this.dom(elements[i]).removeClass(beforeFixCls + '').removeClass(afterFixCls + '');
                            // Emply string for bonzo, which does not handles removeClass(undefined)
                        }
                    }
                }
            }
        });

        this.on('resize', function() {
            init.call(this);
            console.log('fix resize');
        });
    };

    baron.prototype.fix = function(params) {
        var i = 0;

        while (this[i]) {
            fix.call(this[i], params);
            i++;
        }
    };

    return this;
})(window);