var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var task = selection.tasks[0];
        var taskCopy = duplicateTasks([task], task.containingProject)[0];
        taskCopy.name = taskCopy.name + ' (copy)';
        taskCopy.repetitionRule = null;
    });

    action.validate = (selection, sender) => {
        return selection.tasks
            && selection.tasks.length == 1
            && selection.tasks[0].repetitionRule != null
            && selection.tasks[0].containingProject != null
    };

    return action;
})();
_;
