            }

            // Total positions data update, container size dependences included
            function uBar() {
                var scrollerPos, // Scroller content position
                    oldBarSize, newBarSize,
                    hTop,
                    fixState;

                newBarSize = (track[dir.client] - barTopLimit) * scroller[dir.client] / scroller[dir.scrollSize];

                // Positioning bar
                if (oldBarSize != newBarSize) {
                    setBarSize(newBarSize);
                    oldBarSize = newBarSize;
                }
                
                scrollerPos = -(scroller['page' + dir.x + 'Offset'] || scroller[dir.scroll]);
                barPos = relToPos(- scrollerPos / (scroller[dir.scrollSize] - scroller[dir.client]));

                posBar(barPos);