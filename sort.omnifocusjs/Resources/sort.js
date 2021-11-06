var _ = (function() {

	var cmpTime = (t1, t2) => {
		if (!t1 || !t2) {
			// No decision unless both have times
			return 0;
		} else if (t1 > t2) {
			return 1;
		} else if (t1 < t2) {
			return -1;
		} else {
			return 0;
		}
	}

	var dueTime = (item) => {
		return item.dueDate ? item.dueDate.getTime() : null;
	}

	var deferTimeIfFuture = (item, now) => {
		// A defer date of the past is same as no defer date or a defer date of now
		var deferTime = item.deferDate ? item.deferDate.getTime() : null;
		if (deferTime && deferTime <= now) {
			deferTime = null;
		}
		return deferTime;
	}

	var smartTime = (item, now) => {
		let due = dueTime(item);
		let defer = deferTimeIfFuture(item, now);
		if (!due && !defer) {
			return null;
		}
		if (due && !defer) {
			return due;
		}
		if (!due && defer) {
			return defer;
		}
		if (due > defer) {
			return Math.min(due, defer);
		}
		return due;
	}

	var available = (item, now) => {
		return (
			item.taskStatus === Task.Status.Available ||
			item.taskStatus === Task.Status.DueSoon);
	}

	var compare = (left, right) => {
		var now = new Date().getTime();
		var availableLeft = available(left, now);
		var smartTimeLeft = smartTime(left, now);
		var availableRight = available(right, now);
		var smartTimeRight = smartTime(right, now);

		var cmp = 0

		// 1: Availability (in terms of date)
		if (availableLeft && !availableRight) {
			return -1;
		}
		if (!availableLeft && availableRight) {
			return 1;
		}

		// 2: Time
		if (smartTimeLeft && !smartTimeRight) {
			return -1;
		}
		if (!smartTimeLeft && smartTimeRight) {
			return 1;
		}
		if (smartTimeLeft && smartTimeRight) {
			cmp = cmpTime(smartTimeLeft, smartTimeRight);
			if (cmp !== 0) {
				return cmp;
			}
		}

		// 3: Finally sort on name
		return left.name.localeCompare(right.name);
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
