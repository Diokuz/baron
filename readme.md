Baron - a small, fast and crossbrowser vertical custom scrollbar with native system scroll mechanic.
========

Features:

- Do not replaces native system scroll mechanic.
- Customizable scrollbar design with full CSS support.
- Fixable headers.
- No strong dependences from jQuery.

Baron just hides system scrollbar, but not removing it. This can guarantee scroll work on any system where CSS property 'overflow: scroll' realized.

##Simple usage

To start using baron.js go throught following steps:

1. Include dev or min version of baron.js:

```js
<script src="baron.js"></script>
```

2. Make some html:

```html
<div class="wrapper">
    <div class="scroller">
        <div class="container">
        	Your scrollable content here
        </div>
        <div class="scroller__bar"></div>
    </div>
</div>
```

3. And some CSS:

```css
.wrapper {
    position: relative;
    overflow: hidden;
}
.scroller {
    height: 100%;
    overflow-y: scroll;
}
.scroller::-webkit-scrollbar { /* Preventing webkit bug of horizontal scrolling */
    width: 0;
}
.scroller__bar { /* The bar. You should define width, right and background */
    position: absolute;    
    z-index: 1;
    right: 0;
    width: 10px;
    background: #999;
}
.container { /* Data wrapper */
    overflow: hidden; /* For possible margin collapse removing */
}
```

4. At least, initialize baron:

```js
baron($('.wrapper'), {
    scroller: '.scroller',
    container: '.container',
    bar: '.scroller__bar'
});
```

There may be many wrappers on page, but only first scroller, container and scroller__bar on each wrapper will be initialized. Also, make sure you have either jQuery or custom DOM, events and selector engines.