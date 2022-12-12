const lib = require('./defer');

describe('Defer', () => {

    it('can access the module', () => {
        expect(lib.version).toBe('0.1');
    });

});