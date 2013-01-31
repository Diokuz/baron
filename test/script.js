window.onload = function() {
    var root;

    // Simple initialization with minimum parameters, but with headers
    baron($('.test_simple'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'scroller__bar_state_on',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed'
    });


    // Array initialization + barTopLimit
    baron($('.test_arr'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'scroller__bar_state_on',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        barTop: 36
    });

    // Init without headers
    baron($('.test_wo-headers'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'scroller__bar_state_on'
    });

    // Negative viewport
    baron($('.test_negative-viewport'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'scroller__bar_state_on'
    });

    // Flexible height
    baron($('.test_flex'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'scroller__bar_state_on'
    });

    // Flexible height for bottom fixed headers -> they should change positions when window resize occurs.
    baron($('.test_flex-headers'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'scroller__bar_state_on',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        viewMinH: 100
    });

    // No js .test__no-js

    // Maximum variables
    baron($('.test_advanced'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'scroller__bar_state_on',
        barTop: 40,
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        selector: qwery, // Selector engine
        event: function(elem, event, func, off) { // Events manager
            //if (Object.prototype.toString.call(elem) !== "[object Array]") {
            if (!elem.length) {
                elem = [elem]; // bean not supported arrays
            }
            for (var i = 0 ; i < elem.length ; i++) {
                if (off) {
                    bean.off(elem[i], event, func);
                } else {
                    bean.on(elem[i], event, func);
                }
            }
        },
        dom: bonzo // DOM utility
    });
};