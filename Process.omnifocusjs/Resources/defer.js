var _ = function() {
	var lib = new PlugIn.Library(new Version("0.1"));

    const ROOT_NAME = 'DFR';
    const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    var idx = 0;
    const MONTH_ORDINALS = new Map(MONTH_NAMES.map(name => [name, idx++]));

    lib.findCreateSubTag = (parent, tagName) => {
        return parent.tagNamed(tagName) || new Tag(tagName, parent.ending);
    }

    lib.findOrCreateMonthTag = (year, month, rootTag) => {
        var yearName = '' + year;
        var monthName = MONTH_NAMES[month] + '-' + yearName;
        var yearTag = lib.findCreateSubTag(rootTag, yearName);
        var monthTag = lib.findCreateSubTag(yearTag, monthName);
        return monthTag;
    }

    lib.processTask = (task, rootTag) => {
        if (task.taskStatus != Task.Status.Completed && task.taskStatus != Task.Status.Dropped &&
            task.effectiveDeferDate != null &&
            task.effectiveDeferDate.getTime() >= new Date().getTime() ) {
            var defer = task.effectiveDeferDate;
            var year = defer.getFullYear();
            var month = defer.getMonth();
            var monthTag = lib.findOrCreateMonthTag(year, month, rootTag);
            if (!task.tags.includes(monthTag)) {
                console.log("Setting " + monthTag.name + " on " + task.name);
                task.removeTags(rootTag.flattenedChildren);
                task.addTag(monthTag, task.endingOfTags);
            }
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

    lib.sortYears = (rootTag) => {
        var yearTags = rootTag.children

        yearTags.forEach(yearTag => lib.sortMonths(yearTag));

        if (yearTags.length > 1){
            yearTags.sort((a, b) => {
              if (a.name < b.name) {return -1;}
              if (a.name > b.name) {return 1;}
              return 0;
            })
            moveTags(yearTags, rootTag)
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

    lib.pruneYears = (rootTag) => {
        var yearTags = rootTag.children
        yearTags.forEach(yearTag => lib.pruneMonths(yearTag));
        yearTags.forEach((yearTag) => {
            if(yearTag.children.length == 0) {
                deleteObject(yearTag);
            }
        });
   }

    lib.process = (selection) => {
        console.log("Start Processing Defer Dates");
        var rootTag = flattenedTags.byName(ROOT_NAME) || new Tag(ROOT_NAME, tags.ending);
        flattenedTasks.forEach(task => lib.processTask(task, rootTag));
        console.log("Finished Processing Defer Dates");

        lib.sortYears(rootTag);
        lib.pruneYears(rootTag);
    }

	return lib;
}();
_;
