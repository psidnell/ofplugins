var _ = function() {
	var lib = new PlugIn.Library(new Version("0.1"));

    const ROOT_NAME = '/⏸️ DEFERRED';
    const YEARS_NAME = 'YEARS';
    const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const SUN = 0;
    const SAT = 6;
    const DAY = 24*60*60*1000;

    var started = -1;

    lib.t = () => {
        const now = new Date().getTime();

        if (started === -1) {
            started = now;
        }

        const result  = now - started;
        started = now;
        return result;
    }

    var idx = 0;
    const MONTH_ORDINALS = new Map(MONTH_NAMES.map(name => [name, idx++]));

    lib.findCreateSubTag = (parent, tagName) => {
        return parent.tagNamed(tagName) || new Tag(tagName, parent.ending);
    }

    lib.removeTags = (task, tagsToRemove) => {
        // seems MUCH faster than native method
        tagsToRemove.filter(tag => task.tags.includes(tag)).forEach(tag => task.removeTag(tag));
    }

    lib.findOrCreateMonthTag = (year, month, yearsTag) => {
        var yearName = '' + year;
        var monthName = MONTH_NAMES[month] + '-' + yearName;
        var yearTag = lib.findCreateSubTag(yearsTag, yearName);
        var monthTag = lib.findCreateSubTag(yearTag, monthName);
        return monthTag;
    }

    lib.assignMonth = (task, yearsTag) => {
        let now = new Date();
        var defer = task.effectiveDeferDate;
        var year = defer.getFullYear();
        var month = defer.getMonth();
        var monthTag = lib.findOrCreateMonthTag(year, month, yearsTag);
        if (!task.tags.includes(monthTag)) {
            console.log("Setting " + monthTag.name + " on " + task.name);
            lib.removeTags(task, yearsTag.flattenedChildren);
            task.addTag(monthTag, task.endingOfTags);
        }
    }

    lib.assignWeek = (task, tomorrowTag, weekendTag, nextWeekEndTag, thisWeekTag, nextWeekTag) => {
        let now = new Date();
        const defer = task.effectiveDeferDate;
        defer.setHours(0, 0, 0, 0);

        const today = now;
        today.setHours(0, 0, 0, 0);

        const dow = defer.getDay();
        const daysUntil = Math.floor((defer.getTime() - today.getTime()) / DAY);
        const dowSundayFix = dow == 0 ? 7 : dow;
        const offsetFromStartOfWeek = daysUntil - (dowSundayFix - 1);
        const weekOffset = Math.floor(offsetFromStartOfWeek / 7);
        // console.log(defer, weekOffset);

        if (daysUntil === 1) {
            if (!task.tags.includes(tomorrowTag)) {
                task.addTag(tomorrowTag);
            }
        } else {
            lib.removeTags(task, [tomorrowTag]);
        }

        if (weekOffset === 0 && dow !== SAT && dow !== SUN) {
            if (!task.tags.includes(thisWeekTag)) {
                task.addTag(thisWeekTag);
            }
        } else {
            lib.removeTags(task, [thisWeekTag]);
        }

        if (weekOffset === 1 && dow !== SAT && dow !== SUN) {
            if (!task.tags.includes(nextWeekTag)) {
                task.addTag(nextWeekTag);
            }
        } else {
            lib.removeTags(task, [nextWeekTag]);
        }

        if (weekOffset === -1 && (dow === SAT || dow === SUN)) {
            if (!task.tags.includes(weekendTag)) {
                task.addTag(weekendTag);
            }
        } else {
            lib.removeTags(task,[weekendTag]);
        }

        if (weekOffset === 0  && (dow === SAT || dow === SUN)) {
            if (!task.tags.includes(nextWeekEndTag)) {
                task.addTag(nextWeekEndTag);
            }
        } else {
            lib.removeTags(task,[nextWeekEndTag]);
        }
    }

    lib.ordinalOfMonth = (monthAndYear) => {
        var monthName = monthAndYear.split('-')[0];
        var ordinal = MONTH_ORDINALS.get(monthName);
        return ordinal ? ordinal : 0;
    }

    lib.sortMonths = (yearTag) => {
        var monthTags = yearTag.children
        if (monthTags.length > 1){
            monthTags.sort((a, b) => {
              var leftOrdinal = lib.ordinalOfMonth(a.name);
              var rightOrdinal = lib.ordinalOfMonth(b.name);
              if (leftOrdinal < rightOrdinal) {return -1;}
              if (leftOrdinal > rightOrdinal) {return 1;}
              return 0;
            })
            moveTags(monthTags, yearTag)
        }
    }

    lib.sortYearsTags = (yearsTag) => {
        var yearTags = yearsTag.children

        yearTags.forEach(yearTag => lib.sortMonths(yearTag));

        if (yearTags.length > 1){
            yearTags.sort((a, b) => {
              if (a.name < b.name) {return -1;}
              if (a.name > b.name) {return 1;}
              return 0;
            })
            moveTags(yearTags, yearsTag)
        }
    }

    lib.pruneMonths = (yearTag) => {
        var monthTags = yearTag.children;
        monthTags.forEach((monthTag) => {
            if(monthTag.remainingTasks.length == 0) {
                deleteObject(monthTag);
            }
        });
    }

    lib.pruneYearsTags = (yearsTag) => {
        var yearTags = yearsTag.children
        yearTags.forEach(yearTag => lib.pruneMonths(yearTag));
        yearTags.forEach((yearTag) => {
            if(yearTag.children.length == 0 && yearTag.remainingTasks.length == 0) {
                deleteObject(yearTag);
            }
        });
   }

    lib.process = (selection) => {
        started = -1;
        console.log(lib.t(), "Start Processing Defer Dates");
        var rootTag = flattenedTags.byName(ROOT_NAME) || new Tag(ROOT_NAME, tags.ending);
        var yearsTag = rootTag.flattenedTags.byName(YEARS_NAME) || new Tag(YEARS_NAME, rootTag.ending);

        let now = new Date().getTime();

        const deferredTasks = flattenedTasks.filter(
            task => task.taskStatus !== Task.Status.Completed
                && task.taskStatus !== Task.Status.Dropped
                && task.effectiveDeferDate
                && task.effectiveDeferDate.getTime()  > now);

        console.log(lib.t(), "Deferred tasks");

        const availableTasks = flattenedTasks.filter(
            task => task.taskStatus !== Task.Status.Completed
                && task.taskStatus !== Task.Status.Dropped
                && (!task.effectiveDeferDate || task.effectiveDeferDate.getTime()  <= now));

        console.log(lib.t(), "Available tasks");

        deferredTasks.forEach(task => lib.assignMonth(task, yearsTag));

        console.log(lib.t(), "Assigned Months");

        var tomorrowTag = lib.findCreateSubTag(rootTag, "TOMORROW");
        var weekendTag = lib.findCreateSubTag(rootTag, "THIS WEEKEND");
        var nextWeekTag = lib.findCreateSubTag(rootTag, "NEXT WEEK");
        var thisWeekTag = lib.findCreateSubTag(rootTag, "THIS WEEK");
        var nextWeekEndTag = lib.findCreateSubTag(rootTag, "NEXT WEEKEND");
        deferredTasks.forEach(task => lib.assignWeek(task, tomorrowTag, weekendTag, nextWeekEndTag, thisWeekTag, nextWeekTag));

        console.log(lib.t(), "Assigned Weeks");

        var tagsToRemove = rootTag.flattenedChildren;
        availableTasks.forEach(task => lib.removeTags(task, tagsToRemove));

        console.log(lib.t(), "Cleaned available");

        lib.sortYearsTags(yearsTag);

        console.log(lib.t(), "Sorted Tags");

        lib.pruneYearsTags(yearsTag);

        console.log(lib.t(), "Pruned Tags");

        console.log(lib.t(), "Finished Processing Defer Dates");
    }

	return lib;
}();
_;
