var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var lib = PlugIn.find("com.PaulSidnell.Template").library("lib");

        var template = folderNamed('Work')
            .folderNamed('Templates')
            .projectNamed('WebView Release ${Version}');

        lib.expand(template);
    });

    action.validate = (selection, sender) => {
        return true;
    };

    return action;
})();
_;
