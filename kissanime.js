var URL = window.location.origin;
var hostName = window.location.hostname;
var fullURL = window.location.href;

// determine if user is on KissAnime and on the anime's main episode page
if (hostName.search(/kissanime\.\w+/i) != -1){	
	if (fullURL.search(/kissanime\.\w+\/Anime\//i) == -1) {
		alert("You are not on the Anime's main episode page.");
		//fake function to cause script to terminate
		AbortJavaScript();
	}
}

// determine if user is on KissCartoon and on the cartoon's main episode page
else if (hostName.search(/kisscartoon\.\w+/i) != -1){
	if (fullURL.search(/kisscartoon\.\w+\/Cartoon\//i) == -1) {
		alert("You are not on the Cartoon's main episode page.");
		//fake function to cause script to terminate
		AbortJavaScript();
	}
}

// determine if user is on KissAsian and on the drama's main episode page
else if (hostName.search(/kissasian\.\w+/i) != -1){
	if (fullURL.search(/kissasian\.\w+\/Drama\//i) == -1) {
		alert("You are not on the Drama's main episode page.");
		//fake function to cause script to terminate
		AbortJavaScript();
	}
}

else {
	alert("You are not on a valid Kiss (Anime/Cartoon/Asian) site to use this script.");
	//fake function to cause script to terminate
	AbortJavaScript();
}


var episodeLinks = $('table.listing a').map(function(i,el) { return $(el).attr('href'); });
console.log('Found ' + episodeLinks.length + ' episode links on current page.');
if (episodeLinks === 0 || episodeLinks === null) {
	alert("There are no episode links on this page.");
	//fake function to cause script to terminate
	AbortJavaScript();
}


$.ajaxSetup({async:false});
$.getScript("http://kissanime.com/Scripts/asp.js");

var startEpisode = 1

var endEpisode = episodeLinks.length;

var videoQuality = '1280x720.mp4';

var i;
var long_url;
var newLinks = '';
var c = startEpisode;
for (i = (episodeLinks.length - startEpisode); i >= (episodeLinks.length - endEpisode); i--) {
	jQuery.ajax({
        url:    URL + episodeLinks[i], 
        success: function(result) {
            var $result = eval($(result));
			var stringStart = result.search("var wra"); 
			var stringEnd = result.search("document.write"); 
			var javascriptToExecute = result.substring(stringStart, stringEnd);
			eval(javascriptToExecute);
			
			$("body").append('<div id="episode' + i + '" style="display: none;"></div>')
			$('#episode' + i).append(wra); 
			
			var downloadQualityOptions = $('#episode' + i + ' a').map(function(i,el) { return $(el); });
			var j; 
			var qualityFound = false;
			for (j = 0; j < downloadQualityOptions.length; j++) {
				if (videoQuality === downloadQualityOptions[j].html()) {
					long_url = downloadQualityOptions[j].attr('href');
					qualityFound = true;
				} 
			}
			//if preferred quality is not found, defaults to highest quality
			if (qualityFound == false){
				videoQuality = downloadQualityOptions[0].html();
				long_url = downloadQualityOptions[0].attr('href');
			}
			console.log('Completed: ' + c + '/' + (endEpisode - startEpisode + 1));
			newLinks = newLinks + '<a href="' + long_url + '" target="_blank">Episode ' + c + ' (' + videoQuality + ')</a><br></br>\n';
			c++
        },
        async:   false, 
		script:  true
    });
}

var newPageText = 'Kissanime <br /> \n'
newPageText += '<style>body {}a {color: #D5F406;text-decoration: none;outline: medium none;}a:hover {color:#648f06;text-decoration:none;}html,body{font:normal 12px "Tahoma",Arial,Helvetica,sans-serif;line-height:18px;color:#dadada;background-color:#161616;}</style>'
newPageText += 'Links: <br /> \n'
newPageText += newLinks

var newPage = window.open();
newPage.document.body.innerHTML = newPageText
