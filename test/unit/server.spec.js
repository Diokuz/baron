/* global describe, it */

var assert = require('assert')

describe('На сервере', function() {
    it('Барон не должен какать в global', function() {
        assert.equal(global.baron, undefined, 'До реквайра global.baron не определён')

        var baron = require('../../')

        assert(baron, 'Барон есть')
        assert.equal(global.baron, undefined, 'После реквайра global.baron не определён')
    })
})
