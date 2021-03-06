import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import "./index.css";
import {
  convertChipsData,
  convertToChipsData,
  getDateObject,
  getPageURL,
  to24hours,
} from "./helpers";
import MChips from "./chips";

import {
  saveJoinTimeToStorage,
  setUpSettingsFromStorage,
  storeAlertWords,
  storeCurrentURL,
  storeLeaveThreshold,
  removeCurrentURLfromStorage,
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

function handleJoinInfo(request, sender, sendResponse) {
  if (!request.join) {
    document.getElementById("join").disabled = true;
    state.canJoin = false;
  }
}

function toggleUI() {
  const leaveInput = document.getElementById("leave_threshold"),
    joinButton = document.getElementById("join");
  if (state.submitReset === "reset") {
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
function catchError(e) {
  console.error(e);
}

function success(recievedState) {
  updateState(recievedState);
  saveJoinTimeToStorage(state.joinTime);
  changeSubmitToReset();
}

function listenForSubmit() {
  function onSubmitResetClick() {
    if (state.submitReset === "submit") onSubmitClick();
    if (state.submitReset === "reset") onResetClick();
  }
  function clearAllTimeouts() {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs
        .sendMessage(tabs[0].id, { message: "clearAllTimeouts", state })
        .then(updateState)
        .catch((e) => console.error(e));
    });
  }
  function onResetClick() {
    browser.storage.local.remove("joinTime");
    const joinTimeButton = document.querySelector(".timepicker");
    joinTimeButton.innerHTML = "Join Time";
    clearAllTimeouts();
    removeCurrentURLfromStorage();
    changeResetToSubmit();
  }
  function onSubmitClick() {
    state.alertWords = getAlertWords();
    state.leaveThreshold = parseInt(
      document.getElementById("leave_threshold").value,
      10
    );

    storeAlertWords(state.alertWords);
    storeLeaveThreshold(state.leaveThreshold);
    storeCurrentURL();

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

  // When this evaluate to true it mostly means join time button is blocked.
  // When unblocked by clicking reset we delete the time object from storage.
  //  This check is just to avoid inconsistencies in odd cases like reloading
  // the extension while letting the time object stay in storage.
  if (joinTimeStored && getDateObject(joinTimeStored) > new Date()) {
    state.joinTime = joinTimeStored;
    joinTimeStr = to24hours(joinTimeStored);
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
      }
    },
  });
  // todo: rewrite these functions
}

function setupChips(words) {
  function onChipsModified(){
    state.alertWords = getAlertWords();
    storeAlertWords(state.alertWords);
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs
        .sendMessage(tabs[0].id, { message: "updateWords", state })
        .catch(catchError);
    });
  }
  words = convertToChipsData(words);
  const elems = document.querySelectorAll(".chips");
  MChips.init(elems, {
    data: words,
    placeholder: "Enter alert words to get notified!",
    secondaryPlaceholder: "Alert word",
    onChipAdd(){
      onChipsModified();
    },
    onChipDelete(){
      onChipsModified();
    },
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
}

getPageURL().then((url) => {
  const supportedMeetURLregex = /https:\/\/meet.google.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}\/*/;
  if (!supportedMeetURLregex.test(url)) {
    const content = document.getElementById("buttons-div");
    content.removeAttribute("buttons-div");
    content.setAttribute("id", "incorrect-url")
    content.innerHTML = `
      <div id='uhimg'><img src='error-page.svg' id="error-icon"></div><div id='uhoh'>Uh-oh, unsupported URL</div>
      <p class="right-wrong"><img src='right.png'><span>https://meet.google.com/xxx-xxxx-xxx/</span></p>
      <p class="right-wrong"><img src='wrong.png'><span>https://www.example.com/papa/meet/</span></p>`;
  } else {
    browser.storage.local.get("url").then((storedURL) => {
      storedURL = storedURL.url;
      browser.tabs.query({}).then((tabs) => {
        const urls = tabs.map((tab) => tab.url);
        if (storedURL && storedURL !== url) {
          if (!urls.includes(storedURL)) {
            removeCurrentURLfromStorage();
            return;
          }
          const content = document.getElementById("buttons-div");
          content.removeAttribute("buttons-div");
          content.setAttribute("id", "single-instance-err");
          content.innerHTML = `Supports only one tab now. Open the extension in <p id="stored-url">${storedURL}</p> and click "Reset" to use here`;
        }
      });
    });
  }
});

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

browser.tabs.executeScript({ file: "browser-polyfill.js" });
browser.tabs
  .executeScript({ file: "/content.js" })
  .then(listenForSubmit)
  .catch((e) => console.error(`Error occured: ${e}`));

browser.runtime.onMessage.addListener(handleJoinInfo);
