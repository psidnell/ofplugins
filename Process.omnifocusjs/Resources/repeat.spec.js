const lib = require('./repeat');

describe('Defer', () => {

    it('can access the module version', () => {
        expect(lib.version).toBe('0.1');
    });

    it('can calculate elapsed time', async () => {
        expect(lib.t()).toBe(0);
        await new Promise((r) => setTimeout(r, 1));
        expect(lib.t()).toBeGreaterThan(0);
    });

});