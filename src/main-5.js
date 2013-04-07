            }

            // var initialization
            scroller = gData.scroller;
            this._barOn = barOn;
            this._uView = uView;
            this._uBar = uBar;

            // DOM initialization
            if (gData.bar) {
                bar = selector(gData.bar, scroller)[0];
            } else {
                bar = selector('*', scroller);
                bar = bar[bar.length - 1];
            }
            if (!bar) {
                err(11);
            }
            track = selector(gData.track, scroller)[0];
            track = track || bar.parentNode;

            // Prevent second initialization
            scroller.setAttribute('data-baron', 'inited');

            // Choosing scroll direction
            dir = direction[!!gData.h + '']; // 'true' - horizontal, 'false' - vertical

            fixRadius = gData.fixRadius || 0; // Capturing radius for headers when fixing

            hFixCls = gData.hFixCls; // CSS classname for fixed headers

            // Events initialization
            event(scroller, 'scroll', uBar);

            event(bar, 'mousedown', function(e) { // Bar drag
                e.preventDefault(); // Text selection disabling in Opera... and all other browsers?
                selection(); // Disable text selection in ie8
                drag = 1; // Save private byte
            });

            event(document, 'mouseup blur', function() { // Cancelling drag when mouse key goes up and when window loose its focus
                selection(1); // Enable text selection
                drag = 0;
            });

            // Starting drag when mouse key (LM) goes down at bar
            event(document, 'mousedown', function(e) { // document, not window, for ie8
                if (e.button != 2) { // Not RM
                    scrollerPos0 = e.clientY - barPos;
                }
            });

            event(document, 'mousemove', function(e) { // document, not window, for ie8
                if (drag) {
                    scroller.scrollTop = posToRel(e.clientY - scrollerPos0) * (scroller[dir.scrollSize] - scroller[dir.client]);
                }
            });

            event(window, 'resize', resize);
            event(scroller, 'sizeChange', resize); // Custon event for alternate baron update mechanism

            event(bar, 'mousewheel', bubbleWheel);
            if (track != scroller) {
                event(track, 'mousewheel', bubbleWheel);
            }

            // Reinit when resize
            function resize() {
                // Если новый ресайз произошёл быстро - отменяем предыдущий таймаут
                clearTimeout(rTimer);
                // И навешиваем новый
                rTimer = setTimeout(function() {
                    uView();
                    uBar();
                    barOn();
                }, 200);
            };

            return this;
        };

        // Update method for one scroll group
        baron.init.prototype.update = function() {
            this._uView(1);
            this._uBar();
            this._barOn();
        };

        // Initializing scroll group, or updating it if already
        for (var i = 0 ; i < scroller.length ; i++) {
            if (!scroller[i].getAttribute('data-baron')) {
                data.scroller = scroller[i];
                this[i] = new baron.init(data);
            } else {
                event(scroller[i], 'sizeChange', undefined, 'trigger');
            }
        }

        return this;
    };

    // Updating all known baron scroll groups on page
    constructor.prototype.u = function() {
        var i = -1;

        while (this[++i]) {
            this[i].update();
        }
    };
})(window);