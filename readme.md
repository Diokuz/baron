[![Build Status](https://travis-ci.org/Diokuz/baron.svg)](https://travis-ci.org/Diokuz/baron)

*You cannot change the world, but you can change a scrollbar!*

<img src="http://diokuz.github.io/pics/demo.gif" width="475px" height="331px" alt="Baron demo">

Baron — a small, fast and crossbrowser custom scrollbar with native system scroll mechanic.

## [Demo](http://diokuz.github.io/baron/)

[![Join the chat at https://gitter.im/Diokuz/baron](https://badges.gitter.im/Diokuz/baron.svg)](https://gitter.im/Diokuz/baron?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## [API](docs/api.md)

## [Skins](skins/)

## Features

- Doesn't replace native system scroll mechanic.
- Customizable scrollbar design with full CSS support.
- No strong dependencies on jQuery.
- Plugin system (fixable headers, sticky footer, autotests and more)
- Can be inited on hidden blocks
- Vertical, horizontal and bidirectional scroll
- Infinite scroll
- Nested scrollers

Baron just hides the system scrollbar, without removing it. This guarantees scrolling will work on any system.

## Simple usage

* Include either the development or minified version of `baron.js`:

```html
<script src="baron.js"></script>
```

* Initialize baron:

```js
$('.myScroller').baron();
```

## Advanced usage

You can do everything you want with CSS of your custom scrollbar. There some required and recommended css rules (see [base css](baron.css)), dont forget to use them. You also can use predefined [sinks](skins/).

## Nested scrollers

Baron do support nested scrollers. To make scrollers happy, follow the rule:

* Initialize baron instances from ancestor to descendant scrollers order.

Third World War will not begun if you break that rule, but there may be some bad user-experience with baron-instances updates (when size of one scroller depends on size of another). Use `/demo` as example.

## Browsers support

Baron uses two old `CSS 2.1` technologies: 1) `overflow: scroll` 2) `overflow: hidden`.

| <img src="http://diokuz.github.io/pics/chrome.png" width="48px" height="48px" alt="Chrome logo"> | <img src="http://diokuz.github.io/pics/firefox.png" width="48px" height="48px" alt="Firefox logo"> | <img src="http://diokuz.github.io/pics/ie.png" width="48px" height="48px" alt="Internet Explorer logo"> | <img src="http://diokuz.github.io/pics/opera.png" width="48px" height="48px" alt="Opera logo"> | <img src="http://diokuz.github.io/pics/safari.png" width="48px" height="48px" alt="Safari logo"> | <img src="http://diokuz.github.io/pics/android.png" width="48px" height="48px" alt="Android browser logo"> |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 1+ ✔ | 1+ ✔ | 6+ ✔ | 9+ ✔ | 5+ ✔ | 4+ ✔ |

`overflow: scroll` not supported by Opera mini and old versions of Android browser (2-). That means, you cannot make scrollable html-elements for them anyway.

Firefox for Mac OS X now [supported](https://github.com/Diokuz/baron/issues/110).

## 2.0 migration

`impact` param default value changed to `scroller` for all directions. That impact horizontal scrollbars.

If you use % cross-paddings (padding-left and padding-right for vertical direction) for scroller, it will be buggy in Mac OS X Firefox because of need for extra-padding to support it. Use pixels instead, or make html-container inside scroller.

Also, checkout [changelog](changelog.md).

## 1.0 migration

If you have any problems, just set [`cssGuru`](docs/api.md) option to `true`.

## [Chaining](docs/chaining.md)

## [Horizontal and bidirectional scroll](docs/bidir.md)

## [Plugins](docs/plugins.md)

## License

MIT.
