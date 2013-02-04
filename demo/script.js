window.onload = function() {

    baron(document.querySelectorAll('.wrapper'), {
        scroller: '.scroller',
        container: '.container',
        bar: '.scroller__bar',
        //using dom.js, jquery, ender etc.
        //selector: $,
        barTop: 20,
        barOnCls: 'scroller__bar_state_on',
        header: '.header__title',
        hFixCls: 'header__title_state_fixed'
    });
    
};