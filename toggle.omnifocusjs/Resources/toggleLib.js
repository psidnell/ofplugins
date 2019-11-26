var _ = function() {

    var toggleLib = new PlugIn.Library(new Version('0.1'));

    // Can't load this directly during initialisation of a library - it seems.
	// Cache the reference on the library.
    var factoryLib = () => {
        if (!toggleLib._factoryLib) {
			toggleLib._factoryLib = PlugIn.find('com.PaulSidnell.Toggle').library('factoryLib');
        }
        return toggleLib._factoryLib;
    };

    // To make the function visible to tests
    toggleLib.factoryLib = factoryLib;

	toggleLib.createDeactivatedTag = () => {
		var hiddenTagName = 'ON-HOLD';
		var hiddenTagGroup = tagNamed(hiddenTagName) || factoryLib().newTag(hiddenTagName);

		var deactivatedTagName = 'DEACTIVATED';
		var deactivatedTag = hiddenTagGroup.tagNamed(deactivatedTagName) || factoryLib().newTag(deactivatedTagName, hiddenTagGroup);

		return deactivatedTag;
	};

	toggleLib.toggle = function(child, deactivatedTag) {
		if (child instanceof Project) {
			if (child.status === Project.Status.OnHold
				&& child.task.tags.includes(deactivatedTag)) {
				child.task.removeTag(deactivatedTag);
				child.status = Project.Status.Active;
			} else if ( child.status === Project.Status.Active) {
				child.task.addTag(deactivatedTag);
				child.status = Project.Status.OnHold;
			}
		}
	};

	toggleLib.toggleFolder = function(folder) {
		var deactivatedTag = toggleLib.createDeactivatedTag();
		folder.apply(child => {
			toggleLib.toggle(child, deactivatedTag);
		});
		
		// Open the folder
		var url = URL.fromString('omnifocus:///folder/' + encodeURIComponent(folder.name));
		url.open();
	};

	return toggleLib;
}();
_;
