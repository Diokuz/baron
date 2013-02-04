window.onload = function() {

    baron($('.wrapper'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        selector: $,
        barTop: 20,
        barOnCls: 'scroller__bar_state_on',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed'
    });
    
};