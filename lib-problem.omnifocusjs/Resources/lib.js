var _ = function() {
	var lib = new PlugIn.Library(new Version("0.1"));

	lib.hello = () => {
		console.log("Hello");
	};

	return lib;
}();
_;
