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
		enterButton = document.createElement('button'),
		removeButton = document.createElement('button');

	hostCell.classList.add('survey');
	hostCell.innerHTML = survey.host;

	enterButton.innerHTML = 'Enter';
	removeButton.innerHTML = 'Remove';

	actionCell.classList.add('actions');
	actionCell.appendChild(enterButton);
	actionCell.appendChild(removeButton);

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

document.addEventListener('DOMContentLoaded', restore_surveys);