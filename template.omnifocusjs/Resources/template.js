var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var lib = PlugIn.find("com.PaulSidnell.Template").library("lib");

        // The selected project is the template to be used
        // TODO
        // Can't select a project on a phone yet
        // var template = selection.projects[0];
        var template = folderNamed('Work')
            .folderNamed('WebView')
            .projectNamed('${Ticket} - ${Description}');

        lib.expand(template);
    });

    action.validate = (selection, sender) => {
        // TODO
        // Can't select a project on a phone yet
        // return (selection.projects.length === 1)
        return true;
    };

    return action;
})();
_;
