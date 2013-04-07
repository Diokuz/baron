                    headers = selector(gData.header, scroller);
                    if (headers) {
                        if (force) { // For instance: if headers length changed
                            // onMouseWheel bubbling in webkit
                            event(headers, 'mousewheel', bubbleWheel, 'off');
                            event(headers, 'mousewheel', bubbleWheel);
                        }

                        for (i = 0 ; i < headers.length ; i++) {
                            // Summary headers height above current
                            topHeights[i] = (topHeights[i - 1] || 0);

                            if (headers[i - 1]) {
                                topHeights[i] += headers[i - 1][dir.offset];
                            }

                            // Variable header heights
                            pos = {};
                            pos[dir.size] = headers[i][dir.offset];
                            dom(headers[i].parentNode).css(pos);
                            pos = {};
                            pos[dir.crossSize] = headers[i].parentNode[dir.crossClient];
                            dom(headers[i]).css(pos);

                            // Between fixed headers
                            viewPortSize -= headers[i][dir.offset];

                            headerTops[i] = headers[i].parentNode[dir.offsetPos]; // No paddings for parentNode
                        }

                        if (gData.trackSmartLim) { // Bottom edge of first header as top limit for track
                            if (track != scroller) {
                                pos = {};
                                pos[dir.pos] = headers[0].parentNode[dir.offset];
                                dom(track).css(pos);
                            } else {
                                barTopLimit = headers[0].parentNode[dir.offset];
                            }
                        }
                    }