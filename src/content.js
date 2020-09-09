"use strict";

import { joinCall, getJoinButton, leaveWhenPeopleLessThan } from "./page.js";
import { getDateObject } from "./helpers.js";
import { storeTimeoutIds, cancelPreviousTimeouts } from "./storage.js";

function setUpTimeouts(joinTime) {
	if(joinTime) joinTime = getDateObject(joinTime);

  console.log("setting up timeouts", { join: joinTime});

  const joinTimerId = joinTime ? setTimeout(joinCall, joinTime - Date.now()) : 0;
  cancelPreviousTimeouts();
  storeTimeoutIds(joinTimerId);
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
	  const { joinTime } = message;
	  setUpTimeouts(joinTime);
	  leaveWhenPeopleLessThan();
  });
})();
