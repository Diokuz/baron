Baron - a small, fast and crossbrowser vertical custom scrollbar with native system scroll mechanic.

## Demo

http://diokuz.github.com/baron/

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
<div class="wrapper">
    <div class="scroller">
        <div class="container">
        	Your scrollable content here
        </div>
        <div class="scroller__bar"></div>
    </div>
</div>
```

* And some CSS:

```css
.wrapper {
    position: relative;
    overflow: hidden;
}
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
.container { /* Data wrapper */
    overflow: hidden; /* To remove margin collapse */
}
```

Note: you can choose any class names, and slyle them as you want.

* Initialize baron:

```js
$('.wrapper').baron();
```

##Advanced usage

You can specify some parameters at baron initialization:

```js
var scroll = $('.wrapper').baron(params);

// or 
var scroll = baron($('.wrapper'), params);
```

and store baron scrollbar object to `scroll` variable.

where:

```js
params = {
    // Selector for scroller element
    // Default: 'root:first-child'
    scroller: '.scroller',

    // Selector for container element
    // Default: 'scroller:first-child'
    container: '.container',

    // Selector for bar element
    // Default: 'scroller:last-child'
    bar: '.scroller__bar',

    // CSS classname for bar when its needed (when container height above scroller heights)
    // Default: ''
    barOnCls: 'scroller__bar_state_on',

    // Top limit position for bar in pixels.
    // Default: 0
    barTop: 2,
    // !Removed. Use bar wrapper and CSS instead. See /demo/ for details

    // CSS selector for fixable header
    header: '.header__title',

    // CSS class for fixed headers
    hFixCls: 'header__title_state_fixed',

    // CSS class for lowest fixed header of top headers group
    hTopFixCls: 'header__title_position_top',

    // CSS class for uppermost fixed header of bottom headers group
    hBottomFixCls: 'header__title_position_bottom',

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

All parameters are optional.

`scroll` methods:

```js
scroll.u(); // Update all coordinates
```

##Update baron coordinates

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

or fire custom event 'heightChange' to wrapper:

```js
$('.wrapper').trigger('heightChange');
```

or repeat the initialization (not true-style, but will work).

## Browsers support

Full support: Chrome 1+, Firefox 3.6+, Safari 5+, Opera 9+ on Windows, OS X and iOS. Also, the best ever browser downloader - Internet Explorer - supported since version 8.

Partial support: IE6, IE7 (without fixable headers).

Not supported: Opera mini, old versions of Android browser, and other browsers which do not implement the `overflow: scroll` CSS property.

## License

MIT.