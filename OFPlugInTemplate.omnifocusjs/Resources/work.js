var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var createDeactivatedTag = () => {

            var hiddenTagName = "HIDDEN";
            var hiddenTagGroup = tagNamed(hiddenTagName) || new Tag(hiddenTagName);

            var deactivatedTagName = "DEACTIVATED";
            var deactivatedTag = hiddenTagGroup.tagNamed(deactivatedTagName) || new Tag(deactivatedTagName, hiddenTagGroup);

            return deactivatedTag;
        };

        // TODO seems broken
        //var applicationLib = this.ApplicationLib;
        var applicationLib = PlugIn.find("ApplicationLib").library("ApplicationLib");

        var deactivatedTag = applicationLib.createDeactivatedTag();
        // var deactivatedTag = createDeactivatedTag();

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
