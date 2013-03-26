window.onload = function() {
    var root;

    $('.wrapper_very-simple').baron();

    // Simple initialization with minimum parameters, but with headers
    for (var i = 0 ; i < 100 ; i++) {
        $('.wrapper_simple').baron({
            barOnCls: 'baron',
            header: '.header__title',
            hFixCls: 'header__title_state_fixed',
            fixRadius: 30
        });
    }

    // Array initialization + barTopLimit
    $('.test_arr').baron({
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'baron',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed'
    });

    // Init without headers
    $('.test_wo-headers').baron({
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'baron'
    });

    // Negative viewport
    $('.test_negative-viewport').baron({
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'baron'
    });

    // Flexible height
    baron($('.test_flex'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'baron'
    });

    // Flexible height for bottom fixed headers -> they should change positions when window resize occurs.
    baron(document.getElementsByClassName('test_flex-headers'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'baron',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        viewMinSize: 100
    });

    // No js .test__no-js

    // Maximum variables
    baron($('.test_advanced'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'baron',
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

    // Variable header 
    baron(document.getElementsByClassName('test_varheights'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'baron',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        viewMinSize: 100
    });

    // Horizontal scroll
    // $('.test_horizontal').baron({
    //     scroller: '.scroller',
    //     container: '.container',
    //     bar: '.scroller__bar',
    //     barOnCls: 'baron',
    //     header: '.header__title',
    //     hFixCls: 'header__title_state_fixed',
    //     h: true
    // });
};