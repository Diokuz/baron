/* https://github.com/Diokuz/baron */
(function(window, undefined) {
    'use strict';

    var scrolls = [],
        stored = window.baron, // Stored baron vaule for noConflict usage
        $ = window.jQuery, // Trying to use jQuery
        direction = {
            v: { // Vertical
                x: 'Y',
                pos: 'top',
                crossPos: 'left',
                size: 'height',
                crossSize: 'width',
                client: 'clientHeight',
                crossClient: 'clientWidth',
                offset: 'offsetHeight',
                crossOffset: 'offsetWidth',
                offsetPos: 'offsetTop',
                scroll: 'scrollTop',
                scrollSize: 'scrollHeight'
            },

            h: { // Horizontal
                x: 'X',
                pos: 'left',
                crossPos: 'top',
                size: 'width',
                crossSize: 'height',
                client: 'clientWidth',
                crossClient: 'clientHeight',
                offset: 'offsetWidth',
                crossOffset: 'offsetHeight',
                offsetPos: 'offsetLeft',
                scroll: 'scrollLeft',
                scrollSize: 'scrollWidth'
            }
        },
        err;

    if (!window) return; // Server side

    function baron(params) {
        var scrollGroup,
            event,
            selector,
            dom,
            scroller;

        err = function(message) {
            errGlobal(message, params);
        }

        params = params || {};

        // Engines initialization
        selector = params.selector || $;
        if (!selector) {
            err(1);
        }

        event = params.event || function(elem, event, func, mode) {
            $(elem)[mode || 'on'](event, func);
        };
        if (!params.event && !$) {
            err(2);
        }

        dom = params.dom || $;
        if (!dom) {
            err(3);
        }

        scroller = selector(params.scroller || this);

        if (!scroller[0]) {
            scroller = [scroller];
        }

        if (!scroller[0].nodeType) {
            err(10);
        }

        // Main constructor returning baron collection object with u() method in proto
        function constructor(data) {
            

            // gData - user defined data, not changed during baron work
            baron.init = function(gData) {
                var headers,
                    viewPortSize, // Non-headers viewable content summary height
                    headerTops, // Initial top positions of headers
                    topHeights,
                    rTimer,
                    bar,
                    track, // Bar parent
                    barPos, // bar position
                    hFixCls, // CSS to be added on fixed headers
                    hFixFlag = [], // State of current header (top-fix, free, bottom-fix), change of state leads to dom manipulation
                    dir,
                    scroller,
                    drag,
                    scrollerPos0,
                    pos,
                    fixRadius,
                    barTopLimit = 0,
                    i, j;
                
                

                
                

                // var initialization
                this.scroller = gData.scroller;
                this._barOn = barOn;
                this._uView = uView;
                this._uBar = uBar;

                // DOM initialization
                if (gData.bar && gData.bar[0].nodeType) {
                    this.bar = gData.bar[0];
                }
                if (!bar) {
                    if (gData.bar) {
                        bar = selector(gData.bar, scroller)[0];
                    }
                    //  else {
                    //     bar = selector('*', scroller);
                    //     bar = bar[bar.length - 1];
                    // }
                }

                if (this.bar) {
                    this.track = this.selector(gData.track, this.scroller)[0];
                    this.track = this.track || this.bar.parentNode;
                } else {
                    this.track = this.scroller;
                }

                // Prevent second initialization
                this.scroller.setAttribute('data-baron', 'inited');

                // Choosing scroll direction
                this.dir = data.dir;

                this.fixRadius = gData.fixRadius || 0; // Capturing radius for headers when fixing

                this.hFixCls = gData.hFixCls; // CSS classname for fixed headers

                // Events initialization
                event(this.scroller, 'scroll', this.uBar);

                if (this.bar) {
                    event(this.bar, 'touchstart mousedown', function(e) { // Bar drag
                        e.preventDefault(); // Text selection disabling in Opera... and all other browsers?
                        this.selection(); // Disable text selection in ie8
                        drag = 1; // Save private byte
                    });
                }

                event(document, 'mouseup blur touchend', function() { // Cancelling drag when mouse key goes up and when window loose its focus
                    this.selection(1); // Enable text selection
                    drag = 0;
                });

                // Starting drag when mouse key (LM) goes down at bar
                event(document, 'touchstart mousedown', function(e) { // document, not window, for ie8
                    if (e.button != 2) { // Not RM
                        scrollerPos0 = getCursorPos(e) - barPos;
                    }
                });

                event(document, 'mousemove touchmove', function(e) { // document, not window, for ie8
                    if (drag) {
                        this.scroller[this.dir.scroll] = this.posToRel(this.getCursorPos(e) - scrollerPos0) * (this.scroller[this.dir.scrollSize] - this.scroller[this.dir.client]);
                    }
                });

                event(window, 'resize', resize);
                event(this.scroller, 'sizeChange', resize); // Custon event for alternate baron update mechanism

                if (this.bar) {
                    event(this.bar, 'mousewheel', this.bubbleWheel);
                    // if (track && track != scroller) {
                    //     event(track, 'mousewheel', bubbleWheel);
                    // }
                }

                // Reinit when resize
                function resize() {
                    // Limit the resize frenquency
                    clearTimeout(rTimer);
                    rTimer = setTimeout(function() {
                        uView();
                        uBar();
                        barOn();
                    }, 200);
                };



                return this;
            };

            // Switch on the bar by adding user-defined CSS classname to scroller
            baron.init.prototype.barOn = function() {
                if (this.barOnCls) {
                    if (this.scroller[this.dir.client] < this.scroller[this.dir.scrollSize]) {
                        this.dom(this.scroller).addClass(this.barOnCls);
                    } else {
                        this.dom(this.scroller).removeClass(this.barOnCls);
                    }
                }
            };

            // Updating height or width of bar
            baron.init.prototype.setBarSize = function(size) {
                var barMinSize = this.barMinSize || 20;

                if (size > 0 && size < this.barMinSize) {
                    size = this.barMinSize;
                }

                if (this.bar) {
                    this.dom(this.bar).css(this.dir.size, parseInt(size) + 'px');
                }
            };

            // Updating top or left bar position
            this.posBar = function(pos) {
                if (bar) {
                    this.dom(bar).css(this.dir.pos, parseInt(pos) + 'px');
                }
            }

            // Free path for bar
            this.k = function() {
                return this.track[this.dir.client] - this.barTopLimit - this.bar[this.dir.offset];
            }

            // Relative container top position to bar top position
            this.relToPos = function(r) {
                return r * this.k() + this.barTopLimit;
            }

            // Bar position to relative container position
            this.posToRel = function(t) {
                return (t - this.barTopLimit) / k();
            }

            // Cursor position in main direction in px // Now with iOs support
            this.getCursorPos = function(e) {
                return e['client' + this.dir.x] || (((e.originalEvent || e).touches || {})[0] || {})['page' + dir.x];
            }

            // Text selection pos preventing
            this.dontPosSelect = function() {
                return false;
            }

            // Text selection preventing on drag
            this.selection = function(enable) {
                event(document, 'selectpos selectstart', this.dontPosSelect, enable ? 'off' : 'on');
            }

            // Bubbling wheel event e to scroller (from headers and scrollbar)
            // Works only in webkit, because of lack of standarts :(
            this.bubbleWheel = function(e) {
                try {
                    i = document.createEvent('WheelEvent'); // i - for extra byte
                    // evt.initWebKitWheelEvent(deltaX, deltaY, window, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey);
                    i.initWebKitWheelEvent(e.originalEvent.wheelDeltaX, e.originalEvent.wheelDeltaY);
                    this.scroller.dispatchEvent(i);
                    e.preventDefault();
                } catch (e) {};
            }
            // fixing or unfixing headers[i]
            this.fixHeader = function(i, pos) {
                if (this.viewPortSize < (this.viewMinSize || 0)) { // No headers fixing when no enought space for viewport
                    pos = undefined;
                }

                if (pos !== undefined) {
                    pos += 'px';
                    this.dom(this.headers[i]).css(this.dir.pos, pos).addClass(this.hFixCls);
                } else {
                    this.dom(this.headers[i]).css(this.dir.pos, '').removeClass(this.hFixCls);
                }
            }

            // Viewport (re)calculation
            this.uView = function(force) {
                // Setting scrollbar width BEFORE all other work
                this.dom(this.scroller).css(this.dir.crossSize, this.scroller.parentNode[this.dir.crossClient] + this.scroller[this.dir.crossOffset] - this.scroller[this.dir.crossClient] + 'px');

                this.viewPortSize = this.scroller[this.dir.client];

                if (force) {
                    this.headerTops = [];
                }

                hFixFlag = [];
                this.topHeights = [];

                
                this.headers = this.selector(this.header, this.scroller);
                if (this.headers) {
                    for (i = 0 ; i < this.headers.length ; i++) {
                        // Summary headers height above current
                        this.topHeights[i] = (this.topHeights[i - 1] || 0);

                        if (this.headers[i - 1]) {
                            this.topHeights[i] += this.headers[i - 1][this.dir.offset];
                        }

                        // Variable header heights
                        pos = {};
                        pos[this.dir.size] = this.headers[i][this.dir.offset];
                        if (this.headers[i].parentNode !== this.scroller) {
                            this.dom(this.headers[i].parentNode).css(pos);
                        }
                        pos = {};
                        pos[this.dir.crossSize] = this.headers[i].parentNode[this.dir.crossClient];
                        this.dom(this.headers[i]).css(pos);

                        // Between fixed headers
                        this.viewPortSize -= this.headers[i][this.dir.offset];

                        this.headerTops[i] = this.headers[i].parentNode[this.dir.offsetPos]; // No paddings for parentNode

                        if ( !(i == 0 && this.headerTops[i] == 0) && force) {
                            event(this.headers[i], 'mousewheel', bubbleWheel, 'off');
                            event(this.headers[i], 'mousewheel', bubbleWheel);
                        }
                    }

                    if (this.trackSmartLim) { // Bottom edge of first header as top limit for track
                        if (this.track != this.scroller) {
                            pos = {};
                            pos[this.dir.pos] = this.headers[0].parentNode[this.dir.offset];
                            this.dom(this.track).css(pos);
                        } else {
                            this.barTopLimit = this.headers[0].parentNode[this.dir.offset];
                        }
                    }
                }
            }

            // Total positions data update, container size dependences included
            this.uBar = function() {
                var scrollerPos, // Scroller content position
                    oldBarSize, newBarSize,
                    hTop,
                    fixState;

                if (this.bar) {
                    newBarSize = (this.track[this.dir.client] - this.barTopLimit) * this.scroller[this.dir.client] / this.scroller[this.dir.scrollSize];

                    // Positioning bar
                    if (oldBarSize != newBarSize) {
                        this.setBarSize(newBarSize);
                        oldBarSize = newBarSize;
                    }
                    
                    scrollerPos = -(this.scroller['page' + this.dir.x + 'Offset'] || this.scroller[this.dir.scroll]);
                    barPos = this.relToPos(- scrollerPos / (this.scroller[this.dir.scrollSize] - this.scroller[this.dir.client]));

                    posBar(barPos);
                }
                // Positioning headers
                if (this.headers) {
                    var change;
                    for (i = 0 ; i < this.headers.length ; i++) {
                        fixState = 0;
                        if (this.headerTops[i] + scrollerPos < this.topHeights[i] + this.fixRadius) {
                            // Header trying to go up
                            fixState = 1;
                            hTop = this.topHeights[i];
                        } else if (this.headerTops[i] + scrollerPos > this.topHeights[i] + this.viewPortSize - this.fixRadius) {
                            // Header trying to go down
                            fixState = 2;
                            hTop = this.topHeights[i] + this.viewPortSize;
                        } else {
                            // Header in viewport
                            fixState = 3;
                            hTop = undefined;
                        }
                        if (fixState != hFixFlag[i]) {
                            this.fixHeader(i, hTop);
                            hFixFlag[i] = fixState;
                            change = true;
                        }
                    }

                    // Adding positioning classes (on last top and first bottom header)
                    if (change) { // At leats one change in headers flag structure occured
                        for (i = 0 ; i < headers.length ; i++) {
                            if (hFixFlag[i] != hFixFlag[i + 1] && hFixFlag[i] == 1 && this.hBeforeFixCls) {
                                this.dom(headers[i]).addClass(this.hBeforeFixCls).removeClass(this.hAfterFixCls + ''); // Last top fixed header
                            } else if (hFixFlag[i] != hFixFlag[i - 1] && hFixFlag[i] == 2 && this.hAfterFixCls) {
                                this.dom(headers[i]).addClass(this.hAfterFixCls).removeClass(this.hBeforeFixCls + ''); // First bottom fixed header
                            } else {
                                this.dom(headers[i]).removeClass(this.hBeforeFixCls + '').removeClass(this.hAfterFixCls + '');
                                // Emply string for bonzo, which does not handles removeClass(undefined)
                            }
                        }
                    }
                }
            }

            // Update method for one scroll group
            baron.init.prototype.update = function() {
                this._uView(1);
                this._uBar();
                this._barOn();
            };

            // Initializing scroll group, or updating it if already
            var k = 0;
            for (var i = 0 ; i < scroller.length ; i++) {
                if (!scroller[i].getAttribute('data-baron')) {
                    data.scroller = scroller[i];
                    if (data.v !== false) {
                        data.dir = direction.v;
                        data.bar = data.vbar || data.bar;
                        this[k++] = new baron.init(data);
                    }
                    if (data.h) {
                        data.dir = direction.h;
                        data.bar = data.hbar;
                        this[k++] = new baron.init(data);
                    }
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

        scrollGroup = new constructor(params);
        scrollGroup.u();
        scrolls.push(scrollGroup);

        return scrollGroup;
    };

    baron.u = function() {
        for (var i = 0 ; i < scrolls.length ; i++) {
            scrolls[i].u();
        }
    };

    // Use when you need "baron" global var for another purposes
    baron.noConflict = function() {
        window.baron = stored; // Restoring original value of "baron" global var

        return baron;
    };

    baron.version = '0.5.1';

    if ($ && $.fn) { // Adding baron to jQuery as plugin
        $.fn.baron = baron;
    }
    window.baron = baron; // Use noConflict method if you need window.baron var for another purposes
    if (window['module'] && module.exports) {
        module.exports = baron.noConflict();
    }
})(window);