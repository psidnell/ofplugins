var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var tags = [];

        // Tags from any selected tasks
        selection.tasks.forEach(task => {
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
        // var sentinelTagName = "/➡️";
        // var sentinalTag = flattenedTags.byName(sentinelTagName) || new Tag(sentinelTagName);
        // tags.push(sentinalTag);

        var tagNameList = [];
        tags.forEach((tag)=>{
            //if (tag != sentinalTag) {
                tagNameList.push(tag.name);
            //}
        });
        var title = '➡️ ' + tagNameList.join(', ');

        var noteLines = [];
        tags.forEach((tag)=>{
            //if (tag != sentinalTag) {
                noteLines.push('omnifocus:///tag/' +  encodeURIComponent(tag.name));
            //}
        });
        var note = noteLines.join('\n');

        var task = new Task(title, inbox.beginning);
        task.addTag(Tag.forecastTag);
        // task.flagged = true;
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
