var _ = function() {
	var lib = new PlugIn.Library(new Version("0.1"));

    const ROOT_NAME = '/⏸️ DEFERRED';
    const YEARS_NAME = 'YEARS';
    const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const DAY = 24*60*60*1000;

    var idx = 0;
    const MONTH_ORDINALS = new Map(MONTH_NAMES.map(name => [name, idx++]));

    lib.findCreateSubTag = (parent, tagName) => {
        return parent.tagNamed(tagName) || new Tag(tagName, parent.ending);
    }

    lib.findOrCreateMonthTag = (year, month, yearsTag) => {
        var yearName = '' + year;
        var monthName = MONTH_NAMES[month] + '-' + yearName;
        var yearTag = lib.findCreateSubTag(yearsTag, yearName);
        var monthTag = lib.findCreateSubTag(yearTag, monthName);
        return monthTag;
    }

    lib.assignMonth = (task, yearsTag) => {
        var defer = task.effectiveDeferDate;
        var year = defer.getFullYear();
        var month = defer.getMonth();
        var monthTag = lib.findOrCreateMonthTag(year, month, yearsTag);
        if (!task.tags.includes(monthTag)) {
            console.log("Setting " + monthTag.name + " on " + task.name);
            task.removeTags(yearsTag.flattenedChildren);
            task.addTag(monthTag, task.endingOfTags);
        }
    }

    lib.assignWeek = (task, rootTag) => {
        var weekendTag = lib.findCreateSubTag(rootTag, "WEEKEND");
        var nextWeekTag = lib.findCreateSubTag(rootTag, "NEXT WEEK");
        var thisWeekTag = lib.findCreateSubTag(rootTag, "THIS WEEK");

        var today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        var defer = task.effectiveDeferDate;
        defer.setUTCHours(0, 0, 0, 0);

        var dow = defer.getDay();
        var daysUntil = Math.ceil((defer.getTime() - today.getTime())/DAY);

        if (daysUntil < 7 && dow !== 0 && dow !== 6) {
            task.addTag(thisWeekTag);
        } else {
            task.removeTag(thisWeekTag);
        }

        if (daysUntil >= 7 && daysUntil <= 14 && dow !== 0 && dow !== 6) {
            task.addTag(nextWeekTag);
        } else {
            task.removeTag(nextWeekTag);
        }

        if (daysUntil < 7 && (dow === 0 || dow === 6)) {
            task.addTag(weekendTag);
            console.log("" + daysUntil + "/" + dow);
            console.log("Setting " + weekendTag.name + " on " + task.name);
        } else {
            task.removeTag(weekendTag);
        }

    }

    lib.assignTags = (task, rootTag, yearsTag) => {
        if (task.taskStatus != Task.Status.Completed && task.taskStatus != Task.Status.Dropped &&
            task.effectiveDeferDate != null &&
            task.effectiveDeferDate.getTime() >= new Date().getTime() ) {
            lib.assignMonth(task, yearsTag);
            lib.assignWeek(task, rootTag);

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

    lib.sortYears = (yearsTag) => {
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

    lib.pruneYears = (yearsTag) => {
        var yearTags = yearsTag.children
        yearTags.forEach(yearTag => lib.pruneMonths(yearTag));
        yearTags.forEach((yearTag) => {
            if(yearTag.children.length == 0 && yearTag.remainingTasks.length == 0) {
                deleteObject(yearTag);
            }
        });
   }

    lib.process = (selection) => {
        console.log("Start Processing Defer Dates");
        var rootTag = flattenedTags.byName(ROOT_NAME) || new Tag(ROOT_NAME, tags.ending);

        var yearsTag = rootTag.flattenedTags.byName(YEARS_NAME) || new Tag(YEARS_NAME, rootTag.ending);

        flattenedTasks.forEach(task => lib.assignTags(task, rootTag, yearsTag));

        lib.sortYears(yearsTag);
        lib.pruneYears(yearsTag);

        console.log("Finished Processing Defer Dates");
    }

	return lib;
}();
_;
