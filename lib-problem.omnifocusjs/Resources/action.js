var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var lib = this.lib;
        lib.hello();
    });

    action.validate = (selection, sender) => {
        return (true);
    };

    return action;
})();
_;
