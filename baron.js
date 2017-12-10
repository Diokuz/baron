/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Test via a getter in the options object to see if the passive property is accessed
// https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
var supportsPassive = false

try {
    var opts = Object.defineProperty({}, 'passive', {
        get: function() {
            supportsPassive = true
        }
    })

    window.addEventListener('test', null, opts)
} catch (e) {
    // pass
}

module.exports.event = function event(elem, _eventNames, handler, mode) {
    var eventNames = _eventNames.split(' ')
    var prefix = mode == 'on' ? 'add' : 'remove'

    eventNames.forEach(function(eventName) {
        var options = false

        if (['scroll', 'touchstart', 'touchmove'].indexOf(eventName) != -1 && supportsPassive) {
            options = { passive: true }
        }

        elem[prefix + 'EventListener'](eventName, handler, options)
    })
}

function each(obj, handler) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            handler(key, obj[key])
        }
    }
}

module.exports.css = function css(node, key, value) {
    var styles

    if (value === undefined) {
        // Getter mode
        if (typeof key == 'string') {
            return node.style[key]
        }

        styles = key
    } else {
        styles = {}
        styles[key] = value
    }

    each(styles, function(k, val) {
        node.style[k] = val
    })
}

module.exports.add = function add(node, cls) {
    if (!cls) {
        return
    }

    node.classList.add(cls)
}

module.exports.rm = function add(node, cls) {
    if (!cls) {
        return
    }

    node.classList.remove(cls)
}

module.exports.has = function has(node, cls) {
    if (!cls) {
        return false
    }

    return node.classList.contains(cls)
}

module.exports.clone = function clone(_input) {
    var output = {}
    var input = _input || {}

    each(input, function(key, value) {
        output[key] = value
    })

    return output
}

module.exports.qs = function qs(selector, _ctx) {
    if (selector instanceof HTMLElement) {
        return selector
    }

    var ctx = _ctx || document

    return ctx.querySelector(selector)
}

module.exports.each = each


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function log(level, msg, more) {
    var func = console[level] || console.log
    var args = [
        'Baron: ' + msg,
        more
    ]

    Function.prototype.apply.call(func, console, args)
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var g = (function() {
    return this || (1, eval)('this')
}())
var scopedWindow = g && g.window || g

var event = __webpack_require__(0).event
var css = __webpack_require__(0).css
var add = __webpack_require__(0).add
var has = __webpack_require__(0).has
var rm = __webpack_require__(0).rm
var clone = __webpack_require__(0).clone
var qs = __webpack_require__(0).qs

var _baron = baron // Stored baron value for noConflict usage
// var Item = {}
var pos = ['left', 'top', 'right', 'bottom', 'width', 'height']
// Global store for all baron instances (to be able to dispose them on html-nodes)
var instances = []
var origin = {
    v: { // Vertical
        x: 'Y', pos: pos[1], oppos: pos[3], crossPos: pos[0], crossOpPos: pos[2],
        size: pos[5],
        crossSize: pos[4], crossMinSize: 'min-' + pos[4], crossMaxSize: 'max-' + pos[4],
        client: 'clientHeight', crossClient: 'clientWidth',
        scrollEdge: 'scrollLeft',
        offset: 'offsetHeight', crossOffset: 'offsetWidth', offsetPos: 'offsetTop',
        scroll: 'scrollTop', scrollSize: 'scrollHeight'
    },
    h: { // Horizontal
        x: 'X', pos: pos[0], oppos: pos[2], crossPos: pos[1], crossOpPos: pos[3],
        size: pos[4],
        crossSize: pos[5], crossMinSize: 'min-' + pos[5], crossMaxSize: 'max-' + pos[5],
        client: 'clientWidth', crossClient: 'clientHeight',
        scrollEdge: 'scrollTop',
        offset: 'offsetWidth', crossOffset: 'offsetHeight', offsetPos: 'offsetLeft',
        scroll: 'scrollLeft', scrollSize: 'scrollWidth'
    }
}

// Some ugly vars
var opera12maxScrollbarSize = 17
// I hate you https://github.com/Diokuz/baron/issues/110
var macmsxffScrollbarSize = 15
var macosxffRe = /[\s\S]*Macintosh[\s\S]*\) Gecko[\s\S]*/
var isMacFF = macosxffRe.test(scopedWindow.navigator && scopedWindow.navigator.userAgent)

var log, liveBarons, shownErrors

if (process.env.NODE_ENV !== 'production') {
    log = __webpack_require__(2)
    liveBarons = 0
    shownErrors = {
        liveTooMany: false,
        allTooMany: false
    }
}

