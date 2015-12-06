`baron()` returns the baron object, even in jQuery mode. That breaks jQuery chaining. For example, you can't do this:

```js
$('.scroller').baron().css().animate();
```

but you can:

```js
$('.scroller').css().animate() // jQuery chaining
    .baron().update(); // baron chaining
```

and even more:

```js
var scroll = $('.scroller').css().animate().baron().fix();

scroll.baron({direction: 'h'}).test().anotherBaronPlugin();
```

Every baron plugin sould return baron object (this);