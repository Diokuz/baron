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