window.onload = function() {
    var root;

    for (var i = 1 ; i <= 1 ; i++) {
        root = $('.test_' + i);

        baron($('.test'), {
            scroller: '.scroller',
            container: '.container',
            bar: '.scroller__bar',
            header: '.header__title',
            headerFixedClass: 'header__title_state_fixed',
            barTop: 20,
            barBottom: -15
        });
    };

    var pressed = false;
    $('.scroller__bar').on('mousedown', function() {
        pressed = true;
    });
    $('.scroller__bar').on('mouseup', function() {
        pressed = false;
    });
    // $('.wrapper').on('mousemove', function(e) {
    //     console.log(e.offsetY);

    // });


};