function surveyAlreadyAdded(newSurvey, surveys) {
    for (let survey of surveys) {
        if (survey.url === newSurvey.url) {
            return true;
        }
    }

    return false;
}

chrome.runtime.onMessage.addListener(
    function(survey, sender, callback) {
        chrome.storage.sync.get({
            // Key: default value if not set
            surveyList: [],
        }, function(data) {
            if (surveyAlreadyAdded(survey, data.surveyList)) {
                callback({message: 'This survey has already been added'});
                return;
            }

            data.surveyList.push(survey);
            chrome.storage.sync.set({surveyList: data.surveyList}, function() {
                callback({message: 'Survey added', count: data.surveyList.length});
            });
        });

        return true;
    }
);