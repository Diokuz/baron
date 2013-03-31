window.onload = function() {
    var root;

    $('.wrapper_very-simple .scroller').baron();

    // Simple initialization with minimum parameters, but with headers
    for (var i = 0 ; i < 100 ; i++) {
        $('.wrapper_simple .scroller').baron({
            barOnCls: 'baron',
            header: '.header__title',
            hFixCls: 'header__title_state_fixed',
            fixRadius: 30
        });
    }

    // Array initialization + barTopLimit
    $('.test_arr .scroller').baron({
        bar: '.scroller__bar',
        barOnCls: 'baron',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed'
    });

    // Init without headers
    $('.test_wo-headers .scroller').baron({
        bar: '.scroller__bar',
        barOnCls: 'baron'
    });

    // Negative viewport
    $('.test_negative-viewport .scroller').baron({
        bar: '.scroller__bar',
        barOnCls: 'baron'
    });

    // Flexible height
    baron({
        scroller: '.test_flex .scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron'
    });

    // Flexible height for bottom fixed headers -> they should change positions when window resize occurs.
    baron({
        scroller: '.test_flex-headers .scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        viewMinSize: 100
    });

    // No js .test__no-js

    // Maximum variables
    for (var i = 0 ; i < 10 ; i++) {
        baron({
            scroller: '.test_advanced .scroller',
            bar: '.scroller__bar',
            barOnCls: 'baron',
            header: '.header__title',
            hFixCls: 'header__title_state_fixed',
            selector: qwery, // Selector engine
            event: function(elem, event, func, mode) { // Events manager
                if (mode == 'trigger') {
                    mode = 'fire';
                }
                
                if (!elem.length) {
                    elem = [elem]; // bean not supported arrays
                }
                
                for (var i = 0 ; i < elem.length ; i++) {
                    bean[mode || 'on'](elem[i], event, func);
                }
            },
            dom: bonzo // DOM utility
        });
    }

    // Variable header 
    baron({
        scroller: '.test_varheights .scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        viewMinSize: 100
    });

    // Elements outside container
    baron({
        scroller: '.test_scroll-height .scroller',
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