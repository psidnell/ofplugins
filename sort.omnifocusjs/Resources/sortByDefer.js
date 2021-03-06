var _ = (function() {
	var compare = (a, b) => {
		if (a.deferDate && b.deferDate) {
			if (a.deferDate.getTime() > b.deferDate.getTime()) {
				return 1;
			} else if (a.deferDate.getTime() < b.deferDate.getTime()) {
				return -1;
			}
		} else if (!a.deferDate && b.deferDate) {
			return 1;
		} else if (a.deferDate && !b.deferDate) {
			return -1;
		}
		return a.name.localeCompare(b.name);
	};

	var action = new PlugIn.Action(function(selection, sender){
		project = selection.projects[0];
		var tasks = [];
		for (var i = 0; i < project.task.children.length; i++) {
			tasks.push(project.task.children[i]);
		}
		tasks.sort(compare);
		moveTasks(tasks, project);
	});

	action.validate = function(selection, sender){
		return (selection.projects.length === 1)
	};

	return action;
})();
_;
