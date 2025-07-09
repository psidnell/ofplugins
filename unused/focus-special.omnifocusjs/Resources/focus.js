var _ = (function() {

	var action = new PlugIn.Action(async function(selection, sender){

        const EXCLUDE = "♻";

	    var startingPerspective = document.windows[0].perspective;

	    var matches = [];

		flattenedProjects.forEach(project => {
            if (project.status != Project.Status.Dropped &&
                project.status != Project.Status.Done &&
                project.name.indexOf(EXCLUDE) == -1) {
                  matches.push(project);
            }
        });

        var win = document.windows[0]
        win.perspective = Perspective.BuiltIn.Projects
        win.focus = matches;

        // Restore original perspective

        // Crashes on the phone:
        // document.windows[0].perspective = startingPerspective;
        var delay = Device.current.mac ? 0 : 2;
        Timer.once(delay, () => document.windows[0].perspective = startingPerspective);
	});

	action.validate = function(selection, sender){
		return true;
	};

	return action;
})();
_;
