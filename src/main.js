import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import "./index.css";
import { convertChipsData, convertToChipsData, to24hours } from "./helpers";
import "./checkbox";

import {
  saveJoinTimeToStorage,
  setUpSettingsFromStorage,
  storeAlertWords,
  storeLeaveThreshold,
} from "./storage";

let state = {
  joinTime: 0,
  leaveThreshold: 0,
  canJoin: true,
  submitReset: "submit",
  joinTimerOn: false,
  leaveTimerOn: false,
  joinTimerId: 0,
  alertWords: ["attendance"],
  subtitleTimerId: 0,
};

function setUpListnerForInput() {
  const leaveInput = document.getElementById("leave_threshold");
  leaveInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      console.log("enter");
      document.getElementById("submit").click();
    }
  });
}

function handleJoinInfo(request, sender, sendResponse) {
  console.log(request);
  if (!request.join) {
    document.getElementById("join").disabled = true;
    state.canJoin = false;
  }
}

function toggleUI() {
  const leaveInput = document.getElementById("leave_threshold"),
    joinButton = document.getElementById("join");
  if (state.submitReset == "reset") {
    leaveInput.setAttribute("readonly", "");
    leaveInput.setAttribute("class", "dark_border");
    joinButton.setAttribute("disabled", "");
  } else {
    leaveInput.removeAttribute("readonly");
    leaveInput.setAttribute("class", "");
    if (state.canJoin) {
      joinButton.removeAttribute("disabled");
    }
  }
}

const submit = document.getElementById("submit");

function changeSubmitToReset() {
  submit.innerText = "Reset";
  state.submitReset = "reset";
  toggleUI();
}
function changeResetToSubmit() {
  submit.innerText = "Submit";
  state.submitReset = "submit";
  toggleUI();
}

function listenForSubmit() {
  console.log("listen");
  function catchError(e) {
    console.log(e);
  }

  function success(recievedState) {
    console.log("Submit success, storing times");
    updateState(recievedState);
    console.log(state);
    saveJoinTimeToStorage(state.joinTime);
    changeSubmitToReset();
  }
  function onSubmitResetClick() {
    if (state.submitReset == "submit") onSubmitClick();
    if (state.submitReset == "reset") onResetClick();
  }
  function clearAllTimeouts() {
    console.log("initiating clear timouts in main");
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs
        .sendMessage(tabs[0].id, { message: "clearAllTimeouts", state })
        .then(updateState)
        .catch((e) => console.error(e));
    });
  }
  function onResetClick() {
    clearAllTimeouts();
    changeResetToSubmit();
  }
  function onSubmitClick() {
    console.log("onSubmit click");

    state.alertWords = getAlertWords();
    state.leaveThreshold = parseInt(
      document.getElementById("leave_threshold").value,
      10
    );

    storeAlertWords(state.alertWords);
    storeLeaveThreshold(state.leaveThreshold);

    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs
        .sendMessage(tabs[0].id, { message: "submit", state })
        .then(success)
        .catch(catchError);
    });
  }

  submit.addEventListener("click", onSubmitResetClick);
}

let joinInstance;

function setupTimepickers({ joinTime: joinTimeStored }) {
  let joinTimeStr;
  if (joinTimeStored) {
    state.joinTime = joinTimeStored;
    joinTimeStr = to24hours(joinTimeStored);
    console.log(joinTimeStr, joinTimeStored);
  }
  const elems = document.querySelectorAll(".timepicker");
  joinInstance = M.Timepicker.init(elems[0], {
    defaultTime: joinTimeStr || "now",
    onCloseEnd() {
      state.joinTime = {
        hours: this.hours,
        minutes: this.minutes,
        amOrPm: this.amOrPm,
      };
      if (this.time !== undefined) {
        elems[0].innerHTML =
          "<div id='textContainer'><div class='left'>Join:</div><div id='joinSpan' class='right'></div></div>";
        const span = document.getElementById("joinSpan");
        span.innerHTML = this.time + this.amOrPm;
        console.log("onClose", state.joinTime);
      }
    },
  });
  // todo: rewrite these functions
}

function setupChips(words) {
  words = convertToChipsData(words);
  const elems = document.querySelectorAll(".chips");
  M.Chips.init(elems, {
    data: words,
    placeholder: "Enter alert words to get notified!",
    secondaryPlaceholder: "Alert word",
  });
}

function getAlertWords() {
  const elem = document.querySelector(".chips"),
    instance = M.Chips.getInstance(elem);

  return convertChipsData(instance.chipsData);
}

function updateState(recievedState) {
  state = recievedState;
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs
      .sendMessage(tabs[0].id, { message: "sendState", state })
      .then((contentState) => {
        state = contentState;
      })
      .catch((e) => console.error(e));
  });
  console.log("main state updated:", state);
}

setUpSettingsFromStorage(state).then((joinTime) => {
  setupTimepickers(joinTime);
  setupChips(state.alertWords);
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    browser.tabs
      .sendMessage(tabs[0].id, { message: "sendState", state })
      .then((recievedState) => {
        state = recievedState;
        if (state.leaveTimerOn) {
          state.submitReset = "reset";
          changeSubmitToReset();
        }
      })
      .catch((e) => console.error(e));
  });
});

browser.tabs
  .executeScript({ file: "/content.js" })
  .then(listenForSubmit)
  .catch((e) => console.error(`Error occured: ${e}`));

browser.runtime.onMessage.addListener(handleJoinInfo);
setUpListnerForInput();
