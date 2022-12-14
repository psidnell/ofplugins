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
        var monthTag = {
            name: "Mock Tag"
        };
        var task = {
            name: "Mock Task",
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

    it('can not assign a month tag if already assigned', () => {
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

    it('can set a date to be the start of the day', () => {
        //Given
        let now = new Date();

        //When
        var result = lib.setDateToStartOfDay(new Date(now.getTime()));

        //Then
        expect(result.getFullYear()).toBe(now.getFullYear());
        expect(result.getMonth()).toBe(now.getMonth());
        expect(result.getDate()).toBe(now.getDate());
        expect(result.getDay()).toBe(now.getDay());
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
    });

    it.each([
        ['13 Dec 2022 00:00:00 GMT', '13 Dec 2022 00:00:00 GMT', 0],
        ['13 Dec 2022 00:00:00 GMT', '13 Dec 2022 23:59:59 GMT', 0],
        ['13 Dec 2022 00:01:00 GMT', '13 Dec 2022 02:00:00 GMT', 0],
        ['13 Dec 2022 00:00:00 GMT', '14 Dec 2022 00:00:00 GMT', 1],
        ['13 Dec 2022 23:59:00 GMT', '14 Dec 2022 00:00:00 GMT', 1],
        ['13 Dec 2022 00:00:00 GMT', '17 Dec 2022 00:00:00 GMT', 4],
    ])('can calculate the difference in days between dates', (ds1, ds2, expected) => {
        //Given
        var d1 = new Date(Date.parse(ds1));
        var d2 = new Date(Date.parse(ds2));

        //When
        var diff = lib.daysBetween(d1, d2);

        //Then
        expect(diff).toBe(expected);
    });

    it.each([
        // Dec 12 2022 is a Mon
        ['12 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT'],
        ['13 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT'],
        ['14 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT'],
        ['15 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT'],
        ['16 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT'],
        ['17 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT'],
        ['18 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT'],
        // Dec 19 2022 is a Mon
        ['19 Dec 2022 00:00:00 GMT', '19 Dec 2022 00:00:00 GMT'],
    ])('can find the start of the week', (ds, sowDs) => {
        //Given
        var date = new Date(Date.parse(ds));
        var expectedStartOfWeek = new Date(Date.parse(sowDs));

        //When
        var startOfWeek = lib.startOfWeekOf(date);

        //Then
        expect(startOfWeek).toEqual(expectedStartOfWeek);
    });

    it('can apply a tag if required and missing', () => {
        //Given
        const task = {
            tags: [],
            addTag: jest.fn((tag) => null)
        };
        const tag = {};

        //When
        lib.applyTagIf(true, task, tag);

        //Then
        expect(task.addTag.mock.calls[0][0]).toBe(tag);
    });

    it('can do nothing if a tag if required and present', () => {
        //Given
        const tag = {};

        const task = {
            tags: [tag],
            addTag: jest.fn((tag) => null)
        };


        //When
        lib.applyTagIf(true, task, tag);

        //Then
        expect(task.addTag.mock.calls.length).toBe(0);
    });

    it('can remove a tag if not required', () => {
        //Given
        const tag = {};

        const task = {
            tags: [tag],
            addTag: jest.fn((tag) => null)
        };

        lib.removeTags = jest.fn((task, tags) => null)

        //When
        lib.applyTagIf(false, task, tag);

        //Then
        expect(task.addTag.mock.calls.length).toBe(0);

        expect(lib.removeTags.mock.calls[0][0]).toBe(task);
        expect(lib.removeTags.mock.calls[0][1]).toEqual([tag]);
    });

    it.each([
        // Dec 10 2022 is a Sat
        ['10 Dec 2022 00:00:00 GMT', '10 Dec 2022 00:00:00 GMT', 0],
        ['10 Dec 2022 00:00:00 GMT', '11 Dec 2022 00:00:00 GMT', 0],
        ['10 Dec 2022 00:00:00 GMT', '12 Dec 2022 23:59:59 GMT', 1],
        ['10 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT', 1],
        // Dec 12 2022 is a Mon
        ['12 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT', 0],
        ['12 Dec 2022 00:00:00 GMT', '13 Dec 2022 00:00:00 GMT', 0],
        ['12 Dec 2022 00:00:00 GMT', '14 Dec 2022 00:00:00 GMT', 0],
        ['12 Dec 2022 00:00:00 GMT', '15 Dec 2022 00:00:00 GMT', 0],
        ['12 Dec 2022 00:00:00 GMT', '16 Dec 2022 00:00:00 GMT', 0],
        ['12 Dec 2022 00:00:00 GMT', '17 Dec 2022 00:00:00 GMT', 0],
        ['12 Dec 2022 00:00:00 GMT', '18 Dec 2022 00:00:00 GMT', 0],
        ['12 Dec 2022 00:00:00 GMT', '18 Dec 2022 23:59:59 GMT', 0],
        ['12 Dec 2022 00:00:00 GMT', '19 Dec 2022 00:00:00 GMT', 1],
    ])('can calculate week difference', (today, future, difference) => {
        //Given
        var currentDate = new Date(Date.parse(today));
        var futureDate = new Date(Date.parse(future));

        //When
        var result = lib.weekDifference(currentDate, futureDate);

        //Then
        expect(result).toBe(difference);
    });

    it.each([
        ['12 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '12 Dec 2022 23:59:59 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '13 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '13 Dec 2022 23:59:59 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '14 Dec 2022 00:00:00 GMT', false],
    ])('can apply tomorrow tag', (today, defer, isTomorrow) => {
        //Given
        var currentDate = new Date(Date.parse(today));
        var deferDate = new Date(Date.parse(defer));

        var tomorrowTag = {is:"tomorrowTag"};
        var weekendTag = {is:"weekendTag"};
        var nextWeekEndTag = {is:"nextWeekEndTag"}
        var thisWeekTag = {is:"thisWeekTag"};
        var nextWeekTag = {is:"nextWeekTag"};

        const task = {
            effectiveDeferDate: deferDate
        };

        lib.applyTagIf = jest.fn((apply, task, tag) => null)

        //When
        lib.assignWeekTags(task, currentDate, tomorrowTag, weekendTag, nextWeekEndTag, thisWeekTag, nextWeekTag);

        //Then
        expect(lib.applyTagIf.mock.calls[0][0]).toBe(isTomorrow);
        expect(lib.applyTagIf.mock.calls[0][1]).toBe(task);
        expect(lib.applyTagIf.mock.calls[0][2]).toBe(tomorrowTag);
        expect(lib.applyTagIf.mock.calls.length).toBe(5);
    });

    it.each([
        // Dec 12 2022 is a Mon
        // The current week
        ['12 Dec 2022 00:00:00 GMT', false],
        ['13 Dec 2022 00:00:00 GMT', false],
        ['14 Dec 2022 00:00:00 GMT', false],
        ['15 Dec 2022 00:00:00 GMT', false],
        ['16 Dec 2022 00:00:00 GMT', false],
        ['17 Dec 2022 00:00:00 GMT', true],
        ['18 Dec 2022 00:00:00 GMT', true],
    ])('can detect a weekend', (today, isWeekend) => {
        //Given
        var currentDate = new Date(Date.parse(today));

        //When
        var result = lib.isWeekend(currentDate);

        //Then
        expect(result).toBe(isWeekend);
    });

    it.each([
        // Dec 12 2022 is a Mon
        ['11 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT', false],
        // The current week
        ['12 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '13 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '14 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '15 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '16 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '17 Dec 2022 00:00:00 GMT', false],
    ])('can apply this week tag', (today, defer, isThisWeek) => {
        //Given
        var currentDate = new Date(Date.parse(today));
        var deferDate = new Date(Date.parse(defer));

        var tomorrowTag = {is:"tomorrowTag"};
        var weekendTag = {is:"weekendTag"};
        var nextWeekEndTag = {is:"nextWeekEndTag"}
        var thisWeekTag = {is:"thisWeekTag"};
        var nextWeekTag = {is:"nextWeekTag"};

        const task = {
            effectiveDeferDate: deferDate
        };

        lib.applyTagIf = jest.fn((apply, task, tag) => null)

        //When
        lib.assignWeekTags(task, currentDate, tomorrowTag, weekendTag, nextWeekEndTag, thisWeekTag, nextWeekTag);

        //Then
        expect(lib.applyTagIf.mock.calls[1][0]).toBe(isThisWeek);
        expect(lib.applyTagIf.mock.calls[1][1]).toBe(task);
        expect(lib.applyTagIf.mock.calls[1][2]).toBe(thisWeekTag);
        expect(lib.applyTagIf.mock.calls.length).toBe(5);
    });

    it.each([
        // Dec 12 2022 is a Mon
        // The current week
        ['12 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '13 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '14 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '15 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '16 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '17 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '18 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '19 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '20 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '21 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '22 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '23 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '24 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '25 Dec 2022 00:00:00 GMT', false],
    ])('can apply next week tag', (today, defer, isThisWeek) => {
        //Given
        var currentDate = new Date(Date.parse(today));
        var deferDate = new Date(Date.parse(defer));

        var tomorrowTag = {is:"tomorrowTag"};
        var weekendTag = {is:"weekendTag"};
        var nextWeekEndTag = {is:"nextWeekEndTag"}
        var thisWeekTag = {is:"thisWeekTag"};
        var nextWeekTag = {is:"nextWeekTag"};

        const task = {
            effectiveDeferDate: deferDate
        };

        lib.applyTagIf = jest.fn((apply, task, tag) => null)

        //When
        lib.assignWeekTags(task, currentDate, tomorrowTag, weekendTag, nextWeekEndTag, thisWeekTag, nextWeekTag);

        //Then
        expect(lib.applyTagIf.mock.calls[2][0]).toBe(isThisWeek);
        expect(lib.applyTagIf.mock.calls[2][1]).toBe(task);
        expect(lib.applyTagIf.mock.calls[2][2]).toBe(nextWeekTag);
        expect(lib.applyTagIf.mock.calls.length).toBe(5);
    });

    it.each([
        // Dec 12 2022 is a Mon
        ['10 Dec 2022 00:00:00 GMT', '10 Dec 2022 00:00:00 GMT', true],
        ['10 Dec 2022 00:00:00 GMT', '11 Dec 2022 00:00:00 GMT', true],
        // The current week
        ['12 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '13 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '14 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '15 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '16 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '17 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '18 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '19 Dec 2022 00:00:00 GMT', false],
    ])('can apply this weekend tag', (today, defer, isThisWeek) => {
        //Given
        var currentDate = new Date(Date.parse(today));
        var deferDate = new Date(Date.parse(defer));

        var tomorrowTag = {is:"tomorrowTag"};
        var weekendTag = {is:"weekendTag"};
        var nextWeekEndTag = {is:"nextWeekEndTag"}
        var thisWeekTag = {is:"thisWeekTag"};
        var nextWeekTag = {is:"nextWeekTag"};

        const task = {
            effectiveDeferDate: deferDate
        };

        lib.applyTagIf = jest.fn((apply, task, tag) => null)

        //When
        lib.assignWeekTags(task, currentDate, tomorrowTag, weekendTag, nextWeekEndTag, thisWeekTag, nextWeekTag);

        //Then
        expect(lib.applyTagIf.mock.calls[3][0]).toBe(isThisWeek);
        expect(lib.applyTagIf.mock.calls[3][1]).toBe(task);
        expect(lib.applyTagIf.mock.calls[3][2]).toBe(weekendTag);
        expect(lib.applyTagIf.mock.calls.length).toBe(5);
    });

    it.each([
        // Dec 12 2022 is a Mon
        ['10 Dec 2022 00:00:00 GMT', '10 Dec 2022 00:00:00 GMT', false],
        ['10 Dec 2022 00:00:00 GMT', '11 Dec 2022 00:00:00 GMT', false],
        // The current week
        ['12 Dec 2022 00:00:00 GMT', '12 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '13 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '14 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '15 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '16 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '17 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '18 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '19 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '20 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '21 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '22 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '23 Dec 2022 00:00:00 GMT', false],
        ['12 Dec 2022 00:00:00 GMT', '24 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '25 Dec 2022 00:00:00 GMT', true],
        ['12 Dec 2022 00:00:00 GMT', '26 Dec 2022 00:00:00 GMT', false],
    ])('can apply next weekend tag', (today, defer, isThisWeek) => {
        //Given
        var currentDate = new Date(Date.parse(today));
        var deferDate = new Date(Date.parse(defer));

        var tomorrowTag = {is:"tomorrowTag"};
        var weekendTag = {is:"weekendTag"};
        var nextWeekEndTag = {is:"nextWeekEndTag"}
        var thisWeekTag = {is:"thisWeekTag"};
        var nextWeekTag = {is:"nextWeekTag"};

        const task = {
            effectiveDeferDate: deferDate
        };

        lib.applyTagIf = jest.fn((apply, task, tag) => null)

        //When
        lib.assignWeekTags(task, currentDate, tomorrowTag, weekendTag, nextWeekEndTag, thisWeekTag, nextWeekTag);

        //Then
        expect(lib.applyTagIf.mock.calls[4][0]).toBe(isThisWeek);
        expect(lib.applyTagIf.mock.calls[4][1]).toBe(task);
        expect(lib.applyTagIf.mock.calls[4][2]).toBe(nextWeekEndTag);
        expect(lib.applyTagIf.mock.calls.length).toBe(5);
    });
});