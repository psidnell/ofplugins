var _ = (function() {

	var action = new PlugIn.Action(function(selection, sender){
		var fileTypeID = "com.omnigroup.omnifocus2.export-filetype.plain-text";
        var baseName = "Tasky-Export";
        var wrapperPromise = document.makeFileWrapper(baseName, fileTypeID);
        wrapperPromise.then(wrapper => {
        	var taskPaper = wrapper.contents.toString();
        	var url = "drafts://x-callback-url/" +
        	    "create" +
        	    "?action=Project%20from%20Template" +
        	    "&text=" + encodeURIComponent(taskPaper);
            var scriptURL = URL.fromString(url);
            console.log(url);
            scriptURL.call(function(){console.log('OK')})
        })
        wrapperPromise.catch(err => {
        	console.error(err.message);
        })
	});

	action.validate = function(selection, sender){
		return (selection.projects.length === 1);
	};

	return action;
})();
_;
