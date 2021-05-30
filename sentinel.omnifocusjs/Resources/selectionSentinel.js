var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var task = selection.tasks[0];

        var tagNameList = [];
        task.tags.forEach((tag)=>{
            tagNameList.push(tag.name);
        });
        var title = '➡️ ' + tagNameList.join(', ');

        var noteLines = [];
        task.tags.forEach((tag)=>{
            noteLines.push('omnifocus:///tag/' +  encodeURIComponent(tag.name));
        });
        var note = noteLines.join('\n');

        var taskCopy = duplicateTasks([task], task.containingProject)[0];
        taskCopy.name = title;
        taskCopy.repetitionRule = null;
        taskCopy.dueDate = null;
        taskCopy.addTag(Tag.forecastTag);
        taskCopy.note = note;
    });

    action.validate = (selection, sender) => {
        return selection.tasks
            && selection.tasks.length == 1
            && selection.tasks[0].containingProject != null
            && Tag.forecastTag != null
    };

    return action;
})();
_;
