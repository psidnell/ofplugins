var _ = (function() {

	var action = new PlugIn.Action(async function(selection, sender) {
	    var totalMinutes = 0;
	    var tasksWithDuration = 0;
	    var tasksWithoutDuration = 0;
        flattenedTasks.forEach(task => {
            if (task.taskStatus != Task.Status.Completed && task.taskStatus != Task.Status.Dropped &&
                task.taskStatus != Task.Status.Blocked && task.taskStatus != Task.Status.Blocked) {
                if (task.estimatedMinutes) {
                    totalMinutes += task.estimatedMinutes;
                    tasksWithDuration++;
                    console.log(task.name + " " + task.estimatedMinutes);
                } else {
                    tasksWithoutDuration++;
                }
            }
        });

        var hours = Math.floor(totalMinutes / 60);
        var minutes = totalMinutes % (hours * 60);
        var duration = "" + hours + "h " + minutes + "m";
        console.log(totalMinutes);

        var inputForm = new Form();
        inputForm.addField(new Form.Field.String("f1", "Duration", "" + duration), 0)
        inputForm.addField(new Form.Field.String("f2", "Tasks With Duration", "" + tasksWithDuration), 1)
        inputForm.addField(new Form.Field.String("f2", "Tasks Without Duration", "" + tasksWithoutDuration), 2)
        inputForm.show("Duration Summary", "OK").then(
                        (form) => {},
                        (error) => console.log(error));
    });

	action.validate = function(selection, sender){
		return true;
	};

	return action;
})();
_;
