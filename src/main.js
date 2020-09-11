import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import "./index.css";
import { to24hours } from "./helpers";
import "./checkbox.js";

import {
  saveJoinTimeToStorage,
  setUpSettingsFromStorage,
  storeLeaveThreshold,
} from "./storage.js";

let state = {
  joinTime: 0,
  leaveThreshold: 0,
  canJoin: true,
  joinTimerOn: false,
  leaveTimerOn: false,
};

function handleJoinInfo(request, sender, sendResponse) {
  console.log(request);
  if (!request.join) {
    document.getElementById("join").disabled = true;
    state.canJoin = false;
  }
}

function listenForSubmit() {
  console.log("listen");
  function catchError(e) {
    console.log(e);
  }
  function success(recievedState) {
    console.log("Submit success, storing times");
    state = recievedState;
    console.log(state);
    saveJoinTimeToStorage(state.joinTime);
  }
  function onSubmitClick() {
    console.log("onSubmit click");
    state.leaveThreshold = parseInt(
      document.getElementById("leave_threshold").value
    );
    storeLeaveThreshold(state.leaveThreshold);
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs
        .sendMessage(tabs[0].id, { message: "submit", state })
        .then(success)
        .catch(catchError);
    });
  }
  const submit = document.getElementById("submit");
  submit.addEventListener("click", onSubmitClick);
}

let joinInstance;

function setupTimepickers({ joinTime: joinTimeStored }) {
  let joinTimeStr;
  if (joinTimeStored) {
    state.joinTime = joinTimeStored;
    joinTimeStr = to24hours(joinTimeStored);
  }

  const elems = document.querySelectorAll(".timepicker");
  joinInstance = M.Timepicker.init(elems[0], {
    defaultTime: joinTimeStr ? joinTimeStr : new Date().toLocaleTimeString(),
    onCloseEnd() {
      state.joinTime = {
        hours: this.hours,
        minutes: this.minutes,
        amOrPm: this.amOrPm,
      };
      if (this.time !== undefined) {
        elems[0].innerHTML =
          "<div id='textContainer'><div class='left'>Join:</div><div id='joinSpan' class='right'></div></div>";
        let span = document.getElementById("joinSpan");
        span.innerHTML = this.time + this.amOrPm;
        console.log("onClose", state.joinTime);
      }
    },
  });
  // todo: rewrite these functions
}

function updateState(recievedState) {
  state = recievedState;
}

setUpSettingsFromStorage(state).then(setupTimepickers);

browser.tabs
  .executeScript({ file: "/content.js" })
  .then((e) => console.log(e))
  .catch((e) => console.error("Error occured: " + e));

browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  browser.tabs
    .sendMessage(tabs[0].id, { message: "sendState", state })
    .then(updateState)
    .catch((e)=>console.error(e));
});

browser.runtime.onMessage.addListener(handleJoinInfo);
