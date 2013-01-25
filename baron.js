(function(window, undefined) {
    "use strict";

    var baron = function(data) {
        new baron.init(data);
    };

    // gData - исходные данные от инициализации, не должны меняться
    baron.init = function(gData) {
        var headers,
            viewPortHeight, // Максимально возможная высота видимости одной секции контента
            headerTops, // Начальные позиции хидеров
            topHeights,
            bottomHeights,
            rTimer,
            scroller,
            container,
            bar;

        
        // Сбор данных из DOM
        headers = gData.headers;
        scroller = node('scroller');
        container = node('container');
        bar = node('bar');

        // Валидация DOM данных
        if (!(scroller && container && bar)) {
            console.error('acbar: no scroller, container or bar dectected');
            return;
        }
        if (gData.scroller.length > 1) {
            console.error('acbar: more than 1 scroller detected');
            return;
        }

        // Проверка на вторую инициализацию того же скролла
        if (func('inited', scroller)) {
            console.error('acbar: scroller already initialized');
            return;
        }

        // Инициализация
        // Выставляем 100% ширину контента от враппера (скрываем нативный скроллбар) ДО прочей инициализации
        var init = function(barOn){
            func('init', {
                scroller: scroller,
                scrollerWidth: scroller.parentNode.clientWidth + scroller.offsetWidth - scroller.clientWidth + 'px',
                bar: bar,
                barHeight: scroller.clientHeight * scroller.clientHeight / container.offsetHeight + 'px',
                switchScrollbarOn: barOn
            });
        };
        init(scroller.clientHeight < container.offsetHeight);

        // Расчет максимально возможной высоты вьюпорта одной секции с учётом всех заголовков
        // Должно происходить ПОСЛЕ установки ширины скроллера, иначе будут неправильные высоты
        viewPortHeight = scroller.clientHeight;
        headerTops = [];
        if (headers) {
            for (var i = 0 ; i < headers.length ; i++) {
                viewPortHeight -= headers[i].offsetHeight;
                headerTops[i] = headers[i].parentNode.offsetTop;
            }
        }
        topHeights = [];
        bottomHeights = [];

        // Проверяем вьюпорт на перекрываемость заголовками
        if (viewPortHeight <= 0) {
            headers = undefined;
        }

        

        // Событие на скролл
        func('EventsToUpdateScrollbar', scroller, updateScrollBar);

        // Событие на ресайз
        func('onResize', window, function() {
            // Если новый ресайз произошёл быстро - отменяем предыдущий таймаут
            clearTimeout(rTimer);
            // И навешиваем новый
            rTimer = setTimeout(function() {
                if (container.offsetHeight > scroller.clientHeight) {
                    //initScrollBar(true);
                    init(true);
                    updateScrollBar();
                } else {
                    init(false);
                    /*func('init', {
                        scroller: scroller,
                        scrollerWidth: '',
                        bar: bar,
                        barHeight: '',
                        switchScrollbarOn: ''
                    });*/
                }
            }, 200);
        });

        updateScrollBar();

        // Инкапсуляция user-defined нод
        function node(name) {
            if (gData[name]) {
                var node = gData[name][0] || gData[name];
                if (node.nodeType === 1) {
                    return node;
                }
            }
        };

        // Инкапсуляция user-defined функций. Первый аргумент - имя, остальные - параметры функции
        function func() {
            var fname = [].shift.apply(arguments);
            if (typeof gData[fname] === 'function') {
                return gData[fname].apply(this, arguments);
            }
        }

        // Обновление всех координат и состояний скролла в доме
        // Особенность в том, что обновляются все данные, что важно при изменении контента контейнера
        function updateScrollBar() {
            var containerTop, // Виртуальная высота верхней границы контейнера над верхней границей скроллера (всегда положительная)
                barTopLimit = 0, // Крайнее верхнее пложение бара от верха скроллера
                barBottomLimit = 0, // Расстояние от крайне нижнего положения бара до низа скроллера
                relativeContainerTop, // Относительное положение контейнера, от 0 до 1
                barTop, // Позиция top для бара, с учётом пределов и высоты самого бара
                oldBarHeight, newBarHeight; 


            containerTop = topPos(scroller);
            barTopLimit = (headers && headers[0]) ? headers[0].offsetHeight : 0;
            relativeContainerTop = - containerTop / (container.offsetHeight - scroller.clientHeight);
            barTop = relativeContainerTop * (scroller.clientHeight - bar.offsetHeight - barTopLimit - barBottomLimit) + barTopLimit;
            newBarHeight = scroller.clientHeight * scroller.clientHeight / container.offsetHeight;

            // Позиционирование бара
            if (bar) {
                if (oldBarHeight !== newBarHeight) {
                    func('posBar', bar, barTop, newBarHeight);
                    oldBarHeight = newBarHeight;
                } else {
                    func('posBar', bar, barTop);
                }
            }

            // Позиционирование хидеров
            if (headers && headers.length) {
                for (var i = 0 ; i < headers.length ; i++) {
                    if (headerTops[i] + containerTop <= getTopHeadersSumHeight(i)) {
                        // Хидер пытается проскочить вверх
                        func('fixHeader', headers[i], getTopHeadersSumHeight(i));
                    } else if (headerTops[i] + containerTop >= scroller.clientHeight - getBottomHeadersSumHeight(i) - headers[i].offsetHeight) {
                        // Хидер пытается проскочить вниз
                        func('fixHeader', headers[i], scroller.clientHeight - getBottomHeadersSumHeight(i) - headers[i].offsetHeight);
                    } else {
                        // Хидер во вьюпорте, позиционировать не нужно
                        func('unfixHeader', headers[i]);
                    }
                }
            }

            // Ленивая сумма высот всех заголовков выше i-го
            function getTopHeadersSumHeight(i) {
                if (topHeights[i] === undefined) {
                    topHeights[i] = 0;
                    for (var j = 0 ; j < i ; j++) {
                        topHeights[i] += headers[j].offsetHeight;
                    }
                }
                
                return topHeights[i];
            }

            // Ленивая сумма высот всех заголовков ниже i-го
            function getBottomHeadersSumHeight(i) {
                if (bottomHeights[i] === undefined) {
                    bottomHeights[i] = 0;
                    for (var j = i + 1 ; j < headers.length ; j++) {
                        bottomHeights[i] += headers[j].offsetHeight;
                    }
                }

                return bottomHeights[i];
            }

            // Возвращает эквивалент свойства "top" для скроллируемого объекта, который находится внутри node
            function topPos(node) {
                return -(node.pageYOffset || node.scrollTop);
            }
        }
    }

    window.baron = baron;
})(window);