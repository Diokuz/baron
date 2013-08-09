var barOnCls = 'baron';

function eachIt(baron) {
    it("Возвращает барон-объект", function() {
        assert.ok(baron);
        assert.ok(baron.update);
        assert.ok(baron.dispose);
    });
}

describe("Барон.", function() {
    describe("Успешная инициализация барона по-умолчанию", function() {
        var baron,
            scroller,
            bar;

        before(function() {
            baron = $('.scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            });

            scroller = $('.scroller')[0];
            bar = $('.scroller__bar')[0];

            eachIt(baron);
        });

        it("Выставляет аттрибут data-baron-v в значение inited", function() {
            var attrV = $('.scroller').attr('data-baron-v'),
                attrH = $('.scroller').attr('data-baron-h');

            assert.ok(attrV == 'inited');
            assert.ok(!attrH);
        });

        it("Находит bar и выставляет ему правильную высоту", function() {
            var height = parseInt($(bar).css('height'), 10),
                expectedHeight = Math.round(scroller.clientHeight * scroller.clientHeight / scroller.scrollHeight);

            assert.ok(baron[0].bar === bar);
            assert.ok(Math.abs(height - expectedHeight) <= 1);
        });

        it("После вызова метода dispose удаляет атрибуты и классы", function() {
            var sizeDim = baron[0].origin.crossSize;

            baron.dispose();

            var attrV = $('.scroller').attr('data-baron-v'),
                attrH = $('.scroller').attr('data-baron-h'),
                cls = $('.scroller').hasClass(barOnCls),
                size = $('.scroller')[0].style[sizeDim];

            //$('.scroller').css(sizeDim)

            assert.ok(!attrV);
            assert.ok(!attrH);
            assert.ok(!cls);
            assert.ok(!size);
        });
    });
});

describe("Плагин fix.", function() {
    describe("clickable", function() {
        var baron,
            scroller;

        before(function() {
            baron = $('.scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom',
                clickable: true
            });

            scroller = $('.scroller')[0];

            eachIt(baron);
        });

        it("Клики по второму заголовку скроллит контент", function() {
            var e = jQuery.Event('click'),
                firstTitle = $('.header__title')[0],
                secondTitle = $('.header__title')[1],
                top = secondTitle.parentNode.offsetTop - firstTitle.parentNode.offsetHeight;

            scroller.scrollTop = 0;
            $(secondTitle).trigger(e);
            assert(scroller.scrollTop == top, 'Проскроллились до уровня ' + scroller.scrollTop + ' при ожидаемом ' + top);
        });

        it("Клики по третьему заголовку", function() {
            var e = jQuery.Event('click'),
                currentTitle = $('.header__title')[2],
                top = currentTitle.parentNode.offsetTop - $('.header__title')[0].parentNode.offsetHeight - $('.header__title')[1].parentNode.offsetHeight;

            $(currentTitle).trigger(e);
            assert(scroller.scrollTop == top, 'Проскроллились до уровня ' + scroller.scrollTop + ' при ожидаемом ' + top);
        });

        it("Клики по первому заголовку", function() {
            var e = jQuery.Event('click'),
                firstTitle = $('.header__title')[0];

            $(firstTitle).trigger(e);
            assert(scroller.scrollTop == 0, 'Проскроллились до уровня ' + scroller.scrollTop + ' при ожидаемом ' + 0);
        });

        it("Клики по четвертому - новому (appended) заголовку", function() {
            var html = '<div class="header"><h1 class="header__title">New header</h1></div><p class="text">...of the bridges opening, Novonikolayevsk hosted a population of 7,800 people. Its first bank opened in 1906, with a total of five banks operating by 1915. In 1907, Novonikolayevsk, now with a population exceeding 47,000, was granted town status with full rights for self-government. The pre-revolutionary period saw the population of Novosibirsk reach 80,000. During this period the city experienced steady and rapid economic growth, becoming one of the largest commercial and industrial centers of Siberia and developing a significant agricultural processing industry, as well as a power station, iron foundry, commodity market, several banks, and commercial and shipping companies. By 1917, Novosibirsk possessed seven Orthodox churches and one Roman Catholic church, several cinemas, forty primary schools, a high school, a teaching seminary, and the Romanov House non-classical secondary school. In 1913, Novonikolayevsk became one of the first places in Russia to institute compulsory primary education.</p>';

            $(scroller).append(html);
            baron.update();

            var e = jQuery.Event('click'),
                currentTitle = $('.header__title')[3],
                top = currentTitle.parentNode.offsetTop - $('.header__title')[0].parentNode.offsetHeight - $('.header__title')[1].parentNode.offsetHeight - $('.header__title')[2].parentNode.offsetHeight;

            $(currentTitle).trigger(e);
            assert(scroller.scrollTop == top, 'Проскроллились до уровня ' + scroller.scrollTop + ' при ожидаемом ' + top);
        });
    });
});











