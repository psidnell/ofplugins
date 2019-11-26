/**
 * Factory functions to enable simple testing with Jasmine.
 * @type {PlugIn.Library}
 * @private
 */
var _ = function() {
    var factoryLib = new PlugIn.Library(new Version('0.1'));

    factoryLib.newVersion = (version) => {
        return new Version(version);
    };

    factoryLib.newFormFieldOption = (fieldName, label, objects, objectLabels, defaultObject) => {
        return new Form.Field.Option(fieldName, label, objects, objectLabels, defaultObject);
    };

    factoryLib.newTag = (tagName, parent) => {
        return new Tag(tagName, parent);
    };

    factoryLib.newForm = () => {
        return new Form();
    };

    return factoryLib;
}();
_;
