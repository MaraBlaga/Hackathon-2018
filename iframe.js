/*window.parent.postMessage(
	{
		extension: true,
		survey_url: 'http://www.surveymonkey.com'
	},
	"*"
);*/
function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

			
function saveSurvey(event) {
	event.preventDefault();
	alert("CLICK!");
	var url = (window.location != window.parent.location)
			? extractHostname(document.referrer)
            : document.location.hostname;
			
	chrome.runtime.sendMessage(
		{
			host: url, //Not the survey URL
			url:  'http://www.surveymonkey.com' //Survey URL
		},
		function(result) {
			console.log("Result: ");
			console.log(result);
		}
	);
}

var button = document.createElement('span');
button.setAttribute('class', 'btn');
button.setAttribute('role', 'button');
button.innerHTML = '<span>Save for later</span>';
button.addEventListener("click", saveSurvey);
window.document.getElementsByClassName('execute')[0].parentElement.append(button);