var _ = function() {
	var lib = new PlugIn.Library(new Version("0.1"));

	// Find variables in text (thanks to Thomas Kern)
	lib.findVariables = (text, variablesFound) => {
		substrings = text.match(/\[\[[^\]]*\]\]/gm);
		if (substrings != null) {
			for (var i = 0; i < substrings.length; i++) {
				var variable = substrings[i]
				    .replaceAll('[[', '')
				    .replaceAll(']]', '');
				if (!variablesFound.includes(variable)) {
					// console.log("Found variable " + variable);
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
			result = result.replace(new RegExp('\\[\\[' + variable + '\\]\\]', 'g'), value);
		}

		return result;
	};

	// Replace any variables in the task title or note
	lib.replaceVariableInTask = (task, variables) => {
		// console.log('Processing Task ' + task.name);
		task.name = lib.replaceVariables(task.name, variables);
		task.note = lib.replaceVariables(task.note, variables);
	};

	lib.GetDefaultValueForVariable = (variable) => {
	    var now = new Date();
		switch (variable) {
			case 'date' : {

                let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(now);
                let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(now);
                let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(now);
                return `${ye}-${mo}-${da}`;
			}
			case 'time' : {
			    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(now);
                let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(now);
                let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(now);
                let h = new Intl.DateTimeFormat('en', { hour: '2-digit', hour12: false }).format(now);
                let m = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(now);
                return `${ye}-${mo}-${da} ${h}:${m}`;
			}
			default:
				return null;
		}
	}

	// Process the template
	lib.expandTemplate = (template, form) => {
		// console.log('Processing Template ' + template.name);
		// Duplicate the template project
		var project = duplicateSections([template], template.before)[0];

		// Make it active
		project.status = Project.Status.Active;

		// Replace any variables in the project
		project.task.apply((task) => {
			lib.replaceVariableInTask(task, form.values);
		});
		
		// Open the new project
		var url = URL.fromString('omnifocus:///task/' + encodeURIComponent(project.name));
		url.call(reply => {});
	};

	lib.expand = (template) => {
		var templateVariables = lib.findVariablesInTemplate(template);
		if (templateVariables.length == 0) {
			throw new Error("Project is not a template, add a [[variable]] to the title or note");
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
