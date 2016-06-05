/* global describe, assert, before, it, bonzo, qwery, bean */

var barOnCls = 'baron'
var originalHTML = '<div class="scroller"><div class="container"><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">is the third most populous city in Russia after Moscow and St. Petersburg and the most populous city in Asian Russia, with a population of 1,473,754 (2010 Census). It is the administrative center of Novosibirsk Oblast as well as of Siberian Federal District. The city is located in the southwestern part of Siberia at the banks of the Ob River and occupies an area of 502.1 square kilometers (193.9 sq mi).</p><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">Novosibirsk, founded in 1893 at the future site of a Trans-Siberian Railway bridge crossing the great Siberian river of Ob, first received the name Novonikolayevsk (Новониколаевск), in honor both of Saint Nicholas and of the reigning Tsar Nicholas II. The bridge was completed in the spring of 1897, making the new settlement the regional transport hub. The importance of the city further increased with the completion of the Turkestan-Siberia Railway in the early 20th century. The new railway connected Novosibirsk to Central Asia and the Caspian Sea.</p><div class="header"><h1 class="header__title">Baron</h1></div><p class="text">...of the bridges opening, Novonikolayevsk hosted a population of 7,800 people. Its first bank opened in 1906, with a total of five banks operating by 1915. In 1907, Novonikolayevsk, now with a population exceeding 47,000, was granted town status with full rights for self-government. The pre-revolutionary period saw the population of Novosibirsk reach 80,000. During this period the city experienced steady and rapid economic growth, becoming one of the largest commercial and industrial centers of Siberia and developing a significant agricultural processing industry, as well as a power station, iron foundry, commodity market, several banks, and commercial and shipping companies. By 1917, Novosibirsk possessed seven Orthodox churches and one Roman Catholic church, several cinemas, forty primary schools, a high school, a teaching seminary, and the Romanov House non-classical secondary school. In 1913, Novonikolayevsk became one of the first places in Russia to institute compulsory primary education.</p><div class="header"><h1 class="header__title">Baron</h1></div></div><div class="scroller__bar"></div></div>'

function eachIt(baron) {
    it('Возвращает барон-объект', function() {
        assert.ok(baron)
        assert.ok(baron.update)
        assert.ok(baron.dispose)
    })
}

var bonzoQuery = function(selector, context) {
    return bonzo(qwery(selector, context))
}

describe('Барон.', function() {
    before(function() {
        bonzoQuery('.wrapper._origin').html(originalHTML)
    })

    describe('Успешная инициализация барона по-умолчанию', function() {
        var baronInstance,
            scroller,
            bar

        before(function() {
            baronInstance = baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls,
                root: bonzoQuery('.wrapper._origin .scroller'),
                $: bonzoQuery,
                event: function(elem, event, func, mode) { // Events manager
                    var method = mode

                    if (mode == 'trigger') {
                        method = 'fire'
                    }

                    bean[method || 'on'](elem, event, func)
                }
            })

            scroller = bonzoQuery('.scroller')[0]
            bar = bonzoQuery('.scroller__bar')[0]

            eachIt(baronInstance)
        })

        it('Выставляет аттрибут data-baron-v в значение inited', function() {
            var attrV = bonzoQuery('.scroller').attr('data-baron-v-id')
            var attrH = bonzoQuery('.scroller').attr('data-baron-h-id')

            assert.ok(attrV)
            assert.ok(!attrH)
        })

        it('Находит bar и выставляет ему правильную высоту', function() {
            var height = parseInt(bonzoQuery(bar).css('height'), 10)
            var expectedHeight = Math.round(scroller.clientHeight * scroller.clientHeight / scroller.scrollHeight)

            assert.ok(baronInstance[0].bar === bar)
            assert.ok(Math.abs(height - expectedHeight) <= 1)
        })

        describe('При вызове метода dispose()', function() {
            it('удаляет инстанс барона без ошибок', function() {
                assert.doesNotThrow(function() {
                    baronInstance.dispose()
                }, Error)
            })

            it('удаляет атрибут data-baron-v', function() {
                var attrV = bonzoQuery('.scroller').attr('data-baron-v')
                var attrH = bonzoQuery('.scroller').attr('data-baron-h')

                assert.isNull(attrV)
                assert.isNull(attrH)
            })

            it('ставит display: none для bar-ов', function() {
                var display = bonzoQuery(bar).css('display')

                assert.ok(display === 'none')
            })
        })
    })

    describe('Проблемы с отсутствием jQuery', function() {
        before(function() {
            bonzoQuery('.wrapper._origin').html(originalHTML)
        })

        it('Логирует ошибку, если $ не передан', function() {
            var _save = console.error
            var called = 0

            console.error = function() {
                called++
            }

            baron({
                bar: '.scroller__bar',
                barOnCls: barOnCls,
                root: bonzoQuery('.wrapper._origin .scroller'),
                event: function(elem, event, func, mode) { // Events manager
                    var method = mode

                    if (mode == 'trigger') {
                        method = 'fire'
                    }

                    bean[method || 'on'](elem, event, func)
                }
            })

            assert.equal(called, 1)
            console.error = _save
        })

        it('Не бросает ошибку, если this === undefined', function(done) {
            var _save = console.error

            console.error = function() {}
            var result = baron.call(undefined, { // eslint-disable-line
                bar: '.scroller__bar',
                barOnCls: barOnCls,
                root: bonzoQuery('.wrapper._origin .scroller'),
                event: function(elem, event, func, mode) { // Events manager
                    var method = mode

                    if (mode == 'trigger') {
                        method = 'fire'
                    }

                    bean[method || 'on'](elem, event, func)
                }
            })

            assert.ok(result.fix, 'Возвращает пустой но рабочий инстанс барона')

            done()
            console.error = _save
        })
    })
})
