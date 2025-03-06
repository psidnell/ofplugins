var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var tags = [];
        var tasks = [];

        // Tags from any selected tasks
        selection.tasks.forEach(task => {
            tasks.push(task);
            task.tags.forEach(tag => {
                if (!tags.includes(tag)) {
                    tags.push(tag);
                }
            })
        });

        // Any selected tags
        selection.tags.forEach(tag => {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        });

        // Add sentinel tag
         var sentinelTagName = "/↔️";
         var sentinalTag = flattenedTags.byName(sentinelTagName) || new Tag(sentinelTagName);
         // tags.push(sentinalTag);

        var tagNameList = [];
        tags.forEach((tag)=>{
            if (tag != sentinalTag) {
                tagNameList.push(tag.name);
            }
        });
        var title = '↔️ ' + tagNameList.join(', ');

        var noteLines = [];
        tags.forEach((tag)=>{
            if (tag != sentinalTag) {
                noteLines.push(tag.name + ': omnifocus:///tag/' +  tag.id.primaryKey);
                noteLines.push('');
            }
        });
        tasks.forEach((task)=>{
           if (task.containingProject) {
             noteLines.push(task.containingProject.name + ': omnifocus:///project/' +
                task.containingProject.id.primaryKey);
                noteLines.push('');
           }
        });
        var note = noteLines.join('\n');

        var task = new Task(title, inbox.beginning);
        task.addTag(Tag.forecastTag);
        task.flagged = true;
        tags.forEach(tag => {
            task.addTag(tag);
        });
        task.note = note;
    });

    action.validate = (selection, sender) => {
        return selection.tasks.length >= 1 || selection.tags.length >= 1;
    };

    return action;
})();
_;
