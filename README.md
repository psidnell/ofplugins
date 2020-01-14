# ofplugins

A selection of Omnifocus plugins I use on a regular basis. A work in progress...

For details of the OmniAutomation API and how to install and use a plugin see the [reference documentation](https://omni-automation.com/omnifocus/index.html). The Omni Slack channel is also a very useful resource.

## [Template Plugin](template.omnifocusjs)

A template project is simply a project with placeholder variables that can be used as a template to create new active projects. In the new project the variables will have been replaced with real values. The template project can be on hold to avoid cluttering up your active tasks.

Select a template project and run the plugin action and it will:

- Open a form to ask for values for your variables.
- Duplicate the template to create a new project above the template.
- Replace the variables in the copy with values you provided.
- Make the duplicate project active.

Variables are fragments of text like:
 
- ${Name}
- ${PhoneNumber}
- ${PizzaToppings}
- ${NumberOfWidgets}

There are also some special predefined variables where the value in the form
will be be provided with a default value (but which you can edit) such as:

- ${Date} today's date.
- ${Time} the current time.

Variable replacement occurs both in the name and note of a project and all it's tasks.

The plugin provides two actions.

**Select Template**: This action expands the selected template project. The selected project must contain at least one variable or an error will be generated. This is a precaution against accidental selection of a non template project.

While selection of a project is possible on MacOS and iPadOS, it's currently not possible in OmniFocus on iOS. See **Choose Template**.

**Choose Template**: This action scans OmniFocus for projects with variables in their title, and allows one to be selected for expansion.

An example template project in OmniFocus might be:

```
Project: Order Pizza at ${Date} ${Time}
    Task: Call ${PizzaStoreNumber}
    Task: Place Order for ${Type}, ${Size}, ${Extras}
    Task: Pay ${VoucherCode}
    Task: Wait for Delivery
    Task: Eat Pizza
```

## [Toggle Plugin](toggle.omnifocusjs)

This plugin allows all the projects in a folder to be put on hold or re-activated, toggling from one state to the other. You might, for example want to deactivate a Work folder on a Friday night and reactivate it on a
Monday morning. 

The plugin will descend into the selected folder structure changing active projects to on-hold and vice versa.

Note: a DEACTIVATED tag is added to active projects when they are put on hold and removed when they are reactivated. This is so the plug can
identify which projects to re-activate by only re-activating ones that it de-activated in the first place. This means that projects that were on-hold when their enclosing folder was de-activated remain on-hold when the folder is reactivated. 

Actions are provided to activate or put on hold the selected folder or to present a choice from the list of all folders.

## [Sort Plugin](sort.omnifocusjs)

This plugin sorts the tasks in a project by either defer or due. This functionality is available in the MacOS version but not in iOS. 
