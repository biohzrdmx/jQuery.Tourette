/**
* jQuery Tourette
* @author biohzrdmx <github.com/biohzrdmx>
* @version 1.0
* @requires jQuery 1.8+
* @license MIT
*/
;(function($) {
	$.Tourette = function(options) {
		var tourette = {
			tour: null,
			position: null,
			current: null,
			elements: null,
			templates: null,
			prevState: null,
			defaults: {
				overlayMarkup: '<div class="tourette-overlay"></div>',
				promptMarkup: '<div class="tourette-prompt"></div>',
				buttonMarkup: '<a href="#" class="tourette-button"></a>',
				onShow: function(landmark) {
					/* Placeholder */
				},
				onHide: function(landmark) {
					/* Placeholder */
				},
				onStart: function(landmark) {
					/* Placeholder */
				},
				onExit: function(landmark) {
					/* Placeholder */
				},
				onButton: function(landmark, action, button) {
					/* Placeholder */
				}
			},
			callbacks: null,
			init: function(options) {
				var obj = this,
					opts = $.extend(true, {}, obj.defaults, options);
				// Save element templates
				obj.templates = {
					overlay: opts.overlayMarkup,
					prompt: opts.promptMarkup,
					button: opts.buttonMarkup
				};
				obj.callbacks = {
					onShow: opts.onShow,
					onHide: opts.onHide,
					onStart: opts.onStart,
					onExit: opts.onExit,
					onButton: opts.onButton
				};
				// Generate DOM elements
				obj.elements = {
					overlay: $(obj.templates.overlay)
				};
				// And add it to the DOM
				obj.elements.overlay.hide();
				$('body').append(obj.elements.overlay);
				//
				return obj;
			},
			load: function(tour) {
				var obj = this;
				// Initialize stuff
				obj.tour = tour || [];
				obj.position = 0;
				obj.current = null;
			},
			start: function() {
				var obj = this;
				obj.position = 0;
				// Check for a valid landmark
				if ( typeof obj.tour.landmarks[obj.position] !== 'undefined' ) {
					// Get the first landmark
					obj.current = obj.tour.landmarks[obj.position];
					obj.callbacks.onStart(obj.current);
					// And start the show
					obj.show();
				} else {
					// No landmarks
				}
			},
			next: function() {
				var obj = this;
				// Move to the next landmark
				obj.position++;
				// Clip the position pointer
				obj.position = obj.position >= obj.tour.landmarks.length ? obj.tour.landmarks.length - 1 : obj.position;
				// Check for a valid landmark
				if ( typeof obj.tour.landmarks[obj.position] !== 'undefined' ) {
					// Get the landmark
					obj.callbacks.onHide(obj.current);
					obj.current = obj.tour.landmarks[obj.position];
					obj.callbacks.onShow(obj.current);
					// Profit!
					obj.show();
				} else {
					// No landmarks
				}
			},
			prev: function() {
				var obj = this;
				// Move to the previous landmark
				obj.position--;
				// Clip the position pointer
				obj.position = obj.position < 0 ? 0 : obj.position;
				// Check for a valid landmark
				if ( typeof obj.tour.landmarks[obj.position] !== 'undefined' ) {
					// Get the landmark
					obj.callbacks.onHide(obj.current);
					obj.current = obj.tour.landmarks[obj.position];
					obj.callbacks.onShow(obj.current);
					// Yay!
					obj.show();
				} else {
					// No landmarks
				}
			},
			show: function() {
				var obj = this;
				if ( typeof obj.current !== 'undefined' ) {
					// Show the overlay if it isn't visible yet
					if (! obj.elements.overlay.is(':visible') ) {
						obj.elements.overlay.fadeIn();
					}
					// Define our prompt factory function
					var createPrompt = function() {
						var prompt = $(obj.templates.prompt);
						// Create a base prompt
						obj.elements.prompt = prompt;
						obj.elements.prompt.append('<h1 class="tourette-title">'+ obj.current.title +'</h1>');
						obj.elements.prompt.append('<div class="tourette-contents">'+obj.current.contents+'</div>');
						// Now create the buttons container
						var actions = $('<div class="tourette-actions"></div>');
						for (var i = 0; i < obj.current.actions.length; i++) {
							(function(action) {
								var button = $(obj.templates.button);
								// Format the button
								button.text(action.text);
								if (action.cssClass) {
									button.attr('class', action.cssClass);
								}
								// And listen to its click event
								button.on('click', function(e) {
									e.preventDefault();
									// Choose from the preset actions
									switch (action.action) {
										case 'Tourette.next':
											obj.next();
											break;
										case 'Tourette.prev':
											obj.prev();
											break;
										case 'Tourette.show':
											obj.show();
											break;
										case 'Tourette.hide':
											obj.hide();
											break;
										default:
											obj.callbacks.onButton(obj.current, action, button);
									}
								});
								// Add the button to the container
								actions.append(button);
							})(obj.current.actions[i]);
						};
						// And add the buttons container
						obj.elements.prompt.append(actions);
						// Hide the prompt and add it to the DOM
						obj.elements.prompt.hide();
						$('body').append(obj.elements.prompt);
						// Now get the actual element and calculate the prompt dimensions
						var element = $(obj.current.element),
							promptWidth = prompt.outerWidth(),
							promptHeight = prompt.outerHeight();
						// Check if the element has a valid object
						if ( obj.current.element && element.length ) {
							obj.moveToElement(element);
						} else {
							// No element, we must center the prompt
							prompt.css({ top: 50, left: '50%', marginLeft: -(promptWidth / 2) + 'px' });
							// Scroll to the top
							$('html, body').animate({
								scrollTop: 0
							}, 400, function() {
								// And show the prompt
								obj.elements.prompt.fadeIn();
							});
						}
					}
					// Now to the actual processing
					if ( obj.elements.prompt ) {
						// Previous prompt, hide it, kill it (with fire) and create a new one
						obj.elements.prompt.fadeOut(function() {
							$(this).remove();
							// But do it after a brief pause
							setTimeout(createPrompt, 400);
						});
					} else {
						// No other prompts in sight, create it directly
						createPrompt();
					}
				} else {
					// No current landmark
				}
			},
			hide: function() {
				var obj = this;
				// Hide callback
				obj.callbacks.onHide(obj.current);
				// Hiding the prompt
				obj.elements.prompt.fadeOut(function() {
					// Kill it
					$(this).remove();
				});
				// Restore stuff
				if (obj.prevState) {
					// Reset previous element properties
					obj.prevState.element.css({ position: obj.prevState.styles.position, zIndex: obj.prevState.styles.zIndex });
					obj.prevState = null;
				}
				// Hide the overlay
				obj.elements.overlay.fadeOut();
				// And go to the top
				$('html, body').animate({
					scrollTop: 0
				}, 400);
				// Exit callback
				obj.callbacks.onExit(obj.current);
			},
			moveToElement: function(element) {
				// Get the dimensions of the viewport and the element
				var obj = this,
					elementPos = element.offset(),
					elementWidth = element.outerWidth(),
					elementHeight = element.outerHeight(),
					viewWidth = $(window).width(),
					viewHeight = $(window).height(),
					prompt = obj.elements.prompt,
					promptWidth = prompt.outerWidth(),
					promptHeight = prompt.outerHeight(),
					scrollPos = 0,
					promptPos = {
						left: 0,
						top: 0
					};
				// Check whether we have a highlighted element to reset or not
				if (obj.prevState) {
					console.log(obj.prevState);
					// Reset previous element properties
					obj.prevState.element.css({ position: obj.prevState.styles.position, zIndex: obj.prevState.styles.zIndex });
					obj.prevState = null;
				}
				// Save current element state
				obj.prevState = {
					element: element,
					styles: {
						position: element.css('position'),
						zIndex: element.css('zIndex')
					}
				}
				// Change position to relative, if required
				element.css({ position: obj.prevState.styles.position == 'absolute' ? obj.prevState.styles.position : 'relative', zIndex: 2100 });
				// Try to fit the prompt vertically
				if (elementPos.top > promptHeight + 15 && !obj.current.forceBelow) {
					// Prompt fits above the element
					prompt.addClass('prompt-above');
					promptPos.top = elementPos.top - (promptHeight + 15);
					scrollPos = promptPos.top - 15;
				} else {
					// Prompt fits below the element
					prompt.addClass('prompt-below');
					promptPos.top = elementPos.top + elementHeight + 15;
					scrollPos = elementPos.top - 15;
				}
				// Try to fit the prompt horizontally
				promptPos.left = elementPos.left + ((elementWidth / 2) - (promptWidth / 2));
				promptPos.left = promptPos.left < 0 ? 0 : (promptPos.left + promptWidth > viewWidth ? viewWidth - promptWidth : promptPos.left);
				// Position the prompt
				prompt.css(promptPos);
				// Scroll to the adequate position
				$('html, body').animate({
					scrollTop: scrollPos
				}, 400, function() {
					// And show the prompt
					obj.elements.prompt.fadeIn();
				});
			}
		};
		// Call constructor and return instance
		return tourette.init(options);
	};
})(jQuery);
