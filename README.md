# ofplugins

A selection of Omnifocus plugins I use on a regular basis. A work in progress...

For details of the OmniAutomation API and how to install and use a plugin see the [reference documentation](https://omni-automation.com/omnifocus/index.html). The Omni Slack channel is also a very useful resource.

## [Template Plugin](template.omnifocusjs)

A template project is simply an active or paused project with placeholder variables. It can be used
as a template to create new active projects. In the new project any template variables will have been
replaced with real values. The template project can be on hold to avoid cluttering up your active tasks.

Select a template project and run the plugin action and it will:

- Open a form to ask for values for your variables (if any).
- Duplicate the template to create a new project below the template.
- Replace the variables in the copy with values you provided.
- Make the new project active.

The plugin provides one action.

**Select Template**: This action expands the selected template project. 

Variables are fragments of text like:
 
- `[[Name]]`
- `[[Phone Number]]`
- `[[Pizza Toppings]]`
- `[[Number Of Widgets]]`

But they can also have types which the input form can use:

- `[[The Date:date]]` a date picker defaulting to today.
- `[[Start Time:time]]` a date/time picker defaulting to now.
- `[[Year:date:yyyy]]` a date picker that produces just the year. See [formatting rules](https://unicode-org.github.io/icu/userguide/format_parse/datetime/#formatting-dates). The date/time types are actually the same but with different default formats.
- `[[Something:text]]` a longer form of `[[Something]]`.
- `[[Choose:option:One,Two,Three]]` results in the chosen option.
- `[[Checkbox:checkbox]]` results in Yes or No.
- `[[Checkbox1:checkbox:On,Off]]` results in On or Off.

Variable replacement occurs both in the name and note of a project and all it's tasks.

Note that text expansion is performed after internally converting the template
to [OmniFocus TaskPaper format](https://support.omnigroup.com/omnifocus-taskpaper-reference)

This means that it's possible to add text to task/project titles that will be interpreted by
OmniFocus during TaskPaper processing. For example the @due or @defer directives can be placed in the project/task titles with have relative/absolute dates, and these values will become the due/defer date.

An example template project in OmniFocus might be:

![[2022-10-02-065309.png]]
When this project is selected and the action executed, a form will be presented:

![[2022-10-02-065739.png]]

After the form is populated and OK is pressed, a new project is created below the template project, with the template values populated:

![[2022-10-02-065802.png]]

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
