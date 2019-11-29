var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var toggleLib = PlugIn.find('com.PaulSidnell.Toggle').library('toggleLib');

        var folder = selection.folders[0];

        toggleLib.toggleFolder(folder, true);
    });

    action.validate = (selection, sender) => {
        return selection.folders.length === 1 &&
            selection.folders[0].active;
    };

    return action;
})();
_;
