                // Positioning headers
                if (headers) {
                    var change;
                    for (i = 0 ; i < headers.length ; i++) {
                        fixState = 0;
                        if (headerTops[i] + scrollerPos < topHeights[i] + fixRadius) {
                            // Header trying to go up
                            fixState = 1;
                            hTop = topHeights[i];
                        } else if (headerTops[i] + scrollerPos > topHeights[i] + viewPortSize - fixRadius) {
                            // Header trying to go down
                            fixState = 2;
                            hTop = topHeights[i] + viewPortSize;
                        } else {
                            // Header in viewport
                            fixState = 3;
                            hTop = undefined;
                        }
                        if (fixState != hFixFlag[i]) {
                            fixHeader(i, hTop);
                            hFixFlag[i] = fixState;
                            change = true;
                        }
                    }

                    // Adding positioning classes (on last top and first bottom header)
                    if (change) { // At leats one change in headers flag structure occured
                        for (i = 0 ; i < headers.length ; i++) {
                            if (hFixFlag[i] != hFixFlag[i + 1] && hFixFlag[i] == 1 && gData.hBeforeFixCls) {
                                dom(headers[i]).addClass(gData.hBeforeFixCls).removeClass(gData.hAfterFixCls + ''); // Last top fixed header
                            } else if (hFixFlag[i] != hFixFlag[i - 1] && hFixFlag[i] == 2 && gData.hAfterFixCls) {
                                dom(headers[i]).addClass(gData.hAfterFixCls).removeClass(gData.hBeforeFixCls + ''); // First bottom fixed header
                            } else {
                                dom(headers[i]).removeClass(gData.hBeforeFixCls + '').removeClass(gData.hAfterFixCls + '');
                                // Emply string for bonzo, which does not handles removeClass(undefined)
                            }
                        }
                    }
                }