(function ($) {
    "use strict";

    let VCF_CONTENT = 'BEGIN:VCARD\nVERSION:3.0';
    VCF_CONTENT += '\nN:'+TITLE;
    VCF_CONTENT += '\nFN:'+ISIM;
    VCF_CONTENT += '\nTITLE:'+SUB_TITLE;
    VCF_CONTENT += '\nNOTE:'+DESCRIPTION;
    VCF_CONTENT += '\nORG:'+ORG;
    VCF_CONTENT += '\nPHOTO;TYPE=JPEG;ENCODING=b:'+LOGO_64_ENCODED;

    // add card detail
    if (VCARD_DETAILS.length) {
        for (var i in VCARD_DETAILS) {
            if (VCARD_DETAILS.hasOwnProperty(i)) {
                if (DETAILS_FIELD_LIMIT == i) {
                    break;
                }

                let type = VCARD_DETAILS[i].type,
                    value = VCARD_DETAILS[i].value,
                    label = VCARD_DETAILS[i].label || '',
                    icon, link;

                value = $('<div>'+value+'</div>').text();
                label = $('<div>'+label+'</div>').text();

                if(type == 'text') {
                    value = value.replace(/(?:\r\n|\r|\n)/g, '<br>');
                    label = label.replace(/(?:\r\n|\r|\n)/g, '<br>');
                }

                switch (type) {
                    case 'phone':
                        icon = '<i class="fa fa-phone"></i>';
                        link = 'tel:' + value;
                        VCF_CONTENT += '\nTEL:'+value;
                        break;
                    case 'email':
                        icon = '<i class="fa fa-envelope"></i>';
                        link = 'mailto:' + value;
                        VCF_CONTENT += '\nEMAIL:'+value;
                        break;
                    case 'address':
                        icon = '<i class="fa fa-map-marker"></i>';
                        link = 'https://www.google.com/maps/search/' + value;
                        VCF_CONTENT += '\nADR:;;'+value+';;;';
                        break;
                    case 'website':
                        icon = '<i class="fa fa-link"></i>';
                        link = value;
                        VCF_CONTENT += '\nURL;TYPE=WEBSITE:'+value;
                        break;
                    case 'text':
                        icon = '<i class="fa fa-align-left"></i>';
                        link = 'javascript:void(0)';
                        break;
                    case 'facebook':
                        icon = '<i class="fa fa-facebook"></i>';
                        link = 'https://www.facebook.com/' + value;
                        VCF_CONTENT += '\nURL;TYPE=FACEBOOK:'+link;
                        break;
                    case 'twitter':
                        icon = '<i class="fa fa-twitter"></i>';
                        link = 'https://twitter.com/' + value;
                        VCF_CONTENT += '\nURL;TYPE=TWITTER:'+link;
                        break;
                    case 'instagram':
                        icon = '<i class="fa fa-instagram"></i>';
                        link = 'https://instagram.com/' + value;
                        VCF_CONTENT += '\nURL;TYPE=INSTAGRAM:'+link;
                        break;
                    case 'whatsapp':
                        icon = '<i class="fa fa-whatsapp"></i>';
                        link = 'https://api.whatsapp.com/send?phone=' + value;
                        VCF_CONTENT += '\nURL;TYPE=WHATSAPP:'+link;
                        break;
                    case 'telegram':
                        icon = '<i class="fa fa-send"></i>';
                        link = 'https://telegram.me/' + value;
                        VCF_CONTENT += '\nURL;TYPE=TELEGRAM:'+link;
                        break;
                    case 'skype':
                        icon = '<i class="fa fa-skype"></i>';
                        link = 'skype:' + value;
                        break;
                    case 'wechat':
                        icon = '<i class="fa fa-wechat"></i>';
                        link = 'javascript:void(0)';
                        break;
                    case 'snapchat':
                        icon = '<i class="fa fa-snapchat-ghost"></i>';
                        link = 'https://www.snapchat.com/add/' + value;
                        VCF_CONTENT += '\nURL;TYPE=SNAPCHAT:'+link;
                        break;
					case 'linkedin':
                        icon = '<i class="fa fa-linkedin"></i>';
                        link = 'https://www.linkedin.com/' + value;
                        VCF_CONTENT += '\nURL;TYPE=linkedin:'+link;
                        break;
                    case 'sahibinden':
                        icon = '<i class="fa fa-scribd"></i>';
                        link = value;
                        VCF_CONTENT += '\nURL;TYPE=SAHIBINDEN:'+value;
                        break;
                    case 'hepsiemlak':
                        icon = '<i class="fa fa-home"></i>';
                        link = value;
                        VCF_CONTENT += '\nURL;TYPE=HEPSIEMLAK:'+value;
                        break;
                    case 'arabamcom':
                        icon = '<i class="fa fa-car"></i>';
                        link = value;
                        VCF_CONTENT += '\nURL;TYPE=ARABAM:'+value;
                        break;
                    case 'letgo':
                        icon = '<i class="fa fa-modx"></i>';
                        link = value;
                        VCF_CONTENT += '\nURL;TYPE=LETGO:'+value;
                        break;
                    case 'pinterest':
                        icon = '<i class="fa fa-pinterest"></i>';
                        link = 'https://pinterest.com/' + value;
                        VCF_CONTENT += '\nURL;TYPE=PINTEREST:'+link;
                        break;
                    case 'soundcloud':
                        icon = '<i class="fa fa-soundcloud"></i>';
                        link = 'https://soundcloud.com/' + value;
                        VCF_CONTENT += '\nURL;TYPE=SOUNDCLOUD:'+link;
                        break;
                    case 'vimeo':
                        icon = '<i class="fa fa-vimeo"></i>';
                        link = 'https://vimeo.com/' + value;
                        VCF_CONTENT += '\nURL;TYPE=VIMEO:'+link;
                        break;
                    case 'dribbble':
                        icon = '<i class="fa fa-dribbble"></i>';
                        link = 'https://dribbble.com/' + value;
                        VCF_CONTENT += '\nURL;TYPE=DRIBBBLE:'+link;
                        break;
                    case 'behance':
                        icon = '<i class="fa fa-behance"></i>';
                        link = 'https://www.behance.net/' + value;
                        VCF_CONTENT += '\nURL;TYPE=BEHANCE:'+link;
                        break;
                    case 'flickr':
                        icon = '<i class="fa fa-flickr"></i>';
                        link = 'https://flickr.com/' + value;
                        VCF_CONTENT += '\nURL;TYPE=FLICKR:'+link;
                        break;
                    case 'youtube':
                        icon = '<i class="fa fa-youtube-play"></i>';
                        link = 'https://www.youtube.com/channel/' + value;
                        VCF_CONTENT += '\nURL;TYPE=YOUTUBE:'+link;
                        break;
                    case 'tiktok':
                        icon = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="fill: currentcolor; height: 1em; overflow: visible; width: 1em;"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.2585 3C15.5561 5.55428 16.9848 7.07713 19.4688 7.23914V10.112C18.0292 10.2524 16.7683 9.78262 15.3018 8.89699V14.2702C15.3018 21.096 7.84449 23.2291 4.84643 18.3365C2.91988 15.1882 4.09962 9.66382 10.2797 9.44241V12.4719C9.80893 12.5475 9.30564 12.6663 8.84565 12.8229C7.47109 13.2873 6.69181 14.1568 6.90827 15.6904C7.32497 18.6281 12.7258 19.4975 12.2766 13.7571V3.0054H15.2585V3Z"></path></svg>';
                        link = 'https://www.tiktok.com/@' + value;
                        VCF_CONTENT += '\nURL;TYPE=TIKTOK:'+link;
                        break;
                    case 'discord':
                        icon = '<svg aria-hidden="true" focusable="false" viewBox="0 0 30 21" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="fill: currentcolor; height: 1em; overflow: visible; width: 1em;"><path d="M25.9091 1.625C25.9091 1.625 22.7727 -0.7375 19.0909 -1L18.75 -0.34375C22.0909 0.44375 23.5909 1.55938 25.2273 2.9375C22.5 1.55938 19.7727 0.3125 15 0.3125C10.2273 0.3125 7.5 1.55938 4.77273 2.9375C6.34091 1.55938 8.18182 0.3125 11.25 -0.34375L10.9091 -1C7.02273 -0.671875 4.09091 1.625 4.09091 1.625C4.09091 1.625 0.613636 6.48125 0 16.0625C3.54545 20 8.86364 20 8.86364 20L9.95455 18.5562C8.04545 17.9 5.93182 16.7844 4.09091 14.75C6.27273 16.3906 9.61364 18.0312 15 18.0312C20.3864 18.0312 23.7273 16.3906 25.9091 14.75C24.0682 16.7844 21.8864 17.9 20.0455 18.5562L21.1364 20C21.1364 20 26.4545 20 30 16.0625C29.3864 6.48125 25.9091 1.625 25.9091 1.625ZM10.5682 13.4375C9.27273 13.4375 8.18182 12.2563 8.18182 10.8125C8.18182 9.36875 9.27273 8.1875 10.5682 8.1875C11.8636 8.1875 12.9545 9.36875 12.9545 10.8125C12.9545 12.2563 11.8636 13.4375 10.5682 13.4375ZM19.4318 13.4375C18.1364 13.4375 17.0455 12.2563 17.0455 10.8125C17.0455 9.36875 18.1364 8.1875 19.4318 8.1875C20.7273 8.1875 21.8182 9.36875 21.8182 10.8125C21.8182 12.2563 20.7273 13.4375 19.4318 13.4375Z"></path></svg>';
                        link = 'https://discord.gg/' + value;
                        VCF_CONTENT += '\nURL;TYPE=DISCORD:'+link;
                        break;
                    case 'twitch':
                        icon = '<i class="fa fa-twitch"></i>';
                        link = 'https://www.twitch.tv/' + value;
                        VCF_CONTENT += '\nURL;TYPE=TWITCH:'+link;
                        break;
                    case 'github':
                        icon = '<i class="fa fa-github"></i>';
                        link = 'https://github.com/' + value;
                        VCF_CONTENT += '\nURL;TYPE=GITHUB:'+link;
                        break;
                    case 'paypal':
                        icon = '<i class="fa fa-paypal"></i>';
                        link = 'https://paypal.me/' + value;
                        VCF_CONTENT += '\nURL;TYPE=PAYPAL:'+link;
                        break;
                }

                let $tpl = $('<tr class="vcard-type-' + type + '">' +
                    '<td>' +
                    '<a href="' + link + '"><span class="contact-action-container-icon">'  +
                    icon +
                    '</span></a>' +
                    '</td>' +
                    '<td>' +
                    '<a target="_blank" href="' + link + '" class="contact-action-container-text">' +
                    (label != ''
                        ? label
                        : value) +
                    '</a>' +
                    '</td>' +
                    '</tr>');

                $('.vCard-list').append($tpl);
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
    $('.add-to-contact-btn').on('click',function () {
        // Start file download.
        download(TITLE+".vcf",VCF_CONTENT);
    });
})(jQuery);