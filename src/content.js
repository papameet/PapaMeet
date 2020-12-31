import {
  captionsTurnedOff,
  joinCall,
  getJoinButton,
  leaveWhenPeopleLessThan,
  startSubtitleTimers,
  turnOnOffCaptions,
} from "./page";
import { getDateObject } from "./helpers";
import { storeTimeoutIds, cancelPreviousTimeouts } from "./storage";

function setUpTimeouts(state) {
  const { joinTime } = state,
    joinTimeDateObj = getDateObject(joinTime);

  if (joinTime) {
    new Promise((resolve, reject) => {
      state.joinTimerId = setTimeout(() => {
        joinCall() ? resolve("done") : reject("notJoined");
      }, joinTimeDateObj - Date.now());
      state.joinTimerOn = true;
    })
      .then(function _(success, counter = 0) {
        try {
          startSubtitleTimers(state);
        } catch {
          if (counter < 5) {
            counter += 1;
            setTimeout(() => _(success, counter), 2000);
          }
        }
        state.joinTimerOn = false;
        state.joinTimerId = 0;
      })
      .catch((e) => {
        console.error(e);
        state.joinTimerOn = false;
        state.joinTimerId = 0;
      });
  } else {
    state.joinTimerId = 0;
  }
  cancelPreviousTimeouts();
  storeTimeoutIds(state.joinTimerId);
}

function sendJoinInfo(e) {
  const joinBtn = getJoinButton(),
    sending = browser.runtime.sendMessage({
      join: !!joinBtn,
    });
  sending.then(
    (response) => {
      console.log("sent join info. response:", response);
    },
    (err) => console.error(err)
  );
}

(function () {
  sendJoinInfo();

  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  const state = {
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
    state.joinTime = recievedState.joinTime;
    state.leaveThreshold = recievedState.leaveThreshold;
    state.canJoin = !!getJoinButton();
    state.submitReset = recievedState.submitReset;
    state.alertWords = recievedState.alertWords;
  }

  function onSubmit() {
    try {
      if (state.joinTime) setUpTimeouts(state);
      leaveWhenPeopleLessThan(state);
      if (!state.canJoin) startSubtitleTimers(state);
    } catch (e) {
      console.error(e);
    }
  }

  function clearAllTimeouts() {
    if (state.joinTimerOn) {
      clearTimeout(state.joinTimerId);
      state.joinTimerOn = false;
      state.joinTimerId = 0;
    }
    clearInterval(state.leaveInitId);
    clearInterval(state.leaveId);
    clearTimeout(state.subtitleTimerId);
    state.leaveId = 0;
    state.leaveInitId = 0;
    state.leaveTimerOn = false;
    storeTimeoutIds(0);

    // On clicking reset we want to turn off captions
    // This function is called on clicking reset.
    // So, we have this here.
    if (!captionsTurnedOff()) turnOnOffCaptions();
  }

  browser.runtime.onMessage.addListener((recievedObj, sender, sendResponse) => {
    const { message, state: recievedState } = recievedObj;
    updateState(recievedState);
    switch (message) {
      case "submit":
        onSubmit();
        break;
      case "sendState":
        break;
      case "clearAllTimeouts":
        clearAllTimeouts();
        break;
      case "updateWords":
        if (state.submitReset === "reset") startSubtitleTimers(state);
        break;
      default:
        console.log("message did not match: ", message);
    }
    return Promise.resolve(state);
  });
})();
