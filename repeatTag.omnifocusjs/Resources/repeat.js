var _ = (function() {

    const tagName = "♻️";

    var applyTag = (taskOrProject, repeatTag) => {
        if (taskOrProject.repetitionRule) {
            if (!taskOrProject.tags.includes(repeatTag)) {
                console.log("Adding to: " + taskOrProject.name);
                taskOrProject.addTag(repeatTag);
            }
        } else {
            if (taskOrProject.tags.includes(repeatTag)) {
                console.log("Removing from: " + taskOrProject.name);
                taskOrProject.removeTag(repeatTag);
            }
        }
    }

    var applyToTask = (task, repeatTag) => {
        if (task.taskStatus != Task.Status.Completed && task.taskStatus != Task.Status.Dropped) {
            //console.log("Task: " + task.name);
            applyTag(task, repeatTag);
        }
    }

    var applyToProject = (project, repeatTag) => {
        if (project.taskStatus != Task.Status.Completed && project.taskStatus != Task.Status.Dropped) {
            //console.log("Project: " + project.name);
            applyTag(project, repeatTag);
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
	    var repeatTag = flattenedTags.byName(tagName) || new Tag(tagName, tags.end);

        selection.folders.forEach(folder => applyToFolder(folder, repeatTag));
        selection.projects.forEach(project => applyToProject(project, repeatTag));
        selection.tasks.forEach(task => applyToTask(task, repeatTag));

        console.log("Applied " + tagName);
	});

	action.validate = function(selection, sender){
	    return (selection.folders.length > 0) ||
	           (selection.projects.length > 0) ||
	           (selection.tasks.length > 0);
	};

	return action;
})();
_;
