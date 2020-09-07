"use strict";

import { joinCall, leaveCall, getJoinButton } from "./join_leave.js";
import { getDateObject } from "./helpers.js";
import { storeTimeoutIds, cancelPreviousTimeouts } from "./storage.js";

function setUpTimeouts(joinTime, leaveTime) {
	if(joinTime) joinTime = getDateObject(joinTime);
  leaveTime = getDateObject(leaveTime);

  console.log("setting up timeouts", { join: joinTime, leave: leaveTime });

  const joinTimerId = joinTime ? setTimeout(joinCall, joinTime - Date.now()) : 0;
  const leaveTimerId = setTimeout(leaveCall, leaveTime - Date.now());
  cancelPreviousTimeouts();
  storeTimeoutIds(joinTimerId, leaveTimerId);
}

function sendJoinInfo(e) {
  let joinBtn = getJoinButton();
  var sending = browser.runtime.sendMessage({
    join: !!joinBtn ? true : false,
  });
  sending.then(
    (respone) => {
      console.log('sent join info');
    },
    (e) => console.error(e)
  );
}

(function () {
  sendJoinInfo();
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  console.log("contentscript");
  browser.runtime.onMessage.addListener((message) => {
    const { joinTime, leaveTime } = message;
    setUpTimeouts(joinTime, leaveTime);
  });
})();
