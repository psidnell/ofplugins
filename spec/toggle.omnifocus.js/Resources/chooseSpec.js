describe('choose', () => {

    var toggleLib;
    var factoryLib;
    var action;

    beforeEach(() => {
        // Mock enough for creating the plugin and loading libraries

        toggleLib = {};
        factoryLib = {};

        var libs = {
            toggleLib: toggleLib,
            factoryLib: factoryLib
        };

        var plugIn = {
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

        require('../../../toggle.omnifocusjs/Resources/choose.js');
    });

    it('can use mocks', () => {
        var lib1 = PlugIn.find('com.PaulSidnell.Toggle').library('factoryLib');
        expect(lib1).toBe(factoryLib);

        var lib2 = PlugIn.find('com.PaulSidnell.Toggle').library('toggleLib');
        expect(lib2).toBe(toggleLib);
    });

    it('can create action', () => {
        expect(action).toBeTruthy();
        expect(action.fn).toBeTruthy();
        expect(action.validate).toBeTruthy();
    });

    it('can validate', () => {
        expect(action.validate(null, null)).toBeTruthy();
    });

    it('can run when database empty', () => {
        var form = {};

        // Expectations
        factoryLib.newForm = jasmine.createSpy('newForm').and.returnValue(form);
        library.apply = jasmine.createSpy('apply');

        // Test
        action.fn(null, null);

        // Verify
        expect(factoryLib.newForm).toHaveBeenCalled();
        expect(library.apply).toHaveBeenCalled();
    });

    it('can run when no folders', () => {
        var form = {};
        var notFolder = {};

        // Expectations
        factoryLib.newForm = jasmine.createSpy('newForm').and.returnValue(form);
        library.apply = jasmine.createSpy('apply').and.callFake((fn) => {fn(notFolder)});

        // Test
        action.fn(null, null);

        // Verify
        expect(factoryLib.newForm).toHaveBeenCalled();
        expect(library.apply).toHaveBeenCalled();
    });

    it('can find a folder', () => {
        var folderChosen = new Folder();
        folderChosen.name = 'folder1';
        folderChosen.active = true;

        var folderNotChosen = new Folder();
        folderNotChosen.name = 'folder2';
        folderNotChosen.active = true;

        var form = {
            values: {
                choice: folderChosen
            }
        };
        var option = {};
        var promise = {};

        // Expectations
        factoryLib.newForm = jasmine.createSpy('newForm').and.returnValue(form);
        library.apply = jasmine.createSpy('apply').and.callFake((fn) => {
            fn(folderNotChosen);
            fn(folderChosen);
        });
        factoryLib.newFormFieldOption = jasmine.createSpy('newFormFieldOption').and.returnValue(option);
        form.addField = jasmine.createSpy('addField');
        form.show = jasmine.createSpy('show').and.returnValue(promise);
        promise.then = jasmine.createSpy('then').and.callFake ((okFn, errFn) => okFn(form));
        toggleLib.toggleFolder = jasmine.createSpy('toggleFolder');

        // Test
        action.fn(null, null);

        // Verify
        expect(factoryLib.newForm).toHaveBeenCalled();
        expect(library.apply).toHaveBeenCalled();
        expect(factoryLib.newFormFieldOption).toHaveBeenCalled();
        var newFormFieldOptionArgs = factoryLib.newFormFieldOption.calls.mostRecent().args;
        expect(newFormFieldOptionArgs[0]).toBe('choice');
        expect(newFormFieldOptionArgs[1]).toBe('Folder');
        expect(newFormFieldOptionArgs[2].length).toBe(2);
        expect(newFormFieldOptionArgs[2][0]).toBe(folderNotChosen);
        expect(newFormFieldOptionArgs[2][1]).toBe(folderChosen);
        expect(newFormFieldOptionArgs[3].length).toBe(2);
        expect(newFormFieldOptionArgs[3][0]).toBe(folderNotChosen.name);
        expect(newFormFieldOptionArgs[3][1]).toBe(folderChosen.name);
        expect(newFormFieldOptionArgs[4]).toBe(folderNotChosen);
        expect(form.show).toHaveBeenCalledWith('Choose a folder', 'OK');
        expect(promise.then).toHaveBeenCalled();
        expect(toggleLib.toggleFolder).toHaveBeenCalledWith(folderChosen);
    });
});
