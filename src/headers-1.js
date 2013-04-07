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