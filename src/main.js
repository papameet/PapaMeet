import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import "./index.css";
import { to24hours } from "./helpers";
import "./checkbox.js"

import { saveJoinTimeToStorage, setUpTimesFromStorage } from "./storage.js";

function handleJoinInfo(request, sender, sendResponse){
  console.log(request);
  if (!request.join) document.getElementById('join').disabled = true;
}

let joinTime;
function listenForSubmit() {
  console.log("listen");
  function catchError(e) {
    console.log(e);
  }
  function success(e) {
    console.log("Submit success, storing times");
    saveJoinTimeToStorage(joinTime);
  }
  function onSubmitClick() {
    console.log("onSubmit click");
    let leaveThreshold = parseInt(document.getElementById("leave_threshold").value);
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs
        .sendMessage(tabs[0].id, {
          joinTime,
          leaveThreshold,
        })
        .then(success)
        .catch(catchError);
    });
  }
  const submit = document.getElementById("submit");
  submit.addEventListener("click", onSubmitClick);
}

let joinInstance;

function setupTimepickers({
  joinTime: joinTimeStored,
}) {
  let joinTimeStr;
  if (joinTimeStored) {
    joinTime = joinTimeStored;
    joinTimeStr = to24hours(joinTimeStored);
  }

  const elems = document.querySelectorAll(".timepicker");
  joinInstance = M.Timepicker.init(elems[0], {
    defaultTime: joinTimeStr ? joinTimeStr : new Date().toLocaleTimeString(),
    onCloseEnd() {
      joinTime = {
        hours: this.hours,
        minutes: this.minutes,
        amOrPm: this.amOrPm,
      };
      if (this.time !== undefined) {
        elems[0].innerHTML =
          "<div id='textContainer'><div class='left'>Join:</div><div id='joinSpan' class='right'></div></div>";
        let span = document.getElementById("joinSpan");
        span.innerHTML = this.time + this.amOrPm;
        console.log("onClose", joinTime);
      }
    },
  });
  // todo: rewrite these functions
}

setUpTimesFromStorage().then(setupTimepickers);

browser.tabs
  .executeScript({ file: "/content.js" })
  .then(listenForSubmit)
  .catch((e) => console.error("Error occured: " + e));

browser.runtime.onMessage.addListener(handleJoinInfo)