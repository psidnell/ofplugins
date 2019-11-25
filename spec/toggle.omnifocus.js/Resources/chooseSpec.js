describe('choose', () => {

    var action = null;

    beforeEach(function() {
        require('../../mocks/PlugIn');
        require('../../mocks/library');
        require('../../mocks/Form');
        require('../../../toggle.omnifocusjs/Resources/choose.js');
        action = lastPlugInAction;
    });

    it('can create action', () => {
        expect(action).toBeTruthy();
        expect(action.fn).toBeTruthy();
        expect(action.validate).toBeTruthy();
    });

    it('can validate', () => {
        expect(action.validate(null, null)).toBeTruthy();
    });

    it('can run when no folders', () => {
        var plugin = {}
        var toggleLib = {};

        // Expectations
        library.apply = jasmine.createSpy('apply');
        PlugIn.find = jasmine.createSpy('find').and.returnValue(plugin);
        plugin.library = jasmine.createSpy('library').and.returnValue(toggleLib);

        // Test
        action.fn(null, null);

        // Verify
        expect(library.apply).toHaveBeenCalled();
    });
});
