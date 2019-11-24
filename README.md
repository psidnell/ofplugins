# ofplugins

Omnifocus plugins I use on a regular basis. Always a work in progress...

For details of the API see the [reference documentation](https://omni-automation.com/omnifocus/index.html).

## [Template Plugin](template.omnifocusjs)

A template project is simply a project with placeholder variables that can be used to create new active projects. In the new project the variables will have been replaced with real values. The template project can be on hold to avoid cluttering up your active tasks.

Select a template project and run the plugin and it will:

- Open a form to ask for values for your variables.
- Duplicate it.
- Replace the variables in the copy with values you provided.
- Make the duplicate project active.

Variables are fragments of text like:
 
- ${Name}
- ${PhoneNumber}
- ${PizzaToppings}

There are also some special variables where the value in the form
will be be provided with a default (but which you can edit) such as:

- ${Date} today's date
- ${Time} the current time

Variable replacement occurs both in the name and note of a project and all it's tasks.

The plugin provides two actions.

**Select Template**: This action expands the selected template project. The selected project must contain at least one variable or an error will be generated. This is a precaution against accidental selection of a non template project.

While selection is possible on MacOS and iPadOS, it's currently not possible to select a project in OmniFocus on iOS. See **Choose Template**.

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

This plugin allows all the projects in a folder to be put on hold or re-activated.

The plugin will descend the structure toggling the
projects between active and on-hold.

A HIDDEN/DEACTIVATED tag is added to or removed from on-hold projects
to avoid toggling projects that were already on hold.

Two actions are provided.

**Toggle Selected**: This action toggles the selected folder.

While selection is possible on MacOS and iPadOS, it's currently not possible to select a project in OmniFocus on iOS. See **Choose Template**.

**Toggle Selected**: This action scans OmniFocus for folders and allows
one to be selected and toggled.