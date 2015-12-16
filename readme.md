[![Build Status](https://travis-ci.org/Diokuz/baron.svg)](https://travis-ci.org/Diokuz/baron)

*You cannot change the world, but you can change a scrollbar!*

<img src="http://diokuz.github.io/pics/demo.gif" width="475px" height="331px" alt="Baron demo">

Baron — a small, fast and crossbrowser custom scrollbar with native system scroll mechanic.

## [Demo](http://diokuz.github.io/baron/)

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

## Browsers support

Baron uses two old `CSS 2.1` technologies: 1) `overflow: scroll` 2) `overflow: hidden`.

| <img src="http://diokuz.github.io/pics/chrome.png" width="48px" height="48px" alt="Chrome logo"> | <img src="http://diokuz.github.io/pics/firefox.png" width="48px" height="48px" alt="Firefox logo"> | <img src="http://diokuz.github.io/pics/ie.png" width="48px" height="48px" alt="Internet Explorer logo"> | <img src="http://diokuz.github.io/pics/opera.png" width="48px" height="48px" alt="Opera logo"> | <img src="http://diokuz.github.io/pics/safari.png" width="48px" height="48px" alt="Safari logo"> | <img src="http://diokuz.github.io/pics/android.png" width="48px" height="48px" alt="Android browser logo"> |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 1+ ✔ | 1+ ✔ | 6+ ✔ | 9+ ✔ | 5+ ✔ | 4+ ✔ |

`overflow: scroll` not supported by Opera mini and old versions of Android browser (2-). That means, you cannot make scrollable html-elements for them anyway.

! Also, **Firefox for Mac OS X**, in default non-persistant scrollbar mode [is not supported](https://github.com/Diokuz/baron/issues/110).

## 2.0 migration

All `cls` params default values were changed. For example, default `barOnCls` now is `_scrollbar`, default `root` is `.baron__root` or `.baron`, etc. Now by default `baron` expect BEM block named `baron`, with elements like `baron__clipper`, `baron__scroller`, `baron__track`, `baron__bar`... Check [API](docs/api.md).

Non-zero paddings for scroller now forbidden. That is because of Mac OS X version of Firefox. Baron will work anyway, but baron in Mac OS X Firefix may be buggy.

`cssGuru` param now removed: it is supposed that you properly use official `baron.css` base styles. Also, several css-skins added, check them too!

## Simple usage

* Include either the development or minified version of `baron.js`:

```html
<script src="baron.js"></script>
```

* Copy some template [HTML](skins/) and include baron [CSS](skins/styles.css):

```html
<link rel="stylesheet" href="baron.css" />
```

* Initialize baron:

```js
$('.baron').baron();
```

## Advanced usage

You can do everything you want with CSS of your custom scrollbar. There some required and recommended css rules (see [base css](baron.css)), dont forget to use them.

You can change html-template, if you need that, and there many options (see [API](docs/api.md)) for all features, described above.

## Nested scrollers

Baron do support nested scrollers. To make scrollers happy, follow the rule:

* Initialize baron instances from ancestor to descendant scrollers order.

Third World War will not begun if you break that rule, but there may be some bad user-experience with baron-instances updates (when size of one scroller depends on size of another). Use `/demo` as example.

## [Chaining](docs/chaining.md)

## [Horizontal and bidirectional scroll](docs/bidir.md)

## [Plugins](docs/plugins.md)

## License

MIT.