// window.baron and jQuery.fn.baron points to this function
function baron(user) {
    var withParams = !!user
    var tryNode = (user && user[0]) || user
    var isNode = typeof user == 'string' || tryNode instanceof HTMLElement
    var params = isNode ? { root: user } : clone(user)
    var jQueryMode
    var rootNode
    var defaultParams = {
        direction: 'v',
        barOnCls: '_scrollbar',
        resizeDebounce: 0,
        event: event,
        cssGuru: false,
        impact: 'scroller',
        position: 'static'
    }

    params = params || {}

    // Extending default params by user-defined params
    for (var key in defaultParams) {
        if (params[key] == null) { // eslint-disable-line
            params[key] = defaultParams[key]
        }
    }

    if (process.env.NODE_ENV !== 'production') {
        if (params.position == 'absolute' && params.impact == 'clipper') {
            log('error', [
                'Simultaneous use of `absolute` position and `clipper` impact values detected.',
                'Those values cannot be used together.',
                'See more https://github.com/Diokuz/baron/issues/138'
            ].join(' '), params)
        }
    }

    // `this` could be a jQuery instance
    jQueryMode = this && this instanceof scopedWindow.jQuery

    if (params._chain) {
        rootNode = params.root
    } else if (jQueryMode) {
        params.root = rootNode = this[0]
    } else {
        rootNode = qs(params.root || params.scroller)
    }

    if (process.env.NODE_ENV !== 'production') {
        if (!rootNode) {
            log('error', [
                'Baron initialization failed: root node not found.'
            ].join(', '), params)

            return // or return baron-shell?
        }
    }

    var attr = manageAttr(rootNode, params.direction)
    var id = +attr // Could be NaN

    params.index = id

    // baron() can return existing instances,
    // @TODO update params on-the-fly
    // https://github.com/Diokuz/baron/issues/124
    if (id == id && attr !== null && instances[id]) {
        if (process.env.NODE_ENV !== 'production') {
            if (withParams) {
                log('error', [
                    'repeated initialization for html-node detected',
                    'https://github.com/Diokuz/baron/blob/master/docs/logs/repeated.md'
                ].join(', '), params.root)
            }
        }

        return instances[id]
    }

    // root and scroller can be different nodes
    if (params.root && params.scroller) {
        params.scroller = qs(params.scroller, rootNode)
        if (process.env.NODE_ENV !== 'production') {
            if (!params.scroller) {
                log('error', 'Scroller not found!', rootNode, params.scroller)
            }
        }
    } else {
        params.scroller = rootNode
    }

    params.root = rootNode

    var instance = init(params)

    if (instance.autoUpdate) {
        instance.autoUpdate()
    }

    return instance
}

function arrayEach(_obj, iterator) {
    var i = 0
    var obj = _obj

    if (obj.length === undefined || obj === scopedWindow) obj = [obj]

    while (obj[i]) {
        iterator.call(this, obj[i], i)
        i++
    }
}

// shortcut for getTime
function getTime() {
    return new Date().getTime()
}

if (process.env.NODE_ENV !== 'production') {
    baron._instances = instances
}

function manageEvents(item, eventManager, mode) {
    // Creating new functions for one baron item only one time
    item._eventHandlers = item._eventHandlers || [
        {
            // onScroll:
            element: item.scroller,

            handler: function(e) {
                item.scroll(e)
            },

            type: 'scroll'
        }, {
            // css transitions & animations
            element: item.root,

            handler: function() {
                item.update()
            },

            type: 'transitionend animationend'
        }, {
            // onKeyup (textarea):
            element: item.scroller,

            handler: function() {
                item.update()
            },

            type: 'keyup'
        }, {
            // onMouseDown:
            element: item.bar,

            handler: function(e) {
                e.preventDefault() // Text selection disabling in Opera
                item.selection() // Disable text selection in ie8
                item.drag.now = 1 // Save private byte
                if (item.draggingCls) {
                    add(item.root, item.draggingCls)
                }
            },

            type: 'touchstart mousedown'
        }, {
            // onMouseUp:
            element: document,

            handler: function() {
                item.selection(1) // Enable text selection
                item.drag.now = 0
                if (item.draggingCls) {
                    rm(item.root, item.draggingCls)
                }
            },

            type: 'mouseup blur touchend'
        }, {
            // onCoordinateReset:
            element: document,

            handler: function(e) {
                if (e.button != 2) { // Not RM
                    item._pos0(e)
                }
            },

            type: 'touchstart mousedown'
        }, {
            // onMouseMove:
            element: document,

            handler: function(e) {
                if (item.drag.now) {
                    item.drag(e)
                }
            },

            type: 'mousemove touchmove'
        }, {
            // @TODO make one global listener
            // onResize:
            element: scopedWindow,

            handler: function() {
                item.update()
            },

            type: 'resize'
        }, {
            // @todo remove
            // sizeChange:
            element: item.root,

            handler: function() {
                item.update()
            },

            type: 'sizeChange'
        }, {
            // Clipper onScroll bug https://github.com/Diokuz/baron/issues/116
            element: item.clipper,

            handler: function() {
                item.clipperOnScroll()
            },

            type: 'scroll'
        }
    ]

    arrayEach(item._eventHandlers, function(evt) {
        if (evt.element) {
            // workaround for element-elements in `fix` plugin
            // @todo dispose `fix` in proper way and remove workaround
            if (evt.element.length && evt.element !== scopedWindow) {
                for (var i = 0; i < evt.element.length; i++) {
                    eventManager(evt.element[i], evt.type, evt.handler, mode)
                }
            } else {
                eventManager(evt.element, evt.type, evt.handler, mode)
            }
        }
    })

    // if (item.scroller) {
    //     event(item.scroller, 'scroll', item._eventHandlers.onScroll, mode)
    // }
    // if (item.bar) {
    //     event(item.bar, 'touchstart mousedown', item._eventHandlers.onMouseDown, mode)
    // }
    // event(document, 'mouseup blur touchend', item._eventHandlers.onMouseUp, mode)
    // event(document, 'touchstart mousedown', item._eventHandlers.onCoordinateReset, mode)
    // event(document, 'mousemove touchmove', item._eventHandlers.onMouseMove, mode)
    // event(window, 'resize', item._eventHandlers.onResize, mode)
    // if (item.root) {
    //     event(item.root, 'sizeChange', item._eventHandlers.onResize, mode)
    //     // Custon event for alternate baron update mechanism
    // }
}

