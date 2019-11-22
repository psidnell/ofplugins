var _ = function() {
	var lib = new PlugIn.Library(new Version("0.1"));

	// Find variables in text (thanks to Thomas Kern)
	lib.findVariables = (text, variablesFound) => {
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

	// Find all the variables used in the template
	lib.findVariablesInTemplate = (template) => {
		// Find the variables used in the template
		var templateVariables = [];
		template.task.apply((task) => {
			lib.findVariables(task.name, templateVariables);
			lib.findVariables(task.note, templateVariables)
		});

		return templateVariables;
	};

	// Replace variables in the string with those from the form
	lib.replaceVariables = (text, variables) => {
		var result = text;
		for (var variable in variables) {
			var value = variables[variable];
			result = result.replace(variable, value);
		}

		return result;
	};

	// Replace any variables in the task title or note
	lib.replaceVariableInTask = (task, variables) => {
		console.log('Processing Task ' + task.name);
		task.name = lib.replaceVariables(task.name, variables);
		task.note = lib.replaceVariables(task.note, variables);
	};

	// Process the template
	lib.expandTemplate = (template, form) => {
		console.log('Processing Template ' + template.name);
		// Duplicate the template project
		var project = duplicateSections([template], template.before)[0];

		// Make it active
		project.status = Project.Status.Active;

		// Replace any variables in the project
		project.task.apply((task) => {
			lib.replaceVariableInTask(task, form.values);
		})
	};

	lib.expand = (template) => {
		var templateVariables = lib.findVariablesInTemplate(template);

		// Open a form to collect values for variables in the template
		inputForm = new Form();
		for (var i = 0; i < templateVariables.length; i++) {
			var variable = templateVariables[i];
			inputForm.addField(new Form.Field.String(variable, variable, null), i);
		}
		formPrompt = "Provide values for the template";
		buttonTitle = "OK";
		inputForm.show(formPrompt, buttonTitle).then(
			(form) => lib.expandTemplate(template, form),
			(error) => console.log(error));
	};

	return lib;
}();
_;
