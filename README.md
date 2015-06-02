## Tourette

Meet Tourette. An advanced tour engine for web apps.

### Why Tourette?

From Wikipedia:

_"Tourette syndrome [...] is an inherited neuropsychiatric disorder with onset in childhood, characterized by multiple physical (motor) tics and at least one vocal (phonic) tic. These tics characteristically wax and wane, can be suppressed temporarily, and are preceded by a premonitory urge. Tourette's is defined as part of a spectrum of tic disorders, which includes provisional, transient and persistent (chronic) tics."_

And this plugin provides a solid platform for page **tours**...

...that show you some elements and can trigger **automated events** (open menus, tick checkboxes, fill text areas, etc), effectively **taking control** of the browser...

...so Tourette is darn good name!

### How to use

How do you create your own tours?

It's pretty simple. First make sure to include jQuery (1.8+ would do) and both Tourette's JS and CSS files

**CSS**

`<link rel="stylesheet" href="css/tourette.css">`

**JS**

`<script type="text/javascript" src="js/jquery.min.js"></script>`

`<script type="text/javascript" src="js/tourette.js"></script>`

Then build your great web app or web site, you just need some markup to play with.

And here's the interesting part: _create your tour definition file_

#### The tour definition file

This is the 'map' to your landmarks: each landmark represents an stop in the tour and can be related to a page element.

The basic structure of a tour is a very simple JSON:

	{
		"name":"Sample tour",
		"author":"Your name, email, etc",
		"landmarks":[]
	}

As you may have guessed, `landmarks` will hold each of our tour stops, based on the following structure:

	{
		"name":"landmark-name",
		"title":"Landmark Title",
		"contents":"The text to be shown on the prompt, it may include HTML tags, just try to keep it simple and concise.",
		"element":".element-selector",
		"actions":[]
	}

Landmarks may have a related page element or not: you can put `null` on `element` or a jQuery selector to match the desired element.

And then come the actions. Each prompt can hace one or more buttons to navigate the tour or to trigger custom events/interactions.

Actions are defined by the following structure:

	{
		"text":"Button text",
		"cssClass":".button-class",
		"action":"Button.action"
	}

Tourette comes with some predefined `actions`:

*   `Tourette.next` Jump to the next landmark
*   `Tourette.prev` Jump to the previous landmark
*   `Tourette.show` Show the first landmark
*   `Tourette.hide` Quit the tour

If you want to do other things, you may put a custom action name and use it through the `onButton` callback. More on this below.

If you want to use custom classes on each button, fill the _optional_ `cssClass` item.

#### Loading and running the tour

Once you have your tour definition ready you will need to initialize Tourette:

	var tourette = $.Tourette({ /* options */ }); // Construct a new Tourette object

Then just load your tour file and start the tour. Is that easy!

	$.ajax({
		url: 'tour.json',
		dataType: 'json',
		success: function(response) {
			tourette.load(response);
			tourette.start();
		}
	});

#### Constructor options

You may customize the markup of Tourette elements as well as specify callbacks to know when something happens:

*   `overlayMarkup` The overlay markup, defaults to `<div class="tourette-overlay"></div>`
*   `promptMarkup` The prompt markup, defaults to `<div class="tourette-prompt"></div>`
*   `buttonMarkup` The button markup, defaults to `<a href="#" class="tourette-button"></a>`
*   `onShow` onShow callback (see the next section)
*   `onHide` onHide callback (see the next section)
*   `onStart` onStart callback (see the next section)
*   `onExit` onExit callback (see the next section)
*   `onButton` onButton callback (see the next section)

For example, to use Bootstrap buttons you may do:

	var tourette = $.Tourette({
		buttonMarkup: '<a href="#" class="tourette-button btn btn-primary"></a>'
	});


#### Callbacks

Tourette has an useful set of callbacks that will help you to create awesome page tours easily:

`onShow(landmark)`

Called when the prompt is shown
 Receives the current `landmark` object

`onHide(landmark)`

Called when the prompt is hidden
 Receives the current `landmark` object

`onStart(landmark)`

Called when the tour is started
 Receives the current `landmark` object

`onExit(landmark)`

Called when the tour has ended
 Receives the current `landmark` object

`onButton(landmark, action, button)`

Called when a button with a custom action is clicked
 Receives the current `landmark`, `action` and `button` objects

To receive callbacks, just pass an options object to the Tourette constructor:

	var tourette = $.Tourette({
		onExit: function(landmark) {
			alert('You just ended the tour');
		}
	});

### Troubleshooting

Tourette _should work_ on major, modern browsers and has some mobile support. I've tested it on Firefox and Chrome/Opera. Internet Explorer should do fine, but it may have weird bugs.

TL;DR version, use a modern browser and you should be fine.

However, if you've found a bug, please open an issue. Or better yet, fix it and send me a pull request :)

### Credits

**Lead coder:** biohzrdmx [<github.com/biohzrdmx>](http://github.com/biohzrdmx)

### License

The MIT License (MIT)

Copyright (c) 2015 biohzrdmx

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.