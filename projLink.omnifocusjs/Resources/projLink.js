var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var task = selection.tasks[0];
        if (!task.containingProject) {
            return;
        }
        var project = task.containingProject;
        var title = '🌀' + project.name;

        var noteLines = [];
        noteLines.push(task.containingProject.name + ': omnifocus:///project/' +
                task.containingProject.id.primaryKey);
        noteLines.push('');
        var note = noteLines.join('\n');

        var newTask = new Task(title, inbox.beginning);
        if (project) {
            moveTasks([newTask], project);
        }
        newTask.addTag(Tag.forecastTag);
        newTask.flagged = true;
        newTask.note = note;
    });

    action.validate = (selection, sender) => {
        return selection.tasks.length == 1
    };

    return action;
})();
_;
