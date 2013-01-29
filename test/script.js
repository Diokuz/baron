window.onload = function() {
    var root;

    // Simple initialization with minimum parameters, but with headers
    baron($('.test_simple'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        header: '.header__title',
        headerFixedClass: 'header__title_state_fixed'
    });


    // Array initialization + barTopLimit
    baron($('.test_arr'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        header: '.header__title',
        headerFixedClass: 'header__title_state_fixed',
        barTop: 36
    });

    // Init without headers
    baron($('.test_wo-headers'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar'
    });

    // Negative viewport
    baron($('.test_negative-viewport'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar'
    });

    // Flexible height
    baron($('.test_flex'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar'
    });

    // Flexible height for bottom fixed headers -> they should change positions when window resize occurs.
    baron($('.test_flex-headers'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        header: '.header__title',
        headerFixedClass: 'header__title_state_fixed'
    });

    // No js .test__no-js

    // Maximum variables
    baron($('.test_advanced'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnClass: '.scroller__bar_state_on',
        barTop: 40,
        header: '.header__title',
        headerFixedClass: 'header__title_state_fixed',
        selector: qwery, // Selector engine
        event: function(elem, event, func, off) { // Events manager
            if (off) {
                bean.off(elem, event, func);
            } else {
                bean.on(elem, event, func);
            }
        },
        dom: bonzo // DOM utility
    });
};