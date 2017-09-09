window.baron = require('./core')

if (window.jQuery && window.jQuery.fn) {
    window.jQuery.fn.baron = baron
}
