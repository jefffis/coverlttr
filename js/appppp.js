var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.iOS() || isMobile.Windows());
	}
};

var textFile = null;
var localDraft = {};
// var localDraftsCount = 0;
var randomString = Math.random().toString(36).substring(7);

$(function(){
    var form = $('form'),
	    coverLetter = $('#cover-letter'),
    	downloadFile = $('#download-file'),
    	company = $('#company'),
    	title = $('#title'),
    	location = $('#location'),
    	saveLocalDraftBtn = $('#save-local-draft'),
    	localDrafts = $('#local-drafts'),
    	draftList = $('#draft-list');

    if(localStorage.getItem('has-local-drafts')) {
		showLocalDrafts(localDrafts, draftList);
	}

	if(isMobile.any()) {
		downloadFile.text('Email This');
	}

	company.on('keyup', function() {
		var thisRel = $(this).data('rel');
		$('.' + thisRel).text($(this).val());

		if($(this).val() !== '') {
			saveLocalDraftBtn.prop('disabled', false);
		}

	});
	title.on('keyup', function() {
		var thisRel = $(this).data('rel');
		$('.' + thisRel).text($(this).val());

		if($(this).val() !== '') {
			saveLocalDraftBtn.prop('disabled', false);
		}

	});
	location.on('keyup', function() {
		var thisRel = $(this).data('rel');
		$('.' + thisRel).text($(this).val());

		if($(this).val() !== '') {
			saveLocalDraftBtn.prop('disabled', false);
		}

	});
	form.on('submit', function(e) {
		e.preventDefault();
	});
	downloadFile.on('click', function() {
		downloadTextFile($(this));
	});
	saveLocalDraftBtn.on('click', function() {
		saveLocalDraft(company.val(), title.val(), location.val(), coverLetter.html(), localDrafts, draftList, $(this));
	});
	localDrafts.on('click', function() {
		draftList.addClass('shown');
	});
	$('button', draftList).on('click', function() {
		draftList.removeClass('shown');
	});

	// detect change of contenteditable div
	var coverLetterHtml = coverLetter.html();
	coverLetter.on('keyup', function() {
		if(coverLetterHtml != $(this).html()) {
			saveLocalDraftBtn.prop('disabled', false);
		}
	});

	$('body').on('click', '#draft-list a', function() {
		company.val($(this).data('company'));
		title.val($(this).data('title'));
		location.val($(this).data('location'));
		coverLetter.html($(this).data('cover-letter'));
		draftList.removeClass('shown');
		saveLocalDraftBtn.prop('disabled', true);
		randomString = $(this).data('draft-id');
	});

	// $('body').on('click', '#draft-list em', function() {
	// 	var localStorageValue = $(this).data('value'),
	// 		draftLink = $(this).parent();

	// 	for(var i in localStorage) {
	// 		if(localStorageValue === i) {
	// 			localStorage.removeItem(i);
	// 			draftLink.remove();
	// 		}
	// 	}

	// 	for(var i in localStorage) {
	// 		if(localStorage.length < 3) {
	// 			localStorage.removeItem('has-local-drafts');
	// 			setTimeout(function() {
	// 				draftList.removeClass('shown');
	// 				successBanner('All drafts have been removed.');
	// 			}, 500);
	// 		}
	// 	}

	// });
});

function replaceAllText(str, find, replace) {
	if(!str) return;
	return str.replace(new RegExp(find, 'g'), replace);
}

function saveLocalDraft(company, title, location, coverLetter, showLocalDraftsLink, draftList, el) {
	var that = el;
	// console.log(el);
	if ( !localStorage.getItem('has-local-drafts') ) {
		localStorage.setItem('has-local-drafts', true);
	}
	localDraft = {
		'draftId': randomString,
		'company': company,
		'title': title,
		'location': location,
		'coverLetter': replaceAllText(coverLetter, "'", "&#39;")
	}
	localStorage.setItem('local-drafts-' + randomString, JSON.stringify(localDraft));
	showLocalDrafts(showLocalDraftsLink, draftList);
	setTimeout(function() {
		that.addClass('submitted');
	}, 125);
	
	setTimeout(function() {
		that.removeClass('submitted').blur();
		successBanner('Shwing! The draft was saved.');
	}, 1500);
	el.prop('disabled', true);

	// window.location.href = window.location.pathname = '#draft-saved';
	// window.location.reload(true);
}

// if(location.hash === '#draft-saved') {
// 	successBanner('Shwing! The draft was saved.');
// 	history.replaceState({}, document.title, window.location.pathname);
// }

function showLocalDrafts(el, draftList) {
	el.show();

	$('span', draftList).remove();
	var draftNumber = 1;
	for(var i in localStorage) {
		if ( localStorage[i] !== 'true' && typeof localStorage[i] === 'string' ) {
			console.log(localStorage[i]);
			var draft = JSON.parse(localStorage[i]),
				companyName = draft.company !== '' ? draft.company : 'Untitled Draft';
			$('div', draftList).append("<span><a data-draft-id='" + draft.draftId + "' data-company='" + draft.company + "' data-title='" + draft.title + "' data-location='" + draft.location + "' data-cover-letter='" + replaceAllText(draft.coverLetter, "'", "&#39;") + "'>" + companyName + "</a></span>");
			//<em data-value='" + i + "'>Remove</em>
			draftNumber++;
		}
	}
}

function successBanner(msg) {
	var banner = '<div id="success"><p>' + msg + '</p></div>';

	$('body').append(banner);
	setTimeout(function() {
		$('#success').remove();
	}, 3000);
}

function makeTextFile(text) {
	var data = new Blob([text], {type: 'text/plain'});

	// If we are replacing a previously generated file we need to
	// manually revoke the object URL to avoid memory leaks.
	if (textFile !== null) {
		window.URL.revokeObjectURL(textFile);
	}

	textFile = window.URL.createObjectURL(data);

	return textFile;
}
function downloadTextFile(el) {
	var that = el;

	setTimeout(function() {
		that.addClass('submitted');
	}, 125);
	setTimeout(function() {
		var str = '',
			coverLetterContent = document.getElementById('cover-letter'),
			coverLetterTextareaContent = document.getElementById('cover-letter-text'),
			link = document.getElementById('downloadlink');

		str = coverLetterContent.innerHTML.replace(/<br[^>]*>/gi, "\n");
		str = str.replace(/<(?:.|\s)*?>/g, "");

		coverLetterTextareaContent.value = str;

		if(isMobile.any()) {
			// TODO add mobile check
			// coverLetterTextareaContent.select();
			// document.execCommand('copy');
			window.location.href = "mailto:?subject=The cover letter I wrote with CoverBetter&body=" + str;
		} else {
			link.href = makeTextFile(coverLetterTextareaContent.value);
			link.click(); // fake the click, and download the file
		}
	}, 500);
	setTimeout(function() {
		that.removeClass('submitted').blur();
		if(!isMobile.any()) {
			successBanner('Shwing! Text copied.');
		}
	}, 1500);
}