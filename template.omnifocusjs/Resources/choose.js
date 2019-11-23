var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var lib = PlugIn.find("com.PaulSidnell.Template").library("lib");

        var inputForm = new Form();

        // Find templates
        var templates = [];
        var names = [];
        library.apply(item => {
            if (item instanceof Project && item.name.indexOf('${') != -1) {
                templates.push(item);
                names.push(item.name);
            }
        });

        if (templates.length > 0) {
            // Choose which template to expand
            inputForm.addField(new Form.Field.Option(
                "choice",
                "Template",
                templates,
                names,
                templates[0]
            ));

            var formPrompt = "Choose a template";
            var buttonTitle = "OK";
            inputForm.show(formPrompt, buttonTitle).then(
                (form) => lib.expand(form.values['choice']),
                (error) => console.log(error));
        }
    });

    action.validate = (selection, sender) => {
        return true;
    };

    return action;
})();
_;
