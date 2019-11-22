var _ = function(){
	var action = new PlugIn.Action(function(selection){
		var locale = "en-us"
		var monthNames = []
		for (i = 0; i < 12; i++) {
			var objDate = new Date()
			objDate.setMonth(i)
			monthName = objDate.toLocaleString(locale,{month:"long"})
			monthNames.push(monthName)
		}
		folderNames = folders.map(fldr => {return fldr.name})
		monthNames.forEach((month)=>{
			if(!folderNames.includes(month)){new Folder(month)}
		})
	});

	// result determines if the action menu item is enabled
	action.validate = function(selection){
		return true
	};

	return action;
}();
_;