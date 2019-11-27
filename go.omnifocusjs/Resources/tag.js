var _ = (function() {
    var action = new PlugIn.Action((selection, sender) => {

        var open = (tagName) => {
            var url = URL.fromString('omnifocus:///tag/' + encodeURIComponent(tagName));
            url.call(reply => {});
        };

        var recurseTags = (prefix, tag, tagObjects, names) => {
            tagObjects.push(tag);
            names.push(prefix + tag.name);

            for (var i = 0; i < tag.children.length; i++) {
                recurseTags(prefix + tag.name + ' : ', tag.children[i], tagObjects, names);
            }
        };

        var inputForm = new Form();

        // Find tags
        var tagObjects = [];
        var names = [];

        for (var i = 0; i < tags.length; i++) {
            recurseTags('', tags[i], tagObjects, names);
        }

        console.log('found ' + tagObjects.length);

        if (tagObjects.length > 0) {
            inputForm.addField(new Form.Field.Option(
                'choice',
                'Tag',
                names,
                names,
                names[0]
            ));

            var formPrompt = 'Choose a tag';
            var buttonTitle = 'OK';
            inputForm.show(formPrompt, buttonTitle).then(
                (form) => open(form.values['choice']),
                (error) => console.log(error));
        }
    });

    action.validate = (selection, sender) => {
        return true;
    };

    return action;
})();
_;
