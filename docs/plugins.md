## fix plugin

To use fixable headers you should initialize fix plugin after baron:

```html
<div class="scroller">
    <div class="header__title-wrapper">
        <div class="header__title">First element</div>
    </div>
    ...content...
    <div class="header__title-wrapper">
        <div class="header__title">Second element</div>
    </div>
    ...content...
</div>
```

```js
baron(baronParams).fix(params);
```

where:
```js
var params = {
    // CSS selector for fixable elements
    // Must have parentNode (no margin and padding allowed!) with same height (see demo for details). Also see 'limiter' parameter.
    elements: '.header__title',

    // CSS class for elements which now are outside of viewport
    outside: 'header__title_state_fixed',

    // CSS class for elements which now are in viewport
    inside: 'header__title_state_unfixed',

    // CSS class for closest outsite element wrapper from top (left)
    before: 'header__title_position_top',

    // CSS class for closest outsite element wrapper from bottom (right)
    after: 'header__title_position_bottom',

    // if true - sets track top (left) position to header[0].parentNode.offsetHeight (offsetWidth)
    // Default: false
    limiter: true,

    // Radius for element fixing in px
    // Default: 0
    radius: 10,

    // Works identical to outside as if radius === 0
    grad: 'header__title_state_grad',

    // Wether click on element should scroll to
    clickable: false,

    // User defined callback on click (data == {x1: current scrollTop, x2: new scrollTop})
    scroll: function(data) {}
};
```

## Controls plugin

```js
baron().controls(params);

var params = {
    // Element to be used as interactive track. Note: it could be different from 'track' param of baron.
    track: '.visual-track',

    // Element to be used as 'down' / 'right' button
    forward: '.forward-btn',

    // Element to be used as 'up' / 'left' button
    backward: '.backward-btn',

    // Multiplyer for page-down action. Use 1 to scroll preciesly one screen per track click.
    // Default: .9
    screen: .5

    // Scroll distance per control button click in px
    // Default: 30
    delta: 40
};
```

## test plugin

If you have some troubles with baron, use test plugin:

```js
baron(...).test(params);
```

And read results in browser console.

There is no params for test() right now.