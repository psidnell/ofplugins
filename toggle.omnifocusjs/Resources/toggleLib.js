var _ = function() {
	var toggleLib = new PlugIn.Library(new Version("0.1"));

	toggleLib.createDeactivatedTag = () => {

		var hiddenTagName = "HIDDEN";
		var hiddenTagGroup = tagNamed(hiddenTagName) || new Tag(hiddenTagName);

		var deactivatedTagName = "DEACTIVATED";
		var deactivatedTag = hiddenTagGroup.tagNamed(deactivatedTagName) || new Tag(deactivatedTagName, hiddenTagGroup);

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

	toggleLib.toggleFolderOrProject = function(item) {
		var deactivatedTag = toggleLib.createDeactivatedTag();
		item.apply(child => {
			toggleLib.toggle(child, deactivatedTag);
		});
	};

	return toggleLib;
}();
_;
