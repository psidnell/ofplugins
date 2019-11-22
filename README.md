# ofplugins

A work in progress...

For details of the API see the [reference documentation](https://omni-automation.com/omnifocus/index.html).

## [Template Plugin](template.omnifocusjs)

Select a project and the plugin will duplicate it and replace any variables
(e.g. ${Name}, ${PhoneNumber}) with values the user enters in a form.

## [Toggle Plugin](toggle.omnifocusjs)

Select a folder and the plugin will descend the structure toggling the
projects between active and on-hold.

A HIDDEN/DEACTIVATED tag is added to or removed from on-hold projects to avoid
toggling projects that were already on hold.  