/* global describe, assert, before, after, it */

// Here are tests for cross-scrolling bugs https://github.com/Diokuz/baron/issues/116

var barOnCls = 'baron'
var originalHTML = [
    '<div class="scroller"><div class="container"><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">is the third most populous city in Russia after Moscow and St. Petersburg and the most populous city in Asian Russia, with a population of 1,473,754 (2010 Census). It is the administrative center of Novosibirsk Oblast as well as of Siberian Federal District. The city is located in the southwestern part of Siberia at the banks of the Ob River and occupies an area of 502.1 square kilometers (193.9 sq mi).</p><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">Novosibirsk, founded in 1893 at the future site of a Trans-Siberian Railway bridge crossing the great Siberian river of Ob, first received the name Novonikolayevsk (Новониколаевск), in honor both of Saint Nicholas and of the reigning Tsar Nicholas II. The bridge was completed in the spring of 1897, making the new settlement the regional transport hub. The importance of the city further increased with the completion of the Turkestan-Siberia Railway in the early 20th century. The new railway connected Novosibirsk to Central Asia and the Caspian Sea.</p><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">...of the bridges opening, Novonikolayevsk hosted a population of 7,800 people. Its first bank opened in 1906, with a total of five banks operating by 1915. In 1907, Novonikolayevsk, now with a population exceeding 47,000, was granted town status with full rights for self-government. The pre-revolutionary period saw the population of Novosibirsk reach 80,000. During this period the city experienced steady and rapid economic growth, becoming one of the largest commercial and industrial centers of Siberia and developing a significant agricultural processing industry, as well as a power station, iron foundry, commodity market, several banks, and commercial and shipping companies. By 1917, Novosibirsk possessed seven Orthodox churches and one Roman Catholic church, several cinemas, forty primary schools, a high school, a teaching seminary, and the Romanov House non-classical secondary school. In 1913, Novonikolayevsk became one of the first places in Russia to institute compulsory primary education.</p><div class="header"><h1 class="header__title">Baron</h1></div></div>',
    '<div class="scroller__bar"></div>',
    '</div>'
].join('')

var originalHorizontalHTML = [
    '<div class="scroller_h"><div class="container_h">1234567890</div>',
    '<div class="scroller__bar_h"></div>',
    '</div>'
].join('')

describe('Автовозвращение скроллирования контента внутри клиппера.', function() {
    before(function() {
        $('.wrapper._origin').html(originalHTML)
    })

    describe('Вертикальный режим', function() {
        var baron, scroller

        before(function() {
            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar'
            })

            scroller = $('.scroller')[0]
        })

        // https://github.com/Diokuz/baron/issues/116
        it('Попытка браузера заскроллить клиппер блокируется в следующем тике', function(done) {
            var clipper = scroller.parentNode

            // Выставляем ширину больше клиппера чтоб баг мог проявиться
            $(scroller).css({
                'max-width': '200%',
                width: '200%'
            })
            clipper.scrollLeft = 21

            assert.equal(clipper.scrollLeft, 21, 'Проверяем, что контент действительно уехал')

            setTimeout(function() {
                assert.equal(clipper.scrollLeft, 0, 'В следующем тике контент должен вернуться в начальное положение')
                done()
            }, 0)
        })

        after(function() {
            baron.dispose()
        })
    })

    describe('RTL', function() {
        var baron, scroller

        before(function() {
            $('.wrapper._origin').html(originalHTML)

            scroller = $('.scroller')[0]

            scroller.parentNode.dir = 'rtl'

            baron = $('.wrapper._origin .scroller').baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls,
                rtl: true
            })
        })

        // https://github.com/Diokuz/baron/issues/116
        it('Попытка браузера заскроллить клиппер блокируется в следующем тике', function(done) {
            var clipper = scroller.parentNode

            // Выставляем ширину больше клиппера чтоб баг мог проявиться
            $(scroller).css({
                'max-width': '200%',
                width: '200%'
            })
            assert.equal(
                clipper.scrollLeft,
                clipper.scrollWidth - clipper.clientWidth,
                'Проверяем начальное положение, должно быть по правому краю'
            )
            clipper.scrollLeft = 0
            assert.equal(clipper.scrollLeft, 0, 'После принудительного подскролливания позиция должна сбиться на выравнивание по левому краю')

            setTimeout(function() {
                assert.equal(
                    clipper.scrollLeft,
                    clipper.scrollWidth - clipper.clientWidth,
                    'В следующем тике барон должен вернуть контент, в данном случае выровнять его по правому краю как было'
                )
                done()
            }, 0)
        })

        after(function() {
            scroller.parentNode.dir = 'ltr'
            baron.dispose()
        })
    })

    describe('Horizontal mode', function() {
        var scroller

        before(function() {
            $('.wrapper._origin').html(originalHorizontalHTML)

            baron = $('.wrapper._origin').baron({
                scroller: '.scroller_h',
                direction: 'h',
                impact: 'scroller'
            })

            scroller = $('.scroller_h')[0]
        })

        it('Попытка браузера заскроллить клиппер вверх блокируется в следующем тике', function(done) {
            var clipper = scroller.parentNode

            // Выставляем ширину больше клиппера чтоб баг мог проявиться
            $(scroller).css({
                'max-height': '200%',
                height: '200%'
            })
            assert.equal(
                clipper.scrollTop,
                0,
                'Проверяем начальное положение, должно быть по верхнему краю'
            )
            clipper.scrollTop = 23
            assert.equal(clipper.scrollTop, 23, 'После принудительного подскролливания позиция должна сбиться')

            setTimeout(function() {
                assert.equal(
                    clipper.scrollTop,
                    0,
                    'В следующем тике барон должен вернуть контент, в данном случае выровнять его по верхнему краю как было'
                )
                done()
            }, 0)
        })

        after(function() {
            baron.dispose()
        })
    })
})
