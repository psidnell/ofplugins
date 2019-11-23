# ofplugins

Omnifocus plugins I use on a regular basis. Always a work in progress...

For details of the API see the [reference documentation](https://omni-automation.com/omnifocus/index.html).

## [Template Plugin](template.omnifocusjs)

Select a project and the plugin will duplicate it and replace variables of your choice like:
 
- ${Name}
- ${PhoneNumber}
- ${Priority}

A form will be shown that requests values for these variables.

There are also some special variables where the value will be provided automatically
such as:

- ${Date}
- ${Time}

Variable replacement occurs both in the name and note of a project and it's tasks.

## [Toggle Plugin](toggle.omnifocusjs)

Select a folder and the plugin will descend the structure toggling the
projects between active and on-hold.

A HIDDEN/DEACTIVATED tag is added to or removed from on-hold projects to avoid
toggling projects that were already on hold.