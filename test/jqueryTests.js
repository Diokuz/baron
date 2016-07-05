/* global describe, assert, before, after, it */

// @TODO
// 1. Многократный autoUpdate

var barOnCls = 'baron'
var originalHTML = [
    '<div class="scroller"><div class="container"><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">is the third most populous city in Russia after Moscow and St. Petersburg and the most populous city in Asian Russia, with a population of 1,473,754 (2010 Census). It is the administrative center of Novosibirsk Oblast as well as of Siberian Federal District. The city is located in the southwestern part of Siberia at the banks of the Ob River and occupies an area of 502.1 square kilometers (193.9 sq mi).</p><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">Novosibirsk, founded in 1893 at the future site of a Trans-Siberian Railway bridge crossing the great Siberian river of Ob, first received the name Novonikolayevsk (Новониколаевск), in honor both of Saint Nicholas and of the reigning Tsar Nicholas II. The bridge was completed in the spring of 1897, making the new settlement the regional transport hub. The importance of the city further increased with the completion of the Turkestan-Siberia Railway in the early 20th century. The new railway connected Novosibirsk to Central Asia and the Caspian Sea.</p><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">...of the bridges opening, Novonikolayevsk hosted a population of 7,800 people. Its first bank opened in 1906, with a total of five banks operating by 1915. In 1907, Novonikolayevsk, now with a population exceeding 47,000, was granted town status with full rights for self-government. The pre-revolutionary period saw the population of Novosibirsk reach 80,000. During this period the city experienced steady and rapid economic growth, becoming one of the largest commercial and industrial centers of Siberia and developing a significant agricultural processing industry, as well as a power station, iron foundry, commodity market, several banks, and commercial and shipping companies. By 1917, Novosibirsk possessed seven Orthodox churches and one Roman Catholic church, several cinemas, forty primary schools, a high school, a teaching seminary, and the Romanov House non-classical secondary school. In 1913, Novonikolayevsk became one of the first places in Russia to institute compulsory primary education.</p><div class="header"><h1 class="header__title">Baron</h1></div></div>',
    '<div class="scroller__bar"></div>',
    '</div>'
].join('')

var originalHorizontalHTML = [
    '<div class="scroller_h"><div class="container_h"></div>',
    '<div class="scroller__bar_h"></div>',
    '</div>'
].join('')

var originalControlsHTML = [
    '<div class="scroller"><div class="container"><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">is the third most populous city in Russia after Moscow and St. Petersburg and the most populous city in Asian Russia, with a population of 1,473,754 (2010 Census). It is the administrative center of Novosibirsk Oblast as well as of Siberian Federal District. The city is located in the southwestern part of Siberia at the banks of the Ob River and occupies an area of 502.1 square kilometers (193.9 sq mi).</p><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">Novosibirsk, founded in 1893 at the future site of a Trans-Siberian Railway bridge crossing the great Siberian river of Ob, first received the name Novonikolayevsk (Новониколаевск), in honor both of Saint Nicholas and of the reigning Tsar Nicholas II. The bridge was completed in the spring of 1897, making the new settlement the regional transport hub. The importance of the city further increased with the completion of the Turkestan-Siberia Railway in the early 20th century. The new railway connected Novosibirsk to Central Asia and the Caspian Sea.</p><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">...of the bridges opening, Novonikolayevsk hosted a population of 7,800 people. Its first bank opened in 1906, with a total of five banks operating by 1915. In 1907, Novonikolayevsk, now with a population exceeding 47,000, was granted town status with full rights for self-government. The pre-revolutionary period saw the population of Novosibirsk reach 80,000. During this period the city experienced steady and rapid economic growth, becoming one of the largest commercial and industrial centers of Siberia and developing a significant agricultural processing industry, as well as a power station, iron foundry, commodity market, several banks, and commercial and shipping companies. By 1917, Novosibirsk possessed seven Orthodox churches and one Roman Catholic church, several cinemas, forty primary schools, a high school, a teaching seminary, and the Romanov House non-classical secondary school. In 1913, Novonikolayevsk became one of the first places in Russia to institute compulsory primary education.</p><div class="header"><h1 class="header__title">Baron</h1></div></div>',
    '<div class="scroller__track">',
    '<div class="scroller__up"></div>',
    '<div class="scroller__bar"></div>',
    '<div class="scroller__down"></div>',
    '</div>',
    '</div>'
].join('')

