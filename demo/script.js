window.onload = function() {
    baron($('.wrapper_1'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barOnCls: 'scroller__bar_state_on',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        hTopFixCls: 'header__title_position_top',
        hBottomFixCls: 'header__title_position_bottom'
    });

    $('.wrapper_2').baron({barOnCls: 'scroller__bar_state_on'});
};