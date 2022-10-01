# ofplugins

A selection of Omnifocus plugins I use on a regular basis. A work in progress...

For details of the OmniAutomation API and how to install and use a plugin see the [reference documentation](https://omni-automation.com/omnifocus/index.html). The Omni Slack channel is also a very useful resource.

## [Template Plugin](template.omnifocusjs)

A template project is simply an active or paused project with placeholder variables that can be used
as a template to create new active projects. In the new project any template variables will have been
replaced with real values. The template project can be on hold to avoid cluttering up your active tasks.

Select a template project and run the plugin action and it will:

- Open a form to ask for values for your variables (if any).
- Duplicate the template to create a new project above the template.
- Replace the variables in the copy with values you provided.
- Make the duplicate project active.

Variables are fragments of text like:
 
- [[Name]]
- [[PhoneNumber]]
- [[PizzaToppings]]
- [[NumberOfWidgets]]

There are also some special predefined variables where the value in the form
will be be provided with a default value (but which you can edit) such as:

- [[date]] today's date.
- [[time]] the current date and time.

Variable replacement occurs both in the name and note of a project and all it's tasks.

The plugin provides one action.

**Select Template**: This action expands the selected template project. The selected project must contain at least one variable or an error will be generated. This is a precaution against accidental selection of a non template project.

An example template project in OmniFocus might be:

```
Project: Order Pizza at [[time]]
    Task: Call [[PizzaStoreNumber]]
    Task: Place Order for [[Type]], [[Size]], [[Extras]]
    Task: Pay [[VoucherCode]]
    Task: Wait for Delivery
    Task: Eat Pizza
```

Note that text expansion is performed after internally converting the template
to [OmniFocus TaskPaper format](https://support.omnigroup.com/omnifocus-taskpaper-reference)

This means that it's possible to add text to task/project titles that will be interpreted by
OmniFocus during processing. For example @due or @defer directives:

```
Project: Order Pizza Tomorrow Evening @defer(+1d) @due(+1d 7pm)
    Task: Call [[PizzaStoreNumber]]
    Task: Place Order for [[Type]], [[Size]], [[Extras]]
    Task: Pay [[VoucherCode]]
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

This plugin performs a "smart" sort of the tasks in a project accounting for flagged, status, defer and due dates.

## [Copy Skip Repeat](copySkipRepeat.omnifocusjs)

Often I have a repeating task that I want to modify for the current repetition, but not affect the next repetition.

This plugin takes the selected task (if it's in a project and has a repeat), copies it and removes the repeat on the copy (leaving the original unaffected).

The original task is completed and the copy can be modified without affecting the original task.

## [Sentinel Task](sentinel.omnifocusjs)

Often I have several tasks, like a shopping list or a bunch of chores, that I want to do today. I don't want to give all of them the Forecast tag, as that would be too much clutter. Instead I want to have a single [sentinel](https://www.dictionary.com/browse/sentinel) task with the Forecast tag that represents them.

With this plugin, if you select an individual representative task like "Shopping" or the tag itself, it will create a single task where the name is "Shopping", and a note with the url of the shopping tag. The current Forcast tag will also be added.
