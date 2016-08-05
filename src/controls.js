/* Controls plugin for baron 0.6+ */
;(function(scopedWindow) {
    var scopedBaron

    if (typeof module != 'undefined') {
        scopedBaron = require('./core')
    } else {
        scopedBaron = scopedWindow.baron
    }

    var controls = function(params) {
        var forward, backward, track, screen,
            self = this, // AAAAAA!!!!!11
            event

        screen = params.screen || 0.9

        if (params.forward) {
            forward = this.$(params.forward, this.clipper)

            event = {
                element: forward,

                handler: function() {
                    var y = self.pos() + (params.delta || 30)

                    self.pos(y)
                },

                type: 'click'
            }

            this._eventHandlers.push(event) // For auto-dispose
            this.event(event.element, event.type, event.handler, 'on')
        }

        if (params.backward) {
            backward = this.$(params.backward, this.clipper)

            event = {
                element: backward,

                handler: function() {
                    var y = self.pos() - (params.delta || 30)

                    self.pos(y)
                },

                type: 'click'
            }

            this._eventHandlers.push(event) // For auto-dispose
            this.event(event.element, event.type, event.handler, 'on')
        }

        if (params.track) {
            if (params.track === true) {
                track = this.track
            } else {
                track = this.$(params.track, this.clipper)[0]
            }

            if (track) {
                event = {
                    element: track,

                    handler: function(e) {
                        // https://github.com/Diokuz/baron/issues/121
                        if (e.target != track) return

                        var x = e['offset' + self.origin.x],
                            xBar = self.bar[self.origin.offsetPos],
                            sign = 0

                        if (x < xBar) {
                            sign = -1
                        } else if (x > xBar + self.bar[self.origin.offset]) {
                            sign = 1
                        }

                        var y = self.pos() + sign * screen * self.scroller[self.origin.client]

                        self.pos(y)
                    },

                    type: 'mousedown'
                }

                this._eventHandlers.push(event) // For auto-dispose
                this.event(event.element, event.type, event.handler, 'on')
            }
        }
    }

    scopedBaron.fn.controls = function(params) {
        var i = 0

        while (this[i]) {
            controls.call(this[i], params)
            i++
        }

        return this
    }
}(this))
