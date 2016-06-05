/* global describe, assert, it */

describe('Скроллирование в двух направлениях одновременно.', function() {
    var originalHTML = [
        '<div class="scroller"><div class="container" style="width: 1000px; height: 1000px">1</div>',
        '<div class="scroller__bar"></div><div class="scroller__bar scroller__bar_h"></div>',
        '</div>'
    ].join('')

    it('baron().baron() $', function(done) {
        $('.wrapper._origin').html(originalHTML)

        var scroller = $('.scroller')[0]
        var barH = $('.scroller__bar_h')[0]

        var instance = $('.wrapper._origin .scroller').baron({
            bar: '.scroller__bar',
            barOnCls: 'baron'
        }).baron({
            bar: '.scroller__bar_h',
            barOnCls: 'baron_h'
        })

        assert.equal(barH.offsetLeft, 0)
        scroller.scrollLeft = 9999
        setTimeout(function() {
            assert.ok(barH.offsetLeft > 0)
            instance.dispose()
            done()
        }, 0)
    })

    it('Баг baron().baron() root', function(done) {
        $('.wrapper._origin').html(originalHTML)

        var scroller = $('.scroller')[0]
        var barH = $('.scroller__bar_h')[0]

        var instance = $.fn.baron({
            scroller: '.wrapper._origin .scroller',
            bar: '.scroller__bar',
            barOnCls: 'baron'
        }).baron({
            bar: '.scroller__bar_h',
            barOnCls: 'baron_h'
        })

        assert.equal(barH.offsetLeft, 0)
        scroller.scrollLeft = 9999
        setTimeout(function() {
            assert.ok(barH.offsetLeft > 0)
            instance.dispose()
            done()
        }, 0)
    })

    it('Баг baron().baron() root && scroller', function(done) {
        $('.wrapper._origin').html(originalHTML)

        var scroller = $('.scroller')[0]
        var barH = $('.scroller__bar_h')[0]

        var instance = $.fn.baron({
            root: '.wrapper._origin',
            scroller: '.scroller',
            bar: '.scroller__bar',
            barOnCls: 'baron'
        }).baron({
            root: '.wrapper._origin',
            bar: '.scroller__bar_h',
            barOnCls: 'baron_h'
        })

        assert.equal(barH.offsetLeft, 0)
        scroller.scrollLeft = 9999
        setTimeout(function() {
            assert.ok(barH.offsetLeft > 0)
            instance.dispose()
            done()
        }, 0)
    })
})