// set, remove or read baron-specific id-attribute
// @returns {String|null} - id node value, or null, if there is no attr
function manageAttr(node, direction, mode, id) {
    var attrName = 'data-baron-' + direction + '-id'

    if (mode == 'on') {
        node.setAttribute(attrName, id)
    } else if (mode == 'off') {
        node.removeAttribute(attrName)
    }

    return node.getAttribute(attrName)
}

function init(params) {
    var out = new baron.prototype.constructor(params)

    manageEvents(out, params.event, 'on')

    manageAttr(out.root, params.direction, 'on', instances.length)
    instances.push(out)

    if (process.env.NODE_ENV !== 'production') {
        liveBarons++
        if (liveBarons > 100 && !shownErrors.liveTooMany) {
            log('warn', [
                'You have too many live baron instances on page (' + liveBarons + ')!',
                'Are you forget to dispose some of them?',
                'All baron instances can be found in baron._instances:'
            ].join(' '), instances)
            shownErrors.liveTooMany = true
        }
        if (instances.length > 1000 && !shownErrors.allTooMany) {
            log('warn', [
                'You have too many inited baron instances on page (' + instances.length + ')!',
                'Some of them are disposed, and thats good news.',
                'but baron.init was call too many times, and thats is bad news.',
                'All baron instances can be found in baron._instances:'
            ].join(' '), instances)
            shownErrors.allTooMany = true
        }
    }

    out.update()

    return out
}

function fire(eventName) {
    if (this.events && this.events[eventName]) {
        for (var i = 0; i < this.events[eventName].length; i++) {
            var args = Array.prototype.slice.call( arguments, 1 )

            this.events[eventName][i].apply(this, args)
        }
    }
}

