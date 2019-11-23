var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var toggleLib = PlugIn.find("com.PaulSidnell.Toggle").library("lib");

        var folder = selection.folders[0];

        toggleLib.toggleFolder(folder);
    });

    action.validate = (selection, sender) => {
        return (selection.folders.length === 1)
    };

    return action;
})();
_;