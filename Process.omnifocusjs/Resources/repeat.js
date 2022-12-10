var _ = function() {
	var lib = new PlugIn.Library(new Version("0.1"));

    const tagName = "/♻️";

    lib.applyTag = (taskOrProject, repeatTag) => {
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

    lib.applyToTask = (task, repeatTag) => {
        if (task.taskStatus != Task.Status.Completed && task.taskStatus != Task.Status.Dropped) {
            //console.log("Task: " + task.name);
            lib.applyTag(task, repeatTag);
        }
    }

    lib.applyToProject = (project, repeatTag) => {
        if (project.taskStatus != Task.Status.Completed && project.taskStatus != Task.Status.Dropped) {
            //console.log("Project: " + project.name);
            lib.applyTag(project, repeatTag);
            project.flattenedTasks.forEach(task => {
                lib.applyToTask(task, repeatTag);
            });
        }
    }

    lib.applyToFolder = (folder, repeatTag) => {
        if (folder.status != Folder.Status.Dropped) {
            //console.log("Folder: " + folder.name);
            folder.flattenedProjects.forEach(project => {
                lib.applyToProject(project, repeatTag);
            });
        }
    }

    lib.process = (selection) => {
        var repeatTag = flattenedTags.byName(tagName) || new Tag(tagName, tags.end);
        flattenedTasks.forEach(task => lib.applyToTask(task, repeatTag));
        console.log("Applied " + tagName);
    }

	return lib;
}();
_;