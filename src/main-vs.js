            // Viewport (re)calculation
            function viewport(force) {
                // Setting scrollbar width BEFORE all other work
                dom(scroller).css(dir.crossSize, scroller.parentNode[dir.crossClient] + scroller[dir.crossOffset] - scroller[dir.crossClient] + 'px');

                viewPortSize = scroller[dir.client];

                if (force) {
                    headerTops = [];
                }

                hFixFlag = [];
                topHeights = [];

                