baron.prototype = {
    // underscore.js realization
    // used in autoUpdate plugin
    _debounce: function(func, wait) {
        var self = this,
            timeout,
            // args, // right now there is no need for arguments
            // context, // and for context
            timestamp
            // result // and for result

        var later = function() {
            if (self._disposed) {
                clearTimeout(timeout)
                timeout = self = null
                return
            }

            var last = getTime() - timestamp

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last)
            } else {
                timeout = null
                // result = func.apply(context, args)
                func()
                // context = args = null
            }
        }

        return function() {
            // context = this
            // args = arguments
            timestamp = getTime()

            if (!timeout) {
                timeout = setTimeout(later, wait)
            }

            // return result
        }
    },

    constructor: function(params) {
        var barPos,
            scrollerPos0,
            track,
            resizePauseTimer,
            scrollingTimer,
            resizeLastFire,
            oldBarSize

        resizeLastFire = getTime()

        this.params = params
        this.event = params.event
        this.events = {}

        // DOM elements
        this.root = params.root // Always html node, not just selector
        this.scroller = qs(params.scroller)
        if (process.env.NODE_ENV !== 'production') {
            if (this.scroller.tagName == 'body') {
                log('error', [
                    'Please, do not use BODY as a scroller.',
                    'https://github.com/Diokuz/baron/blob/master/docs/logs/do-not-use-body.md'
                ].join(', '), params)
            }
        }
        this.bar = qs(params.bar, this.root)
        track = this.track = qs(params.track, this.root)
        if (!this.track && this.bar) {
            track = this.bar.parentNode
        }
        this.clipper = this.scroller.parentNode

        // Parameters
        this.direction = params.direction
        this.rtl = params.rtl
        this.origin = origin[this.direction]
        this.barOnCls = params.barOnCls
        this.scrollingCls = params.scrollingCls
        this.draggingCls = params.draggingCls
        this.impact = params.impact
        this.position = params.position
        this.rtl = params.rtl
        this.barTopLimit = 0
        this.resizeDebounce = params.resizeDebounce

        // Updating height or width of bar
        function setBarSize(_size) {
            var barMinSize = this.barMinSize || 20
            var size = _size

            if (size > 0 && size < barMinSize) {
                size = barMinSize
            }

            if (this.bar) {
                css(this.bar, this.origin.size, parseInt(size, 10) + 'px')
            }
        }

        // Updating top or left bar position
        function posBar(_pos) {
            if (this.bar) {
                var was = css(this.bar, this.origin.pos),
                    will = +_pos + 'px'

                if (will && will != was) {
                    css(this.bar, this.origin.pos, will)
                }
            }
        }

        // Free path for bar
        function k() {
            return track[this.origin.client] - this.barTopLimit - this.bar[this.origin.offset]
        }

        // Relative content top position to bar top position
        function relToPos(r) {
            return r * k.call(this) + this.barTopLimit
        }

        // Bar position to relative content position
        function posToRel(t) {
            return (t - this.barTopLimit) / k.call(this)
        }

        // Cursor position in main direction in px // Now with iOs support
        this.cursor = function(e) {
            return e['client' + this.origin.x] ||
                (((e.originalEvent || e).touches || {})[0] || {})['page' + this.origin.x]
        }

        // Text selection pos preventing
        function dontPosSelect() {
            return false
        }

        this.pos = function(x) { // Absolute scroller position in px
            var ie = 'page' + this.origin.x + 'Offset',
                key = (this.scroller[ie]) ? ie : this.origin.scroll

            if (x !== undefined) this.scroller[key] = x

            return this.scroller[key]
        }

        this.rpos = function(r) { // Relative scroller position (0..1)
            var free = this.scroller[this.origin.scrollSize] - this.scroller[this.origin.client],
                x

            if (r) {
                x = this.pos(r * free)
            } else {
                x = this.pos()
            }

            return x / (free || 1)
        }

        // Switch on the bar by adding user-defined CSS classname to scroller
        this.barOn = function(dispose) {
            if (this.barOnCls) {
                var noScroll = this.scroller[this.origin.client] >= this.scroller[this.origin.scrollSize]

                if (dispose || noScroll) {
                    if (has(this.root, this.barOnCls)) {
                        rm(this.root, this.barOnCls)
                    }
                } else if (!has(this.root, this.barOnCls)) {
                    add(this.root, this.barOnCls)
                }
            }
        }

        this._pos0 = function(e) {
            scrollerPos0 = this.cursor(e) - barPos
        }

        this.drag = function(e) {
            var rel = posToRel.call(this, this.cursor(e) - scrollerPos0)
            var sub = (this.scroller[this.origin.scrollSize] - this.scroller[this.origin.client])

            this.scroller[this.origin.scroll] = rel * sub
        }

        // Text selection preventing on drag
        this.selection = function(enable) {
            this.event(document, 'selectpos selectstart', dontPosSelect, enable ? 'off' : 'on')
        }

        // onResize & DOM modified handler
        // also fires on init
        // Note: max/min-size didnt sets if size did not really changed (for example, on init in Chrome)
        this.resize = function() {
            var self = this
            var minPeriod = (self.resizeDebounce === undefined) ? 300 : self.resizeDebounce
            var delay = 0

            if (getTime() - resizeLastFire < minPeriod) {
                clearTimeout(resizePauseTimer)
                delay = minPeriod
            }

            function upd() {
                var offset = self.scroller[self.origin.crossOffset]
                var client = self.scroller[self.origin.crossClient]
                var padding = 0
                var was, will

                // https://github.com/Diokuz/baron/issues/110
                if (isMacFF) {
                    padding = macmsxffScrollbarSize

                // Opera 12 bug https://github.com/Diokuz/baron/issues/105
                } else if (client > 0 && offset === 0) {
                    // Only Opera 12 in some rare nested flexbox cases goes here
                    // Sorry guys for magic,
                    // but I dont want to create temporary html-nodes set
                    // just for measuring scrollbar size in Opera 12.
                    // 17px for Windows XP-8.1, 15px for Mac (really rare).
                    offset = client + opera12maxScrollbarSize
                }

                if (offset) { // if there is no size, css should not be set
                    self.barOn()

                    if (self.impact == 'scroller') { // scroller
                        var delta = offset - client + padding

                        // `static` position works only for `scroller` impact
                        if (self.position == 'static') { // static
                            was = css(self.scroller, self.origin.crossSize)
                            will = self.clipper[self.origin.crossClient] + delta + 'px'

                            if (was != will) {
                                self._setCrossSizes(self.scroller, will)
                            }
                        } else { // absolute
                            var styles = {}
                            var key = self.rtl ? 'Left' : 'Right'

                            if (self.direction == 'h') {
                                key = 'Bottom'
                            }

                            styles['padding' + key] = delta + 'px'
                            css(self.scroller, styles)
                        }
                    } else { // clipper
                        was = css(self.clipper, self.origin.crossSize)
                        will = client + 'px'

                        if (was != will) {
                            self._setCrossSizes(self.clipper, will)
                        }
                    }
                } else {
                    // do nothing (display: none, or something)
                }

                Array.prototype.unshift.call(arguments, 'resize')
                fire.apply(self, arguments)

                resizeLastFire = getTime()
            }

            if (delay) {
                resizePauseTimer = setTimeout(upd, delay)
            } else {
                upd()
            }
        }

        this.updatePositions = function(force) {
            var newBarSize,
                self = this

            if (self.bar) {
                newBarSize = (track[self.origin.client] - self.barTopLimit) *
                    self.scroller[self.origin.client] / self.scroller[self.origin.scrollSize]

                // Positioning bar
                if (force || parseInt(oldBarSize, 10) != parseInt(newBarSize, 10)) {
                    setBarSize.call(self, newBarSize)
                    oldBarSize = newBarSize
                }

                barPos = relToPos.call(self, self.rpos())

                posBar.call(self, barPos)
            }

            Array.prototype.unshift.call( arguments, 'scroll' )
            fire.apply(self, arguments)
        }

        // onScroll handler
        this.scroll = function() {
            var self = this

            self.updatePositions()

            if (self.scrollingCls) {
                if (!scrollingTimer) {
                    add(self.root, self.scrollingCls)
                }
                clearTimeout(scrollingTimer)
                scrollingTimer = setTimeout(function() {
                    rm(self.root, self.scrollingCls)
                    scrollingTimer = undefined
                }, 300)
            }
        }

        // https://github.com/Diokuz/baron/issues/116
        this.clipperOnScroll = function() {
            // WTF is this line? https://github.com/Diokuz/baron/issues/134
            // if (this.direction == 'h') return

            // assign `initial scroll position` to `clipper.scrollLeft` (0 for ltr, ~20 for rtl)
            if (!this.rtl) {
                this.clipper[this.origin.scrollEdge] = 0
            } else {
                this.clipper[this.origin.scrollEdge] = this.clipper[this.origin.scrollSize]
            }
        }

        // Flexbox `align-items: stretch` (default) requires to set min-width for vertical
        // and max-height for horizontal scroll. Just set them all.
        // http://www.w3.org/TR/css-flexbox-1/#valdef-align-items-stretch
        this._setCrossSizes = function(node, size) {
            var styles = {}

            styles[this.origin.crossSize] = size
            styles[this.origin.crossMinSize] = size
            styles[this.origin.crossMaxSize] = size

            css(node, styles)
        }

        // Set common css rules
        this._dumbCss = function(on) {
            if (params.cssGuru) return

            var overflow = on ? 'hidden' : null
            var msOverflowStyle = on ? 'none' : null

            css(this.clipper, {
                overflow: overflow,
                msOverflowStyle: msOverflowStyle,
                position: this.position == 'static' ? '' : 'relative'
            })

            var scroll = on ? 'scroll' : null
            var axis = this.direction == 'v' ? 'y' : 'x'
            var scrollerCss = {}

            scrollerCss['overflow-' + axis] = scroll
            scrollerCss['box-sizing'] = 'border-box'
            scrollerCss.margin = '0'
            scrollerCss.border = '0'

            if (this.position == 'absolute') {
                scrollerCss.position = 'absolute'
                scrollerCss.top = '0'

                if (this.direction == 'h') {
                    scrollerCss.left = scrollerCss.right = '0'
                } else {
                    scrollerCss.bottom = '0'
                    scrollerCss.right = this.rtl ? '0' : ''
                    scrollerCss.left = this.rtl ? '' : '0'
                }
            }

            css(this.scroller, scrollerCss)
        }

        // onInit actions
        this._dumbCss(true)

        if (isMacFF) {
            var padding = 'paddingRight'
            var styles = {}
            // getComputedStyle is ie9+, but we here only in f ff
            var paddingWas = scopedWindow.getComputedStyle(this.scroller)[[padding]]

            if (params.direction == 'h') {
                padding = 'paddingBottom'
            } else if (params.rtl) {
                padding = 'paddingLeft'
            }

            var numWas = parseInt(paddingWas, 10)

            if (numWas != numWas) numWas = 0
            styles[padding] = (macmsxffScrollbarSize + numWas) + 'px'
            css(this.scroller, styles)
        }

        return this
    },

    // fires on any update and on init
    update: function(params) {
        if (process.env.NODE_ENV !== 'production') {
            if (this._disposed) {
                log('error', [
                    'Update on disposed baron instance detected.',
                    'You should clear your stored baron value for this instance:',
                    this
                ].join(' '), params)
            }
        }

        fire.call(this, 'upd', params) // Update all plugins' params

        this.resize(1)
        this.updatePositions(1)

        return this
    },

    // One instance
    dispose: function() {
        if (process.env.NODE_ENV !== 'production') {
            if (this._disposed) {
                log('error', 'Already disposed:', this)
            }

            liveBarons--
        }

        manageEvents(this, this.event, 'off')
        manageAttr(this.root, this.params.direction, 'off')
        if (this.params.direction == 'v') {
            this._setCrossSizes(this.scroller, '')
        } else {
            this._setCrossSizes(this.clipper, '')
        }
        this._dumbCss(false)
        this.barOn(true)
        fire.call(this, 'dispose')
        instances[this.params.index] = null
        this.params = null
        this._disposed = true
    },

    on: function(eventName, func, arg) {
        var names = eventName.split(' ')

        for (var i = 0; i < names.length; i++) {
            if (names[i] == 'init') {
                func.call(this, arg)
            } else {
                this.events[names[i]] = this.events[names[i]] || []

                this.events[names[i]].push(function(userArg) {
                    func.call(this, userArg || arg)
                })
            }
        }
    },

    baron: function(params) {
        params.root = this.params.root
        params.scroller = this.params.scroller
        params.direction = (this.params.direction == 'v') ? 'h' : 'v'
        params._chain = true

        return baron(params)
    }
}

