You probably here because you got an error

```
Baron [ xx:xx:xx ]: no jQuery nor params.$ detected https://github.com/Diokuz/baron/blob/master/docs/logs/no-jquery-detected.md {...}
```

Baron can work without jQuery, but it still need an external *selector engine* and *event manager*. If you dont want to see jQuery in your app, thats fine. Just make sure you pass two required (in that case) params:

```js
baron({
    ...
    // Local copy of jQuery-like utility
    // Default: window.jQuery
    $: function(selector, context) {
        return bonzo(qwery(selector, context));
    },

    // Event manager
    // Default: function(elem, event, func, mode) { params.$(elem)[mode || 'on'](event, func); };
    event: function(elem, event, func, mode) { // Events manager
        if (mode == 'on') {
            elem.addEventListener(event, func);
        } else {
            elem.removeEventListener(event, func);
        }
    }
})
```

Note: your `$` must have following methods in prototype: `css`, `addClass`, `hasClass` and `removeClass`.
