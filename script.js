window.onload = function() {
    var root;

    for (var i = 1 ; i <= 7 ; i++) {
        root = $('.test_' + i);

        baron(root, {
            scroller: '.scroller',
            container: '.container',
            bar: '.scroller__bar',
            header: '.header__title',
            init: function(data) {
                // $(data.scroller).css('width', data.scrollerWidth).attr('data-acbar-inited', data.switchScrollbarOn);
                // $(data.bar).css('height', data.barHeight);
                // if (data.switchScrollbarOn) {
                //     $(data.bar).addClass('scroller__bar_active_true');
                // } else {
                //     $(data.bar).removeClass('scroller__bar_active_true')
                // }
            },
            inited: function(data) {
                return $(data.scroller).attr('data-acbar-inited') === 'true';
            },
            posBar: function(bar, barTop, barHeight) {
                // $(bar).css('top', barTop + 'px');
                // if (barHeight) {
                //     $(bar).css('height', barHeight + 'px');
                // }
            },
            fixHeader: function(header, top) {
                $(header).css('top', top + 'px').addClass('header__title_state_fixed');
            },
            unfixHeader: function(header) {
                $(header).removeClass('header__title_state_fixed').css('top', '');
            },
            EventsToUpdateScrollbar: function(elem, func) {
                $(elem).on('scroll', func);
            },
            onResize: function(elem, func) {
                $(elem).on('resize', func);
            }
        });
    };

    var pressed = false;
    $('.scroller__bar').on('mousedown', function() {
        pressed = true;
    });
    $('.scroller__bar').on('mouseup', function() {
        pressed = false;
    });
    $('.wrapper').on('mousemove', function(e) {
        console.log(e.offsetY);

    });


};