/**
 * Factory functions to enable simple testing with Jasmine.
 * @type {PlugIn.Library}
 * @private
 */
var _ = function() {
    var lib = new PlugIn.Library(new Version('0.1'));

    lib.newVersion = (version) => {
        return new Version(version);
    };

    lib.newFormFieldOption = (fieldName, label, objects, objectLabels, defaultObject) => {
        return new Form.Field.Option(fieldName, label, objects, objectLabels, defaultObject);
    };

    lib.newTag = (tagName) => {
        return new Tag(tagName);
    };

    lib.newForm = () => {
        return new Form();
    };

    return lib;
}();
_;
