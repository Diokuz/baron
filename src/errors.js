    function errGlobal(num, params) {
        var prefix = 'Baron error #',
            postfix = '. Input params are: ',
            messages = {
                1: 'no query selector engine found. You have to use either jQuery or custom engine',
                2: 'no event manager found. You have to use either jQuery or custom manager',
                3: 'no DOM utility engine found. You have to use either jQuery or custom engine',
                10: 'no scroller in dom found',
                11: 'no bar found'
            };

        if (console) {
            console.error(prefix + num + ': ' + messages[num] + postfix, params);
        }
        
        throw(messages[num]);
    }
