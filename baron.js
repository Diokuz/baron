(function(window, undefined) {
    "use strict";

    var baron = function(root, data) {
        if (!root[0]) {
            root = [root];
        }
        for (var i = 0 ; i < root.length ; i++) {
            new baron.init(root[i], data);
        }
    };

    // gData - user defined data, not changed during baron work
    baron.init = function(root, gData) {
        var headers,
            viewPortHeight, // Максимально возможная высота видимости одной секции контента
            headerTops, // Начальные позиции хидеров
            topHeights,
            bottomHeights,
            rTimer,
            querySelector,
            eventManager,
            DOMUtility,
            scroller,
            container,
            bar,
            barTop, // Позиция top для бара, с учётом пределов и высоты самого бара
            headerFixedClass,
            drag,
            i, j;

        // Ставит активирующий видимость бара класс, если on == true, и снимает его иначе
        function barOn(on) {
            if (on) {
                DOMUtility(bar).addClass(gData.barOnClass);
            } else {
                DOMUtility(bar).removeClass(gData.barOnClass);
            }
        }

        function posBar(top, height) {
            var barMinHeight = gData.barMinHeight || 20;

            DOMUtility(bar).css('top', top + 'px');
            if (height !== undefined) {
                if (height > 0 && height < barMinHeight) {
                    height = barMinHeight;
                }
                DOMUtility(bar).css('height', height + 'px');
            }
        }

        // Set scroller width, fires once on initialization and on each window resize
        function setScrollerWidth(width) {
            DOMUtility(scroller).css('width', width + 'px');
        }

        // Прилипить хидер
        function fixHeader(header, top) {
            DOMUtility(header).css('top', top + 'px').addClass(headerFixedClass);
        }

        // Убрать прилипание хидера
        function unfixHeader(header) {
            DOMUtility(header).removeClass(headerFixedClass).css('top', '');
        }

        // Коэффициент отношения позиции бара к относительной позиции контейнера
        function k() {
            return scroller.clientHeight - bar.offsetHeight - ((gData.barTop + gData.barBottom) || 0);
        }

        // Преобразование относительной позиции контейнера в позицию бара
        function relToTop(r) {
            return r * k() + (gData.barTop || 0);
        }

        // Преобразование позиции бара в относительную позицию контейнера
        function topToRel(t) {
            return (t - (gData.barTop || 0)) / k();
        }

        // Engines initialization
        var $ = window.jQuery;
        querySelector = gData.querySelector || $;
        if (!querySelector) {
            console.error('baron: no query selector engine found');
            return;
        }
        if (gData.eventManager) {
            eventManager = gData.eventManager;
        } else {
            if ($) {
                eventManager = function (elem, event, func) {
                    $(elem).on(event, func);
                }
            } else {
                console.error('baron: no event manager engine found');
                return;
            }
        }
        DOMUtility = gData.DOMUtility || $;
        if (!DOMUtility) {
            console.error('baron: no DOM utility engine founc');
            return;
        }

        // DOM initialization
        scroller = querySelector(gData.scroller, root)[0];
        container = querySelector(gData.container, scroller)[0];
        bar = querySelector(gData.bar, scroller)[0];
        headers = querySelector(gData.header, container);

        // DOM данных
        if (!(scroller && container && bar)) {
            console.error('acbar: no scroller, container or bar dectected');
            return;
        }

        // Инициализация
        // Выставляем 100% ширину контента от враппера (скрываем нативный скроллбар) ДО прочей инициализации
        barOn(scroller.clientHeight < container.offsetHeight);
        setScrollerWidth(scroller.parentNode.clientWidth + scroller.offsetWidth - scroller.clientWidth);

        // Расчет максимально возможной высоты вьюпорта одной секции с учётом всех заголовков
        // Должно происходить ПОСЛЕ установки ширины скроллера, иначе будут неправильные высоты
        viewPortHeight = scroller.clientHeight;
        headerTops = [];
        if (headers) {
            for (i = 0 ; i < headers.length ; i++) {
                viewPortHeight -= headers[i].offsetHeight;
                headerTops[i] = headers[i].parentNode.offsetTop;
            }
        }
        topHeights = [];
        bottomHeights = [];
        headerFixedClass = gData.headerFixedClass;

        // Проверяем вьюпорт на перекрываемость заголовками
        if (viewPortHeight <= 0) {
            headers = undefined;
        }

        // Events initialization
        // onScroll Event
        eventManager(scroller, 'scroll', updateScrollBar);
        // Resize event
        eventManager(window, 'resize', function() {
            // Если новый ресайз произошёл быстро - отменяем предыдущий таймаут
            clearTimeout(rTimer);
            // И навешиваем новый
            rTimer = setTimeout(function() {
                barOn(container.offsetHeight > scroller.clientHeight);
                updateScrollBar();
            }, 200);
        });
        // Drag event group
        var y = 0,
            wrapperY0,
            barTop0;
        eventManager(bar, 'mousedown', function(e) {
            drag = true;
            y = e.clientY;
        });
        eventManager(root, 'mouseup', function() {
            drag = false;
        });
        scroller.parentNode.addEventListener('mousedown', function(e) {
            if (drag) {
                wrapperY0 = e.clientY;
                barTop0 = barTop;
            }
        });
        scroller.parentNode.addEventListener('mousemove', function(e) {
            if (drag) {
                //scroller.scrollTop = topToRel(e.clientY - y + 33)
                scroller.scrollTop = topToRel(e.clientY - wrapperY0 + barTop0) * (container.offsetHeight - scroller.clientHeight);
            }
            
        });

        // Первичное обновление вида после инициализации
        updateScrollBar();

        // Обновление всех координат и состояний скролла в доме
        // Особенность в том, что обновляются все данные, что важно при изменении контента контейнера
        function updateScrollBar() {
            var containerTop, // Виртуальная высота верхней границы контейнера над верхней границей скроллера (всегда положительная)
                oldBarHeight, newBarHeight; 

            containerTop = -(scroller.pageYOffset || scroller.scrollTop);
            barTop = relToTop(- containerTop / (container.offsetHeight - scroller.clientHeight));
            newBarHeight = scroller.clientHeight * scroller.clientHeight / container.offsetHeight;

            // Если скроллбар не нужен делаем его высоту нулевой
            if (scroller.clientHeight >= container.offsetHeight) {
                newBarHeight = 0;
            }

            // Позиционирование бара
            if (oldBarHeight !== newBarHeight) {
                posBar(barTop, newBarHeight);
                oldBarHeight = newBarHeight;
            } else {
                posBar(barTop);
            }

            // Позиционирование хидеров
            if (headers) {
                for (i = 0 ; i < headers.length ; i++) {
                    if (headerTops[i] + containerTop <= getTopHeadersSumHeight(i)) {
                        // Хидер пытается проскочить вверх
                        fixHeader(headers[i], getTopHeadersSumHeight(i));
                    } else if (headerTops[i] + containerTop >= scroller.clientHeight - getBottomHeadersSumHeight(i) - headers[i].offsetHeight) {
                        // Хидер пытается проскочить вниз
                        fixHeader(headers[i], scroller.clientHeight - getBottomHeadersSumHeight(i) - headers[i].offsetHeight);
                    } else {
                        // Хидер во вьюпорте, позиционировать не нужно
                        unfixHeader(headers[i]);
                    }
                }
            }

            // Ленивая сумма высот всех заголовков выше i-го
            function getTopHeadersSumHeight(i) {
                if (topHeights[i] === undefined) {
                    topHeights[i] = 0;
                    for (j = 0 ; j < i ; j++) {
                        topHeights[i] += headers[j].offsetHeight;
                    }
                }
                
                return topHeights[i];
            }

            // Ленивая сумма высот всех заголовков ниже i-го
            function getBottomHeadersSumHeight(i) {
                if (bottomHeights[i] === undefined) {
                    bottomHeights[i] = 0;
                    for (j = i + 1 ; j < headers.length ; j++) {
                        bottomHeights[i] += headers[j].offsetHeight;
                    }
                }

                return bottomHeights[i];
            }
        }
    }

    window.baron = baron;
})(window);