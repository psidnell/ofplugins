var _ = (function() {

    var isToday = function(date) {
        var today = new Date()
        return date &&
            date.getFullYear() == today.getFullYear() &&
            date.getMonth() == today.getMonth() &&
            date.getDate() == today.getDate();
    }

    var isAvailable = function(task) {
        return (
            task.taskStatus != Task.Status.Blocked &&
            task.taskStatus != Task.Status.Dropped &&
            task.taskStatus != Task.Status.Completed);
        }

    var addTagExclusive = function(task, newTag, exclusiveTags) {
        // Avoid removing and re-adding the tag we want
        // so as to avoid re-ordering when using tags order
        // or unnecessarily re-order the tags
        var tagsToRemove = exclusiveTags.filter(t => t !== newTag);
        task.removeTags(tagsToRemove);
        if (task.tags.indexOf(newTag) == -1) {
            task.addTag(newTag);
        }
    }

    var action = new PlugIn.Action(function(selection, sender){

        var earlyTag = flattenedTags.byName("EARLY") || new Tag("EARLY");
        var amTag = flattenedTags.byName("AM") || new Tag("AM");
        var pmTag = flattenedTags.byName("PM") || new Tag("PM");
        var eveningTag = flattenedTags.byName("EVENING") || new Tag("EVENING");
        var allDayTag = flattenedTags.byName("ALL DAY") || new Tag("ALL DAY");

        var timeTags = [
            earlyTag,
            amTag,
            pmTag,
            eveningTag,
            allDayTag
        ];

        flattenedTasks.forEach(task => {
            // Not actually what I wanted, given likely default planned date
            //var taskDate = task.effectiveDueDate ? task.effectiveDueDate : task.effectivePlannedDate;
            var taskDate = task.effectiveDueDate;

            // Items with a due of today get a time of day tag
            if (isAvailable(task) &&
                isToday(taskDate)) {

                var hour = taskDate.getHours();
                var minute = taskDate.getMinutes();

                var newTag;
                if (hour < 9) {
                    newTag = earlyTag;
                } else if (hour < 12) {
                   newTag = amTag;
                } else if (hour < 18) {
                    newTag = pmTag;
                } else if (hour < 23 || (hour == 23 && minute < 59)) {
                    newTag = eveningTag;
                } else {
                    newTag = allDayTag;
                }

                addTagExclusive(task, newTag, timeTags);
            }
        });
	});

	action.validate = function(selection, sender){
		return true;
	};

	return action;
})();
_;
