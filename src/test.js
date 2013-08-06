/* Autotests plugin for baron 0.6+ (for developers) */
(function(window, undefined) {
    var test = function(params) {
        var errCount = 0,
            totalCount = 0;

        var log = function(type, msg, obj) {
            var text = type + ': ' + msg;

            switch (type) {
                case 'log': css = 'color: #0b0'; break;
                case 'warn': css = 'color: #fc9'; break;
                case 'error': css = 'color: #f00'; break;
            }
            totalCount++;
            if (type == 'log') {
                errCount++;
            }

            console.log('%c ' + totalCount + '. ' + text, css);
            if (obj !== undefined) {
                console.log(obj);
            }
        };

        if (this.scroller && this.scroller.nodeType === 1) {
            log('log', 'Scroller defined and has proper nodeType value', this.scroller);
        } else {
            log('error', 'Scroller not defined or has wrong type (should be html node).', this.scroller);
        }

        if (this.$ && typeof this.$ == 'function') {
            log('log', 'Local $ defined and it is a function');
        } else {
            log('error', 'Local $ has wrong value or is not defined, or custom params.dom and params.selector not defined', params.$);
        }

        if (this.scroller.getAttribute('data-baron-v')) {
            log('log', 'Baron initialized in vertical direction', this.scroller.getAttribute('data-baron-v'));
            if (this.scroller.clientHeight < this.scroller.scrollHeight && this.scroller.getAttribute('data-baron-v')) {
                log('log', 'There are enought space for scrolling in vertical direction right now', this.scroller.scrollHeight - this.scroller.clientHeight + 'px');
            } else {
                log('log', 'There are not enought space for scrolling in vertical direction right now');
            }
        }
        if (this.scroller.getAttribute('data-baron-h')) {
            log('log', 'Baron initialized in horizontal direction', this.scroller.getAttribute('data-baron-h'));
            if (this.scroller.clientWidth < this.scroller.scrollWidth) {
                log('log', 'There are enought space for scrolling in horizontal direction right now', this.scroller.scrollWidth - this.scroller.clientWidth + 'px');
            } else {
                log('log', 'There are not enought space for scrolling in horizontal direction right now');
            }
        }

        if (this.bar && this.bar.nodeType === 1) {
            log('log', 'Bar defined and has proper nodeType value', this.bar);
        } else {
            log('warn', 'Bar not defined or has wrong type (should be html node).', this.bar);
        }
        
        if (this.barOnCls) {
            log('log', 'CSS classname barOnCls defined', this.barOnCls);
        } else {
            log('warn', 'barOnCls not defined - bar will be visible or not visible all the time', this.barOnCls);
        }

        // Preformance test
        var t1 = new Date().getTime(),
            x;
        for (var i = 0 ; i < 1000 ; i += 10) {
            x = i % (this.scroller[this.origin.scrollSize] - this.scroller[this.origin.client]);
            this.pos(x);
            this.event(this.scroller, 'scroll', undefined, 'trigger');
        }
        var t2 = new Date().getTime();
        log('log', 'Preformance test: ' + (t2 - t1) / 1000 + ' milliseconds per scroll event');
        
        log('log', 'Result is ' + errCount + ' / ' + totalCount + '\n');
    };

    baron.fn.test = function(params) {
        var i = 0;

        while (this[i]) {
            test.call(this[i], params);
            i++;
        }

        return this;
    };
})(window);