function eachIt(baron) {
    it('Возвращает барон-объект', function() {
        assert.ok(baron)
        assert.ok(baron.update)
        assert.ok(baron.dispose)
    })
}

describe('Барон.', function() {
    before(function() {
        $('.wrapper._origin').html(originalHTML)
    })

    describe('Успешная инициализация барона по-умолчанию', function() {
        var baron,
            scroller,
            bar

        before(function() {
            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar'
            })

            scroller = $('.scroller')[0]
            bar = $('.scroller__bar')[0]

            eachIt(baron)
        })

        it('Выставляет аттрибут data-baron-v в значение inited', function() {
            var attrV = $('.scroller').attr('data-baron-v-id'),
                attrH = $('.scroller').attr('data-baron-h-id')

            assert.ok(attrV)
            assert.ok(!attrH)
        })

        it('Выставляет дефолтный baOnCls', function() {
            var has = $('.scroller').hasClass('_scrollbar')

            assert.ok(has)
        })

        it('Находит bar и выставляет ему правильную высоту', function() {
            var height = parseInt($(bar).css('height'), 10),
                expectedHeight = Math.round(scroller.clientHeight * scroller.clientHeight / scroller.scrollHeight)

            assert.ok(baron[0].bar === bar)
            assert.ok(Math.abs(height - expectedHeight) <= 1)
        })

        // https://github.com/Diokuz/baron/issues/116
        it('Попытка браузера заскроллить клиппер блокируется в следующем тике', function(done) {
            var clipper = scroller.parentNode

            clipper.scrollLeft = 9999

            setTimeout(function() {
                assert.equal(clipper.scrollLeft, 0)
                done()
            }, 0)
        })

        it('Повторная инициализация бросает ошибку', function() {
            var _save = console.error
            var i = 0

            console.error = function() {
                i++
            }

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar'
            })

            assert.equal(i, 3)
            console.error = _save
        })

        it('Повторный вызов барона без параметров не бросает ошибку', function() {
            var _save = console.error
            var i = 0

            console.error = function() {
                i++
            }

            $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar'
            })

            assert.equal(i, 3)

            $('.wrapper._origin .scroller').baron() // another three times

            assert.equal(i, 3)
            console.error = _save
        })

        it('Повторная инициализация возвращате ссылку на тот же инстанс', function() {
            var _save = console.error

            console.error = function() {}
            var second = $('.wrapper._origin .scroller').baron()
            var third = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            })
            var fourth = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls,
                direction: 'h'
            })

            assert.ok(baron[0] === second[0], 'Без параметров')
            assert.ok(baron[0] === third[0], 'С параметрами, но тот же direction')
            assert.ok(baron[0] != fourth[0], 'Другой direction')

            console.error = _save
            fourth.dispose()
        })

        it('После вызова метода dispose удаляет атрибуты и классы', function() {
            var sizeDim = baron[0].origin.crossSize

            baron.dispose()

            var attrV = $('.scroller').attr('data-baron-v'),
                cls = $('.scroller').hasClass(barOnCls),
                size = $('.scroller')[0].style[sizeDim]

            assert.ok(!attrV, 'attrV')
            assert.ok(!cls, 'cls')
            assert.ok(!size, 'size')
        })

        it('dispose на бароне где не было элементов', function() {
            baron = $('.not_exist').baron({
                bar: '.sadlfhasdhflakjsdhflaksjdhflakjsdh',
                barOnCls: barOnCls
            })

            baron.dispose()
        })
    })

    describe('Проблема с удалением атрибутов https://github.com/Diokuz/baron/issues/147', function() {
        var baron

        before(function() {
            $('.wrapper._origin').html(originalHTML)

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar'
            })

            eachIt(baron)
        })

        it('Удаляем атрибуты, апдейтим и смотрим на высоту бара', function(done) {
            var bar = $('.scroller__bar')[0]
            var scroller = $('.scroller')[0]

            bar.setAttribute('style', '') // hack for phantomjs
            bar.removeAttribute('style')
            scroller.removeAttribute('style')
            scroller.removeAttribute('data-baron-v-id')

            var height = bar.clientHeight

            assert.equal(height, 0)

            baron.update()

            height = bar.clientHeight
            assert(height > 20)
            done()
        })
    })

    describe('RTL', function() {
        var baron,
            scroller,
            bar

        before(function() {
            $('.wrapper._origin').html(originalHTML)

            scroller = $('.scroller')[0]
            bar = $('.scroller__bar')[0]

            scroller.parentNode.dir = 'rtl'

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls,
                rtl: true
            })

            eachIt(baron)
        })

        it('Выставляет аттрибут data-baron-v в значение inited', function() {
            var attrV = $('.scroller').attr('data-baron-v-id'),
                attrH = $('.scroller').attr('data-baron-h-id')

            assert.ok(attrV)
            assert.ok(!attrH)
        })

        it('Находит bar и выставляет ему правильную высоту', function() {
            var height = parseInt($(bar).css('height'), 10),
                expectedHeight = Math.round(scroller.clientHeight * scroller.clientHeight / scroller.scrollHeight)

            assert.ok(baron[0].bar === bar)
            assert.ok(Math.abs(height - expectedHeight) <= 1)
        })

        // https://github.com/Diokuz/baron/issues/116
        it('Попытка браузера заскроллить клиппер блокируется в следующем тике', function(done) {
            var clipper = scroller.parentNode

            clipper.scrollLeft = 0

            setTimeout(function() {
                assert.equal(clipper.scrollLeft, clipper.scrollWidth - clipper.clientWidth)
                done()
            }, 0)
        })

        after(function() {
            scroller.parentNode.dir = 'ltr'
        })
    })

    describe('noParams mode', function() {
        before(function() {
            $('.wrapper._origin').html(originalHTML)
        })

        it('Инициализация без параметров при имеющемся на странице бароне', function() {
            // Суть бага в следующем: manageAttr возвращал undefined, который
            // кастился в 0, поэтому вместо инициализации возвращалась ссылка
            // на имеющийся нулевой инстанс
            var first = $('.wrapper._origin.wrapper_headers .scroller')
            var second = $('.wrapper._origin.wrapper_ .scroller')

            first.baron()
            second.baron()

            var initAttr = second.attr('data-baron-v-id')

            assert.ok(initAttr)

            first.baron().dispose()
            second.baron().dispose()

            var disposeAttr = second.attr('data-baron-v-id')

            assert.equal(disposeAttr, undefined) // eslint-disable-line no-undefined
        })
    })

    describe('cssGuru param', function() {
        before(function() {
            $('.wrapper._origin').html(originalHTML)
        })

        it('Навешиваются все дефолтные стили', function() {
            var notCssGuru = $('.wrapper._origin.wrapper_headers .scroller')
            var cssGuru = $('.wrapper._origin.wrapper_ .scroller')

            notCssGuru.baron({cssGuru: false})
            cssGuru.baron({cssGuru: true})

            var notCssGuruStyles = {
                margin: notCssGuru[0].style.margin,
                border: notCssGuru[0].style.border,
                padding: notCssGuru[0].style.padding,
                boxSizing: notCssGuru[0].style.boxSizing
            }
            var cssGuruStyles = {
                margin: cssGuru[0].style.margin,
                border: cssGuru[0].style.border,
                padding: cssGuru[0].style.padding,
                boxSizing: cssGuru[0].style.boxSizing
            }

            assert.deepEqual(notCssGuruStyles, {
                margin: '0px',
                border: '0px',
                padding: '',
                boxSizing: 'border-box'
            })
            assert.deepEqual(cssGuruStyles, {
                margin: '',
                border: '',
                padding: '',
                boxSizing: ''
            })
        })
    })

    describe('Навешивание классов', function() {
        it('После инициализации нет блокирующего класса _scrolling', function() {
            $('.wrapper._origin').html(originalHTML)

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls,
                scrollingCls: '_scrolling'
            })

            assert.ok(!$('.wrapper._origin .scroller').hasClass('_scrolling'))
            baron.update()
            assert.ok(!$('.wrapper._origin .scroller').hasClass('_scrolling'))
        })
    })

    describe('Механизм обновления размеров', function() {
        it('Если у scroller был <100% размер, обновление происходит', function() {
            $('.wrapper._origin').html(originalHTML)
            $('.wrapper._origin .scroller').css({width: '50px'})

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls,
                scrollingCls: '_scrolling'
            })

            var width = $('.wrapper._origin .scroller').width()

            assert.ok(width > 50, 'With is ' + width)
        })
    })

    describe('Textarea.', function() {
        var baron

        before(function() {
            var html = '<textarea class="scroller" style="font-size: 40px; line-height: 100px">-</textarea><div class="scroller__track"><div class="scroller__bar"></div></div></div>'

            $('.wrapper').html(html)

            $('.header__title').eq(1).css({height: '100px'})

            baron = $('.wrapper').baron({
                scroller: '.scroller',
                bar: '.scroller__bar',
                barOnCls: barOnCls
            })

            eachIt(baron)
        })

        it('Toggling barOnCls.', function(done) {
            $('.scroller').text('sadkvbalsjdfasjdkhf akjsdhflaksdhf lakjhsdafjh sadkvbalsjdfasjdkhf akjsdhflaksdhf lakjhsdafjh')
            baron.update()
            setTimeout(function() {
                assert( $('.wrapper').hasClass(barOnCls), 'При большом количестве контента навешивается класс' )
                $('.scroller').text('')
                baron.update()
                setTimeout(function() {
                    assert( !$('.wrapper').hasClass(barOnCls), 'В отсутствии текста класса нет' )
                    done()
                }, 0)
            }, 0)
        })

        after(function() {
            baron.dispose()
        })
    })

    describe.skip('Contenteditable.', function() {
        var baron

        before(function() {
            var html = '<div class="scroller"><div class="container" contenteditable style="min-height: 100%"></div><div class="scroller__track"><div class="scroller__bar"></div></div></div>'

            $('.wrapper._contenteditable').html(html)

            baron = $('.wrapper._contenteditable .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            })

            eachIt(baron)
        })

        it('Proper top position for bar at enter-keyup', function() {
            $('.wrapper._contenteditable .container').html('w<br />w<br />w<br />w<br />w<br />w<br />w<br />w<br />w<br />w<br />w<br />w<br />w<br />w<br />w<br />w<br />w<br />w<br />w').trigger('keyup')

            var barHeight = $('.wrapper._contenteditable .scroller__bar').height()

            assert.equal(+barHeight, 190)
        })

        after(function() {
            // baron.dispose()
        })
    })

    describe('Horizontal mode', function() {
        var baron

        before(function() {
            $('.wrapper._origin').html(originalHorizontalHTML)
        })

        it('Высота скроллера и клиппера в вебките должна быть одинаковой', function() {
            var _log = console.log
            var msg = ''
            var root

            console.log = function() {
                msg += arguments[0]
                root = arguments[1]
            }

            baron = $('.wrapper').baron({
                scroller: '.scroller_h',
                direction: 'h',
                impact: 'scroller'
            })

            var clipperHeight = $('.wrapper').height()
            var scrollerHeight = $('.scroller_h').height()

            assert.equal(clipperHeight, scrollerHeight)
            assert.equal(msg, 'Scroller not found!', 'Ошибка "скроллер не найден" залогирована 1 раз')
            assert.ok(
                root === $('.wrapper._contenteditable')[0],
                'Ошибка "скроллер не найден" брошена именно с той root-ноды, где его нет'
            )

            console.log = _log
        })

        after(function() {
            baron.dispose()
        })
    })
})

