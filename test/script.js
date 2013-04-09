window.onload = function() {
    var root;

    $('.wrapper_very-simple .scroller').baron();

    // Simple initialization with minimum parameters, but with headers
    for (var i = 0 ; i < 100 ; i++) {
        $('.wrapper_simple .scroller').baron({
            barOnCls: 'baron',
            header: '.header__title',
            hFixCls: 'header__title_state_fixed',
            fixRadius: 30,
            trackSmartLim: true
        });
    }

    // Array initialization + barTopLimit + only before fix class
    $('.test_arr .scroller').baron({
        bar: '.scroller__bar',
        barOnCls: 'baron',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        hBeforeFixCls: 'header__title_position_top'
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

    // Not enought input params
    //baron();

    var anotherBaron = babaron = baron.noConflict();
    console.log('Original baron value is: ', baron);

    // Flexible height for bottom fixed headers -> they should change positions when window resize occurs.
    anotherBaron({
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
        anotherBaron({
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
    anotherBaron({
        scroller: '.test_varheights .scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        viewMinSize: 100
    });

    // Elements outside container
    anotherBaron({
        scroller: '.test_scroll-height .scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        viewMinSize: 100
    });

    // Horizontal scroll
    $('.test_horizontal .scroller').baron({
        bar: '.scroller__bar',
        barOnCls: 'baron',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        h: true,
        v: false
    });

    // Bidirectional scroll
    $('.test_bidir .scroller').baron({
        bar: '.scroller__bar',
        hbar: '.scroller__bar_h',
        barOnCls: 'baron',
        hbarOnCls: 'baron_h',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        h: true,
        v: true
    });

    // Textarea scroll
    $('.test_textarea .scroller').baron({
        bar: $('.test_textarea .scroller__bar'),
        hbar: $('.test_textarea .scroller__bar_h'),
        barOnCls: 'baron',
        hbarOnCls: 'baron_h',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        h: true,
        v: true
    });
};