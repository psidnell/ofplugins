var _ = (function() {

    const action = new PlugIn.Action(async function(selection, sender){

        const fileTypeID = "com.omnigroup.omnifocus2.export-filetype.plain-text"
        const baseName = "Tasky-Export"
        const wrapper = await document.makeFileWrapper(baseName, fileTypeID);
        const taskPaper = wrapper.contents.toString()

        var lib = PlugIn.find("com.PaulSidnell.Template").library("lib");

        var template = selection.projects[0];
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
