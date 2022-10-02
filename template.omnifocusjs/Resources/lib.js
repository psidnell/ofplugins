var _ = function() {
	var lib = new PlugIn.Library(new Version("0.1"));

	// Find variables in text (thanks to Thomas Kern)
	lib.findVariables = (text) => {
	    var variablesFound = [];
		substrings = text.match(/\[\[[^\]]*\]\]/gm);
		if (substrings != null) {
			for (var i = 0; i < substrings.length; i++) {
				var variableSpec = substrings[i]
				    .replaceAll('[[', '')
				    .replaceAll(']]', '');
				if (!variablesFound.includes(variableSpec)) {
					// console.log("Found variable " + variableSpec);
					variablesFound.push(variableSpec);
				}
			}
		}
		return variablesFound;
	};

	// Replace variables in the string with those from the form
	lib.replaceVariables = (text, templateVariables, variableValues) => {
		var result = text;
		for (var i = 0; i < templateVariables.length; i++) {
		    var variableSpec = templateVariables[i];
		    var parts = variableSpec.split(':');
            var variableName = parts[0];
            var variableType = parts.length > 0 ? parts[1] : 'text';
            var options = parts.length > 1 ? parts[2] : null;
            var value = variableValues[variableSpec];
            switch (variableType) {
                case 'date' : {
                    var formatStr = options == null ?  'yyyy-MM-dd' : options;
                    var format = Formatter.Date.withFormat(formatStr);
                    value = format.stringFromDate(value);
                    break;
                }
                case 'time' : {
                    var formatStr = options == null ?  'yyyy-MM-dd HH:mm' : options;
                    var format = Formatter.Date.withFormat(formatStr);
                    value = format.stringFromDate(value);
                    break;
                }
                case 'checkbox' : {
                    var choices = (options != null && options.indexOf(',') != -1) ?
                        options.split(',') : ["Yes", "No"];
                    value = value ? choices[0] : choices[1];
                    break;
                }
                default:
                    break;
            }
            console.log("replacing " + variableSpec + " with " + value);
			result = result.replaceAll("[[" + variableSpec + "]]", value);
		}
		return result;
	};

    lib.buildFolderPath = (folder) => {
        var names = [];
        while (folder != null) {
            names.unshift(folder.name);
            folder = folder.parent;
        }
        return names.length == 0 ? 'projects' : '/folder/' + names.join(':');
    }

	// Process the template
	lib.expandTaskPaper = (template, taskPaper, templateVariables, variableValues) => {
		// console.log('Processing Template ' + template.name);
		var expandedTaskPaper = lib.replaceVariables(taskPaper, templateVariables, variableValues);
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

   	lib.addFormField = (inputForm, variableSpec, position) => {
   	    var parts = variableSpec.split(':');
   	    var variableName = parts[0];
   	    var variableType = parts.length > 0 ? parts[1] : 'text';
   	    var options = parts.length > 1 ? parts[2] : null;
   	    var now = new Date();
   	    // https://unicode-org.github.io/icu/userguide/format_parse/datetime/#formatting-dates
   		switch (variableType) {
   			case 'date' : {
   			    var formatStr = options == null ?  'yyyy-MM-dd' : options;
                var format = Formatter.Date.withFormat(formatStr);
                inputForm.addField(new Form.Field.Date(variableSpec, variableName, new Date(), format), position);
                break;
   			}
   			case 'time' : {
   			    var formatStr = options == null ?  'yyyy-MM-dd HH:mm' : options;
                var format = Formatter.Date.withFormat(formatStr);
                inputForm.addField(new Form.Field.Date(variableSpec, variableName, new Date(), format), position);
                break;
   			}
   			case 'option' : {
                var choices = options != null ? options.split(',') : [""];
                inputForm.addField(new Form.Field.Option(variableSpec, variableName, choices, choices, choices[0]), position);
                break;
            }
   			case 'checkbox' : {
                inputForm.addField(new Form.Field.Checkbox(variableSpec, variableName, null), position);
                break;
            }
   			case 'text':
   			default:
   			    var value = options;
                inputForm.addField(new Form.Field.String(variableSpec, variableName, value), position);
                break;
   		}
   	}


	lib.expand = (template, taskPaper) => {
        var templateVariables = lib.findVariables(taskPaper);

        if (templateVariables.length == 0) {
            lib.expandTaskPaper(template, taskPaper, templateVariables, new Object())
        } else {
            // Open a form to collect values for variables in the template
            var inputForm = new Form();
            for (var i = 0; i < templateVariables.length; i++) {
                var variable = templateVariables[i];
                lib.addFormField(inputForm, variable, i);
            }
            var formPrompt = template.name;
            var buttonTitle = "OK";
            inputForm.show(formPrompt, buttonTitle).then(
                (form) => lib.expandTaskPaper(template, taskPaper, templateVariables, form.values),
                (error) => console.log(error));
        }
	};

	return lib;
}();
_;
