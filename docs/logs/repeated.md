You probably here because you got an error

```
Baron [ xx:xx:xx ]: repeated initialization for html-node detected https://github.com/Diokuz/baron/blob/master/docs/logs/second.md <... />
```

You can have only one baron instance per html-node per one direction: that means maximum one for vertical and another one for horizontal direction for given `root` html-node.

There are two possible reasons for this error:

## Second execution of same js-code

You should place baron initialization to code section, which executes only one time, during component (module, block...) initialization. There is no need to initialize baron on component update.

## Bad selector

If you have two or more scrollers on page, you have to care about proper selectors: they cannot intersect each other.

```js
// Bad selector, that can match many nodes
$('div').baron({...});

// Better, but it is not recommended to make selectors which may match more than one html-node
// (although multi-baron-instances is officially supported)
$('.baron__scroller').baron({...});

// The best selector, which guarantee only one instance per one baron initialization
$('#scroller_123').baron({...})
```

Anyway, try to inspect the callstack and find where the second initialization starts to happen. Then fix it.
