## 0.6.0

core:
- Plugin system added (alpha version)
- fixable headers moved to 'fix' plugin
- 'grunt full' now includes test plugin to build
- 'u' method renamed to 'update'
- 0.2s delay for update on resize event removed

params change
- 'bar' default value now 'undefined' (!)
- 'test' plugin added
- '$' param added, default value: window.jQuery
- 'dom' and 'selector' params removed
- 'direction' ['v', ['h']] param added, default value: 'v'.
- 'freeze' param added: size of scroller parent freezes at initialization, if true
- all params for fixable headers moved to 'fix' plugin

fix plugin:
- 'header' param renamed to 'elements'
- 'hFixCls' param renamed to 'outside'
- 'hBeforeFixCls' param renamed to 'before'
- 'hAfterFixCls' param renamed to 'after'
- 'fixRadius' param renamed to 'radius'
- 'trackSmartLim' param renamed to 'limiter'

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