var _ = function() {
    var factoryLib = PlugIn.find("com.PaulSidnell.Toggle").library("factories");
    var toggleLib = factoryLib.newPlugInLibrary(factoryLib.newVersion("0.1"));

	toggleLib.createDeactivatedTag = () => {

		var hiddenTagName = "ON-HOLD";
		var hiddenTagGroup = tagNamed(hiddenTagName) || factoryLib.newTag(hiddenTagName);

		var deactivatedTagName = "DEACTIVATED";
		var deactivatedTag = hiddenTagGroup.tagNamed(deactivatedTagName) || factoryLib.newTag(deactivatedTagName, hiddenTagGroup);

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

	toggleLib.toggleFolder = function(item) {
		var deactivatedTag = toggleLib.createDeactivatedTag();
		item.apply(child => {
			toggleLib.toggle(child, deactivatedTag);
		});
	};

	return toggleLib;
}();
_;
