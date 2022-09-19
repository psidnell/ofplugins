var _ = (function() {

    const action = new PlugIn.Action(async function(selection, sender){
	    console.log('Action running');

        // Should contain com.omnigroup.omnifocus2.export-filetype.plain-text
        // But doesn't in OF4 on iOS
	    var types = document.writableTypes.map(type => {
        	return "\"" + type + "\""
        })
        types = "[" + types.join(",\n") + "]"
        console.log("Supported file types: " + types);

        if (app.userVersion.versionString.startsWith("3.")) {
            const fileTypeID = "com.omnigroup.omnifocus2.export-filetype.plain-text"
            const baseName = "Tasky-Export"
            const wrapper = await document.makeFileWrapper(baseName, fileTypeID);
            const taskPaper = wrapper.contents.toString()
            const urlStr = "drafts://x-callback-url/" +
                "create" +
                "?action=Project%20from%20Template" +
                "&text=" + encodeURIComponent(taskPaper);
            const scriptURL = URL.fromString(urlStr);
            console.log(scriptURL);
            scriptURL.open()
        } else {
            // In OF4 must copy the project as TaskPaper to the clipboard
            // ourselves and use special Drafts syntax to take that as input.
            const taskPaper = '||clipboard||';
            const urlStr = "drafts://x-callback-url/" +
                "create" +
                "?action=Project%20from%20Template" +
                "&text=" + encodeURIComponent(taskPaper);
            const scriptURL = URL.fromString(urlStr);
            console.log(scriptURL);
            scriptURL.open();
        }
    });

	action.validate = function(selection, sender){
		return (selection.projects.length === 1 &&
		    selection.folders.length == 0);
	};

	return action;
})();
_;
