var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var toggleLib = PlugIn.find('com.PaulSidnell.Toggle').library('toggleLib');

        selection.folders.forEach(folder => {
            if (folder.active) {
                toggleLib.toggleFolder(folder, true);
            }
        });

    });

    action.validate = (selection, sender) => {
        return selection.folders.length > 0;
    };

    return action;
})();
_;
