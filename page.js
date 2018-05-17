function handleEvent(e) {

  //console.log(e.origin);
  //console.log(e.data);
  if (e.origin != 'http://edigitalsurvey.com' || !e.data.hasOwnProperty('extension')) {
	  return;
  }
  
  chrome.runtime.sendMessage(
	{
	  host: 'http://sbapanel.com', //Not the survey URL
	  url:  e.data.survey_url //Survey URL
	},
	function(result) {
	  console.log(result);
	}
  );
}

window.addEventListener('message', handleEvent, false);