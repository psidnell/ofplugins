PlugIn = function () {
}

lastPlugInAction = null;

PlugIn.Action = function (fn) {
    this.fn = fn;
    lastPlugInAction = this;
}
