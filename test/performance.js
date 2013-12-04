$(document).ready(function() {
    var N = 1000;

    function test(callback) {
        var t0 = new Date();
        var scrollHeight = $('.search-results__scroller')[0].scrollHeight - $('.search-results__scroller').height();
        var scroller = $('.search-results__scroller')[0];

        i = 0;
        var interval = setInterval(function() {
            i++;
            var pos = (Math.sin(i / 100) + 1) * scrollHeight / 2;

            scroller.scrollTop = pos;

            if (i > N) {
                clearTimeout(interval);
                var t1 = new Date();
                console.log('r&r per scroll: ', (t1 - t0) / N);
                callback(t1 - t0);
            }
        }, 0);
    }

    setTimeout(function() {
        test(function(result1) {
            $('.search-results__scroller').baron({
                bar: '.search-results__scroll-bar',
                barOnCls: 'search-results_scroll-bar_active'
            })
            // .fix({
            //     elements: '.header__title',
            //     outside: 'header__title_state_fixed',
            //     before: 'header__title_position_top',
            //     after: 'header__title_position_bottom',
            //     limiter: true
            // });

            setTimeout(function() {
                test(function(result2) {
                    console.log('delta per scroll: ', (result2 - result1) / N);
                });
            }, 500);
        });
    }, 500);
});