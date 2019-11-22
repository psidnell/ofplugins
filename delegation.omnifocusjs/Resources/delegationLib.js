var _ = (function() {
	var delegationLib = new PlugIn.Library(new Version("1.0"));

	delegationLib.noteFollowUp = task => {
		functionLibrary = PlugIn.find("com.KaitlinSalzke.functionLibrary").library(
			"functionLibrary"
		);

		// if 'Follow up' task, make a note on original task when followed up on
		if (/[fF]ollow up/.test(task.name)) {
			originalTaskRegex = /\[FOLLOWUPON: omnifocus:\/\/\/task\/(.+)\]/g;
			originalTaskRegexResult = originalTaskRegex.exec(task.note);

			if (originalTaskRegexResult !== null) {
				originalTaskId = originalTaskRegexResult[1];
				originalTask = functionLibrary.getTaskWithId(originalTaskId);

				now = new Date();

				originalTask.note = `${
					originalTask.note
				}\n\nFollowed up ${now.toString()}`;
			}
		}
	};

	return delegationLib;
})();
_;
