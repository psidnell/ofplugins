var _ = (function() {

	var action = new PlugIn.Action(async function(selection, sender){

        const SEARCH_FOR = "work";

	    var startingPerspective = document.windows[0].perspective;

	    var matches = [];
		flattenedFolders.forEach(folder => {
		    if ((!folder.parent) &&
		        folder.status == Folder.Status.Active &&
		        (folder.name.toLowerCase().indexOf(SEARCH_FOR) != -1 || folder.name.toLowerCase().indexOf("misc") != -1)) {
		        matches.push(folder);
		        // console.log("Matched Folder " + folder.name);
            }
		});

		flattenedProjects.forEach(project => {
            if ((!project.parentFolder) &&
                project.status != Project.Status.Dropped &&
                project.status != Project.Status.Done &&
                (project.name.toLowerCase().indexOf(SEARCH_FOR) != -1 || project.name.toLowerCase().indexOf("misc") != -1)) {
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
        Timer.once(0, () => document.windows[0].perspective = startingPerspective);
	});

	action.validate = function(selection, sender){
		return true;
	};

	return action;
})();
_;
