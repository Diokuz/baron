[![Build Status](https://travis-ci.org/Diokuz/baron.svg)](https://travis-ci.org/Diokuz/baron)

*You cannot change the world, but you can change a scrollbar!*

<img src="http://diokuz.github.io/pics/demo.gif" width="475px" height="331px" alt="Baron demo">

Baron — a small, fast and crossbrowser custom scrollbar with native system scroll mechanic.

## [Demo](http://diokuz.github.io/baron/)

## [API](docs/api.md)

## Features

- Doesn't replace native system scroll mechanic.
- Customizable scrollbar design with full CSS support.
- No strong dependencies on jQuery.
- Plugin system (fixable headers, sticky footer, autotests and more)
- Can be inited on hidden blocks
- Vertical, horizontal and bidirectional scroll
- Infinite scroll

Baron just hides the system scrollbar, without removing it. This guarantees scrolling will work on any system.

## Browsers support

Baron uses two old `CSS 2.1` technologies: 1) `overflow: scroll` 2) `overflow: hidden`.

| <img src="http://diokuz.github.io/pics/chrome.png" width="48px" height="48px" alt="Chrome logo"> | <img src="http://diokuz.github.io/pics/firefox.png" width="48px" height="48px" alt="Firefox logo"> | <img src="http://diokuz.github.io/pics/ie.png" width="48px" height="48px" alt="Internet Explorer logo"> | <img src="http://diokuz.github.io/pics/opera.png" width="48px" height="48px" alt="Opera logo"> | <img src="http://diokuz.github.io/pics/safari.png" width="48px" height="48px" alt="Safari logo"> | <img src="http://diokuz.github.io/pics/android.png" width="48px" height="48px" alt="Android browser logo"> |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 1+ ✔ | 1+ ✔ | 6+ ✔ | 9+ ✔ | 5+ ✔ | 4+ ✔ |

`overflow: scroll` not supported by Opera mini and old versions of Android browser (2-). That means, you cannot make scrollable html-elements for them anyway.

! Also, **Firefox for Mac OS X**, in default non-persistant scrollbar mode [is not supported](https://github.com/Diokuz/baron/issues/110).

## 1.0 migration

If you have any problems, just set [`cssGuru`](docs/api.md) option to `true`.

## Simple usage

If you want only to hide system scrollbar:

* Include either the development or minified version of baron.js:

```html
<script src="baron.js"></script>
```

* Make some HTML:

```html
<div class="scroller">
    Your scrollable content here
</div>
```

* And CSS

```css
.scroller::-webkit-scrollbar { /* For Mac OS X styled scrollbars */
    width: 0;
}
```

* Initialize baron:

```js
$('.scroller').baron();
```

## Advanced usage

```html
<div class="scroller">
    Your scrollable content here
    <div class="scroller__track"><!-- Track is optional -->
        <div class="scroller__bar"></div>
    </div>
</div>
```

```css
.scroller {
    overflow-y: scroll;
    -ms-overflow-style: none; /* better feel in ie10+ in some rare cases */
    /* -webkit-overflow-scrolling: touch; *//* uncomment to accelerate scrolling on iOS */
}
.scroller::-webkit-scrollbar { /* For Mac OS X styled scrollbars */
    width: 0;
}
.scroller__track {
    display: none; /* Invisible by default */
    position: absolute;
    right: 4px;
    top: 10px;
    bottom: 4px;
    width: 10px;
    background: rgba(0, 0, 0, .1);
}
.baron > .scroller__track {
    display: block; /* Visible when scrolling is possible */
}
.scroller__bar { /* The bar. You should define width, right position and background */
    position: absolute;    
    z-index: 1;
    right: 0;
    width: 10px;
    background: #999;
}
```

You can specify some parameters on baron initialization:

```js
$('.scroller').baron(params);

// or
var scroll = baron(params);
```

## [Chaining](docs/chaining.md)

## [Horizontal and bidirectional scroll](docs/bidir.md)

## [Plugins](docs/plugins.md)

## License

MIT.
