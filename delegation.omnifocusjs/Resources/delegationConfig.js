var _ = (function() {
  var delegationConfig = new PlugIn.Library(new Version("1.0"));

  delegationConfig.waitingTag = () => {
    // edit the below line to configure the tag used to mark
    // tasks as waiting
    // THIS SHOULD BE A TAG OBJECT
    return tagNamed("Activity Type").tagNamed("⏳ Waiting");
  };

  delegationConfig.followUpMethods = () => {
    // edit the below line to configure the list of tags used
    // to mark different communication methods (i.e. means of follow-up)
    // THIS SHOULD BE AN ARRAY OF TAG OBJECTS
    return tagNamed("Activity Type").tagNamed("Contact").children;
  };

  delegationConfig.defaultFollowUpMethod = () => {
    // edit the below line to configure the default contact
    // method that should be selected in the form
    // THIS SHOULD BE A TAG OBJECT THAT IS INCLUDED IN THE
    // FOLLOW UP METHODS ABOVE
    return tagNamed("Activity Type")
      .tagNamed("Contact")
      .tagNamed("📧 Email");
  };

  delegationConfig.uninheritedTags = () => {
    // edit the below line to configure the list of tags that
    // will NOT be inherited by 'follow up' or 'waiting' tasks
    // THIS SHOULD BE AN ARRAY OF TAG OBJECTS
    return [tagNamed("▵")];
  };

  delegationConfig.functionsForOriginalTaskBeforeWaiting = () => {
    // edit the below to configure the function(s) that will be
    // run on the original task before the 'waiting' task is created,
    // including the action to complete the original task
    // THIS SHOULD BE AN ARRAY OF FUNCTIONS
    customCompletePlugin = PlugIn.find("com.KaitlinSalzke.customComplete");
    if (customCompletePlugin !== null) {
      return [customCompletePlugin.library("customCompleteLib").customComplete];
    } else {
      basicCompleteFunction = task => {
        task.markComplete();
      };
      return [basicCompleteFunction];
    }
  };

  delegationConfig.showForm = () => {
    // edit the below to configure whether a form is shown
    // to edit the 'waiting for' task
    // THIS SHOULD BE EITHER TRUE OR FALSE
    return true;
  };

  delegationConfig.defaultDeferDays = () => {
    // edit the below to configure the number of days
    // the 'waiting' task is deferred by default
    // THIS SHOULD BE A NUMBER, OR NULL IF NO DEFER DATE IS DESIRED
    return null;
  };

  return delegationConfig;
})();
_;
