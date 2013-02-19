Baron - a small, fast and crossbrowser vertical custom scrollbar with native system scroll mechanic.

## Demo

http://diokuz.github.com/baron/

## Features

- Do not replaces native system scroll mechanic.
- Customizable scrollbar design with full CSS support.
- Fixable headers.
- No strong dependences on jQuery.

Baron just hides system scrollbar, but not removing it. This can guarantee scroll work on any system where CSS property 'overflow: scroll' realized.

##Simple usage

To start using baron.js go throught following steps:

* Include dev or min version of baron.js:

```js
<script src="baron.js"></script>
```

* Make some html:

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
.scroller::-webkit-scrollbar { /* Preventing webkit bug of horizontal scrolling */
    width: 0;
}
.scroller__bar { /* The bar. You should define width, right and background */
    position: absolute;    
    z-index: 1;
    right: 0;
    width: 10px;
    background: #999;
}
.container { /* Data wrapper */
    overflow: hidden; /* For possible margin collapse removing */
}
```

Note: you can choose any class names, and slylize them as you want.

* Initialize baron:

```js
baron($('.wrapper'), {
    scroller: '.scroller',
    container: '.container',
    bar: '.scroller__bar'
});
```

There may be many wrappers on page, but only first scroller, container and scroller__bar on each wrapper will be initialized. Also, make sure you have either jQuery or custom DOM, events and selector engines.

## Browsers support

Full support: Chrome, Firefox, Safari, Opera on Windows, OS X and iOs. Also, the best browser download program - Internet Explorer - supported since version 8.

Partial support: IE7 (without fixable headers).

Not supported: Opera mini, Old versions of Android browser, and other browsers which does not implemented overflow: scroll CSS property.

## TODO

- Android 4.0.4 (build-in browser)
- Bar resize when window.resize()
- Fix z-indexes on test page
- try "overflow: auto; & -webkit-overflow-scrolling: touch;" for ipad