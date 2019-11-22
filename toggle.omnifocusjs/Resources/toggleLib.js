var _ = function() {
	var toggleLib = new PlugIn.Library(new Version("0.1"));

	toggleLib.createDeactivatedTag = () => {

		var hiddenTagName = "HIDDEN";
		var hiddenTagGroup = tagNamed(hiddenTagName) || new Tag(hiddenTagName);

		var deactivatedTagName = "DEACTIVATED";
		var deactivatedTag = hiddenTagGroup.tagNamed(deactivatedTagName) || new Tag(deactivatedTagName, hiddenTagGroup);

		return deactivatedTag;
	};

	return toggleLib;
}();
_;
