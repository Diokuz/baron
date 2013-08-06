var b;

$(document).ready(function() {
    var i;

    b = $('.wrapper_very-simple .scroller').baron();

    b.update();

    // Simple initialization with minimum parameters, but with headers
    for (i = 0 ; i < 100 ; i++) {
        $('.wrapper_simple .scroller').baron({
            barOnCls: 'baron'
        }).fix({
            elements: '.header__title',
            outside: 'header__title_state_fixed',
            radius: 30
        });
    }

    // Array initialization + limiter
    $('.test_arr .scroller').baron({
        bar: '.scroller__bar',
        //track: '.scroller__track',
        barOnCls: 'baron',
        pause: 0.1
    }).fix({
        elements: '.header__title',
        outside: 'header__title_state_fixed',
        before: 'header__title_position_top',
        after: 'header__title_position_bottom',
        limiter: true
    })
    .test()
    .controls({
        track: '.scroller__track-visual',
        forward: '.scroller__up',
        backward: '.scroller__down',
        screen: 0.5,
        delta: 60
    });

    // Init without headers
    $('.test_wo-headers .scroller').baron({
        bar: '.scroller__bar',
        barOnCls: 'baron'
    });

    // // Negative viewport
    $('.test_negative-viewport .scroller').baron({
        bar: '.scroller__bar',
        barOnCls: 'baron'
    });

    // Flexible height
    baron({
        scroller: '.test_flex .scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron',
        track: '.scroller__bar-wrapper',
        pause: 0.2
    });

    // Not enought input params
    //baron();

    var babaron = baron.noConflict(),
        anotherBaron = babaron;
    console.log('Original baron value is: ', baron);

    // Flexible height for bottom fixed headers -> they should change positions when window resize occurs.
    anotherBaron({
        scroller: '.test_flex-headers .scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron'
    }).fix({
        elements: '.header__title',
        outside: 'header__title_state_fixed',
        minView: 100
    });

    // No js .test__no-js

    // Maximum variables
    for (i = 0 ; i < 10 ; i++) {
        anotherBaron({
            scroller: '.test_advanced .scroller',
            bar: '.scroller__bar',
            barOnCls: 'baron',
            $: function(selector, context) {
                return bonzo(qwery(selector, context));
            },
            event: function(elem, event, func, mode) { // Events manager
                if (mode == 'trigger') {
                    mode = 'fire';
                }

                bean[mode || 'on'](elem, event, func);
            }
        }).fix({
            elements: '.header__title',
            outside: 'header__title_state_fixed'
        });
    }

    // Variable header 
    anotherBaron({
        scroller: '.test_varheights .scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron'
    }).fix({
        elements: '.header__title',
        outside: 'header__title_state_fixed',
        minView: 100
    });

    // Elements outside container
    anotherBaron({
        scroller: '.test_scroll-height .scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron'
    }).fix({
        elements: '.header__title',
        outside: 'header__title_state_fixed',
        minView: 100
    });

    // Horizontal scroll
    $('.test_horizontal .scroller').baron({
        bar: '.scroller__bar',
        barOnCls: 'baron',
        direction: 'h'
    }).fix({
        elements: '.header__title',
        outside: 'header__title_state_fixed',
        before: 'before',
        after: 'after',
        limiter: true
    });

    // Bidirectional scroll
    $('.test_bidir .scroller').baron({
        bar: '.scroller__bar',
        barOnCls: 'baron'
    }).baron({
        bar: '.scroller__bar_h',
        barOnCls: 'baron_h'
    });

    // Bidirectional scroll root bug
    anotherBaron({
        scroller: '.test_bidir-2 .scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron'
    }).baron({
        bar: '.scroller__bar_h',
        barOnCls: 'baron_h'
    });

    // Textarea scroll
    $('.test_textarea').baron({
        scroller: '.scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron'
    }).baron({
        bar: '.scroller__bar_h',
        barOnCls: 'baron_h'
    });

    // Bar outside
    $('.test_bar-outside').baron({
        scroller: '.scroller',
        bar: '.scroller__bar',
        barOnCls: 'baron'
    }).baron({
        bar: '.scroller__bar_h',
        barOnCls: 'baron_h'
    });

    var leak = [];
    for (i = 0 ; i < 1000 ; i++) {
        $('.test_mem-leak').attr('data-baron-v', '');
        var l = $('.test_mem-leak').baron({
            scroller: '.scroller',
            bar: '.scroller__bar',
            barOnCls: 'baron'
        });
        leak.push(l);
        l.dispose();
    }
});