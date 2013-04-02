            }

            // var initialization
            scroller = gData.scroller;
            this.invalidateBar = invalidateBar;
            this.viewport = viewport;
            this.updateScrollBar = updateScrollBar;

            // DOM initialization
            if (gData.bar) {
                bar = selector(gData.bar, scroller)[0];
            } else {
                bar = selector('*', scroller);
                bar = bar[bar.length - 1];
            }
            track = selector(gData.track, scroller)[0];
            track = track || bar.parentNode;
            if (!(scroller && bar)) {
                // console.error('acbar: no scroller or bar dectected');
                return;
            }

            // Prevent second initialization
            scroller.setAttribute('data-baron', 'inited');

            // Choosing scroll direction
            dir = direction.vertical;
            if (gData.h) {
                dir = direction.horizontal;
            }

            // Capturing radius for headers when fixing
            fixRadius = gData.fixRadius || 0;

            // CSS classname for fixed headers
            hFixCls = gData.hFixCls;

            // Events initialization
            // onScroll
            event(scroller, 'scroll', updateScrollBar);

            // Bar drag
            event(bar, 'mousedown', function(e) {
                e.preventDefault(); // Text selection disabling in Opera... and all other browsers?
                selection(); // Disable text selection in ie8
                drag = 1; // Save private byte
            });

            // Cancelling drag when mouse key goes up and when window loose its focus
            event(document, 'mouseup blur', function() {
                selection(1); // Enable text selection
                drag = 0;
            });

            // Starting drag when mouse key (LM) goes down at bar
            event(document, 'mousedown', function(e) { // document, not window, for ie8
                if (e.button != 2) { // Not RM
                    scrollerY0 = e.clientY - barPos;
                }
            });

            event(document, 'mousemove', function(e) { // document, not window, for ie8
                if (drag) {
                    scroller.scrollTop = posToRel(e.clientY - scrollerY0) * (scroller[dir.scrollSize] - scroller[dir.client]);
                }
            });

            event(window, 'resize', resize);
            event(scroller, 'sizeChange', resize); // Custon event for alternate baron update mechanism

            // Reinit when resize
            function resize() {
                // Если новый ресайз произошёл быстро - отменяем предыдущий таймаут
                clearTimeout(rTimer);
                // И навешиваем новый
                rTimer = setTimeout(function() {
                    viewport();
                    updateScrollBar();
                    invalidateBar();
                }, 200);
            };

            return this;
        };

        // Update method for one scroll group
        baron.init.prototype.update = function() {
            this.viewport(1);
            this.updateScrollBar();
            this.invalidateBar();
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

    // Adding baron to jQuery as plugin
    if ($ && $.fn) {
        $.fn.baron = baron;
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = baron;
    } else {
        window.baron = baron; // Use noConflict method if you need window.baron var for another purposes
    }
})(window);