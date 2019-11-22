var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var lib = PlugIn.find("com.PaulSidnell.Template").library("lib");

        var template = selection.projects[0];

        lib.expand(template);
    });

    action.validate = (selection, sender) => {
        return (selection.projects.length === 1)
    };

    return action;
})();
_;
