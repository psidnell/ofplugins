var _ = function() {
	var lib = new PlugIn.Library(new Version("0.1"));

	// Find variables in text (thanks to Thomas Kern)
	lib.findVariables = (text) => {
	    var variablesFound = [];
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
		return variablesFound;
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

	lib.getDefaultValueForVariable = (variable) => {
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

    lib.buildFolderPath = (folder) => {
        var names = [];
        while (folder != null) {
            names.unshift(folder.name);
            folder = folder.parent;
        }
        return names.length == 0 ? 'projects' : '/folder/' + names.join(':');
    }

	// Process the template
	lib.expandTaskPaper = (template, taskPaper, variableValues) => {
		console.log('Processing Template ' + template.name);
		var expandedTaskPaper = lib.replaceVariables(taskPaper, variableValues);
		// console.log(expandedTaskPaper);

        var path = lib.buildFolderPath(template.parentFolder);

        encodeURIComponent(template.assignedContainer);
        var urlStr = "omnifocus:///paste" +
            "?target=" + encodeURIComponent(path) +
            "&content=" + encodeURIComponent(expandedTaskPaper)
        // console.log(urlStr);
		// Create and open the new project
		var url = URL.fromString(urlStr);
		url.call(reply => {});
	};

	lib.expand = (template, taskPaper) => {
        var templateVariables = lib.findVariables(taskPaper);

        if (templateVariables.length == 0) {
            lib.expandTaskPaper(template, taskPaper, templateVariables)
        } else {
            // Open a form to collect values for variables in the template
            var inputForm = new Form();
            console.log(1);
            for (var i = 0; i < templateVariables.length; i++) {
                var variable = templateVariables[i];
                var defaultValue = lib.getDefaultValueForVariable(variable);
                inputForm.addField(new Form.Field.String(variable, variable, defaultValue), i);
            }
            var formPrompt = "Provide values for the template";
            var buttonTitle = "OK";
            console.log(2);
            inputForm.show(formPrompt, buttonTitle).then(
                (form) => lib.expandTaskPaper(template, taskPaper, form.values),
                (error) => console.log(error));
        }
	};

	return lib;
}();
_;
