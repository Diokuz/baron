/* Fixable elements plugin for baron 0.6+ */
;(function(scopedWindow) {
    var scopedBaron

    if (typeof module != 'undefined') {
        scopedBaron = require('./core.js')
    } else {
        scopedBaron = scopedWindow.baron
    }

    // removeIf(production)
    var log = function() {
        scopedBaron.fn.log.apply(this, arguments)
    }
    // endRemoveIf(production)

    var fix = function(userParams) {
        var elements, viewPortSize,
            params = { // Default params
                outside: '',
                inside: '',
                before: '',
                after: '',
                past: '',
                future: '',
                radius: 0,
                minView: 0
            },
            topFixHeights = [], // inline style for element
            topRealHeights = [], // ? something related to negative margins for fixable elements
            headerTops = [], // offset positions when not fixed
            scroller = this.scroller,
            eventManager = this.event,
            $ = this.$,
            self = this

        // removeIf(production)
        if (this.position != 'static') {
            log('error', [
                'Fix plugin cannot work properly in non-static baron position.',
                'See more https://github.com/Diokuz/baron/issues/135'
            ].join(' '), this.params)
        }
        // endRemoveIf(production)

        // i - number of fixing element, pos - fix-position in px, flag - 1: top, 2: bottom
        // Invocation only in case when fix-state changed
        function fixElement(i, _pos, flag) {
            var pos = _pos
            var ori = flag == 1 ? 'pos' : 'oppos'

            if (viewPortSize < (params.minView || 0)) { // No headers fixing when no enought space for viewport
                pos = undefined
            }

            // Removing all fixing stuff - we can do this because fixElement triggers only when fixState really changed
            this.$(elements[i]).css(this.origin.pos, '').css(this.origin.oppos, '').removeClass(params.outside)

            // Fixing if needed
            if (pos !== undefined) {
                pos += 'px'
                this.$(elements[i]).css(this.origin[ori], pos).addClass(params.outside)
            }
        }

        function bubbleWheel(e) {
            try {
                var i = document.createEvent('WheelEvent') // i - for extra byte

                // evt.initWebKitWheelEvent(deltaX, deltaY, window, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey)
                i.initWebKitWheelEvent(e.originalEvent.wheelDeltaX, e.originalEvent.wheelDeltaY)
                scroller.dispatchEvent(i)
                e.preventDefault()
            } catch (ex) {
                //
            }
        }

        function init(_params) {
            var pos

            for (var key in _params) {
                params[key] = _params[key]
            }

            elements = this.$(params.elements, this.scroller)

            if (elements) {
                viewPortSize = this.scroller[this.origin.client]
                for (var i = 0; i < elements.length; i++) {
                    // Variable header heights
                    pos = {}
                    pos[this.origin.size] = elements[i][this.origin.offset]
                    if (elements[i].parentNode !== this.scroller) {
                        this.$(elements[i].parentNode).css(pos)
                    }
                    pos = {}
                    pos[this.origin.crossSize] = elements[i].parentNode[this.origin.crossClient]
                    this.$(elements[i]).css(pos)

                    // Between fixed headers
                    viewPortSize -= elements[i][this.origin.offset]

                    headerTops[i] = elements[i].parentNode[this.origin.offsetPos] // No paddings for parentNode

                    // Summary elements height above current
                    topFixHeights[i] = (topFixHeights[i - 1] || 0) // Not zero because of negative margins
                    topRealHeights[i] = (topRealHeights[i - 1] || Math.min(headerTops[i], 0))

                    if (elements[i - 1]) {
                        topFixHeights[i] += elements[i - 1][this.origin.offset]
                        topRealHeights[i] += elements[i - 1][this.origin.offset]
                    }

                    if ( !(i == 0 && headerTops[i] == 0)/* && force */) {
                        this.event(elements[i], 'mousewheel', bubbleWheel, 'off')
                        this.event(elements[i], 'mousewheel', bubbleWheel)
                    }
                }

                if (params.limiter && elements[0]) { // Bottom edge of first header as top limit for track
                    if (this.track && this.track != this.scroller) {
                        pos = {}
                        pos[this.origin.pos] = elements[0].parentNode[this.origin.offset]
                        this.$(this.track).css(pos)
                    } else {
                        this.barTopLimit = elements[0].parentNode[this.origin.offset]
                    }
                    // this.barTopLimit = elements[0].parentNode[this.origin.offset]
                    this.scroll()
                }

                if (params.limiter === false) { // undefined (in second fix instance) should have no influence on bar limit
                    this.barTopLimit = 0
                }
            }

            var event = {
                element: elements,

                handler: function() {
                    var parent = $(this)[0].parentNode,
                        top = parent.offsetTop,
                        num

                    // finding num -> elements[num] === this
                    for (var j = 0; j < elements.length; j++ ) {
                        if (elements[j] === this) num = j
                    }

                    var locPos = top - topFixHeights[num]

                    if (params.scroll) { // User defined callback
                        params.scroll({
                            x1: self.scroller.scrollTop,
                            x2: locPos
                        })
                    } else {
                        self.scroller.scrollTop = locPos
                    }
                },

                type: 'click'
            }

            if (params.clickable) {
                this._eventHandlers.push(event) // For auto-dispose
                // eventManager(event.element, event.type, event.handler, 'off')
                eventManager(event.element, event.type, event.handler, 'on')
            }
        }

        this.on('init', init, userParams)

        var fixFlag = [], // 1 - past, 2 - future, 3 - current (not fixed)
            gradFlag = []

        this.on('init scroll', function() {
            var fixState, hTop, gradState
            var i

            if (elements) {
                var change

                // fixFlag update
                for (i = 0; i < elements.length; i++) {
                    fixState = 0
                    if (headerTops[i] - this.pos() < topRealHeights[i] + params.radius) {
                        // Header trying to go up
                        fixState = 1
                        hTop = topFixHeights[i]
                    } else if (headerTops[i] - this.pos() > topRealHeights[i] + viewPortSize - params.radius) {
                        // Header trying to go down
                        fixState = 2
                        // console.log('topFixHeights[i] + viewPortSize + topRealHeights[i]', topFixHeights[i], this.scroller[this.origin.client], topRealHeights[i])
                        hTop = this.scroller[this.origin.client] - elements[i][this.origin.offset] - topFixHeights[i] - viewPortSize
                        // console.log('hTop', hTop, viewPortSize, elements[this.origin.offset], topFixHeights[i])
                        // (topFixHeights[i] + viewPortSize + elements[this.origin.offset]) - this.scroller[this.origin.client]
                    } else {
                        // Header in viewport
                        fixState = 3
                        hTop = undefined
                    }

                    gradState = false
                    if (headerTops[i] - this.pos() < topRealHeights[i] || headerTops[i] - this.pos() > topRealHeights[i] + viewPortSize) {
                        gradState = true
                    }

                    if (fixState != fixFlag[i] || gradState != gradFlag[i]) {
                        fixElement.call(this, i, hTop, fixState)
                        fixFlag[i] = fixState
                        gradFlag[i] = gradState
                        change = true
                    }
                }

                // Adding positioning classes (on last top and first bottom header)
                if (change) { // At leats one change in elements flag structure occured
                    for (i = 0; i < elements.length; i++) {
                        if (fixFlag[i] == 1 && params.past) {
                            this.$(elements[i]).addClass(params.past).removeClass(params.future)
                        }

                        if (fixFlag[i] == 2 && params.future) {
                            this.$(elements[i]).addClass(params.future).removeClass(params.past)
                        }

                        if (fixFlag[i] == 3) {
                            if (params.future || params.past) this.$(elements[i]).removeClass(params.past).removeClass(params.future)
                            if (params.inside) this.$(elements[i]).addClass(params.inside)
                        } else if (params.inside) {
                            this.$(elements[i]).removeClass(params.inside)
                        }

                        if (fixFlag[i] != fixFlag[i + 1] && fixFlag[i] == 1 && params.before) {
                            this.$(elements[i]).addClass(params.before).removeClass(params.after) // Last top fixed header
                        } else if (fixFlag[i] != fixFlag[i - 1] && fixFlag[i] == 2 && params.after) {
                            this.$(elements[i]).addClass(params.after).removeClass(params.before) // First bottom fixed header
                        } else {
                            this.$(elements[i]).removeClass(params.before).removeClass(params.after)
                        }

                        if (params.grad) {
                            if (gradFlag[i]) {
                                this.$(elements[i]).addClass(params.grad)
                            } else {
                                this.$(elements[i]).removeClass(params.grad)
                            }
                        }
                    }
                }
            }
        })

        this.on('resize upd', function(updParams) {
            init.call(this, updParams && updParams.fix)
        })
    }

    scopedBaron.fn.fix = function(params) {
        var i = 0

        while (this[i]) {
            fix.call(this[i], params)
            i++
        }

        return this
    }
}(this))
