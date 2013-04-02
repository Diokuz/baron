            // fixing or unfixing headers[i]
            function fixHeader(i, pos) {
                if (viewPortSize < (gData.viewMinSize || 0)) { // No headers fixing when no enought space for viewport
                    pos = undefined;
                }

                if (pos !== undefined) {
                    pos += 'px';
                    dom(headers[i]).css(dir.pos, pos).addClass(hFixCls);
                } else {
                    dom(headers[i]).css(dir.pos, '').removeClass(hFixCls);
                }
            }

            // Webkit bug: scroll freezing when header goes to fixed state right under cursor
            function bubbleWheel(e) {
                try {
                    i = document.createEvent('WheelEvent'); // i - for extra byte
                    // evt.initWebKitWheelEvent(deltaX, deltaY, window, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey);
                    i.initWebKitWheelEvent(e.originalEvent.wheelDeltaX, e.originalEvent.wheelDeltaY);
                    scroller.dispatchEvent(i);
                    e.preventDefault();
                } catch (e) {};
            }