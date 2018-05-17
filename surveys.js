function get_surveys(callback) {
    chrome.storage.sync.get({
        // Key: default value if not set
        surveyList: [],
    }, function(data) {
        callback(data.surveyList);
    });
}

// Restores surveys
// stored in chrome.storage.
function restore_surveys() {
    /*save_surveys([
     {host: "testsurveyurl.com", url: "https://testsurveyurl.com/survey/enter/s/ESV-123"},
     {host: "testsurveyurl2.com", url: "https://testsurveyurl2.com/survey/enter/s/ESV-456"}
     ]);*/
    get_surveys(render_surveys);
}

function save_surveys(surveys, callback) {
    chrome.storage.sync.set({surveyList: surveys}, function() {
        if (typeof callback === 'function') {
            callback();
        }
    });
}

function store_survey(survey, callback) {
    get_surveys(function(surveys) {
		console.log(survey);
        surveys.push(survey);
        save_surveys(surveys, function() {
            add_to_list(survey);
            callback({message: 'Survey added', count: surveys.length});
        });
    });
}

function render_surveys(surveys) {
    for (let survey of surveys) {
        add_to_list(survey);
    }
}

function add_to_list(survey) {
    let table = document.querySelector('table#surveyList tbody'),
        row = table.insertRow(-1),
        hostCell = row.insertCell(0),
        actionCell = row.insertCell(1),
        btnGroup = document.createElement('div'),
        enterButton = document.createElement('button'),
        removeButton = document.createElement('button');

    hostCell.innerHTML = survey.host;

    actionCell.style.textAlign = 'center';
    btnGroup.setAttribute('class','btn-toolbar');

    enterButton.innerHTML = 'Enter';
    removeButton.innerHTML = 'Remove';
    btnGroup.appendChild(enterButton);
    btnGroup.appendChild(removeButton);

    actionCell.appendChild(enterButton);
    actionCell.appendChild(removeButton);

    actionCell.appendChild(btnGroup);

    enterButton.addEventListener("click", function() {
        //chrome.tabs.create({url: survey.url});
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.update(tabs[0].id, {url: survey.url});
        });
    });

    removeButton.addEventListener("click", function() {
        remove_from_list(survey);
    });
}

function remove_from_list(survey) {
    get_surveys(function(surveys) {
        for (let i = 0; i < surveys.length; i++) {
            if (surveys[i].url === survey.url) {
                surveys.splice(i, 1);
                save_surveys(surveys, function() {
                    let row = document.querySelector('table#surveyList tbody tr:nth-of-type('+(i+1)+')');
                    row.parentNode.removeChild(row);
                });
                return;
            }
        }
    });
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', restore_surveys);

chrome.runtime.onMessage.addListener(
    function(survey, sender, callback) {
		alert("LOADING??");
        store_survey(survey, callback);
    }
);
//Maybe we need an event to open the survey when clicked from the list.. another to delete surveys from the list.. etc...
