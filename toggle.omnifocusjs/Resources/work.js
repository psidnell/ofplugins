var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var toggleLib = PlugIn.find("com.PaulSidnell.Toggle").library("lib");

        var folder = folderNamed('Work');

        if (folder) {
            toggleLib.toggleFolder(folder);
        }
    });

    action.validate = (selection, sender) => {
        return (true);
    };

    return action;
})();
_;
