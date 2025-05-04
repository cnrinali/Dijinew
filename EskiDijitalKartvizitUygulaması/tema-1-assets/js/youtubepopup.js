/*!
 * GRT Youtube Popup - jQuery Plugin
 * Version: 1.0
 * Author: GRT107
 *
 * Copyright (c) 2017 GRT107
 * Released under the MIT license
 */
(function($) {
	$.fn.grtyoutube = function(options) {
		return this.each(function() {
			var getvideoid = $(this).attr("youtubeid");
			var settings = $.extend({
				videoID: getvideoid,
				autoPlay: true,
				theme: "dark"
			}, options);
			if(settings.autoPlay === true) {
				settings.autoPlay = 1
			} else if(settings.autoPlay === false) {
				settings.autoPlay = 0
			}
			if(settings.theme === "dark") {
				settings.theme = "youtube-siyah-theme"
			} 
			if(getvideoid) {
				$(this).on("click", function() {
					$("body").append('<div class="youtubepopup ' + settings.theme + '">' + '<div class="youtubepopupic">' + '<span class="youtubepopupkapa"></span>' + '<iframe class="youtube-iframe" src="https://www.youtube.com/embed/' + settings.videoID + '?rel=0&wmode=transparent&autoplay=' + settings.autoPlay + '&iv_load_policy=3" allowfullscreen frameborder="0" allow="autoplay; fullscreen"></iframe>' + '</div>' + '</div>');
				});
			}
			$(this).on('click', function(event) {
				event.preventDefault();
				$(".grtyoutube-popup-close, .youtubepopup").click(function() {
					$(".youtubepopup").remove();
				});
			});
			$(document).keyup(function(event) {
				if(event.keyCode == 27) {
					$(".youtubepopup").remove();
				}
			});
		});
	};
}(jQuery));
// Demo video 1
$(".youtube-link").grtyoutube({
	autoPlay: true,
	theme: "dark"
});

$('.kategori div:last-child').addClass("kategorisonu");