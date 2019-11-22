# About

This is an Omni Automation plug-in bundle for OmniFocus that provides 'waiting for' and 'follow up' actions. Further details of these actions are provided below.

_Please note that Omni Automation for OmniFocus is still in development and details are subject to change before it officially ships. If you have questions, please refer to [Omni's Slack #automation channel](https://www.omnigroup.com/slack/)._

_In addition, please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from a random amateur on the internet!)_

_**Known issue:** These scripts do not currently appear to function correctly on tasks in the inbox._

# Installation & Set-Up

**Important note: for this plug-in bundle to work correctly, my [Function Library for OmniFocus](https://github.com/ksalzke/function-library-for-omnifocus) is also required and needs to be added to the plug-in folder separately.**

1. Click on the green `Clone or download` button above to download a `.zip` file of all the files in this GitHub repository.
2. Unzip the downloaded file.
3. Open the configuration file located at `Resources/delegationConfig.js` and make any changes needed to reflect your OmniFocus set-up. Further explanations of the options are included within that file as comments.
4. Rename the entire folder to anything you like, with the extension `.omnifocusjs`
5. Move the resulting file to your OmniFocus plug-in library folder.

# Actions

This plug-in contains the following two actions:

## Waiting For
This action can be run on one or more selected tasks. For each task, it:

1. Runs the actions configured in the configuration file (under `functionsForOriginalTaskBeforeWaiting`). By default, this runs the [`customComplete` function in the 'Custom Complete' library](https://github.com/ksalzke/custom-complete-omnifocus-plugin/blob/master/Resources/customCompleteLib.js) of my [Custom Complete OmniFocus Plugin](https://github.com/ksalzke/custom-complete-omnifocus-plugin), or, if that is not installed, simply marks the task as complete.
2. Creates a new task after the selected task(s). Optionally (when the `showForm` setting in the configuration file is set to `true`), a form is shown to confirm or change the task's details, including its due date, before it is created. By default (in the form and also if the form is not shown), this task's:
   * name is the same as the original task's name, but with `Waiting for: ` prepended
   * tag is the `waitingTag` specified in the configuration file (currently this is `Activity Type: ⏳ Waiting` by default.
   * defer date is the the date that is the number of days specified in the configuration file from today (e.g. if `defaultDeferDays` is `1`, the default defer date will be tomorrow); the user's default start time is used. By default this is set to `null` and there is no defer date set

Note that any project tags will also be inherited, unless they are specified as `uninheritedTags` in the configuration file.

## Follow Up
This action can be run on one or more selected tasks.

It first prompts the user for a contact method to be used to follow up on the selected task(s). These are taken from the `followUpMethods` variable in the configuration file and by default are any children of the `Activity Type: Contact` tag.

Then, for each selected task:
1. If the task is not already contained within such an action group, creates a sequential action group with the same name as the selected task(s).
2. Moves the task into the parent sequential action group.
3. Creates a new task before the original task (and inside the action group) whose: 
   * name is the same as the original task's name, but with  `Follow up: ` prepended in place of `Waiting for: `.
   * tags are the same as the original task's tags (tags may also be inherited from a containing action group or project), but with the the following changes:
      * the selected follow-up method is added 
      * any waiting tags (the tag specified as `waitingTag` in the configuration file as well as any of its children) are removed
      * any tags specified as `uninheritedTags` in the configuration file are removed
   * note is a link to the original task in the format `[FOLLOWUPON: omnifocus///task/taskid]`

Note that the parent sequential action group is created so that the 'waiting for' task only becomes available after the follow-up task has been completed (or dropped or deleted), even in a parallel project or single-action list.

# Functions

This plugin also contains the following function within the `delegationLib` library:

## noteFollowUp

This function takes a task as input and if the task begins with `follow up` or `Follow up` it looks in the note of the task for a `[FOLLOWUPON]` tag of the type created by the `Follow Up` action.

If one is found it adds a note to that original task indicating that the task has been followed up on the current time and date.

It is hoped that in the future this will be able to be run automatically on the completion of a task, but currently the intention is that it will be run manually from a 'custom complete' action. It can be used as follows (given a task stored in variable `task`):

```
delegationPlugin = PlugIn.find("com.KaitlinSalzke.Delegation");
	if (delegationPlugin !== null) {
		delegationPlugin.library("delegationLib").noteFollowUp(task);
	}
```

An example can be seen in the [`customComplete` function in the 'Custom Complete' library](https://github.com/ksalzke/custom-complete-omnifocus-plugin/blob/master/Resources/customCompleteLib.js) in my [Custom Complete OmniFocus Plugin/Repository](https://github.com/ksalzke/custom-complete-omnifocus-plugin).