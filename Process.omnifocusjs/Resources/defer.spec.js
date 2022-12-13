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

    it('can find a sub tag', () => {
        //Given
        const tagName = "tag name";
        const existingChildTag = {};
        const parent = {
            tagNamed: jest.fn((name) => existingChildTag)
        }

        //When
        var result = lib.findCreateSubTag(parent, tagName);

        //Then
        expect(result).toBe(existingChildTag)
        expect(parent.tagNamed.mock.calls[0][0]).toBe(tagName);
        expect(parent.tagNamed.mock.calls.length).toBe(1);
    });

    it('can create a sub tag', () => {
        //Given
        const tagName = "tag name";
        const parent = {
            tagNamed: jest.fn((name) => null),
            ending: "ending"
        };

        //When
        var createdTag = lib.findCreateSubTag(parent, tagName);

        //Then
        expect(createdTag.name).toBe(tagName);
        expect(createdTag.position).toBe(parent.ending);
        expect(parent.tagNamed.mock.calls[0][0]).toBe(tagName);
        expect(parent.tagNamed.mock.calls.length).toBe(1);
    });

    it('can remove a tag', () => {
        //Given

        var tag1 = {};
        var tag2 = {};
        var tag3 = {};

        var task = {
            tags: [tag1, tag2, tag3],
            removeTag: jest.fn((tag) => null)
        };

        //When
        lib.removeTags(task, [tag1, tag2]);

        //Then
        expect(task.removeTag.mock.calls.length).toBe(2);
        expect(task.removeTag.mock.calls[0][0]).toBe(tag1);
        expect(task.removeTag.mock.calls[1][0]).toBe(tag2);

    });

    it('can create a month tag', () => {
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

    it('can assign a month tag if not assigned', () => {
        //Given
        let now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var yearsTag = {
            flattenedChildren: []
        };
        var monthTag = {};
        var task = {
            effectiveDeferDate: new Date(),
            tags: [],
            addTag: jest.fn((tag) => null),
            endingOfTags: "ending"
        }
        lib.findOrCreateMonthTag = jest.fn((year, month, yearsTag) => monthTag)
        lib.removeTags = jest.fn((task, tagList) => null)

        //When
        lib.assignMonth(task, yearsTag);

        //Then
        expect(lib.findOrCreateMonthTag.mock.calls[0][0]).toBe(year);
        expect(lib.findOrCreateMonthTag.mock.calls[0][1]).toBe(month);
        expect(lib.findOrCreateMonthTag.mock.calls[0][2]).toBe(yearsTag);

        expect(lib.removeTags.mock.calls[0][0]).toBe(task);
        expect(lib.removeTags.mock.calls[0][1]).toBe(yearsTag.flattenedChildren);

        expect(task.addTag.mock.calls[0][0]).toBe(monthTag);
        expect(task.addTag.mock.calls[0][1]).toBe(task.endingOfTags);
    });

    it('can assign a month tag if already assigned', () => {
        //Given
        let now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var yearsTag = {
            flattenedChildren: []
        };
        var monthTag = {};
        var task = {
            effectiveDeferDate: new Date(),
            tags: [monthTag],
            addTag: jest.fn((tag) => null),
            endingOfTags: "ending"
        }
        lib.findOrCreateMonthTag = jest.fn((year, month, yearsTag) => monthTag)
        lib.removeTags = jest.fn((task, tagList) => null)

        //When
        lib.assignMonth(task, yearsTag);

        //Then
        expect(lib.findOrCreateMonthTag.mock.calls[0][0]).toBe(year);
        expect(lib.findOrCreateMonthTag.mock.calls[0][1]).toBe(month);
        expect(lib.findOrCreateMonthTag.mock.calls[0][2]).toBe(yearsTag);

        expect(lib.removeTags.mock.calls.length).toBe(0);
        expect(task.addTag.mock.calls.length).toBe(0);
    });

});