/* Autoupdate plugin for baron 0.6+ */
;(function(scopedWindow) {
    var scopedBaron

    if (typeof module != 'undefined') {
        scopedBaron = require('./core')
    } else {
        scopedBaron = scopedWindow.baron
    }

    var MutationObserver = scopedWindow.MutationObserver || scopedWindow.WebKitMutationObserver || scopedWindow.MozMutationObserver || null

    var autoUpdate = function() {
        var self = this
        var watcher

        if (this._au) {
            return
        }

        function actualizeWatcher() {
            if (!self.root[self.origin.offset]) {
                startWatch()
            } else {
                stopWatch()
            }
        }

        // Set interval timeout for watching when root node will be visible
        function startWatch() {
            if (watcher) return

            watcher = setInterval(function() {
                if (self.root[self.origin.offset]) {
                    stopWatch()
                    self.update()
                }
            }, 300) // is it good enought for you?)
        }

        function stopWatch() {
            clearInterval(watcher)
            watcher = null
        }

        var debouncedUpdater = self._debounce(function() {
            self.update()
        }, 300)

        this._observer = new MutationObserver(function() {
            actualizeWatcher()
            self.update()
            debouncedUpdater()
        })

        this.on('init', function() {
            self._observer.observe(self.root, {
                childList: true,
                subtree: true,
                characterData: true
                // attributes: true
                // No reasons to set attributes to true
                // The case when root/child node with already properly inited baron toggled to hidden and then back to visible,
                // and the size of parent was changed during that hidden state, is very rare
                // Other cases are covered by watcher, and you still can do .update by yourself
            })

            actualizeWatcher()
        })

        this.on('dispose', function() {
            self._observer.disconnect()
            stopWatch()
            delete self._observer
        })

        this._au = true
    }

    scopedBaron.fn.autoUpdate = function(params) {
        if (!MutationObserver) return this

        var i = 0

        while (this[i]) {
            autoUpdate.call(this[i], params)
            i++
        }

        return this
    }
}(this))
