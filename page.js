if (document.readyState === 'complete') {
	myInitCode();
} else {
	document.addEventListener('DOMContentLoaded', function () {
		myInitCode();
	});
}

function myInitCode() {
	function main () {
		window.addEventListener('message', receiveMessage, false);

		function receiveMessage(evt)
		{
			if (evt.origin === 'http://edigitalsurvey.com' || evt.origin.includes('.dev.edig.co.uk')) {
				if (!evt.data.hasOwnProperty('destroyLayer') || evt.data.destroyLayer !== true) {
					return;
				}

				EDRSurvey.getLayers()[0].destroy();
			}
		}
	}

	var script = window.document.createElement('script');
	script.appendChild(window.document.createTextNode('('+ main +')();'));
	(document.body || document.head || document.documentElement).appendChild(script);
}