// baron.fn.constructor.prototype = baron.fn
baron.prototype.constructor.prototype = baron.prototype

// Use when you need "baron" global var for another purposes
baron.noConflict = function() {
    scopedWindow.baron = _baron // Restoring original value of "baron" global var

    return baron
}

baron.version = '3.0.1'

baron.prototype.autoUpdate = __webpack_require__(4)(scopedWindow)
baron.prototype.fix = __webpack_require__(7)
baron.prototype.controls = __webpack_require__(6)

module.exports = baron

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* Autoupdate plugin for baron 0.6+ */

function autoUpdateOne(MutationObserver) {
    var self = this
    var watcher

    if (this._au) {
        return
    }

    function actualizeWatcher() {
        if (!self.root[self.origin.offset]) {
            startWatch()
        } else {
            stopWatch()
        }
    }

    // Set interval timeout for watching when root node will be visible
    function startWatch() {
        if (watcher) return

        watcher = setInterval(function() {
            if (self.root[self.origin.offset]) {
                stopWatch()
                self.update()
            }
        }, 300) // is it good enought for you?)
    }

    function stopWatch() {
        clearInterval(watcher)
        watcher = null
    }

    var debouncedUpdater = self._debounce(function() {
        self.update()
    }, 300)

    this._observer = new MutationObserver(function() {
        actualizeWatcher()
        self.update()
        debouncedUpdater()
    })

    this.on('init', function() {
        self._observer.observe(self.root, {
            childList: true,
            subtree: true,
            characterData: true
            // attributes: true
            // No reasons to set attributes to true
            // The case when root/child node with already properly inited baron toggled to hidden and then back to visible,
            // and the size of parent was changed during that hidden state, is very rare
            // Other cases are covered by watcher, and you still can do .update by yourself
        })

        actualizeWatcher()
    })

    this.on('dispose', function() {
        self._observer.disconnect()
        stopWatch()
        delete self._observer
    })

    this._au = true
}

