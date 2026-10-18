/*
	Multiverse by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ]
		});

	// Hack: Enable IE workarounds.
		if (browser.name == 'ie')
			$body.addClass('ie');

	// Touch?
		if (browser.mobile)
			$body.addClass('touch');

	// Transitions supported?
		if (browser.canUse('transition')) {

			// Play initial animations on page load.
				$window.on('load', function() {
					window.setTimeout(function() {
						$body.removeClass('is-preload');
					}, 100);
				});

			// Prevent transitions/animations on resize.
				var resizeTimeout;

				$window.on('resize', function() {

					window.clearTimeout(resizeTimeout);

					$body.addClass('is-resizing');

					resizeTimeout = window.setTimeout(function() {
						$body.removeClass('is-resizing');
					}, 100);

				});

		}

	// Scroll back to top.
		$window.scrollTop(0);

	// Panels.
		var $panels = $('.panel');

		$panels.each(function() {

			var $this = $(this),
				$toggles = $('[href="#' + $this.attr('id') + '"]'),
				$closer = $('<div class="closer" />').appendTo($this);

			// Closer.
				$closer
					.on('click', function(event) {
						$this.trigger('---hide');
					});

			// Events.
				$this
					.on('click', function(event) {
						event.stopPropagation();
					})
					.on('---toggle', function() {

						if ($this.hasClass('active'))
							$this.triggerHandler('---hide');
						else
							$this.triggerHandler('---show');

					})
					.on('---show', function() {

						// Hide other content.
							if ($body.hasClass('content-active'))
								$panels.trigger('---hide');

						// Activate content, toggles.
							$this.addClass('active');
							$toggles.addClass('active');

						// Activate body.
							$body.addClass('content-active');

					})
					.on('---hide', function() {

						// Deactivate content, toggles.
							$this.removeClass('active');
							$toggles.removeClass('active');

						// Deactivate body.
							$body.removeClass('content-active');

					});

			// Toggles.
				$toggles
					.removeAttr('href')
					.css('cursor', 'pointer')
					.on('click', function(event) {

						event.preventDefault();
						event.stopPropagation();

						$this.trigger('---toggle');

					});

		});

		// Global events.
			$body
				.on('click', function(event) {

					if ($body.hasClass('content-active')) {

						event.preventDefault();
						event.stopPropagation();

						$panels.trigger('---hide');

					}

				});

			$window
				.on('keyup', function(event) {

					if (event.keyCode == 27
					&&	$body.hasClass('content-active')) {

						event.preventDefault();
						event.stopPropagation();

						$panels.trigger('---hide');

					}

				});

	// Header.
		var $header = $('#header');

		// Links.
			$header.find('a').each(function() {

				var $this = $(this),
					href = $this.attr('href');

				// Internal link? Skip.
					if (!href
					||	href.charAt(0) == '#')
						return;

				// Redirect on click.
					$this
						.removeAttr('href')
						.css('cursor', 'pointer')
						.on('click', function(event) {

							event.preventDefault();
							event.stopPropagation();

							window.location.href = href;

						});

			});

	// Footer.
		var $footer = $('#footer');

		// Copyright.
		// This basically just moves the copyright line to the end of the *last* sibling of its current parent
		// when the "medium" breakpoint activates, and moves it back when it deactivates.
			$footer.find('.copyright').each(function() {

				var $this = $(this),
					$parent = $this.parent(),
					$lastParent = $parent.parent().children().last();

				breakpoints.on('<=medium', function() {
					$this.appendTo($lastParent);
				});

				breakpoints.on('>medium', function() {
					$this.appendTo($parent);
				});

			});

	// Main.
		var $main = $('#main');

		// Thumbs.
			$main.find('.thumb').each(function() {

				var	$this = $(this),
					$image = $this.find('.image'), $image_img = $image.children('img'),
					x;

				// No image? Bail.
					if ($image.length == 0)
						return;

				// Image.
				// This sets the background of the "image" <span> to the image pointed to by its child
				// <img> (which is then hidden). Gives us way more flexibility.

					// Set background.
						$image.css('background-image', 'url(' + $image_img.attr('src') + ')');

					// Set background position.
						if (x = $image_img.data('position'))
							$image.css('background-position', x);

					// Hide original img.
						$image_img.hide();

			});

		// Poptrox (one lightbox per collection, so next/previous stays inside that collection).
			var $rows = $main.find('.row');

			$rows.poptrox({
				baseZIndex: 20000,
				caption: function($a) {

					var s = '';

					$a.nextAll().each(function() {
						s += this.outerHTML;
					});

					return s;

				},
				fadeSpeed: 300,
				onPopupClose: function() { $body.removeClass('modal-active'); },
				onPopupOpen: function() { $body.addClass('modal-active'); },
				overlayOpacity: 0,
				popupCloserText: '',
				popupHeight: 150,
				popupLoaderText: '',
				popupSpeed: 300,
				popupWidth: 150,
				selector: '.thumb > a.image',
				usePopupCaption: true,
				usePopupCloser: true,
				usePopupDefaultStyling: false,
				usePopupForceClose: true,
				usePopupLoader: true,
				usePopupNav: true,
				windowMargin: 50
			});

			// Hack: Set margins to 0 when 'xsmall' activates.
				breakpoints.on('<=xsmall', function() {
					$rows.each(function() { this._poptrox.windowMargin = 0; });
				});

				breakpoints.on('>xsmall', function() {
					$rows.each(function() { this._poptrox.windowMargin = 50; });
				});

			// Swipe left/right inside the full-size view to change photo.
				var touchX = null, touchY = null;

				$(document)
					.on('touchstart', '.poptrox-popup', function(event) {
						var t = event.originalEvent.touches[0];
						touchX = t.clientX;
						touchY = t.clientY;
					})
					.on('touchend', '.poptrox-popup', function(event) {

						if (touchX === null)
							return;

						var t = event.originalEvent.changedTouches[0],
							dx = t.clientX - touchX,
							dy = t.clientY - touchY;

						touchX = touchY = null;

						if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
							$(this).find(dx < 0 ? '.nav-next' : '.nav-previous').trigger('click');

					});

	// Collections.
		var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
			$collections = $main.find('.collection'),
			$dots = $('#collection-dots .dot');

		// Rows: prev/next arrows + overflow detection.
			$collections.each(function() {

				var $wrap = $(this).find('.row-wrap'),
					row = $wrap.find('.row')[0],
					$prev = $wrap.find('.row-arrow.prev'),
					$next = $wrap.find('.row-arrow.next'),
					ticking = false;

				function update() {
					var max = row.scrollWidth - row.clientWidth;
					$wrap.toggleClass('has-overflow', max > 4);
					$prev.toggleClass('is-hidden', row.scrollLeft <= 4);
					$next.toggleClass('is-hidden', row.scrollLeft >= max - 4);
					ticking = false;
				}

				function scrollRow(dir) {
					row.scrollBy({ left: dir * row.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
				}

				$prev.on('click', function() { scrollRow(-1); });
				$next.on('click', function() { scrollRow(1); });

				$(row).on('scroll', function() {
					if (!ticking) {
						ticking = true;
						window.requestAnimationFrame(update);
					}
				});

				$window.on('load resize', update);
				update();

			});

		// Dots: highlight the collection in view, jump on click.
			function updateDots() {

				var refY = window.innerHeight * 0.4,
					atBottom = (window.innerHeight + window.pageYOffset) >= (document.documentElement.scrollHeight - 2),
					current = 0;

				$collections.each(function(i) {
					if (this.getBoundingClientRect().top <= refY)
						current = i;
				});

				if (atBottom)
					current = $collections.length - 1;

				$dots.each(function(i) {
					$(this).toggleClass('is-active', i === current);
				});

			}

			var dotsTicking = false;

			$window.on('scroll resize load', function() {
				if (!dotsTicking) {
					dotsTicking = true;
					window.requestAnimationFrame(function() {
						updateDots();
						dotsTicking = false;
					});
				}
			});

			$dots.on('click', function(event) {

				var target = $($(this).attr('href'))[0];

				event.preventDefault();
				event.stopPropagation();

				// Close the About panel first if it's open.
					if ($body.hasClass('content-active'))
						$panels.trigger('---hide');

				if (target)
					target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

			});

			updateDots();

})(jQuery);