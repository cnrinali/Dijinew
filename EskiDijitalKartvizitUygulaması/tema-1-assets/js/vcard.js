(function($) {
	"use strict";
	let VCF_CONTENT = 'BEGIN:VCARD\nVERSION:3.0';
	VCF_CONTENT += '\nN;LANGUAGE=tr;CHARSET=utf-8:' + TITLE.split(" ").reverse().join(";") + ";;;";
	VCF_CONTENT += '\nFN;CHARSET=utf-8:' + TITLE;
	VCF_CONTENT += '\nTITLE;CHARSET=utf-8:' + SUB_TITLE;
	VCF_CONTENT += '\nTEL;CELL;VOICE: ' + mobilno;
	VCF_CONTENT += '\nURL;WORK: ' + Firmaweb;
	VCF_CONTENT += '\nEMAIL;HOME:' + MAILAL;
	VCF_CONTENT += '\nNOTE;LANGUAGE=tr;CHARSET=utf-8:' + DESCRIPTION;
	VCF_CONTENT += '\nPHOTO;TYPE=JPEG;ENCODING=b:' + LOGO_64_ENCODED;
	if(VCARD_DETAILS.length) {
		for(var i in VCARD_DETAILS) {
			if(VCARD_DETAILS.hasOwnProperty(i)) {
				let type = VCARD_DETAILS[i].type,
					value = VCARD_DETAILS[i].value,
					label = VCARD_DETAILS[i].label || '',
					icon, link;
				value = $('<div>' + value + '</div>').text();
				label = $('<div>' + label + '</div>').text();
				if(type == 'text') {
					value = value.replace(/(?:\r\n|\r|\n)/g, '<br>');
					label = label.replace(/(?:\r\n|\r|\n)/g, '<br>');
				}
				switch(type) {
					case 'profillink':
						icon = '<i class="fa fa-link"></i>';
						link = value;
						VCF_CONTENT += '\nURL;' + value;
						break;
					case 'phone':
						icon = '<i class="fa fa-phone"></i>';
						link = 'tel:' + value;
						VCF_CONTENT += '\nTEL:' + value;
						break;
					case 'adres':
						icon = '<i class="fa fa-map-marker"></i>';
						link = 'https://www.google.com/maps/search/' + value;
						VCF_CONTENT += '\nADR;CHARSET=utf-8:;;' + value + ';;;;';
						break;
					case 'web_site':
						icon = '<i class="fa fa-link"></i>';
						link = value;
						VCF_CONTENT += '\nURL;TYPE=WEBSITE:' + value;
						break;
					case 'Facebook':
						icon = '<i class="fa fa-facebook"></i>';
						link = 'https://facebook.com/' + value;
						VCF_CONTENT += '\nURL;TYPE=FACEBOOK:' + link;
						break;
					case 'Twitter':
						icon = '<i class="fa fa-twitter"></i>';
						link = 'https://twitter.com/' + value;
						VCF_CONTENT += '\nURL;TYPE=TWITTER:' + link;
						break;
					case 'Instagram':
						icon = '<i class="fa fa-instagram"></i>';
						link = 'https://instagram.com/' + value;
						VCF_CONTENT += '\nURL;TYPE=INSTAGRAM:' + link;
						break;
					case 'WhatsApp':
						icon = '<i class="fa fa-whatsapp"></i>';
						link = 'https://api.whatsapp.com/send?phone=' + value;
						VCF_CONTENT += '\nURL;TYPE=WHATSAPP:' + link;
						break;
					case 'Telegram':
						icon = '<i class="fa fa-send"></i>';
						link = 'https://telegram.me/' + value;
						VCF_CONTENT += '\nURL;TYPE=TELEGRAM:' + link;
						break;
					case 'Skype':
						icon = '<i class="fa fa-skype"></i>';
						link = 'skype:' + value;
						break;
					case 'Signal':
						icon = '<svg aria-hidden="true" focusable="false" viewBox="0 0 27 27" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="fill: currentcolor; height: 1em; overflow: visible; width: 1em;"><path d="M10.249 0.411007L10.5446 1.63349C9.36239 1.92857 8.22244 2.39227 7.16693 3.02459L6.51251 1.94965C7.67357 1.2541 8.94019 0.727166 10.249 0.411007ZM16.751 0.411007L16.4554 1.63349C17.6376 1.92857 18.7776 2.39227 19.8331 3.02459L20.4875 1.94965C19.3264 1.2541 18.0598 0.727166 16.751 0.411007ZM1.93159 6.52342C1.23495 7.68267 0.707193 8.94731 0.390539 10.2541L1.61493 10.5492C1.91048 9.36885 2.3749 8.23068 3.00821 7.17681L1.93159 6.52342ZM1.25606 13.5C1.25606 12.8888 1.29828 12.2775 1.40383 11.6663L0.158327 11.4766C-0.0527756 12.8255 -0.0527756 14.1745 0.158327 15.5234L1.40383 15.3337C1.29828 14.7225 1.25606 14.1112 1.25606 13.5ZM20.4875 25.0504L19.8331 23.9754C18.7776 24.6077 17.6376 25.0925 16.4343 25.3876L16.7299 26.6101C18.0598 26.2728 19.3264 25.7459 20.4875 25.0504ZM25.7439 13.5C25.7439 14.1112 25.7017 14.7225 25.5962 15.3337L26.8417 15.5234C27.0528 14.1745 27.0528 12.8255 26.8417 11.4766L25.5962 11.6663C25.7017 12.2775 25.7439 12.8888 25.7439 13.5ZM26.6095 16.7459L25.3851 16.4508C25.0895 17.6522 24.6251 18.7904 23.9918 19.8443L25.0684 20.4977C25.7651 19.3173 26.2928 18.0527 26.6095 16.7459ZM15.3366 25.5984C14.1122 25.7881 12.8878 25.7881 11.6634 25.5984L11.4734 26.8419C12.8245 27.0527 14.1755 27.0527 15.5266 26.8419L15.3366 25.5984ZM23.3585 20.7506C22.6196 21.7412 21.7541 22.6054 20.7619 23.3431L21.5219 24.3548C22.6196 23.5539 23.5696 22.5843 24.3929 21.5094L23.3585 20.7506ZM20.7619 3.65691C21.7541 4.39461 22.6196 5.25878 23.3585 6.24941L24.3718 5.49063C23.5696 4.39461 22.5985 3.44614 21.5219 2.6452L20.7619 3.65691ZM3.64152 6.24941C4.38038 5.25878 5.2459 4.39461 6.23808 3.65691L5.47811 2.6452C4.38038 3.44614 3.43041 4.41569 2.62823 5.49063L3.64152 6.24941ZM25.0684 6.52342L23.9918 7.17681C24.6251 8.23068 25.1106 9.36885 25.4062 10.5703L26.6306 10.2752C26.2928 8.94731 25.7651 7.68267 25.0684 6.52342ZM11.6634 1.40164C12.8878 1.21194 14.1122 1.21194 15.3366 1.40164L15.5266 0.15808C14.1755 -0.0526932 12.8245 -0.0526932 11.4734 0.15808L11.6634 1.40164ZM4.29593 24.692L1.67826 25.3033L2.29046 22.6897L1.04496 22.3946L0.43276 25.0082C0.263878 25.6827 0.686083 26.3782 1.38272 26.5258C1.57271 26.5679 1.76271 26.5679 1.9527 26.5258L4.57037 25.9356L4.29593 24.692ZM1.31939 21.2775L2.54378 21.5726L2.96599 19.76C2.35379 18.7272 1.88937 17.6101 1.59382 16.4508L0.369429 16.7459C0.643862 17.863 1.06607 18.9379 1.61493 19.9496L1.31939 21.2775ZM7.23026 24.0176L5.41478 24.4391L5.71032 25.6616L7.04027 25.3454C8.05356 25.8934 9.13018 26.315 10.249 26.589L10.5446 25.3665C9.3835 25.0925 8.26466 24.6288 7.23026 24.0176ZM13.5 2.53981C7.44136 2.53981 2.52267 7.45082 2.52267 13.5C2.52267 15.5656 3.11376 17.589 4.21149 19.3173L3.15598 23.8279L7.65246 22.774C12.7823 25.9988 19.5586 24.4602 22.7885 19.3384C26.0184 14.2166 24.4773 7.45082 19.3475 4.226C17.5954 3.12998 15.5688 2.53981 13.5 2.53981Z"></path></svg>';
						link = 'javascript:void(0)';
						break;
					case 'Snapchat':
						icon = '<i class="fa fa-snapchat-ghost"></i>';
						link = 'https://www.snapchat.com/add/' + value;
						VCF_CONTENT += '\nURL;TYPE=SNAPCHAT:' + link;
						break;
					case 'Linkedin':
						icon = '<i class="fa fa-linkedin"></i>';
						link = 'https://www.linkedin.com/in/' + value;
						VCF_CONTENT += '\nURL;TYPE=LINKEDIN:' + value;
						break;
					case 'Pinterest':
						icon = '<i class="fa fa-pinterest"></i>';
						link = 'https://pinterest.com/' + value;
						VCF_CONTENT += '\nURL;TYPE=PINTEREST:' + link;
						break;
					case 'Soundcloud':
						icon = '<i class="fa fa-soundcloud"></i>';
						link = 'https://soundcloud.com/' + value;
						VCF_CONTENT += '\nURL;TYPE=SOUNDCLOUD:' + link;
						break;
					case 'Dribble':
						icon = '<i class="fa fa-dribbble"></i>';
						link = 'https://dribbble.com/' + value;
						VCF_CONTENT += '\nURL;TYPE=DRIBBBLE:' + link;
						break;
					case 'Behance':
						icon = '<i class="fa fa-behance"></i>';
						link = 'https://www.behance.net/' + value;
						VCF_CONTENT += '\nURL;TYPE=BEHANCE:' + link;
						break;
					case 'Youtube':
						icon = '<i class="fa fa-youtube-play"></i>';
						VCF_CONTENT += '\nURL;TYPE=YOUTUBE:' + value;
						break;
					case 'Tiktok':
						icon = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="fill: currentcolor; height: 1em; overflow: visible; width: 1em;"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.2585 3C15.5561 5.55428 16.9848 7.07713 19.4688 7.23914V10.112C18.0292 10.2524 16.7683 9.78262 15.3018 8.89699V14.2702C15.3018 21.096 7.84449 23.2291 4.84643 18.3365C2.91988 15.1882 4.09962 9.66382 10.2797 9.44241V12.4719C9.80893 12.5475 9.30564 12.6663 8.84565 12.8229C7.47109 13.2873 6.69181 14.1568 6.90827 15.6904C7.32497 18.6281 12.7258 19.4975 12.2766 13.7571V3.0054H15.2585V3Z"></path></svg>';
						link = 'https://www.tiktok.com/@' + value;
						VCF_CONTENT += '\nURL;TYPE=TIKTOK:' + link;
						break;
					case 'Twitch':
						icon = '<i class="fa fa-twitch"></i>';
						link = 'https://www.twitch.tv/' + value;
						VCF_CONTENT += '\nURL;TYPE=TWITCH:' + link;
						break;
					case 'Github':
						icon = '<i class="fa fa-github"></i>';
						link = 'https://github.com/' + value;
						VCF_CONTENT += '\nURL;TYPE=GITHUB:' + link;
						break;
				}
			}
		}
	}
	VCF_CONTENT += '\nEND:VCARD';

	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/x-vcard;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
	$('.rehberedownload').on('click', function() {
		download(TITLE + ".vcf", VCF_CONTENT);
		;
	});
})(jQuery);