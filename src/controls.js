/* Controls plugin for baron 0.6+ */
(function(window, undefined) {
    var controls = function(params) {
        var forward, backward, track, screen,
            self = this; // AAAAAA!!!!!11

        screen = params.screen || 0.9;

        if (params.forward) {
            forward = this.$(params.forward, this.clipper);

            this.event(forward, 'click', function() {
                var y = self.pos() - params.delta || 30;
                
                self.pos(y);
            });
        }

        if (params.backward) {
            backward = this.$(params.backward, this.clipper);

            this.event(backward, 'click', function() {
                var y = self.pos() + params.delta || 30;

                self.pos(y);
            });
        }

        if (params.track) {
            if (params.track === true) {
                track = this.track;
            } else {
                track = this.$(params.track, this.clipper)[0];
            }

            if (track) {
                this.event(track, 'mousedown', function(e) {
                    var x = e['offset' + self.origin.x],
                        xBar = self.bar[self.origin.offsetPos],
                        sign = 0;

                    if (x < xBar) {
                        sign = -1;
                    } else if (x > xBar + self.bar[self.origin.offset]) {
                        sign = 1;
                    }

                    var y = self.pos() + sign * screen * self.scroller[self.origin.client];
                    self.pos(y);
                });
            }
        }

    };

    baron.fn.controls = function(params) {
        var i = 0;

        while (this[i]) {
            controls.call(this[i], params);
            i++;
        }

        return this;
    };
})(window);