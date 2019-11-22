var _ = function() {
	var Library = new PlugIn.Library(new Version("1.0"));

	ApplicationLib.somefunc = function(){
		return "Hello World";
	};
	
	return Library;
}();
_;
