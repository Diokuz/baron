Baron - a small, fast and crossbrowser vertical custom scrollbar with native system scroll mechanic.

## Demo

http://diokuz.github.com/baron/

## Files

You can find latest full baron version in /dist/ folder.

## Features

- Do not replaces native system scroll mechanic.
- Customizable scrollbar design with full CSS support.
- Fixable headers.
- No strong dependences on jQuery.

Baron just hides the system scrollbar, without removing it. This guarantees scrolling will work on any system where the CSS property 'overflow: scroll' is applied.

##Simple usage

To start using baron.js:

* Include either the development or minified version of baron.js:

```js
<script src="baron.js"></script>
```

* Make some HTML:

```html
<div class="scroller">
    <div class="container">
        Your scrollable content here
    </div>
    <div class="scroller__bar"></div>
</div>
```

* And some CSS:

```css
.scroller {
    height: 100%;
    overflow-y: scroll;
}
.scroller::-webkit-scrollbar { /* Preventing webkit horizontal scrolling bug */
    width: 0;
}
.scroller__bar { /* The bar. You should define width, right position and background */
    position: absolute;    
    z-index: 1;
    right: 0;
    width: 10px;
    background: #999;
}
```

Note: you can choose any class names, and slyle them as you want.

* Initialize baron:

```js
$('.scroller').baron();
```

##Advanced usage

You can specify some parameters at baron initialization:

```js
var scroll = $('.scroller').baron(params);

// or
var scroll = baron(params);
```

and store baron scrollbar object to `scroll` variable.

where:

```js
params = {
    // Selector for scroller element.
    // Default: this (in jQuery mode).
    scroller: '.scroller',

    // Selector for bar element
    // Default: 'scroller:last-child'
    bar: '.scroller__bar',

    // CSS classname for scroller when its needed (when content height above scroller heights)
    // Default: ''
    barOnCls: 'baron',

    // CSS selector for fixable header
    // Must have parentNode with same height (see demo for details). Also see trackSmartLim parameter.
    header: '.header__title',

    // CSS class for fixed headers
    hFixCls: 'header__title_state_fixed',

    // CSS class for lowest fixed header of top headers group
    hBeforeFixCls: 'header__title_position_top',

    // CSS class for uppermost fixed header of bottom headers group
    hAfterFixCls: 'header__title_position_bottom',

    // true - sets track top (left) position to header[0].parentNode.offsetHeight (offsetWidth)
    trackSmartLim: true,

    // Div wich contains bar, bar.parentNode by default
    track: '.track'

    // Radius for header fixing in px. Default vaule is 0.
    fixRadius: 10

    // Selector engine
    // Default: window.jQuery
    selector: qwery,

    // Event manager
    // Default: function(elem, event, func, mode) { DOM(elem)[mode || 'on'](event, func); };
    event: function(elem, event, func, mode) { // Events manager
        if (!elem.length) {
            elem = [elem]; // bean not support arrays
        }
        for (var i = 0 ; i < elem.length ; i++) {
            bean[mode || 'on'](elem[i], event, func);
        }
    },

    // DOM utility
    // Default: window.jQuery
    dom: bonzo
}
```

All parameters are optional (except scroller, if you not using baron as jQuery plugin).

`scroll` methods:

```js
scroll.u(); // Update scroller
```

##Update baron

When container size changed (for example: you load additional data to container by ajax), you should call u() method:

```js
scroll.u();
```

or u() method of all baron scrolls on page:

```js
$.baron.u();

// or
baron.u();
```

or fire custom event 'sizeChange' to wrapper:

```js
$('.scroller').trigger('sizeChange');
```

or repeat the initialization (not true-style, but will work).

##noConflict mode

If you need window.baron for another purposes you can restore original value:
```js
// window.baron points to some other library
...
// you include baron, it replaces the window.baron variable to baron namespace

var babaron = baron.noConflict();
// now window.baron points to that other library again, and you can use window.babaron.u() etc.
```

## Custom build (Grunt)

If you want exclude fixable headers functionality, type
```js
grunt core
```
in your console, and you will get dist/baron.js and dist/baron.min.js only with core functionality.

Type
```js
grunt
```
to build full version of baron.

## Browsers support

Full support: Chrome 1+, Firefox 3.6+, Safari 5+, Opera 9+ on Windows, OS X and iOS. Also, the best ever browser downloader - Internet Explorer - supported since version 8.

Partial support: IE6, IE7 (without fixable headers).

Not supported: Opera mini, old versions of Android browser, and other browsers which do not implement the `overflow: scroll` CSS property.

## License

MIT.