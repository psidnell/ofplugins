var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var toggleLib = PlugIn.find("com.PaulSidnell.Toggle").library("toggleLib");

        var folder = folderNamed('Home');

        if (folder) {
            toggleLib.toggleFolderOrProject(folder);
        }
    });

    action.validate = (selection, sender) => {
        return (true);
    };

    return action;
})();
_;
