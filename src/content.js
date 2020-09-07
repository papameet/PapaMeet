"use strict";

import { joinCall, leaveCall } from "./join_leave.js";
import { getDateObject } from "./helpers.js";
import { storeTimeoutIds, cancelPreviousTimeouts } from "./storage.js";

function setUpTimeouts(joinTime, leaveTime) {
  joinTime = getDateObject(joinTime);
  leaveTime = getDateObject(leaveTime);

  console.log("setting up timeouts", { join: joinTime, leave: leaveTime });

  const joinTimerId = setTimeout(joinCall, joinTime - Date.now());
  const leaveTimerId = setTimeout(leaveCall, leaveTime - Date.now());
  cancelPreviousTimeouts();
  storeTimeoutIds(joinTimerId, leaveTimerId);
}

(function () {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  console.log("contentscript");
  browser.runtime.onMessage.addListener((message) => {
    const { joinTime, leaveTime } = message;
    setUpTimeouts(joinTime, leaveTime);
    console.log(joinTime, leaveTime);
  });
})();
