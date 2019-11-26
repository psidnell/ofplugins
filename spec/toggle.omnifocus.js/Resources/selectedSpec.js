describe('selected', () => {

    var toggleLib;
    var action;

    beforeEach(() => {
        // Mock enough for creating the plugin and loading libraries

        toggleLib = {};

        var libs = {
            toggleLib: toggleLib,
        };

        var plugIn = {
            mock: 'PlugIn',
            library: (name) => libs[name]
        };

        PlugIn = class {
        };

        PlugIn.find = (pluginName) => plugIn;

        action;
        PlugIn.Action = function (fn) {
            this.fn = fn;
            action = this;
        };

        Folder = class {
        };

        library = {};

        require('../../../toggle.omnifocusjs/Resources/selection.js');
    });

    it('can use mocks', () => {
        var lib = PlugIn.find('com.PaulSidnell.Toggle').library('toggleLib');
        expect(lib).toBe(toggleLib);
    });

    it('can create action', () => {
        expect(action).toBeTruthy();
        expect(action.fn).toBeTruthy();
        expect(action.validate).toBeTruthy();
    });

    it('does not validate when nothing selected', () => {
        var selection = {
            folders: []
        };
        expect(action.validate(selection, null)).toBeFalsy();
    });

    it('does validate when a folder is selected', () => {
        var selection = {
            folders: [new Folder()]
        };
        expect(action.validate(selection, null)).toBeTruthy();
    });

    it('can toggle a folder', () => {
        var selection = {
            folders: [new Folder()]
        };

        // Expectations
        toggleLib.toggleFolder = jasmine.createSpy('toggleFolder');

        // Test
        action.fn(selection, null);

        // Verify
        expect(toggleLib.toggleFolder).toHaveBeenCalledWith(selection.folders[0]);
    });

});
