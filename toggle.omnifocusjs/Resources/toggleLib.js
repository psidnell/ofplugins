var _ = function() {

    var toggleLib = new PlugIn.Library(new Version('0.1'));

    // Can't load this directly during initialisation of a library - it seems.
	// Cache the reference on the library.
	var _factoryLib;
    var factoryLib = () => {
        if (!_factoryLib) {
			_factoryLib = PlugIn.find('com.PaulSidnell.Toggle').library('factoryLib');
        }
        return _factoryLib;
    };

    // To make the function visible to tests
    toggleLib.factoryLib = factoryLib;

	toggleLib.createDeactivatedTag = () => {
		var deactivatedTagName = 'DEACTIVATED';
		var deactivatedTag = tagNamed(deactivatedTagName) || factoryLib().newTag(deactivatedTagName);

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
		url.call(reply => {});
	};

	return toggleLib;
}();
_;
