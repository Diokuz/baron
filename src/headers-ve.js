                    headers = selector(gData.header, scroller);
                    if (headers) {
                        for (i = 0 ; i < headers.length ; i++) {
                            // Summary headers height above current
                            topHeights[i] = (topHeights[i - 1] || 0);

                            if (headers[i - 1]) {
                                topHeights[i] += headers[i - 1][dir.offset];
                            }

                            // Variable header heights
                            pos = {};
                            pos[dir.size] = headers[i][dir.offset];
                            if (headers[i].parentNode !== scroller) {
                                dom(headers[i].parentNode).css(pos);
                            }
                            pos = {};
                            pos[dir.crossSize] = headers[i].parentNode[dir.crossClient];
                            dom(headers[i]).css(pos);

                            // Between fixed headers
                            viewPortSize -= headers[i][dir.offset];

                            headerTops[i] = headers[i].parentNode[dir.offsetPos]; // No paddings for parentNode

                            if ( !(i == 0 && headerTops[i] == 0) && force) {
                                event(headers[i], 'mousewheel', bubbleWheel, 'off');
                                event(headers[i], 'mousewheel', bubbleWheel);
                            }
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