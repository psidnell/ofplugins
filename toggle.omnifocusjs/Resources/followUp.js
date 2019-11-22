var _ = (function() {
	var action = new PlugIn.Action(function(selection, sender) {
		config = this.delegationConfig;

		// configure tags
		waitingTag = config.waitingTag();
		followUpMethods = config.followUpMethods();
		defaultFollowUpMethod = config.defaultFollowUpMethod();

		// uninherited tags to be removed
		uninheritedTags = config.uninheritedTags();

		// also remove tags that are children of waiting tag
		uninheritedTags = uninheritedTags.concat(waitingTag.children, waitingTag);

		functionLibrary = PlugIn.find("com.KaitlinSalzke.functionLibrary").library(
			"functionLibrary"
		);

		// show form to select follow up method
		var inputForm = new Form();

		popupMenu = new Form.Field.Option(
			"contactMethod",
			"Contact Method",
			followUpMethods,
			followUpMethods.map(tag => tag.name),
			defaultFollowUpMethod
		);

		inputForm.addField(popupMenu);

		formPrompt = "Select contact method:";
		formPromise = inputForm.show(formPrompt, "Continue");

		inputForm.validate = function(formObject) {
			validation = true;
			return validation;
		};

		// process results from form selection
		formPromise.then(function(formObject) {
			selectedFollowUpMethod = formObject.values["contactMethod"];

			tasks = selection.tasks;

			tasks.forEach(task => {
				// get parent task
				parentTask = functionLibrary.getParent(task);

				if (!/^Waiting for: /.test(parentTask.name)) {
					// add parent action group
					parentTask = new Task(task.name, task.before);
				}

				// move original task inside group
				moveTasks([task], parentTask.ending);

				// replace "Waiting for: " with "Follow up: " in task name
				followUpTaskName = task.name.replace(
					/^(?:Waiting for: )*/,
					"Follow up: "
				);

				// create task and add relevant tags and link to original task
				followUpTask = new Task(followUpTaskName, task.before);
				followUpTask.addTag(selectedFollowUpMethod);
				followUpTask.addTags(task.tags);
				followUpTask.removeTags(uninheritedTags);
				followUpTask.note =
					"[FOLLOWUPON: omnifocus:///task/" + task.id.primaryKey + "]";

				// make the group sequential
				parentTask.sequential = true;
			});
		});

		// log error if form is cancelled
		formPromise.catch(function(err) {
			console.log("form cancelled", err.message);
		});
	});

	action.validate = function(selection, sender) {
		return selection.tasks.length >= 1;
	};

	return action;
})();
_;
