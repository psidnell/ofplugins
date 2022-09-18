var _ = (function() {

	const action = new PlugIn.Action(async function(selection, sender){
		const fileTypeID = "com.omnigroup.omnifocus2.export-filetype.plain-text";
		const baseName = "Tasky-Export";
		const wrapper = await document.makeFileWrapper(baseName, fileTypeID);
		const taskPaper = wrapper.contents.toString()
		const urlStr = "drafts://x-callback-url/" +
			"create" +
			"?action=Project%20from%20Template" +
			"&text=" + encodeURIComponent(taskPaper);
		const scriptURL = URL.fromString(urlStr);
        console.log(scriptURL);
        scriptURL.open();
	});

	action.validate = function(selection, sender){
		return (selection.projects.length === 1);
	};

	return action;
})();
_;
