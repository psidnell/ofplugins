describe('PlugIn', () => {
    it('can instantiate PlugIn', () => {
        var lib = new PlugIn.Library(new Version("0.1"));
        expect(lib.version).toBe("0.1");
    });
});