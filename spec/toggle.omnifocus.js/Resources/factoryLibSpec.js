describe('factoryLib', () => {

    var factoryLib;

    beforeEach(() => {
        // Mock enough for creating the plugin and loading libraries

        PlugIn = class {
        };

        Version = function (version) {
            this.version = version;
        };

        PlugIn.Library = function (version) {
            this.version = version;
            factoryLib = this;
        };

        Form = class {
        };

        Form.Field = class {
        };

        Form.Field.Option = function(fieldName, label, objects, objectLabels, defaultObject) {
            this.fieldName = fieldName;
            this.label = label;
            this.objects = objects;
            this.objectLabels = objectLabels;
            this.defaultObject = defaultObject;
        };

        Tag = function (tagName) {
            this.name = tagName;
        };

        require('../../../toggle.omnifocusjs/Resources/factoryLib.js');
    });

    it('can create library', () => {
        expect(factoryLib).toBeTruthy();
        expect(factoryLib.version).toBeTruthy();
        expect(factoryLib.version.version).toBe('0.1')
    });

    it('can create create new Version', () => {
        var version = factoryLib.newVersion('1.2.3');
        expect(version instanceof Version).toBeTruthy();
        expect(version.version).toBe('1.2.3');
    });

    it('can create create new Option', () => {
        var fieldName = 'fn';
        var label = 'lbl';
        var objects = [];
        var objectLabels = [];
        var defaultObject = {};

        var option = factoryLib.newFormFieldOption(fieldName, label, objects, objectLabels, defaultObject);

        expect(option instanceof Form.Field.Option).toBeTruthy();
        expect(option.fieldName).toBe(fieldName);
        expect(option.label).toBe(label);
        expect(option.objects).toBe(objects);
        expect(option.objectLabels).toBe(objectLabels);
        expect(option.defaultObject).toBe(defaultObject);
    });

    it('can create create new Tag', () => {
        var name = 'tn';

        var tag = factoryLib.newTag(name);

        expect(tag instanceof Tag).toBeTruthy();
        expect(tag.name).toBe(name);
    });

    it('can create create new Form', () => {

        var form = factoryLib.newForm();

        expect(form instanceof Form).toBeTruthy();
    });
});
