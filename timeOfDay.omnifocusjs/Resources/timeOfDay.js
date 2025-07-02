var _ = (function() {

    var isToday = function(date) {
        var today = new Date()
        return date &&
            date.getFullYear() == today.getFullYear() &&
            date.getMonth() == today.getMonth() &&
            date.getDate() == today.getDate();
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
        var anytimeTag = flattenedTags.byName("ANYTIME") || new Tag("ANYTIME");
        var maybeTag = flattenedTags.byName("MAYBE") || new Tag("MAYBE");
        var forecastTag = Tag.forecastTag;

        var timeTags = [
            earlyTag,
            amTag,
            pmTag,
            eveningTag,
            allDayTag
        ];

        flattenedTasks.forEach(task => {

            // Items with a due of today
            if (task.taskStatus != Task.Status.Blocked &&
                task.taskStatus != Task.Status.Dropped &&
                task.taskStatus != Task.Status.Completed &&
                isToday(task.effectiveDueDate)) {

                var hour = task.effectiveDueDate.getHours();
                var minute = task.effectiveDueDate.getMinutes();

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

               if (task.tags.indexOf(forecastTag) == -1) {
                   task.addTag(forecastTag);
               }
            }

            // Items flagged or with today tag
            if (task.taskStatus != Task.Status.Blocked &&
                task.taskStatus != Task.Status.Dropped &&
                task.taskStatus != Task.Status.Completed &&
                (!task.effectiveDueDate || !isToday(task.effectiveDueDate)) &&
                task.tags.indexOf(allDayTag) == -1 &&
                task.tags.indexOf(earlyTag) == -1 &&
                task.tags.indexOf(amTag) == -1 &&
                task.tags.indexOf(pmTag) == -1 &&
                task.tags.indexOf(eveningTag) == -1 &&
                task.tags.indexOf(anytimeTag) == -1 &&
                task.tags.indexOf(maybeTag) == -1 &&
                (task.tags.indexOf(forecastTag) != -1 || task.flagged)) {

                if (task.tags.indexOf(anytimeTag) == -1) {
                    task.addTag(anytimeTag);
                }

                if (task.tags.indexOf(forecastTag) == -1) {
                    task.addTag(forecastTag);
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
