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
	get_surveys(render_surveys);
}

function save_surveys(surveys, callback) {
	chrome.storage.sync.set({surveyList: surveys}, function() {
		if (typeof callback === 'function') {
			callback();
		}
	});
}

function set_survey_prepared(guid) {
    get_surveys(function(surveys) {
        for (let survey of surveys) {
            if (survey.guid === guid) {
                survey.prepared = true;
                save_surveys(surveys);
                return;
            }
        }
    });
}

function set_survey_entered(guid) {
    get_surveys(function(surveys) {
        for (let survey of surveys) {
            if (survey.guid === guid) {
                survey.entered = true;
                save_surveys(surveys);
                return;
            }
        }
    });
}

function updateCount(surveys) {
	var count = surveys.length;
	if (count !== 0) {
		chrome.browserAction.setBadgeText({text: count.toString()}); // Display how many surveys we have
		chrome.browserAction.setBadgeBackgroundColor({color: [244, 104, 19, 100]});
	} else {
		chrome.browserAction.setBadgeText({text: ''});
	}
}


function render_surveys(surveys) {
	updateExtension(surveys);
	for (let survey of surveys) {
		add_to_list(survey);
	}
}

function add_to_list(survey) {
	let table = document.querySelector('table#surveyList tbody'),
		row = table.insertRow(-1),
		iconCell = row.insertCell(0),
		hostCell = row.insertCell(1),
		enteredCell = row.insertCell(2),
		actionCell = row.insertCell(3),
		enterButton = document.createElement('button'),
		removeButton = document.createElement('button');

	var img = document.createElement('img');
	img.style.height = '16px';
	img.style.width = '16px';
    img.src = survey.icon;
	iconCell.appendChild(img);

	hostCell.classList.add('survey');
	hostCell.innerHTML = survey.host;

	enteredCell.innerHTML = (survey.entered) ? 'Yes' : 'No';

	enterButton.innerHTML = 'Enter';
	removeButton.innerHTML = 'Remove';

	actionCell.classList.add('actions');
	actionCell.appendChild(enterButton);
	actionCell.appendChild(removeButton);

	enterButton.addEventListener("click", function() {
	    if (typeof survey.prepared === "undefined" || !survey.prepared) {
            let request = new XMLHttpRequest();
            //request.open('POST', 'https://surveys.edigitalresearch.com/prepare.php?guid=' + survey.guid, false);
            request.open('POST', 'http://surveys.php7.edr-0902.dev.edig.co.uk:8083/prepare.php?guid=' + survey.guid, false);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.setRequestHeader('X_REQUESTED_WITH', 'XMLHttpRequest');
            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    // Success!
                    set_survey_prepared(survey.guid);
                } else {
                    // Server returned an error
                }
            };
            request.onerror = function() {
                // There was a connection error of some sort
            };

            var paramsString = "",
                params = survey.entryData;

            // Generate parameter string for request
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var val = params[key];
                    val = typeof(val) === 'object' ? JSON.stringify(val) : val;
                    val = encodeURIComponent(val);
                    if (!paramsString) {
                        paramsString = key + "=" + val;
                    } else {
                        paramsString = paramsString + "&" + key + "=" + val;
                    }
                }
            }

            //request.send(JSON.stringify(survey.entryData));
            request.send(paramsString);
        }

        set_survey_entered(survey.guid);
        //chrome.tabs.create({url: 'https://surveys.edigitalresearch.com/deploy/enter/guid/' + survey.guid + '/installation/' + survey.entryData.installationId});
        chrome.tabs.create({url: 'http://surveys.php7.edr-0902.dev.edig.co.uk:8083/deploy/enter/guid/' + survey.guid + '/installation/' + survey.entryData.installationId});
	});

	removeButton.addEventListener("click", function() {
		remove_from_list(survey);
	});
}


function remove_from_list(survey) {
	get_surveys(function(surveys) {
		for (let i = 0; i < surveys.length; i++) {
			if (surveys[i].guid === survey.guid) {
				surveys.splice(i, 1);
				save_surveys(surveys, function() {
					let row = document.querySelector('table#surveyList tbody tr:nth-of-type('+(i+1)+')');
					row.parentNode.removeChild(row);
				});
				updateExtension(surveys);
				return;
			}
		}
	});
}

function updateExtension(surveys) {
	updateCount(surveys);
	updateView(surveys);
}

function updateView(surveys) {
    if (surveys.length === 0) {
        document.querySelector('#surveyList').setAttribute('style','display:none;');
        let placeholder = document.querySelector('#placeholder').innerHTML = '<p style="text-align: center">You do not have any saved for later surveys.</p>';
    }
}

document.addEventListener('DOMContentLoaded', restore_surveys);