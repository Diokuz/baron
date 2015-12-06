To switch default vertical direction to horizontal direction just set 'direction' param to 'h' value:

```js
baron({
    ...
    direction: 'h'
});
```

If you want to scroll in both directions (vertical and horizontal) you must initialize baron two times: one per direction. In than case you can do chaining:

```js
baron(vParams).baron(hParams);
```

Note: think about horizontal baron as about second independent baron instance, or as about plugin for 'baron', which simply calls 'baron' with redefined default params - both statements are true, actually. Unfortunately, in case above you only can manage last baron instance in chain (to update or dispose it). To manage both you have to initialize them independently:

```js
vScroll = baron(vParams);
hScroll = baron(hParams);
...
vScroll.dispose();
hScroll.dispose();
```

*Note: horizontal scroll works in a different way: height of scroller is auto (you can set it to particular value in CSS), and height of clipper is varing by baron.*