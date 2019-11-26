describe('choose', () => {

    // Mock classes enough for
    PlugIn = function () {
    };

    library = {
    };

    lastPlugInAction = null;

    PlugIn.Action = function (fn) {
        this.fn = fn;
        lastPlugInAction = this;
    };

    Form = function () {
        //this.fields = [];
        this.addField = (field) => {
            //this.fields.push(field);
        };
        this.show = (formPrompt, buttonTitle) => {
            // return {
            //     then: () => {}
            // }
        };
    };

    Form.Field = function (fn) {
    };

    Form.Field.Option = function (fn) {
        this.fn = fn;
    };

    Folder = function () {
    };

    require('../../../toggle.omnifocusjs/Resources/choose.js');
    action = lastPlugInAction;

    it('can create action', () => {
        expect(action).toBeTruthy();
        expect(action.fn).toBeTruthy();
        expect(action.validate).toBeTruthy();
    });

    it('can validate', () => {
        expect(action.validate(null, null)).toBeTruthy();
    });

    it('can run when database empty', () => {
        var plugin = {};
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

    it('can run when no folders', () => {
        var plugin = {};
        var toggleLib = {};
        var notFolder = {};

        // Expectations
        library.apply = jasmine.createSpy('apply').and.callFake((fn) => {fn(notFolder)});
        PlugIn.find = jasmine.createSpy('find').and.returnValue(plugin);
        plugin.library = jasmine.createSpy('library').and.returnValue(toggleLib);

        // Test
        action.fn(null, null);

        // Verify
        expect(library.apply).toHaveBeenCalled();
    });

    it('can find a folder', () => {
        var plugin = {};
        var toggleLib = {};
        var folder = new Folder();
        var form = {};
        var option = {};

        // Expectations
        Form = jasmine.createSpy('Form').and.returnValue(form);
        Form.Field = {};
        Form.Field.Option = jasmine.createSpy('Option').and.returnValue(option);
        inputForm.addField = jasmine.createSpy('addField');

        library.apply = jasmine.createSpy('apply').and.callFake((fn) => {fn(folder)});
        PlugIn.find = jasmine.createSpy('find').and.returnValue(plugin);
        plugin.library = jasmine.createSpy('library').and.returnValue(toggleLib);

        // Test
        action.fn(null, null);

        // Verify
        expect(library.apply).toHaveBeenCalled();
    });
});
