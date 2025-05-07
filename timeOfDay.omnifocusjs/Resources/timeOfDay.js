var _ = (function() {

    var isToday = function(date) {
        var today = new Date()
        return date &&
            date.getFullYear() == today.getFullYear() &&
            date.getMonth() == today.getMonth() &&
            date.getDate() == today.getDate();
    }

    var isEarly = function(date) {
        var today = new Date()
        return date &&
            date.getFullYear() == today.getFullYear() &&
            date.getMonth() == today.getMonth() &&
            date.getDate() == today.getDate() &&
            date.getHours() < 9;
    }

    var action = new PlugIn.Action(function(selection, sender){

        flattenedTasks.forEach(task => {
            if (task.taskStatus != Task.Status.Blocked &&
                task.taskStatus != Task.Status.Dropped &&
                task.taskStatus != Task.Status.Completed &&
                isToday(task.effectiveDueDate)) {


                    var hour = task.effectiveDueDate.getHours();
                    var minute = task.effectiveDueDate.getMinutes();

                    var earlyTag = flattenedTags.byName("EARLY") || new Tag("EARLY");
                    var amTag = flattenedTags.byName("AM") || new Tag("AM");
                    var pmTag = flattenedTags.byName("PM") || new Tag("PM");
                    var eveningTag = flattenedTags.byName("EVENING") || new Tag("EVENING");
                    var allDayTag = flattenedTags.byName("ALL DAY") || new Tag("ALL DAY");

                    task.removeTags([
                        earlyTag,
                        amTag,
                        pmTag,
                        eveningTag,
                        allDayTag
                    ]);

                    if (hour < 9) {
                        task.addTag(earlyTag);
                    } else if (hour < 12) {
                        task.addTag(amTag);
                    } else if (hour < 18) {
                        task.addTag(pmTag);
                    } else if (hour < 23 || (hour == 23 && minute < 59)) {
                        task.addTag(eveningTag);
                    } else {
                        task.addTag(allDayTag);
                    }


            }
        });
	});

	action.validate = function(selection, sender){
		return true;
	};

	return action;
})();
_;
