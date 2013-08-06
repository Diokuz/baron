var barOnCls = 'baron';

function eachIt(baron) {
    it("Возвращает барон-объект", function() {
        assert.ok(baron);
        assert.ok(baron.update);
        assert.ok(baron.dispose);
    });
}

describe("Успешная инициализация барона по-умолчанию", function() {
    var baron = $('.scroller').baron({
        bar: '.scroller__bar',
        barOnCls: barOnCls
    });

    var scroller = $('.scroller')[0],
        bar = $('.scroller__bar')[0];

    eachIt(baron);

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