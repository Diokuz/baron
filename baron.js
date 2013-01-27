!function(undefined) {
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
            rTimer,
            querySelector,
            eventManager,
            DOMUtility,
            scroller,
            container,
            bar,
            barTop, // Позиция top для бара, с учётом пределов и высоты самого бара
            headerFixedClass,
            hFixFlag = [],
            drag,
            scrollerY0,
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
        // function setScrollerWidth(width) {
        //     DOMUtility(scroller).css('width', width + 'px');
        // }

        // Прилипить хидер
        function fixHeader(i, top, fix) {
            hFixFlag[i] = fix;
            DOMUtility(headers[i]).css('top', top + 'px').addClass(headerFixedClass);
        }

        // Убрать прилипание хидера
        function unfixHeader(i) {
            hFixFlag[i] = 0;
            DOMUtility(headers[i]).css('top', '').removeClass(headerFixedClass);
        }

        // Коэффициент отношения позиции бара к относительной позиции контейнера
        function k() {
            return scroller.clientHeight - bar.offsetHeight - gData.barTop || 0 - gData.barBottom || 0;
        }

        // Преобразование относительной позиции контейнера в позицию бара
        function relToTop(r) {
            return r * k() + (gData.barTop || 0);
        }

        // Преобразование позиции бара в относительную позицию контейнера
        function topToRel(t) {
            return (t - (gData.barTop || 0)) / k();
        }

        // Функция для биндинга на событие selectstart
        function dontStartSelect() {
            return false;
        }

        // Блокировка выделения текста при драге
        function selection(on) {
            // document.unselectable = on ? 'off' : 'on';
            eventManager(document, "selectstart", dontStartSelect, on ? 'off' : '' );
            // DOMUtility(document.body).css('MozUserSelect', on ? '' : 'none' );
        }

        // Engines initialization
        var $ = window.jQuery;
        querySelector = gData.querySelector || $;
        if (!querySelector) {
            // console.error('baron: no query selector engine found');
            return;
        }
        eventManager = gData.eventManager || function(elem, event, func, off) {
            $(elem)[off||'on'](event, func);
        };
        if (!gData.eventManager && !$) {
            return;
        }
        DOMUtility = gData.DOMUtility || $;
        if (!DOMUtility) {
            // console.error('baron: no DOM utility engine founc');
            return;
        }

        // DOM initialization
        scroller = querySelector(gData.scroller, root)[0];
        container = querySelector(gData.container, scroller)[0];
        bar = querySelector(gData.bar, scroller)[0];
        headers = querySelector(gData.header, container);

        // DOM данных
        if (!(scroller && container && bar)) {
            // console.error('acbar: no scroller, container or bar dectected');
            return;
        }

        // Инициализация
        // Выставляем 100% ширину контента от враппера (скрываем нативный скроллбар) ДО прочей инициализации
        barOn(scroller.clientHeight < container.offsetHeight);
        DOMUtility(scroller).css('width', scroller.parentNode.clientWidth + scroller.offsetWidth - scroller.clientWidth + 'px');
        // setScrollerWidth(scroller.parentNode.clientWidth + scroller.offsetWidth - scroller.clientWidth);

        // Расчет максимально возможной высоты вьюпорта одной секции с учётом всех заголовков
        // Должно происходить ПОСЛЕ установки ширины скроллера, иначе будут неправильные высоты
        viewPortHeight = scroller.clientHeight;
        headerTops = [];
        if (headers) {
            for (i = 0 ; i < headers.length ; i++) {
                viewPortHeight -= headers[i].offsetHeight;
                headerTops[i] = headers[i].offsetTop; // No paddings for parentNode
            }
        }
        topHeights = [];
        headerFixedClass = gData.headerFixedClass;

        // Проверяем вьюпорт на перекрываемость заголовками
        if (viewPortHeight <= 0) {
            headers = 0; // undefined takes +1 byte :)
        }

        // Events initialization
        // onScroll
        eventManager(scroller, 'scroll', updateScrollBar);

        // Resize
        eventManager(window, 'resize', function() {
            // Если новый ресайз произошёл быстро - отменяем предыдущий таймаут
            clearTimeout(rTimer);
            // И навешиваем новый
            rTimer = setTimeout(function() {
                barOn(container.offsetHeight > scroller.clientHeight);
                updateScrollBar();
            }, 200);
        });

        // Drag
        eventManager(bar, 'mousedown', function(e) {
            e.preventDefault(); // Text selection disabling in Opera... and all other browsers?
            selection(); // Disable text selection in ie8
            drag = 1; // Another one byte
        });
        eventManager(document, 'mouseup blur', function() {
            selection(1); // Enable text selection
            drag = 0;
        });
        eventManager(document, 'mousedown', function(e) { // document for ie8
            //if (drag) {
                scrollerY0 = e.clientY - barTop;
                // barTop0 = barTop;
            //}
        });
        eventManager(document, 'mousemove', function(e) { // document for ie8
            if (drag) {
                scroller.scrollTop = topToRel(e.clientY - scrollerY0) * (container.offsetHeight - scroller.clientHeight);
            }
        });

        // First update to initialize bar look
        updateScrollBar();

        // Обновление всех координат и состояний скролла в доме
        // Особенность в том, что обновляются все данные, что важно при изменении контента контейнера
        function updateScrollBar() {
            var containerTop, // Виртуальная высота верхней границы контейнера над верхней границей скроллера (всегда положительная)
                oldBarHeight, newBarHeight,
                hTop; 

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
            var fix;
            if (headers) {
                for (i = 0 ; i < headers.length ; i++) {
                    if (headerTops[i] + containerTop < getTopHeadersSumHeight(i)) {
                        // Хидер пытается проскочить вверх
                        // fixHeader(i, getTopHeadersSumHeight(i));
                        if (hFixFlag[i] == 2) {
                            fix = 1;
                            hFixFlag[i] = 0;
                        }
                        hTop = getTopHeadersSumHeight(i);
                    } else if (headerTops[i] + containerTop > getTopHeadersSumHeight(i) + viewPortHeight) {
                        // Хидер пытается проскочить вниз
                        // fixHeader(i, scroller.clientHeight - getBottomHeadersSumHeight(i) - headers[i].offsetHeight);
                        if (hFixFlag[i] == 1){
                            fix = 2;
                            hFixFlag[i] = 0;
                        }
                        hTop = getTopHeadersSumHeight(i) + viewPortHeight;
                    } else {
                        // Хидер во вьюпорте, позиционировать не нужно
                        // unfixHeader(i);
                        hTop = undefined;
                    }
                    if (hTop === undefined) {
                        unfixHeader(i);
                    } else if (!hFixFlag[i]) {
                        fixHeader(i, hTop, fix);
                    }
                }
            }

            // Ленивая сумма высот всех заголовков выше i-го
            function getTopHeadersSumHeight(i) {
                if (!topHeights[i]) {
                    topHeights[i] = 0;
                    for (j = 0 ; j < i ; j++) {
                        topHeights[i] += headers[j].offsetHeight;
                    }
                }
                
                return topHeights[i];
            }
        }
    }

    window.baron = baron;
}()