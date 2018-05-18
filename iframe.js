/*window.parent.postMessage(
	{
		extension: true,
		survey_url: 'http://www.surveymonkey.com'
	},
	"*"
);*/
function extractHostname(url, getProtocol, getPort) {
    var hostname;

    if (getProtocol === false) {
        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }
    } else {
        hostname = url.split('/')[0] + '//' + url.split('/')[2];
    }

    if (getPort === false) {
        parts = hostname.split(':');
        //find & remove port number
        hostname = parts[0];
        if (getProtocol) {
            hostname += ':' + parts[1];
        }
    }
    return hostname;
}

function genGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


function saveSurvey(event) {
	event.preventDefault();

	var url = (window.location != window.parent.location)
		? extractHostname(document.referrer, false, false)
		: document.location.hostname;

	var iconPath = extractHostname(document.referrer, true, true) + '/favicon.ico';

	chrome.runtime.sendMessage({type: "notification", options: {
			icon: iconPath,
			host: url, // Not the survey URL
            guid: genGuid(),
            entryData: {
			    data1: "",
                data2: "",
                data3: "",
                deploymentId: /*"630062866",*/"129936546",
                installationId: /*"INS-763587847",*/"INS-447627824",
                locale: "",
                probes: {},
                surveyId: /*"ESV-390991618",*/"ESV-189533661",
                test: true,
                url: "http://sba.php7.edr-0902.dev.edig.co.uk:8083/",
                uuid: ""
            }
		}}, function (result) {
		if (result.success) {
			window.parent.postMessage({destroyLayer: true}, "*");
		}

		console.log('Result: ');
		console.log(result);
	});
}

var button = document.createElement('span');
button.setAttribute('class', 'btn');
button.setAttribute('role', 'button');
button.innerHTML = '<span>Save for later</span>';
button.addEventListener("click", saveSurvey);
window.document.getElementsByClassName('execute')[0].parentElement.append(button);