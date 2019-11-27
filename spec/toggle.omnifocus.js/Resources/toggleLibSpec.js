describe('toggleLib', () => {

    var toggleLib;
    var factoryLib;

    beforeEach(() => {
        // Mock enough for creating the plugin and loading libraries

        factoryLib = {
        };

        var libs = {
            factoryLib: factoryLib,
        };

        var plugIn = {
            library: (name) => libs[name]
        };

        PlugIn = class {
        };

        PlugIn.find = (pluginName) => plugIn;

        Version = function (version) {
            this.version = version;
        };

        PlugIn.Library = function (version) {
            this.version = version;
            toggleLib = this;
        };

        Tag = function(tagName) {
            this.name = tagName;
        };

        Project = class {
        };

        Project.Status = {
            Active: 'Active',
            OnHold: 'OnHold'
        };

        URL = class {
        };

        require('../../../toggle.omnifocusjs/Resources/toggleLib.js');

        // Clean the lib in the required code to prevent previous values affecting tests
        toggleLib._factoryLib = null;
    });

    it('can use mocks', () => {
        var lib = PlugIn.find('com.PaulSidnell.Toggle').library('factoryLib');
        expect(lib).toBe(factoryLib);
    });

    it('can create library', () => {
        expect(toggleLib).toBeTruthy();
        expect(toggleLib.version).toBeTruthy();
        expect(toggleLib.version.version).toBe('0.1')
    });

    it('can load factoryLib', () => {
        expect(toggleLib._factoryLib).toBeFalsy();

        var result = toggleLib.factoryLib();

        expect(result).toBe(factoryLib);
        expect(toggleLib._factoryLib).toBe(factoryLib);
    });

    it('can load create Deactivated tag when ON-HOLD and DEACTIVATED already exists', () => {
        var hiddenTagGroup = new Tag('ON-HOLD');
        var deactivatedTag = new Tag('DEACTIVATED');

        // Expectations
        tagNamed = jasmine.createSpy('tagNamed').and.returnValue(hiddenTagGroup);
        hiddenTagGroup.tagNamed = jasmine.createSpy('tagNamed').and.returnValue(deactivatedTag);

        // Test
        var result = toggleLib.createDeactivatedTag();

        // Verify
        expect(result).toBe(deactivatedTag);
        expect(tagNamed).toHaveBeenCalledWith('ON-HOLD');
        expect(hiddenTagGroup.tagNamed).toHaveBeenCalledWith('DEACTIVATED');
    });

    it('can load create Deactivated tag when ON-HOLD already exists', () => {
        var onHoldTag = new Tag('ON-HOLD');
        var deactivatedTag = new Tag('DEACTIVATED');

        // Expectations
        tagNamed = jasmine.createSpy('tagNamed').and.returnValue(onHoldTag);
        onHoldTag.tagNamed = jasmine.createSpy('tagNamed').and.returnValue(null);
        factoryLib.newTag = jasmine.createSpy('newTag').and.returnValue(deactivatedTag);

        // Test
        var result = toggleLib.createDeactivatedTag();

        // Verify
        expect(result).toBe(deactivatedTag);
        expect(tagNamed).toHaveBeenCalledWith('ON-HOLD');
        expect(onHoldTag.tagNamed).toHaveBeenCalledWith('DEACTIVATED');
        expect(factoryLib.newTag).toHaveBeenCalledWith('DEACTIVATED', onHoldTag);
    });

    it('can load create Deactivated tag when no tags exists', () => {
        var onHoldTag = new Tag('ON-HOLD');
        var deactivatedTag = new Tag('DEACTIVATED');

        // Expectations
        tagNamed = jasmine.createSpy('tagNamed').and.returnValue(null);
        onHoldTag.tagNamed = jasmine.createSpy('tagNamed').and.returnValue(null);
        factoryLib.newTag = jasmine.createSpy('newTag').and.callFake((name) => {
            if (name === 'ON-HOLD') {
                return onHoldTag;
            } else if (name === 'DEACTIVATED') {
                return deactivatedTag;
            }
        });

        // Test
        var result = toggleLib.createDeactivatedTag();

        // Verify
        expect(result).toBe(deactivatedTag);
        expect(tagNamed).toHaveBeenCalledWith('ON-HOLD');
        expect(onHoldTag.tagNamed).toHaveBeenCalledWith('DEACTIVATED');
        expect(factoryLib.newTag).toHaveBeenCalledWith('ON-HOLD');
        expect(factoryLib.newTag).toHaveBeenCalledWith('DEACTIVATED', onHoldTag);
    });

    it('doesn\'t change a node of the wrong type', () => {
        var child = {};
        child.status = null;

        // Test
        toggleLib.toggle(child, null);

        // Verify
        expect(child.status).toBe(null);
    });

    it('doesn\'t change a project with the wrong status', () => {
        var child = new Project();
        child.status = null;

        // Test
        toggleLib.toggle(child, null);

        // Verify
        expect(child.status).toBe(null);
    });

    it('doesn\'t activate a project without the deactivated tag', () => {
        var child = new Project();
        child.status = Project.Status.OnHold;
        child.task = {
            tags: []
        };

        // Test
        toggleLib.toggle(child, null);

        // Verify
        expect(child.status).toBe(Project.Status.OnHold);
    });

    it('can activate a project with the correct type, status and tag', () => {
        var deactivatedTag = new Tag('');
        var child = new Project();
        child.status = Project.Status.OnHold;
        child.task = {
            tags: [deactivatedTag]
        };

        // Expectations
        child.task.removeTag = jasmine.createSpy('removeTag');

        // Test
        toggleLib.toggle(child, deactivatedTag);

        // Verify
        expect(child.task.removeTag).toHaveBeenCalledWith(deactivatedTag);
        expect(child.status).toBe(Project.Status.Active);
    });

    it('can deactivate a project with the correct type and status', () => {
        var deactivatedTag = new Tag('');
        var child = new Project();
        child.status = Project.Status.Active;
        child.task = {
            tags: []
        };

        // Expectations
        child.task.addTag = jasmine.createSpy('addTag');

        // Test
        toggleLib.toggle(child, deactivatedTag);

        // Verify
        expect(child.status).toBe(Project.Status.OnHold);
        expect(child.task.addTag).toHaveBeenCalledWith(deactivatedTag);
    });

    it('can toggle a folder', () => {
        var onHoldTag = new Tag('ON-HOLD');
        var deactivatedTag = new Tag('DEACTIVATED');
        var folder = {};
        folder.name = 'fname with a spece';
        var child = new Project();
        child.status = Project.Status.Active;
        child.task = {
            tags: []
        };
        var url = new URL();

        // Expectations
        tagNamed = jasmine.createSpy('tagNamed').and.returnValue(onHoldTag);
        onHoldTag.tagNamed = jasmine.createSpy('tagNamed').and.returnValue(null);
        factoryLib.newTag = jasmine.createSpy('newTag').and.returnValue(deactivatedTag);
        folder.apply = jasmine.createSpy('apply').and.callFake(fn => fn(child));
        child.task.addTag = jasmine.createSpy('addTag');
        URL.fromString = jasmine.createSpy('fromString').and.returnValue(url);
        url.call = jasmine.createSpy('open');

        // Test
        toggleLib.toggleFolder(folder);

        // Verify
        expect(folder.apply).toHaveBeenCalled();
        expect(child.status).toBe(Project.Status.OnHold);
        expect(child.task.addTag).toHaveBeenCalledWith(deactivatedTag);
        expect(URL.fromString).toHaveBeenCalledWith('omnifocus:///folder/' + encodeURIComponent(folder.name));
        expect(url.call).toHaveBeenCalled();
    });
});
