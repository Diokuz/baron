/* global describe, assert, before,, it */

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

describe("Режим position='absolute'.", function() {
    var scopedBaron = window.baron

    before(function() {
        $('.wrapper._origin').html(originalHTML)
    })

    describe('Вертикальный режим.', function() {
        before(function() {
            $('.wrapper._origin').html(originalHTML)
        })

        it('Выставляются стили (position, padding).', function() {
            var baron = $('.wrapper._origin .scroller').baron({
                position: 'absolute',
                bar: '.scroller__bar',
                barOnCls: 'baron'
            })

            var clipperStyles = $('.wrapper._origin')[0].style
            var scrollerStyles = $('.wrapper._origin .scroller')[0].style

            assert.equal(clipperStyles.position, 'relative')
            assert.equal(scrollerStyles.position, 'absolute')
            assert.equal(scrollerStyles.paddingTop, '')
            assert.equal(scrollerStyles.paddingRight, '0px')
            assert.equal(scrollerStyles.paddingBottom, '')
            assert.equal(scrollerStyles.paddingLeft, '')

            baron.dispose()
        })

        it('Логирование ошибки при одновременном position=absolute && impact=clipper', function() {
            var _log = scopedBaron.fn.log
            var i = 0

            scopedBaron.fn.log = function() {
                i++
            }

            var baron = $('.wrapper._origin .scroller').baron({
                position: 'absolute',
                bar: '.scroller__bar',
                barOnCls: 'baron',
                impact: 'clipper'
            })

            assert.equal(i, 1)

            scopedBaron.fn.log = _log
            baron.dispose()
        })

        it('Логирование ошибки при вызове плагина fix (он несовместим с mode=position)', function() {
            var _log = scopedBaron.fn.log
            var i = 0

            scopedBaron.fn.log = function() {
                i++
            }

            var baron = $('.wrapper._origin .scroller').baron({
                position: 'absolute',
                bar: '.scroller__bar',
                barOnCls: 'baron'
            }).fix()

            assert.equal(i, 3)

            scopedBaron.fn.log = _log
            baron.dispose()
        })

        it('rtl', function() {
            $('.wrapper._origin').html(originalHTML)
            $('.wrapper._origin').attr('dir', 'rtl')
            var baron = $('.wrapper._origin .scroller').baron({
                position: 'absolute',
                rtl: true,
                bar: '.scroller__bar',
                barOnCls: 'baron'
            })

            var clipperStyles = $('.wrapper._origin')[0].style
            var scrollerStyles = $('.wrapper._origin .scroller')[0].style

            assert.equal(clipperStyles.position, 'relative')
            assert.equal(scrollerStyles.position, 'absolute')
            assert.equal(scrollerStyles.paddingTop, '')
            assert.equal(scrollerStyles.paddingRight, '')
            assert.equal(scrollerStyles.paddingBottom, '')
            assert.equal(scrollerStyles.paddingLeft, '0px')

            baron.dispose()
            $('.wrapper._origin').attr('dir', '')
        })

        it('horizontal', function() {
            $('.wrapper._origin').html(originalHorizontalHTML)
            var baron = $('.wrapper._origin .scroller_h').baron({
                position: 'absolute',
                bar: '.scroller__bar',
                barOnCls: 'baron',
                direction: 'h'
            })

            var clipperStyles = $('.wrapper._origin')[0].style
            var scrollerStyles = $('.wrapper._origin .scroller_h')[0].style

            assert.equal(clipperStyles.position, 'relative')
            assert.equal(scrollerStyles.position, 'absolute')
            assert.equal(scrollerStyles.paddingTop, '')
            assert.equal(scrollerStyles.paddingRight, '')
            assert.equal(scrollerStyles.paddingBottom, '0px')
            assert.equal(scrollerStyles.paddingLeft, '')

            baron.dispose()
        })
    })
})
