window.onload = function() {
    baron($('.wrapper'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        barTop: 20,
        barOnCls: 'scroller__bar_state_on',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed',
        hTopFixCls: 'header__title_position_top',
        hBottomFixCls: 'header__title_position_bottom'
    });
};