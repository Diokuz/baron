window.onload = function() {
    baron($('.wrapper_1'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'baron',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        hBeforeFixCls: 'header__title_position_top',
        hAfterFixCls: 'header__title_position_bottom'
    });

    $('.wrapper_2').baron({barOnCls: 'baron'});
};