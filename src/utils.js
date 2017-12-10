'use strict'

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
