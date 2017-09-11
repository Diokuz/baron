var _baron = require('./core')

window.baron = _baron

if (window.jQuery && window.jQuery.fn) {
    window.jQuery.fn.baron = _baron
}
