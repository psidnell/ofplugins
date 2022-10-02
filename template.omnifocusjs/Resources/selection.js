var _ = (function() {

    const action = new PlugIn.Action(async function(selection, sender){
        var template = selection.projects[0];

        // Open the template project exclusively in project view to avoid
        // issues collecting the TaskPaper
        var win = document.windows[0]
        win.perspective = Perspective.BuiltIn.Projects
        win.focus = [template];

        // Should contain com.omnigroup.omnifocus2.export-filetype.plain-text
        // But doesn't in OF4 on iOS
        var types = document.writableTypes.map(type => {
            return "\"" + type + "\""
        })
        types = "[" + types.join(",\n") + "]";
        // console.log("Supported file types: " + types);

        // Where supported fetch the taskpaper of the selected project
        // otherwise (e.g. the test flight of OF4 on iOS) you must copy
        // the project as taskpsper
        var taskPaper;
        if (types.indexOf("com.omnigroup.omnifocus2.export-filetype.plain-text") != -1) {
            const fileTypeID = "com.omnigroup.omnifocus2.export-filetype.plain-text"
            const baseName = "Tasky-Export"
            const wrapper = await document.makeFileWrapper(baseName, fileTypeID);
            taskPaper = wrapper.contents.toString();
        } else {
            taskPaper = Pasteboard.general.string;
        }

        // Unfocus again
        win.focus = [];

        var lib = PlugIn.find("com.PaulSidnell.Template").library("lib");

        lib.expand(template, taskPaper);
    });

    action.validate = (selection, sender) => {
        return selection.projects.length === 1 &&
            (selection.projects[0].status === Project.Status.OnHold ||
                selection.projects[0].status === Project.Status.Active);
                 //&& selection.projects[0].name.indexOf('[[') != -1;
    };

    return action;
})();
_;
