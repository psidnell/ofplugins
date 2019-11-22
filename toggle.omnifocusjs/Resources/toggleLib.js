var _ = (function() {
	var ToggleLib = new PlugIn.Library(new Version("1.0"));

	ToggleLib.createDeactivatedTag = () => {

		var hiddenTagName = "HIDDEN";
		var hiddenTagGroup = tagNamed(hiddenTagName) || new Tag(hiddenTagName);

		var deactivatedTagName = "DEACTIVATED";
		var deactivatedTag = hiddenTagGroup.tagNamed(deactivatedTagName) || new Tag(deactivatedTagName, hiddenTagGroup);

		return deactivatedTag;
	};

	return ToggleLib;
})();
_;
