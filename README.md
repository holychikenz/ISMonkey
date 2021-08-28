ISMonkey
========

Lightweight idlescape extension manager with a set of built-in extensions
available. Extensions can be added directly though greasemonkey are
enabled/disabled through a built-in settings menu.

## Installation
With greasemonkey (or tampermonkey) enabled, one can install the extension
manager directly through this link:  
[ismonkey.user.js](https://github.com/holychikenz/ISMonkey/raw/main/ismonkey.user.js)  
It is recommended that the user first install the base extension manager and
then enable their chosen extensions through the in-game menu.

## Included Extensions
The following extensions are included by default (not all are enabled by default)
and are part of the base code; however, other extensions can be added directly into
the base script.
| | |
|:-|:-|
| Animation Cancel | Remove some unwanted animations that cause high cpu load |
| Food Info | Hover over ingredients have tags and size. Cooking recipes show up in the cooking window |
| Inject CSS | Add css to style various aspects |
| Runecrafting | Add more useful metrics to RC |
| Smithing | Add more useful metrics to smithing |
| Jiggy Slide | Allows the user to resize the 3 main windows by dragging |

## Developers
Extensions are broken into two categories based on whether they listen to socket
messages or not. To add a compatible extension, all that is required is that
it have a compatible constructor. The constuctor should take the form
```javascript
constructor( monkey, options )
```
where `monkey` is a reference to the parent class `ISMonkey` and options is a
dictionary (to be used however you like). Additionally, any extension that requires
reading socket messages should have a `run(obj, msg)` method. For an example
of this, see [playerdata.js](https://github.com/holychikenz/ISMonkey/blob/main/extensions/playerdata.js).
