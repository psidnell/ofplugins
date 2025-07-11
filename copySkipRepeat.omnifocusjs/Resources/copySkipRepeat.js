var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var task = selection.tasks[0];

        // Clear selection?
        document.windows[0].selectObjects([]);

        // Create new task
        var dest = task.containingProject ? task.containingProject : inbox.ending;
        var taskCopy = duplicateTasks([task], dest)[0];
        taskCopy.name = taskCopy.name + ' (copy)';
        taskCopy.repetitionRule = null;

        // Complete the current one
        task.markComplete();

        document.windows[0].selectObjects([taskCopy]);
    });

    action.validate = (selection, sender) => {
        return selection.tasks
            && selection.tasks.length == 1
            && selection.tasks[0].repetitionRule != null
            /*&& selection.tasks[0].containingProject != null*/
    };

    return action;
})();
_;
