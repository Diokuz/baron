/* global describe, assert, beforeEach, it */

var barOnCls = 'baron'
var originalHTML = '<div class="scroller"><div class="container"><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">is the third most populous city in Russia after Moscow and St. Petersburg and the most populous city in Asian Russia, with a population of 1,473,754 (2010 Census). It is the administrative center of Novosibirsk Oblast as well as of Siberian Federal District. The city is located in the southwestern part of Siberia at the banks of the Ob River and occupies an area of 502.1 square kilometers (193.9 sq mi).</p><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">Novosibirsk, founded in 1893 at the future site of a Trans-Siberian Railway bridge crossing the great Siberian river of Ob, first received the name Novonikolayevsk (Новониколаевск), in honor both of Saint Nicholas and of the reigning Tsar Nicholas II. The bridge was completed in the spring of 1897, making the new settlement the regional transport hub. The importance of the city further increased with the completion of the Turkestan-Siberia Railway in the early 20th century. The new railway connected Novosibirsk to Central Asia and the Caspian Sea.</p><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">...of the bridges opening, Novonikolayevsk hosted a population of 7,800 people. Its first bank opened in 1906, with a total of five banks operating by 1915. In 1907, Novonikolayevsk, now with a population exceeding 47,000, was granted town status with full rights for self-government. The pre-revolutionary period saw the population of Novosibirsk reach 80,000. During this period the city experienced steady and rapid economic growth, becoming one of the largest commercial and industrial centers of Siberia and developing a significant agricultural processing industry, as well as a power station, iron foundry, commodity market, several banks, and commercial and shipping companies. By 1917, Novosibirsk possessed seven Orthodox churches and one Roman Catholic church, several cinemas, forty primary schools, a high school, a teaching seminary, and the Romanov House non-classical secondary school. In 1913, Novonikolayevsk became one of the first places in Russia to institute compulsory primary education.</p><div class="header"><h1 class="header__title">Baron</h1></div></div><div class="scroller__bar"></div></div>'
var segment = '<div class="header"><h1 class="header__title">Header</h1></div><p class="text">text</p>'

// Фантом жс не поддерживает mutation observer
describe('Плагин autoUpdate', function() {
    it('Добавление элемента (типа ajax). ', function(done) {
        $('.wrapper._origin').html(originalHTML)

        baron = $('.wrapper._origin .scroller').baron({
            bar: '.scroller__bar',
            barOnCls: barOnCls
        })

        var barHeight1 = $('.scroller__bar').height()
        var item = $('.wrapper._origin .container').html()

        $('.wrapper._origin .container').prepend(item + item + item)

        baron.update()

        setTimeout(function() {
            var barHeight2 = $('.scroller__bar').height()

            assert(barHeight2 < barHeight1, 'Высота бара должна уменьшиться')
            // baron.dispose()
            done()
        }, 100)
    })

    it('Добавление прилипающего заголовка. ', function(done) {
        $('.wrapper._origin').html(originalHTML)

        $('.wrapper._origin .scroller')[0].scrollTop = 0 // f ff

        baron = $('.wrapper._origin .scroller').baron({
            bar: '.scroller__bar',
            barOnCls: barOnCls
        }).fix({
            elements: '.header__title',
            outside: 'header__title_state_fixed'
        })

        var barHeight1 = $('.scroller__bar').height()
        var headerScroller = $('.wrapper._origin.wrapper_headers .scroller')
        var st = headerScroller.offset().top

        $('.wrapper._origin .container').prepend('text before' + segment)

        setTimeout(function() {
            var barHeight2 = $('.scroller__bar').height()

            assert(barHeight2 < barHeight1, 'Высота бара должна уменьшиться: ' + barHeight2 + ' vs ' + barHeight1)

            var ht1 = headerScroller.find('.header').eq(0).offset().top

            assert(ht1 > 0, 'Начальная позиция первого заголовка должна быть ниже текста')

            headerScroller[0].scrollTop = headerScroller.find('.header').eq(1)[0].offsetTop
            ht1 = headerScroller.find('.header__title').eq(1).offset().top
            assert.equal(ht1, st, 'После скролла позиция первого заголовка должна попасть в верхний левый угол скроллера')

            setTimeout(function() {
                var t = headerScroller.find('.header__title').eq(0)[0].offsetTop

                assert.equal(t, 0, 'Позиция нового заголовка должна стать нулевой, то есть он должен прилипнуть')

                baron.dispose()
                done()
            }, 10)
        }, 401)
    })

    it('Добавление блока с css-анимируемой высотой. ', function(done) {
        $('.wrapper._origin').html(originalHTML)

        baron = $('.wrapper._origin .scroller').baron({
            bar: '.scroller__bar',
            barOnCls: barOnCls
        }).fix({
            elements: '.header__title',
            outside: 'header__title_state_fixed'
        })

        var barHeight1 = $('.scroller__bar').height()

        $('.wrapper._origin .container').prepend('<div class="anim"></div>')

        setTimeout(function() {
            $('.anim').addClass('_visible')
            setTimeout(function() {
                var barHeight2 = $('.scroller__bar').height()

                assert(barHeight2 < barHeight1, 'Высота бара должна уменьшиться')

                done()
            }, 1100)
        }, 300)
    })

    describe('Инициализация на скрытом блоке', function() {
        var block = $('.wrapper._origin')

        beforeEach(function() {
            block.css({display: 'none'})
            $('.wrapper._origin').html(originalHTML)

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls
            })
        })

        it('После появления адекватно работает', function(done) {
            block.css({display: 'block'})
            setTimeout(function() {
                var width = $('.wrapper._origin .scroller')[0].clientWidth // Нельзя брать $.width() потому что он возьмет из styles
                var barWidth = $('.wrapper._origin .scroller__bar')[0].clientWidth

                assert(width > 0, 'Ширина скроллера должна быть уже больше 0, ' + width)
                assert(barWidth > 0, 'Ширина бара должна быть уже больше 0, ' + barWidth)
                done()
            }, 400)
        })

        it('После появления root-ноды адекватно работает сразу же', function(done) {
            block.css({display: 'block'})
            setTimeout(function() {
                var width = $('.wrapper._origin .scroller')[0].clientWidth // Нельзя брать $.width() потому что он возьмет из styles
                var barWidth = $('.wrapper._origin .scroller__bar')[0].clientWidth

                assert(width > 0, 'width ' + width)
                assert(barWidth > 0, 'barWidth ' + barWidth)
                done()
            }, 301)
        })
    })
})
