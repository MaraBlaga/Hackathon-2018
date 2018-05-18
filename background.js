function surveyAlreadyAdded(newSurvey, surveys) {
    for (let survey of surveys) {
        //if (survey.entryData.deploymentId === newSurvey.entryData.deploymentId) {
        if (survey.host === newSurvey.host) {
            return true;
        }
    }

    return false;
}

function updateCount(surveys) {
    let count = surveys.length;
    if (count !== 0) {
        chrome.browserAction.setBadgeText({text: count.toString()}); // Display how many surveys we have
        chrome.browserAction.setBadgeBackgroundColor({color: [244, 104, 19, 100]});
    } else {
    chrome.browserAction.setBadgeText({text: ''});
    }
}

chrome.storage.sync.get({
    // Key: default value if not set
    surveyList: [],
}, function(data) {
    console.log(data.surveyList);
    updateCount(data.surveyList);
});

chrome.runtime.onMessage.addListener(
    function(request, sender, callback) {
        switch (request.type) {
            case "notification":
                let survey = request.options;
                chrome.storage.sync.get({
                    // Key: default value if not set
                    surveyList: [],
                }, function(data) {
                    if (surveyAlreadyAdded(survey, data.surveyList)) {
						chrome.notifications.create('addedSurvey', {
							'message': 'This survey has already been saved',
							'type': 'basic',
							'iconUrl': 'S-icon-2.png',
							'title': 'Warning'
						}, function () {
							console.log('Created warning notification');
						});

                        callback({
							success: true,
							alreadyExists: true,
							message: 'This survey has already been added'
                        });
                        return;
                    }

                    data.surveyList.push(survey);
                    chrome.storage.sync.set({surveyList: data.surveyList}, function() {
                        updateCount(data.surveyList);
                        chrome.notifications.create('addedSurvey', {
                        	'message': 'Survey has been saved for later',
							'type': 'basic',
							'iconUrl': 'S-icon.png',
							'title': 'Success'
						}, function () {
                        	console.log('Created notification');
						});
                        callback({
							success: true,
							alreadyExists: false,
							message: 'Survey added',
							count: data.surveyList.length
                        });
                    });
                });
                break;
        }

        return true;
    }
);
