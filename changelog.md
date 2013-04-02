## 0.4.0

Improvements

- Grunt task runner for build customization added
- root var removed (use scroller param instead)
- barOnCls now applied to scroller, not bar
- trackSmartLim param added (if true bottom edge of first header uses as bar top limit)
- fixRadius param added
- Variable (tex-dependent) headers heights support added

Bugs

- Right click drag bug fixed
- Update method now invalidate bar presence
- Margin collapse and positioned elements bug fixed
- 

Misc

- heightChange custom event renamed to sizeChange
- noConflict method added
- container param removed
- hTopFixCls param renamed to hBeforeFixCls
- hBottomFixCls param renamed to hAfterFixCls
- barTop param removed
- "Require" support
- Server-side "usage" handler