var _ = (function() {
  var action = new PlugIn.Action(function(selection, sender) {
    config = this.delegationConfig;

    // configuration
    waitingTag = config.waitingTag();
    uninheritedTags = config.uninheritedTags();
    showForm = config.showForm();
    defaultDeferDays = config.defaultDeferDays();

    functionLibrary = PlugIn.find("com.KaitlinSalzke.functionLibrary").library(
      "functionLibrary"
    );

    tasks = selection.tasks;

    asyncForEach(tasks, async task => {
      // do functions set up in config file first
      config.functionsForOriginalTaskBeforeWaiting().forEach(func => {
        func(task);
      });

      // set up defaults for new 'waiting' task
      // -- task name
      waitingForTaskName = `Waiting for: ${task.name}`;

      // -- defer date
      if (defaultDeferDays !== null) {
        defaultStartTime = settings.objectForKey("DefaultStartTime");
        defaultStartTimeSplit = defaultStartTime.split(":");
        defaultStartHours = defaultStartTimeSplit[0];
        defaultStartMinutes = defaultStartTimeSplit[1];

        deferDate = functionLibrary.adjustDateByDays(
          new Date(),
          defaultDeferDays
        );
        deferDate.setHours(defaultStartHours);
        deferDate.setMinutes(defaultStartMinutes);
      } else {
        deferDate = null;
      }

      // -- due date
      dueDate = null;

      // if showForm is set to true in config, show form to edit task
      if (showForm === true) {
        var inputForm = new Form();
        nameField = new Form.Field.String(
          "taskName",
          "Task name",
          waitingForTaskName
        );
        inputForm.addField(nameField);
        deferField = new Form.Field.Date("deferDate", "Defer date", deferDate);
        inputForm.addField(deferField);
        dueField = new Form.Field.Date("dueDate", "Due date", null);
        inputForm.addField(dueField);
        let formPrompt = "Adjust task details if needed";
        let buttonTitle = "Continue";
        formPromise = inputForm.show(formPrompt, buttonTitle);
        inputForm.validate = formObject => {
          return true;
        };
        await formPromise.then(formObject => {
          waitingForTaskName = formObject.values["taskName"];
          deferDate = formObject.values["deferDate"];
          dueDate = formObject.values["dueDate"];
        });
      }

      // create task and add relevant tags
      waitingTask = new Task(waitingForTaskName, task.after);
      waitingTask.addTag(waitingTag);
      waitingTask.removeTags(uninheritedTags);
      waitingTask.deferDate = deferDate;
      waitingTask.dueDate = dueDate;
    });
  });

  action.validate = function(selection, sender) {
    return selection.tasks.length >= 1;
  };

  return action;
})();
_;

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
