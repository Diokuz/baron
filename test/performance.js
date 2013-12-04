$(document).ready(function() {
    var N = 1000;

    function test(callback, n) {
        var t0 = new Date();
        var scrollHeight = $('.search-results__scroller')[0].scrollHeight - $('.search-results__scroller').height();
        var scroller = $('.search-results__scroller')[0];
        var localN = n || N;

        i = 0;
        var interval = setInterval(function() {
            i++;
            var pos = (Math.sin(i / 100) + 1) * scrollHeight / 2;

            scroller.scrollTop = pos;

            if (i > localN) {
                clearTimeout(interval);
                var t1 = new Date();
                if (!n) console.log('r&r per scroll: ', (t1 - t0) / N);
                callback(t1 - t0);
            }
        }, 0);
    }

    setTimeout(function() {
        test(function() { // Первый прогон для оптимизации
            test(function(result1) {
                $('.search-results__scroller').baron({
                    bar: '.search-results__scroll-bar',
                    barOnCls: 'search-results_scroll-bar_active',
                    scrollingCls: '_scrolling',
                    pause: 0.03
                })
                .fix({
                    elements: '.search-results__fade',
                    outside: 'search-results__fade_state_fixed',
                    before: 'search-results__fade_pos_top',
                    after: 'search-results__fade_pos_bottom',
                    past: 'search-results__fade_group_top',
                    future: 'search-results__fade_group_bottom',
                    clickable: true,
                    limiter: true // Ограничение скроллбара сверху
                });

                // Без fix но зафиксированными
                // $('.search-results__list-header').addClass('search-results__fade_group_top search-results__fade_state_fixed');
                // $('.search-results__list-header').eq(0).css({top: '0px'});
                // $('.search-results__list-header').eq(1).css({top: '38px'});

                setTimeout(function() {
                    test(function(result2) {
                        console.log('delta per scroll: ', (result2 - result1) / N);
                    });
                }, 500);
            });
        }, 300);
    }, 500);


    // $('.search-results__scroller').baron({
    //     bar: '.search-results__scroll-bar',
    //     barOnCls: 'search-results_scroll-bar_active',
    //     scrollingCls: '_scrolling',
    //     // pause: .03
    // })
    // .fix({
    //     elements: '.search-results__fade',
    //     outside: 'search-results__fade_state_fixed',
    //     before: 'search-results__fade_pos_top',
    //     after: 'search-results__fade_pos_bottom',
    //     past: 'search-results__fade_group_top',
    //     future: 'search-results__fade_group_bottom',
    //     clickable: true,
    //     limiter: true // Ограничение скроллбара сверху
    // });
});