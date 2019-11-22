var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var toggleLib = this.toggleLib;

        var deactivatedTag = toggleLib.createDeactivatedTag();

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
        
        var folder = folderNamed('Work');

        if (folder) {
            process(folder);
        }
    });

    action.validate = (selection, sender) => {
        return (true);
    };

    return action;
})();
_;
