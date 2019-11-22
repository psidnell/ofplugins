/*{
    "type": "action",
    "targets": ["omnifocus"],
    "author": "Paul Sidnell",
    "identifier": "Home-Toggle.omnijs",
    "version": "1.0",
    "description": "Activate/Deactivate 'Home' Folder and nested projects",
    "label": "Home Toggle",
    "shortLabel": "Home Toggle"
}*/
(() => {
    var action = new PlugIn.Action((selection, sender) => {
        
        var hiddenTagName = "HIDDEN";
        var hiddenTagGroup = tagNamed(hiddenTagName) || new Tag(hiddenTagName);
    
        var deactivatedTagName = "DEACTIVATED";
        var deactivatedTag = hiddenTagGroup.tagNamed(deactivatedTagName) || new Tag(deactivatedTagName, hiddenTagGroup);
    
        var toggle = function(child) {
            if (child instanceof Project) {
                if (child.status === Project.Status.OnHold
                    && child.task.tags.includes(deactivatedTag)) {
                    child.task.removeTag(deactivatedTag);
                    child.status = Project.Status.Active;
                } else if ( child.status === Project.Status.Active) {
                    child.task.addTag(deactivatedTag);
                    child.status = Project.Status.OnHold;
                }
            }
        };
        
        var process = function(folder) {
            folder.apply(child => {
                toggle(child);
            });
        };
        
        var folder = folderNamed('Home');

        if (folder) {
            process(folder);
        }
    });

    action.validate = (selection, sender) => {
        return (true);
    };

    return action;
})();
