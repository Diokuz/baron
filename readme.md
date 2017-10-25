[![Build Status](https://travis-ci.org/Diokuz/baron.svg)](https://travis-ci.org/Diokuz/baron) [![Join the chat at https://gitter.im/Diokuz/baron](https://badges.gitter.im/Diokuz/baron.svg)](https://gitter.im/Diokuz/baron?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

*You cannot change the world, but you can change a scrollbar!*

<img src="http://diokuz.github.io/pics/demo.gif" width="475px" height="331px" alt="Baron demo">

Baron — a small, fast and crossbrowser custom scrollbar with native system scroll mechanic.

See also [react-baron](https://github.com/Diokuz/react-baron).

## [Demo](http://diokuz.github.io/baron/)

## [API](docs/api.md)

## [Skins](skins/)

## Features

- Doesn't replace native system scroll mechanic.
- Customizable scrollbar design with full CSS support.
- Do not depends on external libraries (since v3).
- Can be inited on hidden blocks
- Vertical, horizontal and bidirectional scroll
- Infinite scroll
- Nested scrollers

Baron do not hide native scrollbar, just hides it. This guarantees scrolling will work in any browser.

## 1. Hiding system scrollbar

* Include `baron.js` and some css:

```html
<script src="baron.js"></script>
<style>
    ::-webkit-scrollbar { /* for Mac OS X support */
        width: 0;
    }
</style>
```

* Initialize baron on your scroller:

```js
baron('.my-scroller');
```

## 2. Making your own custom-designed scrollbar

You can do everything you want with CSS of your custom scrollbar. There are some required and recommended css rules (see [base css](baron.css)) – do not forget to use them. You can also use predefined [skins](skins/).

## Webpack

Just import baron and use it:

```js
import baron from 'baron';
// or: const baron = require('baron');

baron({ scroller: ... });
```

## Version for development

Note, that `baron.js` is a development version. It contains additional code and log messages, to make the development process easier.

`baron.min.js` is a production-ready version: weight less, works a little bit faster.

## Nested scrollers

Baron do support nested scrollers. To make scrollers happy, follow the rule:

* Initialize baron instances from ancestor to descendant scrollers order.

Third World War will not begun if you break that rule, but there may be some bad user-experience with baron-instances updates (when size of one scroller depends on size of another). See `/demo` source.

## Browsers support

Baron uses two old `CSS 2.1` technologies: 1) `overflow: scroll` 2) `overflow: hidden`.

| <img src="http://diokuz.github.io/pics/chrome.png" width="48px" height="48px" alt="Chrome logo"> | <img src="http://diokuz.github.io/pics/firefox.png" width="48px" height="48px" alt="Firefox logo"> | <img src="http://diokuz.github.io/pics/ie.png" width="48px" height="48px" alt="Internet Explorer logo"> | <img src="http://diokuz.github.io/pics/opera.png" width="48px" height="48px" alt="Opera logo"> | <img src="http://diokuz.github.io/pics/safari.png" width="48px" height="48px" alt="Safari logo"> | <img src="http://diokuz.github.io/pics/android.png" width="48px" height="48px" alt="Android browser logo"> |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 8+ ✔ | 3.6+ ✔ | 10+ ✔ | 11.5+ ✔ | 5.1+ ✔ | 4+ ✔ |

Wanna support ie6 and Opera 9? Try baron@2 version + jQuery. Version 3+ uses `classList` API and `style` attribute.

## 3.0 migration

1. Make sure you are satisfied with new supported browser list.
2. Remove `$` and `event` params if any. You also could remove jQuery from your page.
3. Make sure you have one html node per one initialization: multi-baron not supported.
4. `pull` plugin removed, so you cannot use it anymore. But you can add it manually.

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
