var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var factoryLib = PlugIn.find("com.PaulSidnell.Toggle").library("factories");
        var toggleLib = PlugIn.find("com.PaulSidnell.Toggle").library("toggleLib" +
            "");

        var inputForm = new Form();

        // Find folders
        var folders = [];
        var names = [];
        library.apply(item => {
            if (item instanceof Folder) {
                folders.push(item);
                names.push(item.name);
            }
        });

        if (folders.length > 0) {
            // Choose which folder to toggle
            inputForm.addField(toggleLib.newFormFieldOption(
                "choice",
                "Folder",
                folders,
                names,
                folders[0]
            ));

            var formPrompt = "Choose a folder";
            var buttonTitle = "OK";
            inputForm.show(formPrompt, buttonTitle).then(
                (form) => toggleLib.toggleFolder(form.values['choice']),
                (error) => console.log(error));
        }
    });

    action.validate = (selection, sender) => {
        return true;
    };

    return action;
})();
_;
