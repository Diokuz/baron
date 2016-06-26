You probably here because you got an error

```
Baron [ xx:xx:xx ]: Please, do not use BODY as a scroller. https://github.com/Diokuz/baron/blob/master/docs/logs/do-not-use-body.md {...}
```

Webkit has a [bug](https://bugs.chromium.org/p/chromium/issues/detail?id=34224), which breaks baron behaviour, when `body` tag is used as a scroller. Please, make another `div`.