module.exports = function autoUpdateCreator(win) {
    var MutationObserver = win.MutationObserver || win.WebKitMutationObserver || win.MozMutationObserver || null

    return function autoUpdate() {
        if (!MutationObserver) return this

        autoUpdateOne.call(this, MutationObserver)

        return this
    }
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var _baron = __webpack_require__(3)

window.baron = _baron

if (window.jQuery && window.jQuery.fn) {
    window.jQuery.fn.baron = _baron
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* Controls plugin for baron */

var qs = __webpack_require__(0).qs

module.exports = function controls(params) {
    var forward, backward, track, screen,
        self = this,
        event

    screen = params.screen || 0.9

    if (params.forward) {
        forward = qs(params.forward, this.clipper)

        event = {
            element: forward,

            handler: function() {
                var y = self.pos() + (params.delta || 30)

                self.pos(y)
            },

            type: 'click'
        }

        this._eventHandlers.push(event) // For auto-dispose
        this.event(event.element, event.type, event.handler, 'on')
    }

    if (params.backward) {
        backward = qs(params.backward, this.clipper)

        event = {
            element: backward,

            handler: function() {
                var y = self.pos() - (params.delta || 30)

                self.pos(y)
            },

            type: 'click'
        }

        this._eventHandlers.push(event) // For auto-dispose
        this.event(event.element, event.type, event.handler, 'on')
    }

    if (params.track) {
        if (params.track === true) {
            track = this.track
        } else {
            track = qs(params.track, this.clipper)
        }

        if (track) {
            event = {
                element: track,

                handler: function(e) {
                    // https://github.com/Diokuz/baron/issues/121
                    if (e.target != track) return

                    var x = e['offset' + self.origin.x],
                        xBar = self.bar[self.origin.offsetPos],
                        sign = 0

                    if (x < xBar) {
                        sign = -1
                    } else if (x > xBar + self.bar[self.origin.offset]) {
                        sign = 1
                    }

                    var y = self.pos() + sign * screen * self.scroller[self.origin.client]

                    self.pos(y)
                },

                type: 'mousedown'
            }

            this._eventHandlers.push(event) // For auto-dispose
            this.event(event.element, event.type, event.handler, 'on')
        }
    }
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

/* Fixable elements plugin for baron */

var log = __webpack_require__(2)
var css = __webpack_require__(0).css
var add = __webpack_require__(0).add
var rm = __webpack_require__(0).rm

module.exports = function fix(userParams) {
    var elements,
        viewPortSize,
        params = { // Default params
            outside: '',
            inside: '',
            before: '',
            after: '',
            past: '',
            future: '',
            radius: 0,
            minView: 0
        },
        topFixHeights = [], // inline style for element
        topRealHeights = [], // ? something related to negative margins for fixable elements
        headerTops = [], // offset positions when not fixed
        scroller = this.scroller,
        eventManager = this.event,
        self = this

    if (process.env.NODE_ENV !== 'production') {
        if (this.position != 'static') {
            log('error', [
                'Fix plugin cannot work properly in non-static baron position.',
                'See more https://github.com/Diokuz/baron/issues/135'
            ].join(' '), this.params)
        }
    }

    // i - number of fixing element, pos - fix-position in px, flag - 1: top, 2: bottom
    // Invocation only in case when fix-state changed
    function fixElement(i, _pos, flag) {
        var pos = _pos
        var ori = flag == 1 ? 'pos' : 'oppos'

        if (viewPortSize < (params.minView || 0)) { // No headers fixing when no enought space for viewport
            pos = undefined
        }

        // Removing all fixing stuff - we can do this because fixElement triggers only when fixState really changed
        css(elements[i], this.origin.pos, '')
        css(elements[i], this.origin.oppos, '')
        rm(elements[i], params.outside)

        // Fixing if needed
        if (pos !== undefined) {
            pos += 'px'
            css(elements[i], this.origin[ori], pos)
            add(elements[i], params.outside)
        }
    }

    function bubbleWheel(e) {
        try {
            var i = document.createEvent('WheelEvent') // i - for extra byte

            // evt.initWebKitWheelEvent(deltaX, deltaY, window, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey)
            i.initWebKitWheelEvent(e.originalEvent.wheelDeltaX, e.originalEvent.wheelDeltaY)
            scroller.dispatchEvent(i)
            e.preventDefault()
        } catch (ex) {
            //
        }
    }

    function init(_params) {
        var pos

        for (var key in _params) {
            params[key] = _params[key]
        }

        if (params.elements instanceof HTMLElement) {
            elements = [params.elements]
        } else if (typeof params.elements == 'string') {
            elements = this.scroller.querySelectorAll(params.elements)
        } else if (params.elements && params.elements[0] instanceof HTMLElement) {
            elements = params.elements
        }

        if (elements) {
            viewPortSize = this.scroller[this.origin.client]
            for (var i = 0; i < elements.length; i++) {
                // Variable header heights
                pos = {}
                pos[this.origin.size] = elements[i][this.origin.offset] + 'px'
                if (elements[i].parentNode !== this.scroller) {
                    css(elements[i].parentNode, pos)
                }
                pos = {}
                pos[this.origin.crossSize] = elements[i].parentNode[this.origin.crossClient] + 'px'
                css(elements[i], pos)

                // Between fixed headers
                viewPortSize -= elements[i][this.origin.offset]

                headerTops[i] = elements[i].parentNode[this.origin.offsetPos] // No paddings for parentNode

                // Summary elements height above current
                topFixHeights[i] = (topFixHeights[i - 1] || 0) // Not zero because of negative margins
                topRealHeights[i] = (topRealHeights[i - 1] || Math.min(headerTops[i], 0))

                if (elements[i - 1]) {
                    topFixHeights[i] += elements[i - 1][this.origin.offset]
                    topRealHeights[i] += elements[i - 1][this.origin.offset]
                }

                if ( !(i == 0 && headerTops[i] == 0)/* && force */) {
                    this.event(elements[i], 'mousewheel', bubbleWheel, 'off')
                    this.event(elements[i], 'mousewheel', bubbleWheel)
                }
            }

            if (params.limiter && elements[0]) { // Bottom edge of first header as top limit for track
                if (this.track && this.track != this.scroller) {
                    pos = {}
                    pos[this.origin.pos] = elements[0].parentNode[this.origin.offset] + 'px'
                    css(this.track, pos)
                } else {
                    this.barTopLimit = elements[0].parentNode[this.origin.offset]
                }
                // this.barTopLimit = elements[0].parentNode[this.origin.offset]
                this.scroll()
            }

            if (params.limiter === false) { // undefined (in second fix instance) should have no influence on bar limit
                this.barTopLimit = 0
            }
        }

        var event = {
            element: elements,

            handler: function() {
                var parent = this.parentNode,
                    top = parent.offsetTop,
                    num

                // finding num -> elements[num] === this
                for (var j = 0; j < elements.length; j++ ) {
                    if (elements[j] === this) num = j
                }

                var locPos = top - topFixHeights[num]

                if (params.scroll) { // User defined callback
                    params.scroll({
                        x1: self.scroller.scrollTop,
                        x2: locPos
                    })
                } else {
                    self.scroller.scrollTop = locPos
                }
            },

            type: 'click'
        }

        if (params.clickable) {
            this._eventHandlers.push(event) // For auto-dispose
            // eventManager(event.element, event.type, event.handler, 'off')
            for (var j = 0; j < event.element.length; j++) {
                eventManager(event.element[j], event.type, event.handler, 'on')
            }
        }
    }

    this.on('init', init, userParams)

    var fixFlag = [], // 1 - past, 2 - future, 3 - current (not fixed)
        gradFlag = []

    this.on('init scroll', function() {
        var fixState, hTop, gradState
        var i

        if (elements) {
            var change

            // fixFlag update
            for (i = 0; i < elements.length; i++) {
                fixState = 0
                if (headerTops[i] - this.pos() < topRealHeights[i] + params.radius) {
                    // Header trying to go up
                    fixState = 1
                    hTop = topFixHeights[i]
                } else if (headerTops[i] - this.pos() > topRealHeights[i] + viewPortSize - params.radius) {
                    // Header trying to go down
                    fixState = 2
                    // console.log('topFixHeights[i] + viewPortSize + topRealHeights[i]', topFixHeights[i], this.scroller[this.origin.client], topRealHeights[i])
                    hTop = this.scroller[this.origin.client] - elements[i][this.origin.offset] - topFixHeights[i] - viewPortSize
                    // console.log('hTop', hTop, viewPortSize, elements[this.origin.offset], topFixHeights[i])
                    // (topFixHeights[i] + viewPortSize + elements[this.origin.offset]) - this.scroller[this.origin.client]
                } else {
                    // Header in viewport
                    fixState = 3
                    hTop = undefined
                }

                gradState = false
                if (headerTops[i] - this.pos() < topRealHeights[i] || headerTops[i] - this.pos() > topRealHeights[i] + viewPortSize) {
                    gradState = true
                }

                if (fixState != fixFlag[i] || gradState != gradFlag[i]) {
                    fixElement.call(this, i, hTop, fixState)
                    fixFlag[i] = fixState
                    gradFlag[i] = gradState
                    change = true
                }
            }

            // Adding positioning classes (on last top and first bottom header)
            if (change) { // At leats one change in elements flag structure occured
                for (i = 0; i < elements.length; i++) {
                    if (fixFlag[i] == 1 && params.past) {
                        add(elements[i], params.past)
                        rm(elements[i], params.future)
                    }

                    if (fixFlag[i] == 2 && params.future) {
                        add(elements[i], params.future)
                        rm(elements[i], params.past)
                    }

                    if (fixFlag[i] == 3) {
                        rm(elements[i], params.past)
                        rm(elements[i], params.future)
                        add(elements[i], params.inside)
                    }

                    if (fixFlag[i] != fixFlag[i + 1] && fixFlag[i] == 1) {
                        add(elements[i], params.before)
                        rm(elements[i], params.after) // Last top fixed header
                    } else if (fixFlag[i] != fixFlag[i - 1] && fixFlag[i] == 2) {
                        add(elements[i], params.after)
                        rm(elements[i], params.before) // First bottom fixed header
                    } else {
                        rm(elements[i], params.before)
                        rm(elements[i], params.after)
                    }

                    if (params.grad) {
                        if (gradFlag[i]) {
                            add(elements[i], params.grad)
                        } else {
                            rm(elements[i], params.grad)
                        }
                    }
                }
            }
        }
    })

    this.on('resize upd', function(updParams) {
        init.call(this, updParams && updParams.fix)
    })

    return this
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ })
/******/ ]);