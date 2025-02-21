describe('Version', () => {
    it('can instantiate Version', () => {
        var version = new Version('123');
        expect(version.version).toBe('123');
    });
});