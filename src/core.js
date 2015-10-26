(function(window, $, undefined) {
    'use strict';

    if (!window) return; // Server side

    var _baron = baron; // Stored baron value for noConflict usage
    var pos = ['left', 'top', 'right', 'bottom', 'width', 'height'];
    // Global store for all baron instances (to be able to dispose them on html-nodes)
    var instances = [];
    var origin = {
        v: { // Vertical
            x: 'Y', pos: pos[1], oppos: pos[3], crossPos: pos[0], crossOpPos: pos[2],
            size: pos[5], crossSize: pos[4],
            client: 'clientHeight', crossClient: 'clientWidth',
            crossScroll: 'scrollWidth',
            offset: 'offsetHeight', crossOffset: 'offsetWidth', offsetPos: 'offsetTop',
            scroll: 'scrollTop', scrollSize: 'scrollHeight'
        },
        h: { // Horizontal
            x: 'X', pos: pos[0], oppos: pos[2], crossPos: pos[1], crossOpPos: pos[3],
            size: pos[4], crossSize: pos[5],
            client: 'clientWidth', crossClient: 'clientHeight',
            crossScroll: 'scrollHeight',
            offset: 'offsetWidth', crossOffset: 'offsetHeight', offsetPos: 'offsetLeft',
            scroll: 'scrollLeft', scrollSize: 'scrollWidth'
        }
    };

    function each(obj, iterator) {
        var i = 0;

        if (obj.length === undefined || obj === window) obj = [obj];

        while (obj[i]) {
            iterator.call(this, obj[i], i);
            i++;
        }
    }

    function baron(params) {
        var jQueryMode,
            roots,
            $;

        params = params || {};
        $ = params.$ || $ || window.jQuery;
        jQueryMode = this instanceof $;  // this - window or jQuery instance

        if (jQueryMode) {
            params.root = roots = this;
        } else {
            roots = $(params.root || params.scroller);
        }

        var instance = new baron.fn.constructor(roots, params, $);

        if (instance.autoUpdate) {
            instance.autoUpdate();
        }

        return instance;
    }

    // shortcut for getTime
    function getTime() {
        return new Date().getTime();
    }

    baron._instances = instances; // for debug

    baron.fn = {
        constructor: function(roots, input, $) {
            var params = validate(input);

            params.$ = $;
            this.length = 0;
            each.call(this, roots, function(root, i) {
                var id = +manageAttr(root, params.direction); // Could be NaN

                // baron() without params can return existing instances,
                // but baron(params) will throw an Error as a second initialization
                if (id == id && instances[id] && !input) {
                    this[i] = instances[id];
                } else {
                    var localParams = clone(params);

                    // root and scroller can be different nodes
                    if (params.root && params.scroller) {
                        localParams.scroller = params.$(params.scroller, root);
                        if (!localParams.scroller.length) {
                            localParams.scroller = root;
                        }
                    } else {
                        localParams.scroller = root;
                    }

                    localParams.root = root;
                    this[i] = init(localParams);
                }

                this.length = i + 1;
            });

            this.params = params;
        },

        dispose: function() {
            var params = this.params;

            each(this, function(item) {
                item.dispose(params);
            });

            this.params = null;
        },

        update: function() {
            var i = 0;

            while (this[i]) {
                this[i].update.apply(this[i], arguments);
                i++;
            }
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

    function manageEvents(item, eventManager, mode) {
        // Creating new functions for one baron item only one time
        item._eventHandlers = item._eventHandlers || [
            {
                // onScroll:
                element: item.scroller,

                handler: function(e) {
                    item.scroll(e);
                },

                type: 'scroll'
            }, {
                // css transitions & animations
                element: item.root,

                handler: function() {
                    item.update();
                },

                type: 'transitionend animationend'
            }, {
                // onKeyup (textarea):
                element: item.scroller,

                handler: function() {
                    item.update();
                },

                type: 'keyup'
            }, {
                // onMouseDown:
                element: item.bar,

                handler: function(e) {
                    e.preventDefault(); // Text selection disabling in Opera
                    item.selection(); // Disable text selection in ie8
                    item.drag.now = 1; // Save private byte
                    if (item.draggingCls) {
                        $(item.bar).addClass(item.draggingCls);
                    }
                },

                type: 'touchstart mousedown'
            }, {
                // onMouseUp:
                element: document,

                handler: function() {
                    item.selection(1); // Enable text selection
                    item.drag.now = 0;
                    if (item.draggingCls) {
                        $(item.bar).removeClass(item.draggingCls);
                    }
                },

                type: 'mouseup blur touchend'
            }, {
                // onCoordinateReset:
                element: document,

                handler: function(e) {
                    if (e.button != 2) { // Not RM
                        item._pos0(e);
                    }
                },

                type: 'touchstart mousedown'
            }, {
                // onMouseMove:
                element: document,

                handler: function(e) {
                    if (item.drag.now) {
                        item.drag(e);
                    }
                },

                type: 'mousemove touchmove'
            }, {
                // onResize:
                element: window,

                handler: function() {
                    item.update();
                },

                type: 'resize'
            }, {
                // sizeChange:
                element: item.root,

                handler: function() {
                    item.update();
                },

                type: 'sizeChange'
            }
        ];

        each(item._eventHandlers, function(event) {
            if (event.element) {
                eventManager(event.element, event.type, event.handler, mode);
            }
        });

        // if (item.scroller) {
        //     event(item.scroller, 'scroll', item._eventHandlers.onScroll, mode);
        // }
        // if (item.bar) {
        //     event(item.bar, 'touchstart mousedown', item._eventHandlers.onMouseDown, mode);
        // }
        // event(document, 'mouseup blur touchend', item._eventHandlers.onMouseUp, mode);
        // event(document, 'touchstart mousedown', item._eventHandlers.onCoordinateReset, mode);
        // event(document, 'mousemove touchmove', item._eventHandlers.onMouseMove, mode);
        // event(window, 'resize', item._eventHandlers.onResize, mode);
        // if (item.root) {
        //     event(item.root, 'sizeChange', item._eventHandlers.onResize, mode);
        //     // Custon event for alternate baron update mechanism
        // }
    }

    // set, remove or read baron-specific id-attribute
    function manageAttr(node, direction, mode, id) {
        var attrName = 'data-baron-' + direction + '-id';

        if (mode == 'on') {
            node.setAttribute(attrName, id);
        } else if (mode == 'off') {
            node.removeAttribute(attrName);
        } else {
            return node.getAttribute(attrName);
        }
    }

    function init(params) {
        if (manageAttr(params.root, params.direction)) {
            console.log('Error! Baron for this node already initialized', params.root);
        }

        // __proto__ of returning object is baron.prototype
        var out = new item.prototype.constructor(params);

        manageEvents(out, params.event, 'on');

        manageAttr(out.root, params.direction, 'on', instances.length);
        instances.push(out);

        out.update();

        return out;
    }

    function clone(input) {
        var output = {};

        input = input || {};

        for (var key in input) {
            if (input.hasOwnProperty(key)) {
                output[key] = input[key];
            }
        }

        return output;
    }

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
    }

    function fire(eventName) {
        /* jshint validthis:true */
        if (this.events && this.events[eventName]) {
            for (var i = 0 ; i < this.events[eventName].length ; i++) {
                var args = Array.prototype.slice.call( arguments, 1 );

                this.events[eventName][i].apply(this, args);
            }
        }
    }

    var item = {};

    item.prototype = {
        // underscore.js realization
        _debounce: function(func, wait) {
            var self = this,
                timeout,
                // args, // right now there is no need for arguments
                // context, // and for context
                timestamp;
                // result; // and for result

            var later = function() {
                if (self._disposed) {
                    clearTimeout(timeout);
                    timeout = self = null;
                    return;
                }

                var last = getTime() - timestamp;

                if (last < wait && last >= 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    // result = func.apply(context, args);
                    func();
                    // context = args = null;
                }
            };

            return function() {
                // context = this;
                // args = arguments;
                timestamp = getTime();

                if (!timeout) {
                    timeout = setTimeout(later, wait);
                }

                // return result;
            };
        },

        constructor: function(params) {
            var $,
                barPos,
                scrollerPos0,
                track,
                resizePauseTimer,
                scrollPauseTimer,
                scrollingTimer,
                pause,
                scrollLastFire,
                resizeLastFire,
                oldBarSize;

            resizeLastFire = scrollLastFire = getTime();

            $ = this.$ = params.$;
            this.event = params.event;
            this.events = {};

            function getNode(sel, context) {
                return $(sel, context)[0]; // Can be undefined
            }

            // DOM elements
            this.root = params.root; // Always html node, not just selector
            this.scroller = getNode(params.scroller);
            this.bar = getNode(params.bar, this.root);
            track = this.track = getNode(params.track, this.root);
            if (!this.track && this.bar) {
                track = this.bar.parentNode;
            }
            this.clipper = this.scroller.parentNode;

            // Parameters
            this.direction = params.direction;
            this.origin = origin[this.direction];
            this.barOnCls = params.barOnCls || '_baron';
            this.scrollingCls = params.scrollingCls;
            this.draggingCls = params.draggingCls;
            this.barTopLimit = 0;
            pause = params.pause * 1000 || 0;

            // Updating height or width of bar
            function setBarSize(size) {
                /* jshint validthis:true */
                var barMinSize = this.barMinSize || 20;

                if (size > 0 && size < barMinSize) {
                    size = barMinSize;
                }

                if (this.bar) {
                    $(this.bar).css(this.origin.size, parseInt(size, 10) + 'px');
                }
            }

            // Updating top or left bar position
            function posBar(pos) {
                /* jshint validthis:true */
                if (this.bar) {
                    var was = $(this.bar).css(this.origin.pos),
                        will = +pos + 'px';

                    if (will && will != was) {
                        $(this.bar).css(this.origin.pos, will);
                    }
                }
            }

            // Free path for bar
            function k() {
                /* jshint validthis:true */
                return track[this.origin.client] - this.barTopLimit - this.bar[this.origin.offset];
            }

            // Relative content top position to bar top position
            function relToPos(r) {
                /* jshint validthis:true */
                return r * k.call(this) + this.barTopLimit;
            }

            // Bar position to relative content position
            function posToRel(t) {
                /* jshint validthis:true */
                return (t - this.barTopLimit) / k.call(this);
            }

            // Cursor position in main direction in px // Now with iOs support
            this.cursor = function(e) {
                return e['client' + this.origin.x] ||
                    (((e.originalEvent || e).touches || {})[0] || {})['page' + this.origin.x];
            };

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

                if (r) {
                    x = this.pos(r * free);
                } else {
                    x = this.pos();
                }

                return x / (free || 1);
            };

            // Switch on the bar by adding user-defined CSS classname to scroller
            this.barOn = function(dispose) {
                if (this.barOnCls) {
                    if (dispose ||
                        this.scroller[this.origin.client] >= this.scroller[this.origin.scrollSize])
                    {
                        if ($(this.root).hasClass(this.barOnCls)) {
                            $(this.root).removeClass(this.barOnCls);
                        }
                    } else {
                        if (!$(this.root).hasClass(this.barOnCls)) {
                            $(this.root).addClass(this.barOnCls);
                        }
                    }
                }
            };

            this._pos0 = function(e) {
                scrollerPos0 = this.cursor(e) - barPos;
            };

            this.drag = function(e) {
                var rel = posToRel.call(this, this.cursor(e) - scrollerPos0);
                var k = (this.scroller[this.origin.scrollSize] - this.scroller[this.origin.client]);
                this.scroller[this.origin.scroll] = rel * k;
            };

            // Text selection preventing on drag
            this.selection = function(enable) {
                this.event(document, 'selectpos selectstart', dontPosSelect, enable ? 'off' : 'on');
            };

            // onResize & DOM modified handler
            this.resize = function() {
                var self = this,
                    delay = 0;

                if (getTime() - resizeLastFire < pause) {
                    clearTimeout(resizePauseTimer);
                    delay = pause;
                }

                function upd() {
                    var client,
                        offset,
                        was,
                        will;

                    offset = self.scroller[self.origin.crossOffset];

                    if (offset) { // if there is no size, css should not be set
                        self.barOn();
                        client = self.scroller[self.origin.crossClient];

                        // Two different appropches for different directions
                        if (self.direction == 'v') { // vertical
                            var delta = offset - client;

                            was = $(self.clipper).css(self.origin.crossSize);
                            will = self.clipper[self.origin.crossClient] + delta + 'px';

                            if (was != will) {
                                $(self.scroller).css(self.origin.crossSize, will);
                            }
                        } else { // horizontal
                            was = $(self.clipper).css(self.origin.crossSize);
                            will = self.scroller[self.origin.crossClient] + 'px';

                            if (was != will) {
                                $(self.clipper).css(self.origin.crossSize, will);
                            }
                        }
                    }

                    Array.prototype.unshift.call(arguments, 'resize');
                    fire.apply(self, arguments);

                    resizeLastFire = getTime();
                }

                if (delay) {
                    resizePauseTimer = setTimeout(upd, delay);
                } else {
                    upd();
                }
            };

            this.updatePositions = function() {
                var newBarSize,
                    self = this;

                if (self.bar) {
                    newBarSize = (track[self.origin.client] - self.barTopLimit) *
                        self.scroller[self.origin.client] / self.scroller[self.origin.scrollSize];

                    // Positioning bar
                    if (parseInt(oldBarSize, 10) != parseInt(newBarSize, 10)) {
                        setBarSize.call(self, newBarSize);
                        oldBarSize = newBarSize;
                    }

                    barPos = relToPos.call(self, self.rpos());

                    posBar.call(self, barPos);
                }

                Array.prototype.unshift.call( arguments, 'scroll' );
                fire.apply(self, arguments);

                scrollLastFire = getTime();
            };

            // onScroll handler
            this.scroll = function() {
                var delay = 0,
                    self = this;

                if (getTime() - scrollLastFire < pause) {
                    clearTimeout(scrollPauseTimer);
                    delay = pause;
                }

                if (delay) {
                    scrollPauseTimer = setTimeout(function() {
                        self.updatePositions();
                    }, delay);
                } else {
                    self.updatePositions();
                }

                if (self.scrollingCls) {
                    if (!scrollingTimer) {
                        this.$(this.scroller).addClass(this.scrollingCls);
                    }
                    clearTimeout(scrollingTimer);
                    scrollingTimer = setTimeout(function() {
                        self.$(self.scroller).removeClass(self.scrollingCls);
                        scrollingTimer = undefined;
                    }, 300);
                }

            };

            return this;
        },

        update: function(params) {
            fire.call(this, 'upd', params); // Update all plugins' params

            this.resize(1);
            this.updatePositions();

            return this;
        },

        // One instance
        dispose: function(params) {
            manageEvents(this, this.event, 'off');
            manageAttr(this.root, params.direction, 'off');
            this.$(this.scroller).css(this.origin.crossSize, '');
            this.barOn(true);
            fire.call(this, 'dispose');
            this._disposed = true;
        },

        on: function(eventName, func, arg) {
            var names = eventName.split(' ');

            for (var i = 0 ; i < names.length ; i++) {
                if (names[i] == 'init') {
                    func.call(this, arg);
                } else {
                    this.events[names[i]] = this.events[names[i]] || [];

                    this.events[names[i]].push(function(userArg) {
                        func.call(this, userArg || arg);
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

    baron.version = '0.7.10';

    if ($ && $.fn) { // Adding baron to jQuery as plugin
        $.fn.baron = baron;
    }

    window.baron = baron; // Use noConflict method if you need window.baron var for another purposes
    if (window['module'] && module.exports) {
        module.exports = baron.noConflict();
    }
})(window, window.$);
