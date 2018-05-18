window.addEventListener('message', receiveMessage, false);

function receiveMessage(evt)
{
	if (evt.origin === 'http://edigitalsurvey.com' || evt.origin.includes('.dev.edig.co.uk')) {
		if (!evt.data.hasOwnProperty('destroyLayer') || evt.data.destroyLayer !== true) {
			return;
		}

		var surveyLayer = window.document.getElementById('edr_survey');

		if (surveyLayer != null) {
			surveyLayer.parentNode.removeChild(surveyLayer);
		}
	}
}