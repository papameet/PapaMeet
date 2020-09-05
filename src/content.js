"use strict";

import {joinCall, leaveCall} from './join_leave.js';
import {getDateObject} from './helpers.js';


function setUpTimeouts(joinTime, leaveTime) {
	joinTime = getDateObject(joinTime);
	leaveTime = getDateObject(leaveTime);

	console.log('setting up timeouts', { join: joinTime, leave: leaveTime })

	setTimeout(joinCall, joinTime - Date.now());
	setTimeout(leaveCall, leaveTime - Date.now());
}

(function () {
	if (window.hasRun) {
		return;
	}
	window.hasRun = true;

	console.log('contentscript')
	browser.runtime.onMessage.addListener((message) => {
		const { joinTime, leaveTime } = message;
		setUpTimeouts(joinTime, leaveTime);
		console.log(joinTime, leaveTime);
	})
})();
