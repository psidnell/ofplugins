describe('Defer', () => {

    var lib;

    beforeEach(() => {
        lib = require('./defer');
    });

    it('can access the module version', () => {
        expect(lib.version).toBe('0.1');
    });

    it('can calculate elapsed time', async () => {
        expect(lib.t()).toBe(0);
        await new Promise((r) => setTimeout(r, 1));
        expect(lib.t()).toBeGreaterThan(0);
    });

    it('can create a month tag', async () => {
        //Given
        var year = 2022;
        var month = 11;
        var yearTag = {};
        lib.findCreateSubTag = jest.fn((parentTag, name) =>
            ({
                parentTag: parentTag,
                name: name,
            })
        );

        //When
        var monthTag = lib.findOrCreateMonthTag(year, month, yearTag);

        //Then
        expect(monthTag.name).toBe('DEC-2022');
        expect(monthTag.parentTag.name).toBe('2022');
        expect(lib.findCreateSubTag.mock.calls.length).toBe(2);
    });

});