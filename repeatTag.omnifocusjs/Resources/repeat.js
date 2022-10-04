var _ = (function() {

    var applyToTask = (task, repeatTag) => {
        if (task.taskStatus != Task.Status.Completed && task.taskStatus != Task.Status.Dropped) {
            //console.log("Task: " + task.name);
            if (task.repetitionRule) {
                task.addTag(repeatTag);
            } else {
                task.removeTag(repeatTag);
            }
        }
    }

    var applyToProject = (project, repeatTag) => {
        if (project.taskStatus != Task.Status.Completed && project.taskStatus != Task.Status.Dropped) {
            //console.log("Project: " + project.name);
            project.flattenedTasks.forEach(task => {
                applyToTask(task, repeatTag);
            });
        }
    }

    var applyToFolder = (folder, repeatTag) => {
        if (folder.status != Folder.Status.Dropped) {
            //console.log("Folder: " + folder.name);
            folder.flattenedProjects.forEach(project => {
                applyToProject(project, repeatTag);
            });
        }
    }

	var action = new PlugIn.Action(function(selection, sender){
	    var tagName = "♻";
	    var repeatTag = flattenedTags.byName(tagName) || new Tag(tagName, tags.end);

        if (selection.folders) {
            selection.folders.forEach(folder => applyToFolder(folder, repeatTag));
        }

        console.log("Applied " + tagName);
	});

	action.validate = function(selection, sender){
	    // TODO allow the selection of anything
	    // TODO push
	    return selection.folders && selection.folders.length > 0;
	};

	return action;
})();
_;
