var _ = (function() {

	const SEARCH_FOR = ["alarms", "routine", "templates"];

	var matchesStrings = (name) => {
		var nameLc = name.toLowerCase();
		for (s of SEARCH_FOR) {
			if (nameLc.indexOf(s) !== -1) {
				return true;
			}
		}
		return false;
	}
	var action = new PlugIn.Action(async function(selection, sender){
	    var startingPerspective = document.windows[0].perspective;

	    var matches = [];
		flattenedFolders.forEach(folder => {
		    if ((!folder.parent) &&
		        folder.status == Folder.Status.Active &&
		        !matchesStrings(folder.name)) {
		        matches.push(folder);
		        // console.log("Matched Folder " + folder.name);
            }
		});

		flattenedProjects.forEach(project => {
            if ((!project.parentFolder) &&
                project.status != Project.Status.Dropped &&
                project.status != Project.Status.Done &&
				!matchesStrings(project.name)) {
                matches.push(project);
                // console.log("Matched Project " + project.name);
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
