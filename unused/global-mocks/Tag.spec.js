describe('Tag', () => {
    it('can instantiate Tag', () => {
        var tag = new Tag('name', 'position');
        expect(tag.name).toBe('name');
        expect(tag.position).toBe('position');
    });
});