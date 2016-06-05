// removeIf(production)
baron.fn.log = function(level, msg, nodes) {
    var time = new Date().toString()
    var func = console[level] || console.log
    var args = [
        'Baron [ ' + time.substr(16, 8) + ' ]: ' + msg,
        nodes
    ]

    Function.prototype.apply.call(func, console, args)
}
// endRemoveIf(production)
