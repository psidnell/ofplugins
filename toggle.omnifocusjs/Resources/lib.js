var _ = function() {
	var lib = new PlugIn.Library(new Version("0.1"));

	lib.createDeactivatedTag = () => {

		var hiddenTagName = "HIDDEN";
		var hiddenTagGroup = tagNamed(hiddenTagName) || new Tag(hiddenTagName);

		var deactivatedTagName = "DEACTIVATED";
		var deactivatedTag = hiddenTagGroup.tagNamed(deactivatedTagName) || new Tag(deactivatedTagName, hiddenTagGroup);

		return deactivatedTag;
	};

	lib.toggle = function(child, deactivatedTag) {
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

	lib.toggleFolderOrProject = function(item) {
		var deactivatedTag = lib.createDeactivatedTag();
		item.apply(child => {
			lib.toggle(child, deactivatedTag);
		});
	};

	return lib;
}();
_;
