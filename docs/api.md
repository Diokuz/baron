## Baron API

### initialization parameters

```js
var params = {
    // Two modes available: 'static' (width = width + 17), 'absolute' (right: -17px).
    // Note: fixable headers works only in 'static' position
    // Default: 'static'
    position: 'absolute',

    // Flag, indicating that you know your css,
    // and baron must minimize the count of setted inline css rules
    // (i.e. overflow: hidden for clipper and overflow-y: scroll for scroller)
    // Default: false
    cssGuru: true,

    // Whos width (height) will be setted?
    // Default: 'scroller'
    impact: 'clipper',

    // Selector for `scroller` element.
    // Default: this (in jQuery mode).
    scroller: '.scroller',

    // `Root` html element for baron. Use this param when your html-scrollbar content is outside scroller
    // Default: scroller
    root: $('.my_scroller'),

    // Selector for `bar` element
    // Default: 'undefined'
    bar: '.scroller__bar',

    // `Track`
    // Default: parent node of bar
    track: '.scroller__track',

    // CSS classname for `scroller` when its needed (when content height above scroller heights)
    // Default: '_scrollbar'
    barOnCls: '_scrollbar',
    // Note: without barOnCls, scroller__bar should be invisible

    // CSS classname for `root` from start till end + 300ms of scrolling process
    // You can boost performance by using `_scrolling {pointer-events: none}`
    // Default: undefined
    scrollingCls: '_scrolling',

    // CSS classname for `root` when `bar` dragging by cursor
    // Its better than `.bar:hover` rule
    // Default: undefined
    draggingCls: '_dragging',

    // Scroll direction
    // Default: 'v' (vertical), 'h' for second baron invocation
    direction: 'h',

    // Minimum time delay between two resize events fires in seconds [0..1] or milliseconds (1..∞)
    // Default: 300 ms
    resizeDebounce: .2, // s

    // Local copy of jQuery-like utility
    // Default: window.jQuery
    $: function(selector, context) {
        return bonzo(qwery(selector, context));
    },

    // Event manager
    // Default: function(elem, event, func, mode) { params.$(elem)[mode || 'on'](event, func); };
    event: function(elem, event, func, mode) { // Events manager
        if (mode == 'trigger') {
            mode = 'fire';
        }

        bean[mode || 'on'](elem, event, func);
    },

    // For dir="rtl"
    // Default: false
    rtl: true
};
```

All parameters are optional (except scroller; or root, if you are not using baron as jQuery plugin).

### Baron library methods and props

```js
// Baron stores all its instances in window.baron._instances, and link them with html-nodes by data-baron-[dir]-id attribute values.
baron._instances

baron.version // Loaded version of baron

baron.noConflict
// window.baron points to some other library
...
// you include baron, it replaces the window.baron variable to baron namespace
var graf = baron.noConflict();
// now window.baron points to that other library again, and you can use window.graf() etc.
$('.scroller').graf();
```

### Baron instance methods and props

```js
var scroller = $('.scroller').baron();
// If you dont want to store variable, use baron as getter:
// var scroller2 = $('.scroller').baron()
// scroller === scroller2; // true

// Manual force update. Recalcs all sizes and positions.
scroller.update();
// or $('.scroller').baron().update()

// Removes all baron inline-styles, attributes and event-listeners
scroller.dispose();
// or $('.scroller').baron().dispose()
```
