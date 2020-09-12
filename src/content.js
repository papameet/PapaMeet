"use strict";

import { joinCall, getJoinButton, leaveWhenPeopleLessThan } from "./page.js";
import { getDateObject } from "./helpers.js";
import { storeTimeoutIds, cancelPreviousTimeouts } from "./storage.js";

function setUpTimeouts(state) {
  const joinTime = state.joinTime;
  const joinTimeDateObj = getDateObject(joinTime);

  console.log("setting up timeouts", { join: joinTimeDateObj });

  if (joinTime) {
    new Promise((resolve, reject) => {
      state.joinTimerId = setTimeout(() => {
        joinCall() ? resolve("done") : reject("notJoined");
      }, joinTimeDateObj - Date.now());
      state.joinTimerOn = true;
    })
      .then((success) => {
        state.joinTimerOn = false;
        state.joinTimerId = 0;
      })
      .catch((e) => {
        console.log(e);
        state.joinTimerOn = false;
        state.joinTimerId = 0;
      });
  } else {
    {
      state.joinTimerId = 0;
    }
  }
  cancelPreviousTimeouts();
  storeTimeoutIds(state.joinTimerId);
}

function sendJoinInfo(e) {
  let joinBtn = getJoinButton();
  var sending = browser.runtime.sendMessage({
    join: !!joinBtn ? true : false,
  });
  sending.then(
    (respone) => {
      console.log("sent join info");
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

  let state = {
    joinTime: 10,
    leaveThreshold: 0,
    canJoin: true,
    joinTimerOn: false,
    leaveTimerOn: false,
    joinTimerId: 0,
    leaveId: 0,
    leaveInitId: 0,
    submitReset: "submit",
  };

  function updateState(recievedState) {
    state = {
      ...state,
      joinTime: recievedState.joinTime,
      leaveThreshold: recievedState.leaveThreshold,
      canJoin: !!getJoinButton(),
      submitReset: recievedState.submitReset,
    };
  }

  function onSubmit() {
    if (state.joinTime) setUpTimeouts(state);
    leaveWhenPeopleLessThan(state);
  }

  function clearAllTimeouts() {
    if (state.joinTimerOn) {
      clearTimeout(state.joinTimerId);
      state.joinTimerOn = false;
      state.joinTimerId = 0;
    }
    clearInterval(state.leaveInitId);
    clearInterval(state.leaveId);
    state.leaveId = 0;
    state.leaveInitId = 0;
    state.leaveTimerOn = false;
    storeTimeoutIds(0);
    console.log('All timeouts cleared')
  }

  browser.runtime.onMessage.addListener((recievedObj, sender, sendResponse) => {
    const { message, state: recievedState } = recievedObj;
    console.log("hi");
    updateState(recievedState);
    console.log("message recieved in content:",message);
    switch (message) {
      case "submit":
        onSubmit();
        break;
      case "sendState":
        break;
      case "clearAllTimeouts":
        clearAllTimeouts();
        break;
      default:
        console.log("message did not match: ", message);
    }
    console.log("content", state);
    return Promise.resolve(state);
  });
})();
