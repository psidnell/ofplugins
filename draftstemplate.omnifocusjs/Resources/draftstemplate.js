var _ = (function() {

	const action = new PlugIn.Action(function(selection, sender){
	    console.log('Action running');

	    var types = document.writableTypes.map(type => {
        	return "\"" + type + "\""
        })
        types = "[" + types.join(",\n") + "]"
        console.log("Supported file types: " + types);

		const fileTypeID = "com.omnigroup.omnifocus2.export-filetype.plain-text";
		const wrapperPromise = document.makeFileWrapper("Tasky-Export", fileTypeID);
		console.log('Promise created');
        wrapperPromise.then(wrapper => {
            console.log('Wrapper ready');
            const taskPaper = wrapper.contents.toString();
            const urlStr = "drafts://x-callback-url/" +
                "create" +
                "?action=Project%20from%20Template" +
                "&text=" + encodeURIComponent(taskPaper);
            console.log('TaskPaper fetched, url: ',urlStr);
            const scriptURL = URL.fromString(urlStr);
            console.log('scriptURL: ' +  scriptURL);
            scriptURL.open();
        });
	});

	action.validate = function(selection, sender){
		return (selection.projects.length === 1);
	};

	return action;
})();
_;
