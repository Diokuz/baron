/* Pull to load plugin for baron 0.6+ */
(function(window, undefined) {
    var pull = function(params) {
        var prefix = params.prefix,
            block = this.$(params.block),
            size = params.size || this.origin.size,
            limit = params.limit || 80,
            callback = params.callback,
            elements = params.elements || [],
            self = this,
            _insistence = 0,
            _zeroXCount = 0,
            _interval,
            _x = 0,
            _t1 = 0,
            _on;

        function getHeight() {
            return self.scroller[self.origin.scroll] + self.scroller[self.origin.offset];
        }

        function getScrollHeight() {
            return self.scroller[self.origin.scrollSize];
        }

        function step(x, force) {
            var k = x * .0005;

            //if (!force) k = k * 1.2;

            return Math.floor(force - k * (x + 550));
        }

        function toggle(on) {
            _on = on;

            if (on) {
                update(); // First time with no delay
                _interval = setInterval(update, 200);
            } else {
                clearInterval(_interval);
            }
        }

        function update() {
            var pos = {},
                height = getHeight(),
                scrollHeight = getScrollHeight(),
                dx,
                op4,
                t2 = new Date().getTime();

            op4 = 0; // Возвращающая сила
            if (_insistence > 0) {
                op4 = 40;
            }
            if (_insistence) {
                dx = step(_x, op4);
                if (height >= scrollHeight - dx - 100) {
                    _x += dx;
                } else {
                    _x = 0;
                }

                if (_x < 0) _x = 0;

                pos[size] = _x + 'px';
                self.$(block).css(pos);

                for (var i = 0 ; i < elements.length ; i++) {
                    self.$(elements[i].self).css(elements[i].property, Math.min(_x / limit * 100, 100) + '%');
                }

                _insistence = -1;
            }

            if (_x == 0) {
                _zeroXCount++;
            } else {
                _zeroXCount = 0;
            }
            if (_zeroXCount > 5) {
                toggle(false);
            }

            if (callback && _x > limit) {
                callback();
            }
        }

        this.on('init', function() {
            toggle(true);
        });

        this.on('dispose', function() {
            toggle(false);
        });

        this.event(this.scroller, 'mousewheel DOMMouseScroll', function() {
            _insistence = 1;
            if (!_on && getHeight() >= getScrollHeight()) {
                toggle(true);
            }
        });
    };

    baron.fn.pull = function(params) {
        var i = 0;

        while (this[i]) {
            pull.call(this[i], params);
            i++;
        }

        return this;
    };
})(window);