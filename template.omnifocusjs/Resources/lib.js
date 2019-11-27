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

	lib.GetDefaultValueForVariable = (variable) => {
		switch (variable) {
			case '${Date}' : {
				var options = {
					weekday: 'short',
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				};
				return new Date().toLocaleDateString('en-UK', options);
			}
			case '${Time}' : {
				var options = {
					hour: '2-digit',
					minute: '2-digit',
					hour12: false
				};
				return new Date().toLocaleTimeString('en-UK', options);
			}
			default:
				return null;
		}
	}

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
		});
		
		// Open the new project
		var url = URL.fromString('omnifocus:///folder/' + encodeURIComponent(project.id.primaryKey));
		url.call(reply => {});
	};

	lib.expand = (template) => {
		var templateVariables = lib.findVariablesInTemplate(template);
		if (templateVariables.length == 0) {
			throw new Error("Project is not a template, add a ${Variable} to the title or note");
		}

		// Open a form to collect values for variables in the template
		var inputForm = new Form();

		for (var i = 0; i < templateVariables.length; i++) {
			var variable = templateVariables[i];
			var defaultValue = lib.GetDefaultValueForVariable(variable);
			inputForm.addField(new Form.Field.String(variable, variable, defaultValue), i);
		}
		var formPrompt = "Provide values for the template";
		var buttonTitle = "OK";
		inputForm.show(formPrompt, buttonTitle).then(
			(form) => lib.expandTemplate(template, form),
			(error) => console.log(error));
	};

	return lib;
}();
_;
