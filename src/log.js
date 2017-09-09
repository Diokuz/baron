module.exports = function log(level, msg, more) {
    var func = console[level] || console.log
    var args = [
        'Baron: ' + msg,
        more
    ]

    Function.prototype.apply.call(func, console, args)
}