describe('Плагин fix.', function() {
    describe('Base.', function() {
        var baron
        var scroller
        // var scrollTop

        before(function() {
            $('.wrapper._origin').html(originalHTML)
            scroller = $('.scroller')[0]
        })

        it('No elements', function() {
            $(scroller).find('.header').empty()

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom',
                clickable: true,
                scroll: function(/* data */) {
                    // scrollTop = data.x2
                }
            })

            $('.wrapper._origin').html(originalHTML)
        })

        it('past and future params', function() {
            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            })

            baron = baron.fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom',
                past: 'header__title_group_top',
                future: 'header__title_group_bottom',
                clickable: true,
                scroll: function(/* data */) {
                    // scrollTop = data.x2
                }
            })

            $('.scroller')[0].scrollTop = 4
            baron.update() // Событие выстреливает позже

            var firstHeader = $('.wrapper_headers .scroller .header__title').eq(0),
                secondHeader = $('.wrapper_headers .scroller .header__title').eq(1),
                thirdHeader = $('.wrapper_headers .scroller .header__title').eq(2)

            assert(firstHeader.hasClass('header__title_state_fixed'), '1 outside class')
            assert(firstHeader.hasClass('header__title_position_top'), '1 before class')
            assert(firstHeader.hasClass('header__title_group_top'), '1 past class')

            assert(secondHeader.hasClass('header__title_state_fixed'), '2 outside class')
            assert(secondHeader.hasClass('header__title_position_bottom'), '2 after class')
            assert(secondHeader.hasClass('header__title_group_bottom'), '2 past class')

            assert(thirdHeader.hasClass('header__title_state_fixed'), '3 outside class')
            assert(!thirdHeader.hasClass('header__title_position_bottom'), '3 !after class')
            assert(thirdHeader.hasClass('header__title_group_bottom'), '3 past class')

            baron.dispose()
        })

        it('no future and after classes when bottom edge reached', function() {
            $('.wrapper._origin').html(originalHTML)

            baron = $('.wrapper._origin .scroller').baron({
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
                scroll: function(/* data */) {
                    // scrollTop = data.x2
                }
            })

            $('.scroller')[0].scrollTop = 99999
            baron.update() // Событие выстреливает позже

            assert(!$('.wrapper_headers .scroller .header__title').hasClass('header__title_group_bottom'), 'no future class')
            assert(!$('.wrapper_headers .scroller .header__title').hasClass('header__title_position_bottom'), 'no after class')

            // $('.wrapper').html(originalHTML)
        })

        it('grad param', function() {
            $('.wrapper._origin').html(originalHTML)

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom',
                past: 'header__title_group_top',
                future: 'header__title_group_bottom',
                grad: 'header__title_grad_true',
                radius: 100
            })

            baron.update() // Событие выстреливает позже

            assert(!$('.wrapper_headers .scroller .header:first-of-type .header__title').hasClass('header__title_grad_true'), 'has no grad class on start')

            $('.scroller')[0].scrollTop = 1
            baron.update()
            assert($('.wrapper_headers .scroller .header:first-of-type .header__title').hasClass('header__title_grad_true'), 'has grad class after 1px scroll down')

            $('.scroller')[0].scrollTop = $('.scroller')[0].scrollHeight - $('.scroller')[0].clientHeight
            baron.update()
            assert(!$('.wrapper_headers .scroller .header:last-of-type .header__title').hasClass('header__title_grad_true'), 'has no grad class on end')
            $('.scroller')[0].scrollTop = $('.scroller')[0].scrollHeight - $('.scroller')[0].clientHeight - 1
            baron.update()
            assert($('.wrapper_headers .scroller .header:last-of-type .header__title').hasClass('header__title_grad_true'), 'has grad class after 1px scroll up')

            baron.dispose()
        })

        it('header hav either inside or outside class', function() {
            $('.wrapper._origin').html(originalHTML)

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                inside: 'insideClass',
                outside: 'outsideClass'
            })

            $('.scroller')[0].scrollTop = 99999
            baron.update() // Событие выстреливает позже

            $('.wrapper_headers .scroller .header__title').each(function() {
                var hasInside = $(this).hasClass('insideClass'),
                    hasOutside = $(this).hasClass('outsideClass')

                assert(hasInside || hasOutside, 'no inside or outside class')
            })

            assert($('.wrapper_headers .scroller .header__title').eq(3).hasClass('insideClass'), 'no inside class')
        })
    })

    describe('clickable', function() {
        var baron,
            scroller

        before(function() {
            $('.wrapper._origin').html(originalHTML)

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom',
                clickable: true
            })

            scroller = $('.scroller')[0]

            eachIt(baron)
        })

        it('Клики по второму заголовку скроллит контент', function() {
            var e = jQuery.Event('click') // eslint-disable-line new-cap
            var firstTitle = $('.header__title')[0]
            var secondTitle = $('.header__title')[1]
            var top = secondTitle.parentNode.offsetTop - firstTitle.parentNode.offsetHeight

            scroller.scrollTop = 0
            $(secondTitle).trigger(e)
            assert(scroller.scrollTop == top, 'Проскроллились до уровня ' + scroller.scrollTop + ' при ожидаемом ' + top)
        })

        it('Клики по третьему заголовку', function() {
            var e = jQuery.Event('click') // eslint-disable-line new-cap
            var currentTitle = $('.header__title')[2]
            var top = currentTitle.parentNode.offsetTop - $('.header__title')[0].parentNode.offsetHeight - $('.header__title')[1].parentNode.offsetHeight

            $(currentTitle).trigger(e)
            assert(scroller.scrollTop == top, 'Проскроллились до уровня ' + scroller.scrollTop + ' при ожидаемом ' + top)
        })

        it('Клики по первому заголовку', function() {
            var e = jQuery.Event('click') // eslint-disable-line new-cap
            var firstTitle = $('.header__title')[0]

            $(firstTitle).trigger(e)
            assert(scroller.scrollTop == 0, 'Проскроллились до уровня ' + scroller.scrollTop + ' при ожидаемом ' + 0)
        })

        it('Клики по четвертому - новому (appended) заголовку', function() {
            var html = '<div class="header"><h1 class="header__title">New header</h1></div><p class="text">...of the bridges opening, Novonikolayevsk hosted a population of 7,800 people. Its first bank opened in 1906, with a total of five banks operating by 1915. In 1907, Novonikolayevsk, now with a population exceeding 47,000, was granted town status with full rights for self-government. The pre-revolutionary period saw the population of Novosibirsk reach 80,000. During this period the city experienced steady and rapid economic growth, becoming one of the largest commercial and industrial centers of Siberia and developing a significant agricultural processing industry, as well as a power station, iron foundry, commodity market, several banks, and commercial and shipping companies. By 1917, Novosibirsk possessed seven Orthodox churches and one Roman Catholic church, several cinemas, forty primary schools, a high school, a teaching seminary, and the Romanov House non-classical secondary school. In 1913, Novonikolayevsk became one of the first places in Russia to institute compulsory primary education.</p>'

            $(scroller).append(html)
            baron.update()

            var e = jQuery.Event('click') // eslint-disable-line new-cap
            var currentTitle = $('.header__title')[3]
            var top = currentTitle.parentNode.offsetTop - $('.header__title')[0].parentNode.offsetHeight - $('.header__title')[1].parentNode.offsetHeight - $('.header__title')[2].parentNode.offsetHeight

            $(currentTitle).trigger(e)
            assert(scroller.scrollTop == top, 'Проскроллились до уровня ' + scroller.scrollTop + ' при ожидаемом ' + top)
        })

        after(function() {
            baron.dispose()
        })
    })

    describe('clickable + scroll callback', function() {
        var baron,
            scroller,
            scrollTop

        before(function() {
            scroller = $('.scroller')[0]

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom',
                clickable: true,
                scroll: function(data) {
                    scrollTop = data.x2
                }
            })

            eachIt(baron)
        })

        it('Клики по второму заголовку вызывает callback с правильной координатой', function() {
            var e = jQuery.Event('click') // eslint-disable-line new-cap
            var firstTitle = $('.header__title')[0]
            var secondTitle = $('.header__title')[1]
            var top = secondTitle.parentNode.offsetTop - firstTitle.parentNode.offsetHeight

            scroller.scrollTop = 0
            $(secondTitle).trigger(e)
            assert(scrollTop == top, 'Попросили проскроллить до уровня ' + scrollTop + ' при ожидаемом ' + top)
        })

        after(function() {
            baron.dispose()
        })
    })

    describe('Negative margins.', function() {
        var baron

        before(function() {
            var html = '<div class="scroller"><div class="container"><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">is the third most populous city in Russia after Moscow and St. Petersburg and the most populous city in Asian Russia, with a population of 1,473,754 (2010 Census). It is the administrative center of Novosibirsk Oblast as well as of Siberian Federal District. The city is located in the southwestern part of Siberia at the banks of the Ob River and occupies an area of 502.1 square kilometers (193.9 sq mi).</p><div class="header"><h1 class="header__title">Baron</h1></div><div class="scroller__pull"></div></div><div class="scroller__bar"></div></div>'

            $('.wrapper._origin').html(html)
            $('.header__title').css({margin: '-7px 0 0'})

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom'
            })

            eachIt(baron)
        })

        it('No fix classes on first header at start', function() {
            assert(!$('.header__title').eq(0).hasClass('header__title_state_fixed'), 'no fix cls')
            assert(!$('.header__title').eq(0).hasClass('header__title_position_top'), 'no before cls')
            assert(!$('.header__title').eq(0).hasClass('header__title_position_bottom'), 'no after cls')
        })

        it('offsetTop', function() {
            assert($('.header__title')[0].offsetTop == -7, 'offsetTop at start pos ' + $('.header__title')[0].offsetTop)
            $('.scroller')[0].scrollTop = 1
            baron.update()
            assert($('.header__title')[0].offsetTop == -7, 'offsetTop at 1px scroll ' + $('.header__title')[0].offsetTop)
        })

        after(function() {
            baron.dispose()
        })
    })

    describe('Live params update.', function() {
        var baron
        var scroller

        before(function() {
            var html = '<div class="scroller"><div class="container"><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">is the third most populous city in Russia after Moscow and St. Petersburg and the most populous city in Asian Russia, with a population of 1,473,754 (2010 Census). It is the administrative center of Novosibirsk Oblast as well as of Siberian Federal District. The city is located in the southwestern part of Siberia at the banks of the Ob River and occupies an area of 502.1 square kilometers (193.9 sq mi).</p><div class="header"><h1 class="header__title">Baron</h1></div><div class="scroller__pull"></div></div><div class="scroller__bar"></div></div>'

            $('.wrapper._origin').html(html)

            scroller = $('.scroller')[0]

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            }).fix({
                elements: '.header__title',
                outside: 'header__title_state_fixed',
                before: 'header__title_position_top',
                after: 'header__title_position_bottom'
            })

            eachIt(baron)
        })

        it('Add limiter param', function() {
            baron.update({
                fix: {
                    limiter: true
                }
            })
            scroller.scrollTop = 1
            scroller.scrollTop = 0

            assert(parseInt($('.scroller__bar').css('top'), 10) == $('.header').height(), 'Самое высокое положение скроллбара теперь ограничено высотой заголовка')

            baron.update({
                fix: {
                    limiter: false
                }
            })
            scroller.scrollTop = 1
            scroller.scrollTop = 0

            assert(parseInt($('.scroller__bar').css('top'), 10) == 0, 'Самое высокое положение скроллбара снова неограничено высотой заголовка')
        })

        // it('offsetTop', function() {
        //     assert($('.header__title')[0].offsetTop == -7, 'offsetTop at start pos ' + $('.header__title')[0].offsetTop)
        //     $('.scroller')[0].scrollTop = 1
        //     baron.update()
        //     assert($('.header__title')[0].offsetTop == -7, 'offsetTop at 1px scroll ' + $('.header__title')[0].offsetTop)
        // })

        after(function() {
            baron.dispose()
        })
    })

    describe('Two independed fix.', function() {
        var baron

        before(function() {
            var html = '<div class="scroller"><div class="container"><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">is the third most populous city in Russia after Moscow and St. Petersburg and the most populous city in Asian Russia, with a population of 1,473,754 (2010 Census). It is the administrative center of Novosibirsk Oblast as well as of Siberian Federal District. The city is located in the southwestern part of Siberia at the banks of the Ob River and occupies an area of 502.1 square kilometers (193.9 sq mi).</p><div class="header"><h1 class="header__title">Baron</h1></div><div class="scroller__pull"></div></div><div class="scroller__bar"></div></div>'

            $('.wrapper._origin').html(html)

            $('.header__title').eq(1).css({height: '100px'})

            baron = $('.wrapper._origin .scroller').baron({
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
            })

            eachIt(baron)
        })

        it('Bar limited by first header', function() {
            baron.update()
            assert(parseInt($('.scroller__bar').css('top'), 10) == $('.header').height(), 'Самое высокое положение скроллбара ограничено высотой первого заголовка')
        })

        // it('offsetTop', function() {
        //     assert($('.header__title')[0].offsetTop == -7, 'offsetTop at start pos ' + $('.header__title')[0].offsetTop)
        //     $('.scroller')[0].scrollTop = 1
        //     baron.update()
        //     assert($('.header__title')[0].offsetTop == -7, 'offsetTop at 1px scroll ' + $('.header__title')[0].offsetTop)
        // })

        after(function() {
            baron.dispose()
            $('.header__title').eq(1).css({height: ''})
        })
    })
})

describe('Плагин controls.', function() {
    before(function() {
        $('.wrapper._origin').html(originalControlsHTML)

        baron = $('.wrapper._origin .scroller').baron({
            bar: '.scroller__bar',
            barOnCls: barOnCls
        }).controls({
            track: '.scroller__track',
            forward: '.scroller__down',
            backward: '.scroller__up'
        })
    })

    // https://github.com/Diokuz/baron/issues/121
    // it.only('Клик в контрол не должен приводить к всплытию в трек', function(done) {
    //     var i = 0

    //     setTimeout(function() {
    //         $('.scroller__down').trigger('click')
    //         $('.scroller__down').trigger('mousedown', {offsetX: 1})
    //         setTimeout(function() {
    //             $('.scroller__down').trigger('click')
    //             $('.scroller__down').trigger('mousedown', {offsetX: 1})
    //             setTimeout(function() {
    //                 $('.scroller__down').trigger('click')
    //                 $('.scroller__down').trigger('mousedown', {offsetX: 1})
    //                 var scrollTop = $('.scroller')[0].scrollTop
    //                 console.log(scrollTop)
    //                 done()
    //             }, 10)
    //         }, 10)
    //     }, 10)
    // })

    after(function() {
        baron.dispose()
    })
})
