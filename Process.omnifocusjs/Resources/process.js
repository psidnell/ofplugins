var _ = (function() {

	var action = new PlugIn.Action(function(selection, sender){

	    var repeat = PlugIn.find("com.PaulSidnell.Process").library("repeat");
	    repeat.process(selection);

	    var defer = PlugIn.find("com.PaulSidnell.Process").library("defer");
        defer.process(selection);
	});

	action.validate = function(selection, sender){
	    return true;
	};

	return action;
})();
_;
