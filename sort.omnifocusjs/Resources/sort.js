var _ = (function() {

    var smartTime = (item, now) => {
        var time;
        if (item.dueDate) {
            time = item.dueDate.getTime()
        } else if (item.deferDate) {
            time = item.deferDate.getTime();
        } else {
            time = now.getTime();
        }
        // console.log ('smartTime ' + item.name + ' ' + new Date(time) + ' = ' + time);
        return time;
    }

    var rank = (item) => {
        /* Statuses to consider
            Available (Task.Status r/o) • The task is available to work on.
            Blocked (Task.Status r/o) • The task is not available to work on currently, due to a future defer date, a preceeding task in a sequential project, or having an on-hold tag associated.
            Completed (Task.Status r/o) • The task is already completed.
            Dropped (Task.Status r/o) • The task will not be worked on.
            DueSoon (Task.Status r/o) • The task is incomplete and due soon.
            Next (Task.Status r/o) • The task is the first available task in a project.
            Overdue (Task.Status r/o) • The task is incomplete overdue.
        */
        var rank = 0;
        var status = item.taskStatus;
        switch (status) {
            case Task.Status.Overdue:
            case Task.Status.DueSoon:
            case Task.Status.Available:
            case Task.Status.Next:
                rank += item.flagged ? Math.pow(10, 4) : 0;
                break;
        }

        rank += status === Task.Status.Overdue ? Math.pow(10, 3): 0;
        rank += status === Task.Status.DueSoon ? Math.pow(10, 2) : 0;
        rank += status === Task.Status.Available ? Math.pow(10, 1) : 0;
        rank += status === Task.Status.Next ? Math.pow(10, 0) : 0;
        // console.log('rank ' + item.name + ' ' + item.taskStatus + ' f=' + item.flagged + ' = ' + rank);
        return rank;
    }

	var compare = (left, right) => {
	    const now = new Date();
	    // Compare on rank
        const leftRank = rank(left);
        const rightRank = rank (right);
        if (leftRank != rightRank) {
            return rightRank - leftRank;
        }

        // Compare on smart times
        const leftSmartTime = smartTime(left, now);
        const rightSmartTime = smartTime(right, now);
        if (leftSmartTime !== rightSmartTime) {
            return leftSmartTime - rightSmartTime;
        }

		// Compare on name
		var cmp = left.name.localeCompare(right.name);
		if (cmp != 0) {
		    return cmp;
		};

		// Compare on id
        return left.id.primaryKey.localeCompare(right.id.primaryKey);
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
