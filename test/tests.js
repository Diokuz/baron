var barOnCls = 'baron';

var originalHTML = '<div class="scroller"><div class="container"><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">is the third most populous city in Russia after Moscow and St. Petersburg and the most populous city in Asian Russia, with a population of 1,473,754 (2010 Census). It is the administrative center of Novosibirsk Oblast as well as of Siberian Federal District. The city is located in the southwestern part of Siberia at the banks of the Ob River and occupies an area of 502.1 square kilometers (193.9 sq mi).</p><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">Novosibirsk, founded in 1893 at the future site of a Trans-Siberian Railway bridge crossing the great Siberian river of Ob, first received the name Novonikolayevsk (Новониколаевск), in honor both of Saint Nicholas and of the reigning Tsar Nicholas II. The bridge was completed in the spring of 1897, making the new settlement the regional transport hub. The importance of the city further increased with the completion of the Turkestan-Siberia Railway in the early 20th century. The new railway connected Novosibirsk to Central Asia and the Caspian Sea.</p><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">...of the bridges opening, Novonikolayevsk hosted a population of 7,800 people. Its first bank opened in 1906, with a total of five banks operating by 1915. In 1907, Novonikolayevsk, now with a population exceeding 47,000, was granted town status with full rights for self-government. The pre-revolutionary period saw the population of Novosibirsk reach 80,000. During this period the city experienced steady and rapid economic growth, becoming one of the largest commercial and industrial centers of Siberia and developing a significant agricultural processing industry, as well as a power station, iron foundry, commodity market, several banks, and commercial and shipping companies. By 1917, Novosibirsk possessed seven Orthodox churches and one Roman Catholic church, several cinemas, forty primary schools, a high school, a teaching seminary, and the Romanov House non-classical secondary school. In 1913, Novonikolayevsk became one of the first places in Russia to institute compulsory primary education.</p><div class="header"><h1 class="header__title">Baron</h1></div></div><div class="scroller__bar"></div></div>';

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
    describe("Base.", function() {
        var baron,
            scroller,
            scrollTop;

        before(function() {
            scroller = $('.scroller')[0];
        });

        it("No elements", function() {
            $(scroller).find('.header').empty();

            baron = $('.scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom',
                clickable: true,
                scroll: function(data) {
                    scrollTop = data.x2;
                }
            });

            $('.wrapper').html(originalHTML);
        });

        it("past and future params", function() {
            baron = $('.scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom',
                past: 'header__title_group_top',
                future: 'header__title_group_bottom',
                clickable: true,
                scroll: function(data) {
                    scrollTop = data.x2;
                }
            });

            $('.scroller')[0].scrollTop = 4;
            baron.update(); // Событие выстреливает позже

            var firstHeader = $('.wrapper_headers .scroller .header__title').eq(0),
                secondHeader = $('.wrapper_headers .scroller .header__title').eq(1),
                thirdHeader = $('.wrapper_headers .scroller .header__title').eq(2);

            assert(firstHeader.hasClass('header__title_state_fixed'), '1 outside class');
            assert(firstHeader.hasClass('header__title_position_top'), '1 before class');
            assert(firstHeader.hasClass('header__title_group_top'), '1 past class');

            assert(secondHeader.hasClass('header__title_state_fixed'), '2 outside class');
            assert(secondHeader.hasClass('header__title_position_bottom'), '2 after class');
            assert(secondHeader.hasClass('header__title_group_bottom'), '2 past class');

            assert(thirdHeader.hasClass('header__title_state_fixed'), '3 outside class');
            assert(!thirdHeader.hasClass('header__title_position_bottom'), '3 !after class');
            assert(thirdHeader.hasClass('header__title_group_bottom'), '3 past class');

            baron.dispose();
        });

        it("no future and after classes when bottom edge reached", function() {
            $('.wrapper').html(originalHTML);

            baron = $('.scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom',
                past: 'header__title_group_top',
                future: 'header__title_group_bottom',
                clickable: true,
                scroll: function(data) {
                    scrollTop = data.x2;
                }
            });

            $('.scroller')[0].scrollTop = 99999;
            baron.update(); // Событие выстреливает позже

            assert(!$('.wrapper_headers .scroller .header__title').hasClass('header__title_group_bottom'), 'no future class');
            assert(!$('.wrapper_headers .scroller .header__title').hasClass('header__title_position_bottom'), 'no after class');

            // $('.wrapper').html(originalHTML);
        });
    });

    describe("clickable", function() {
        var baron,
            scroller;

        before(function() {
            $('.wrapper').html(originalHTML);

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

        after(function() {
            baron.dispose();
        });
    });

    describe("clickable + scroll callback", function() {
        var baron,
            scroller,
            scrollTop;

        before(function() {
            scroller = $('.scroller')[0];

            baron = $('.scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom',
                clickable: true,
                scroll: function(data) {
                    scrollTop = data.x2;
                }
            });

            eachIt(baron);
        });

        it("Клики по второму заголовку вызывает callback с правильной координатой", function() {
            var e = jQuery.Event('click'),
                firstTitle = $('.header__title')[0],
                secondTitle = $('.header__title')[1],
                top = secondTitle.parentNode.offsetTop - firstTitle.parentNode.offsetHeight;

            scroller.scrollTop = 0;
            $(secondTitle).trigger(e);
            assert(scrollTop == top, 'Попросили проскроллить до уровня ' + scrollTop + ' при ожидаемом ' + top);
        });

        after(function() {
            baron.dispose();
        });
    });

    describe("Negative margins.", function() {
        var baron,
            scroller;

        before(function() {
            var html = '<div class="scroller"><div class="container"><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">is the third most populous city in Russia after Moscow and St. Petersburg and the most populous city in Asian Russia, with a population of 1,473,754 (2010 Census). It is the administrative center of Novosibirsk Oblast as well as of Siberian Federal District. The city is located in the southwestern part of Siberia at the banks of the Ob River and occupies an area of 502.1 square kilometers (193.9 sq mi).</p><div class="header"><h1 class="header__title">Baron</h1></div><div class="scroller__pull"></div></div><div class="scroller__bar"></div></div>';
            $('.wrapper').html(html);
            $('.header__title').css({margin: '-7px 0 0'});

            scroller = $('.scroller')[0];

            baron = $('.scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom'
            });

            eachIt(baron);
        });

        it("No fix classes on first header at start", function() {
            assert(!$('.header__title').eq(0).hasClass('header__title_state_fixed'), 'no fix cls');
            assert(!$('.header__title').eq(0).hasClass('header__title_position_top'), 'no before cls');
            assert(!$('.header__title').eq(0).hasClass('header__title_position_bottom'), 'no after cls');
        });

        it("offsetTop", function() {
            assert($('.header__title')[0].offsetTop == -7, 'offsetTop at start pos ' + $('.header__title')[0].offsetTop);
            $('.scroller')[0].scrollTop = 1;
            baron.update();
            assert($('.header__title')[0].offsetTop == -7, 'offsetTop at 1px scroll ' + $('.header__title')[0].offsetTop);
        });

        after(function() {
            baron.dispose();
        });
    });

    describe("Live params update.", function() {
        var baron,
            scroller;

        before(function() {
            var html = '<div class="scroller"><div class="container"><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">is the third most populous city in Russia after Moscow and St. Petersburg and the most populous city in Asian Russia, with a population of 1,473,754 (2010 Census). It is the administrative center of Novosibirsk Oblast as well as of Siberian Federal District. The city is located in the southwestern part of Siberia at the banks of the Ob River and occupies an area of 502.1 square kilometers (193.9 sq mi).</p><div class="header"><h1 class="header__title">Baron</h1></div><div class="scroller__pull"></div></div><div class="scroller__bar"></div></div>';
            
            $('.wrapper').html(html);

            scroller = $('.scroller')[0];

            baron = $('.scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom'
            });

            eachIt(baron);
        });

        it("Add limiter param", function() {
            baron.update({
                fix: {
                    limiter: true
                }
            });
            scroller.scrollTop = 1;
            scroller.scrollTop = 0;

            assert(parseInt($('.scroller__bar').css('top'), 10) == $('.header').height(), 'Самое высокое положение скроллбара теперь ограничено высотой заголовка');

            baron.update({
                fix: {
                    limiter: false
                }
            });
            scroller.scrollTop = 1;
            scroller.scrollTop = 0;
            
            assert(parseInt($('.scroller__bar').css('top'), 10) == 0, 'Самое высокое положение скроллбара снова неограничено высотой заголовка');
        });

        // it("offsetTop", function() {
        //     assert($('.header__title')[0].offsetTop == -7, 'offsetTop at start pos ' + $('.header__title')[0].offsetTop);
        //     $('.scroller')[0].scrollTop = 1;
        //     baron.update();
        //     assert($('.header__title')[0].offsetTop == -7, 'offsetTop at 1px scroll ' + $('.header__title')[0].offsetTop);
        // });

        after(function() {
            baron.dispose();
        });
    });

    describe("Two independed fix.", function() {
        var baron,
            scroller;

        before(function() {
            var html = '<div class="scroller"><div class="container"><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">is the third most populous city in Russia after Moscow and St. Petersburg and the most populous city in Asian Russia, with a population of 1,473,754 (2010 Census). It is the administrative center of Novosibirsk Oblast as well as of Siberian Federal District. The city is located in the southwestern part of Siberia at the banks of the Ob River and occupies an area of 502.1 square kilometers (193.9 sq mi).</p><div class="header"><h1 class="header__title">Baron</h1></div><div class="scroller__pull"></div></div><div class="scroller__bar"></div></div>';
            
            $('.wrapper').html(html);

            scroller = $('.scroller')[0];
            $('.header__title').eq(1).css({height: '100px'});

            baron = $('.scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: $('.header__title').eq(0),
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom',
                limiter: true
            }).fix({
                elements: $('.header__title').eq(1),
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom'
            });

            eachIt(baron);
        });

        it("Bar limited by first header", function() {
            baron.update();
            assert(parseInt($('.scroller__bar').css('top'), 10) == $('.header').height(), 'Самое высокое положение скроллбара ограничено высотой первого заголовка');
        });

        // it("offsetTop", function() {
        //     assert($('.header__title')[0].offsetTop == -7, 'offsetTop at start pos ' + $('.header__title')[0].offsetTop);
        //     $('.scroller')[0].scrollTop = 1;
        //     baron.update();
        //     assert($('.header__title')[0].offsetTop == -7, 'offsetTop at 1px scroll ' + $('.header__title')[0].offsetTop);
        // });

        after(function() {
            baron.dispose();
            $('.header__title').eq(1).css({height: ''});
        });
    });
});











