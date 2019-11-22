var _ = function(){
	var action = new PlugIn.Action(function(selection){
		console.log('action has run');
	});

	// routine determines if menu item is enabled
	action.validate = function(selection){
		return true
	};

	return action;
}();
_;
