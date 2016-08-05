/* Pull to load plugin for baron 0.6+ */
;(function(scopedWindow) {
    var scopedBaron

    if (typeof module != 'undefined') {
        scopedBaron = require('./core')
    } else {
        scopedBaron = scopedWindow.baron
    }

    var pull = function(params) {
        var block = this.$(params.block),
            size = params.size || this.origin.size,
            limit = params.limit || 80,
            onExpand = params.onExpand,
            elements = params.elements || [],
            inProgress = params.inProgress || '',
            self = this,
            _insistence = 0,
            _zeroXCount = 0,
            _interval,
            _timer,
            _x = 0,
            _onExpandCalled,
            _waiting = params.waiting || 500,
            _on

        function getSize() {
            return self.scroller[self.origin.scroll] + self.scroller[self.origin.offset]
        }

        // Scroller content height
        function getContentSize() {
            return self.scroller[self.origin.scrollSize]
        }

        // Scroller height
        function getScrollerSize() {
            return self.scroller[self.origin.client]
        }

        function step(x, force) {
            var k = x * 0.0005

            return Math.floor(force - k * (x + 550))
        }

        function toggle(on) {
            _on = on

            if (on) {
                update() // First time with no delay
                _interval = setInterval(update, 200)
            } else {
                clearInterval(_interval)
            }
        }

        function update() {
            var pos = {},
                height = getSize(),
                scrollHeight = getContentSize(),
                dx,
                op4,
                scrollInProgress = _insistence == 1

            op4 = 0 // Возвращающая сила
            if (_insistence > 0) {
                op4 = 40
            }
            // if (_insistence > -1) {
            dx = step(_x, op4)
            if (height >= scrollHeight - _x && _insistence > -1) {
                if (scrollInProgress) {
                    _x += dx
                }
            } else {
                _x = 0
            }

            if (_x < 0) _x = 0

            pos[size] = _x + 'px'
            if (getScrollerSize() <= getContentSize()) {
                self.$(block).css(pos)
                for (var i = 0; i < elements.length; i++) {
                    self.$(elements[i].self).css(elements[i].property, Math.min(_x / limit * 100, 100) + '%')
                }
            }

            if (inProgress && _x) {
                self.$(self.root).addClass(inProgress)
            }

            if (_x == 0) {
                if (params.onCollapse) {
                    params.onCollapse()
                }
            }

            _insistence = 0
            _timer = setTimeout(function() {
                _insistence = -1
            }, _waiting)
            // }

            if (onExpand && _x > limit && !_onExpandCalled) {
                onExpand()
                _onExpandCalled = true
            }

            if (_x == 0) {
                _zeroXCount++
            } else {
                _zeroXCount = 0
            }
            if (_zeroXCount > 1) {
                toggle(false)
                _onExpandCalled = false
                if (inProgress) {
                    self.$(self.root).removeClass(inProgress)
                }
            }
        }

        this.on('init', function() {
            toggle(true)
        })

        this.on('dispose', function() {
            toggle(false)
        })

        this.event(this.scroller, 'mousewheel DOMMouseScroll', function(e) {
            var down = e.wheelDelta < 0 || (e.originalEvent && e.originalEvent.wheelDelta < 0) || e.detail > 0

            if (down) {
                _insistence = 1
                clearTimeout(_timer)
                if (!_on && getSize() >= getContentSize()) {
                    toggle(true)
                }
            }
            //  else {
            //     toggle(false)
            // }
        })
    }

    scopedBaron.fn.pull = function(params) {
        var i = 0

        while (this[i]) {
            pull.call(this[i], params)
            i++
        }

        return this
    }
}(this))
