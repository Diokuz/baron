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
baron($('.wrapper'), {
    scroller: '.scroller',
    container: '.container',
    bar: '.scroller__bar'
});
```

There may be many wrappers on page, but only the first scroller, container and scroller__bar on each wrapper will be initialized. Also, make sure you have either jQuery or custom DOM, for events and selector engines.

## Browsers support

Full support: Chrome, Firefox, Safari, Opera on Windows, OS X and iOS. Also, the best browser in history: Internet Explorer is supported from version 8.

Partial support: IE7 (without fixable headers).

Not supported: Opera mini, Old versions of Android browser, and other browsers which do not implement the `overflow: scroll` CSS property.

## License

MIT.

## TODO

- Android 4.0.4 (build-in browser)
- try "overflow: auto; & -webkit-overflow-scrolling: touch;" for ipad