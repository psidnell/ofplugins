var _ = (function() {

	const action = new PlugIn.Action(function(selection, sender){
	    console.log('action running');
		const fileTypeID = "com.omnigroup.omnifocus2.export-filetype.plain-text";
		const wrapperPromise = document.makeFileWrapper("Tasky-Export", fileTypeID);
		wrapperPromise.then(wrapper => {
            console.log('Wrapper fetched');
            const taskPaper = wrapper.contents.toString()
            const urlStr = "drafts://x-callback-url/" +
                "create" +
                "?action=Project%20from%20Template" +
                "&text=" + encodeURIComponent(taskPaper);
            console.log('url: ',urlStr);
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
