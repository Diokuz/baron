## 2.2.2

 - Fix root bidirect bug && add tests https://github.com/Diokuz/baron/issues/139

## 2.2.0

 - Add `position` param

## 2.1.1

 - Update dist files properly

## 2.1.0

 - Rework of cross-scroll bugs issue https://github.com/Diokuz/baron/issues/134
 - Add tests for scroll-scroll bugs
 - Update uglify-js package
 - Change `main` field to prod version of baron

## 2.0.2

 - Remove baron instances from baron._instances on dispose (https://github.com/Diokuz/baron/issues/132)
 - baron._instances now reachable only in dev mode

## 2.0.1

 - Baron now trows an Error when no jQuery nor params.$ found

## 2.0.0

 - `impact` default value now always `scroller`.
 - Mac OS X Firefox support
 - draggingCls now adds to `root`, not `bar`
 - second baron init for same direction now always returns existing instance

## 1.2.1

 - [fix `controls` click and direction](https://github.com/Diokuz/baron/issues/121).

## 1.2.0

 - `scrollingCls` param now sets on `root`, not `scroller`.

## 1.1.0

 - add `rtl` param.

## 1.0.3

 - add ```-ms-overflow-style: none``` for non-guru css mode.

## 1.0.2

 - fix ie clipper (cross-scroll)[https://github.com/Diokuz/baron/issues/116]

## 1.0.0

 - add `cssGuru` option for css guru.
 - add default css.
 - remove resizeDebounce param.
 - fix phantom tests.
 - remove pause param.

## 0.8.0

 - `impact` param added

## 0.7.16

 - fixed noParams initialization bug for multiple barons on page

## 0.7.15

 - fixed module.exports bug (now baron is compatible with react-baron)

## 0.7.14

 - fixed flexbox bug
 - fixed Opera 12 nested flexbox bug
 - rework of horizontal scroll
 - removed `freeze` param

## 0.6.2

- dispose method added (to free memory and remove event listeners when scroller removed from dom)

## 0.6.0

core:
- Plugin system added (alpha version)
- fixable headers moved to 'fix' plugin
- 'grunt full' now includes test plugin to build
- 'u' method renamed to 'update'
- 0.2s delay for update on resize event removed (use 'pause' param instead)

params change
- 'bar' default value now 'undefined' (!)
- '$' param added, default value: window.jQuery
- 'dom' and 'selector' params removed
- 'direction' ['v', 'h'] param added, default value: 'v'.
- 'freeze' param added: size of scroller parent freezes at initialization, if true
- 'pause' param added: use it on slow hardware to limit event trigger frequency (minimum time delay between two triggers in seconds)
- all params for fixable headers moved to 'fix' plugin

fix plugin:
- 'header' param renamed to 'elements'
- 'hFixCls' param renamed to 'outside'
- 'hBeforeFixCls' param renamed to 'before'
- 'hAfterFixCls' param renamed to 'after'
- 'fixRadius' param renamed to 'radius'
- 'trackSmartLim' param renamed to 'limiter'

plugins:
- 'controls' plugin added
- 'test' plugin added

## 0.5.0

- Horizontal scroll support
- Textarea support
- Dev build added (with error console messages)

## 0.4.0

Improvements

- Grunt task runner for build customization added
- root var removed (use scroller param instead)
- barOnCls now applied to scroller, not the bar
- trackSmartLim param added (if true bottom edge of first header uses as bar top limit)
- fixRadius param added
- Variable (tex-dependent) headers heights support added
- noConflict method added

Bugs

- Right click drag bug fixed
- Update method now invalidates bar visibility
- Margin collapse and positioned elements bug fixed

Misc

- heightChange custom event renamed to sizeChange
- container param removed
- hTopFixCls param renamed to hBeforeFixCls
- hBottomFixCls param renamed to hAfterFixCls
- barTop param removed
- "require()" support added
- Server-side "usage" handler added
