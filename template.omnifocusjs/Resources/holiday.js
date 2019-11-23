var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var lib = PlugIn.find("com.PaulSidnell.Template").library("lib");

        var template = folderNamed('Work')
            .folderNamed('Templates')
            .projectNamed('Book ${Name} from ${From} to ${To} for ${Days} days');

        lib.expand(template);
    });

    action.validate = (selection, sender) => {
        return true;
    };

    return action;
})();
_;
