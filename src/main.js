import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import "./index.css";
import { to24hours } from "./helpers";

import { saveTimesToStorage, setUpTimesFromStorage } from "./storage.js";

let joinTime, leaveTime;
function listenForSubmit() {
  console.log("listen");
  function catchError(e) {
    console.log(e);
  }
  function success(e) {
    console.log("Submit success, storing times");
    saveTimesToStorage(joinTime, leaveTime);
  }
  function onSubmitClick() {
    console.log("onSubmit click");
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs
        .sendMessage(tabs[0].id, {
          joinTime,
          leaveTime,
        })
        .then(success)
        .catch(catchError);
    });
  }
  const submit = document.getElementById("submit");
  submit.addEventListener("click", onSubmitClick);
}

let joinInstance, leaveInstance;

function setupTimepickers({
  joinTime: joinTimeStored,
  leaveTime: leaveTimeStored,
}) {
  let joinTimeStr, leaveTimeStr;
  if (joinTimeStored) {
    joinTime = joinTimeStored;
    joinTimeStr = to24hours(joinTimeStored);
  }
  if (leaveTimeStored) {
    leaveTime = leaveTimeStored;
    leaveTimeStr = to24hours(leaveTimeStored);
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
  leaveInstance = M.Timepicker.init(elems[1], {
    defaultTime: leaveTimeStr?leaveTimeStr: new Date().toLocaleTimeString(),
    onCloseEnd() {
      leaveTime = {
        hours: this.hours,
        minutes: this.minutes,
        amOrPm: this.amOrPm,
      };
      if (this.time !== undefined) {
        elems[1].innerHTML =
          "<div id='textContainer'><div class='left'>Leave:</div><div id='leaveSpan' class='right'></div></div>";
        let span = document.getElementById("leaveSpan");
        span.innerHTML = span.innerHTML = this.time + this.amOrPm;
        console.log("onClose", leaveTime);
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
