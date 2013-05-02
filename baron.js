/* https://github.com/Diokuz/baron */
/*
1. Расширение барона плагинами - все основные переменные и методы засовываются в прототип
2. Плагины должны уметь получать доступ к объекту барон
3. За 1 раз инициализируется 1 направление скролла (?)
4. Отказ от скролл-групп (нах они были нужны?)
*/
(function(window, undefined) {
    'use strict';

    if (!window) return; // Server side

var
    scrolls = [],
    _baron = window.baron, // Stored baron vaule for noConflict usage
    $ = window.jQuery, // Trying to use jQuery
    direction = {
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
        var jQueryMode = (this && this[0] && this[0].nodeType);

        params = params || {};

        // Getting scroller html element
        params.$ = params.$ || window.$;
        if (jQueryMode) { // this === scroller
            params.scroller = this[0];
        } else {
            params.scroller = (params.selector || params.$)(params.scroller)[0];
        }

        if (params.scroller.getAttribute('data-baron')) return;

        var event = params.event || function(elem, event, func, mode) {
            params.$(elem)[mode || 'on'](event, func);
        };

        var out = new baron.prototype.init(params); // __proto__ of returning object is baron.prototype

        event(params.scroller, 'scroll', function() {
            out.uBar();
        });

        out.scroller.setAttribute('data-baron', 'inited');
        out.update();

        return out;
    };

    baron.prototype = {
        init: function(params) {
            var selector = params.selector || params.$;
            this.dom = params.dom || params.$;
            this.event = params.event || function(elem, event, func, mode) {
                params.$(elem)[mode || 'on'](event, func);
            };

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
            this.dir = (params.direction === 'horizontal') ? direction.h : direction.v;
            this.barOnCls = params.barOnCls;
            this.barTopLimit = params.barTopLimit || 0;

            // Switch on the bar by adding user-defined CSS classname to scroller
            this.barOn = function() {
                if (this.barOnCls) {
                    if (this.scroller[this.dir.client] < this.scroller[this.dir.scrollSize]) {
                        this.dom(this.scroller).addClass(this.barOnCls);
                    } else {
                        this.dom(this.scroller).removeClass(this.barOnCls);
                    }
                }
            };

            // Updating height or width of bar
            this.setBarSize = function(size) {
                var barMinSize = this.barMinSize || 20;

                if (size > 0 && size < this.barMinSize) {
                    size = this.barMinSize;
                }

                if (this.bar) {
                    this.dom(this.bar).css(this.dir.size, parseInt(size) + 'px');
                }
            };

            // Updating top or left bar position
            this.posBar = function(pos) {
                if (this.bar) {
                    this.dom(this.bar).css(this.dir.pos, +pos + 'px');
                }
            }

            // Free path for bar
            this.k = function() {
                var out = this.track[this.dir.client] - this.barTopLimit - this.bar[this.dir.offset];

                return out;
            }

            // Relative container top position to bar top position
            this.relToPos = function(r) {
                var out = r * this.k() + this.barTopLimit;

                return out;
            }

            // Bar position to relative container position
            this.posToRel = function(t) {
                return (t - this.barTopLimit) / k();
            }

            // Cursor position in main direction in px // Now with iOs support
            this.getCursorPos = function(e) {
                return e['client' + this.dir.x] || (((e.originalEvent || e).touches || {})[0] || {})['page' + dir.x];
            }

            // Text selection pos preventing
            this.dontPosSelect = function() {
                return false;
            }

            // Text selection preventing on drag
            this.selection = function(enable) {
                event(document, 'selectpos selectstart', this.dontPosSelect, enable ? 'off' : 'on');
            }

            // Viewport (re)calculation
            this.uView = function(force) {
                this.dom(this.scroller).css(this.dir.crossSize, this.clipper[this.dir.crossClient] + this.scroller[this.dir.crossOffset] - this.scroller[this.dir.crossClient] + 'px');
            }

            // Total positions data update, container size dependences included
            this.uBar = function() {
                var scrollerPos, scrollDelta,
                    oldBarSize, newBarSize, barPos;

                if (this.bar) {
                    newBarSize = (this.track[this.dir.client] - this.barTopLimit) * this.scroller[this.dir.client] / this.scroller[this.dir.scrollSize];

                    // Positioning bar
                    if (oldBarSize != newBarSize) {
                        this.setBarSize(newBarSize);
                        oldBarSize = newBarSize;
                    }
                    
                    scrollerPos = -(this.scroller['page' + this.dir.x + 'Offset'] || this.scroller[this.dir.scroll]);
                    scrollDelta = (this.scroller[this.dir.scrollSize] - this.scroller[this.dir.client]) || 1;
                    barPos = this.relToPos(- scrollerPos / scrollDelta);

                    this.posBar(barPos);
                }
            }

            return this;
        },

        update: function() {
            this.uView(1);
            this.barOn();
            this.uBar();

            return this;
        },

        headers: function(params) {
            
        }
    };

    baron.prototype.init.prototype = baron.prototype;

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