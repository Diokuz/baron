window.onload = function() {
    var root;

    $('.wrapper_very-simple').baron();

    // Simple initialization with minimum parameters, but with headers
    for (var i = 0 ; i < 100 ; i++) {
        $('.wrapper_simple').baron({
            barOnCls: 'scroller__bar_state_on',
            header: '.header__title',
            hFixCls: 'header__title_state_fixed'
        });
    }

    // Array initialization + barTopLimit
    $('.test_arr').baron({
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'scroller__bar_state_on',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        barTop: 36
    });

    // Init without headers
    $('.test_wo-headers').baron({
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'scroller__bar_state_on'
    });

    // Negative viewport
    $('.test_negative-viewport').baron({
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
    baron(document.getElementsByClassName('test_flex-headers'), {
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
        barTop: 2,
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        selector: qwery, // Selector engine
        event: function(elem, event, func, mode) { // Events manager
            //if (Object.prototype.toString.call(elem) !== "[object Array]") {
            if (!elem.length) {
                elem = [elem]; // bean not supported arrays
            }
             for (var i = 0 ; i < elem.length ; i++) {
                bean[mode || 'on'](elem[i], event, func);
            }
        },
        dom: bonzo // DOM utility
    });
};