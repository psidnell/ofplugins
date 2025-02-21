var _ = function() {

    var toggleLib = new PlugIn.Library(new Version('0.1'));

	toggleLib.createDeactivatedTag = () => {
		var deactivatedTagName = 'DEACTIVATED';
		var deactivatedTag = tagNamed(deactivatedTagName) || new Tag(deactivatedTagName);

		return deactivatedTag;
	};

	toggleLib.toggle = function(child, deactivatedTag, activate) {
		if (child instanceof Project) {
			if (activate && child.status === Project.Status.OnHold
				&& child.task.tags.includes(deactivatedTag)) {
				child.task.removeTag(deactivatedTag);
				child.status = Project.Status.Active;
			} else if (!activate && child.status === Project.Status.Active) {
				child.task.addTag(deactivatedTag);
				child.status = Project.Status.OnHold;
			}
		}
	};

	toggleLib.toggleFolder = function(folder, activate) {
		var deactivatedTag = toggleLib.createDeactivatedTag();
		folder.apply(child => {
			toggleLib.toggle(child, deactivatedTag, activate);
		});
		
		// Open the folder
		var url = URL.fromString('omnifocus:///folder/' + encodeURIComponent(folder.name));
		url.call(reply => {});
	};

	return toggleLib;
}();
_;
