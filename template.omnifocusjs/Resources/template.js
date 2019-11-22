var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        // Find variables in text (thanks to Thomas Kern)
        var findVariables = function(text, variablesFound) {
            substrings = text.match(/\$\{[^\}]*\}/gm);
            if (substrings != null) {
                for (var i = 0; i < substrings.length; i++) {
                    var variable = substrings[i];
                    if (!variablesFound.includes(variable)) {
                        console.log("Found variable " + variable);
                        variablesFound.push(variable);
                    }
                }
            }
        };

        // Replace variables in the string with those from the form
        var replaceVariables = function(text, variables) {
            var result = text;
            for (var variable in variables) {
                var value = variables[variable];
                result = result.replace(variable, value);
            }

            return result;
        };

        // Replace any variables in the task title or note
        var replaceVariableInTask = function(task, variables) {
            console.log('Processing Task ' + task.name);
            task.name = replaceVariables(task.name, variables);
            task.note = replaceVariables(task.note, variables);
        };

        // Process the template
        var process = function(template, form) {
            console.log('Processing Template ' + template.name);
            // Duplicate the template project
            var project = duplicateSections([template], template.before)[0];

            // Make it active
            project.status = Project.Status.Active;

            // Replace any variables in the project
            project.task.apply((task) => {
                replaceVariableInTask(task, form.values);
            })
        };

        // The selected project is the template to be used
        // TODO
        // Can't select a project on a phone yet
        // var template = selection.projects[0];
        var template = folderNamed('Work')
            .folderNamed('WebView')
            .projectNamed('${Ticket} - ${Description}');
        console.log('Template project is ' + template);

        // Find the variables used in the template
        var templateVariables = [];
        template.task.apply((task) => {
            findVariables(task.name, templateVariables);
            findVariables(task.note, templateVariables)
        });

        // Open a form to collect values for variables in the template
        inputForm = new Form();
        for (var i = 0; i < templateVariables.length; i++) {
            var variable = templateVariables[i];
            inputForm.addField(new Form.Field.String(variable, variable, null), i);
        }
        formPrompt = "Provide values for the template";
        buttonTitle = "OK";
        inputForm.show(formPrompt, buttonTitle).then(
            (form) => process(template, form),
            (error) => console.log(error));
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