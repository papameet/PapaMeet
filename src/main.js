import M from "materialize-css"
import "materialize-css/dist/css/materialize.min.css";
import "./index.css";
import {saveTimesToStorage, setUpTimesFromStorage} from "./storage.js";


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

function setupTimepickers() {
  const elems = document.querySelectorAll(".timepicker");
  const joinInstance = M.Timepicker.init(elems[0], {
    onCloseStart() {
      elems[0].innerHTML =
        "<div id='textContainer'><div class='left'>Join:</div><div id='joinSpan' class='right'></div></div>";
    },
    onCloseEnd() {
      joinTime = {
        hours: this.hours,
        minutes: this.minutes,
        amOrPm: this.amOrPm,
      };
      let span = document.getElementById("joinSpan");
      span.innerHTML = this.time + this.amOrPm;
      console.log("onClose", joinTime);
    },
  });
  const leaveInstance = M.Timepicker.init(elems[1], {
    onCloseStart() {
      elems[1].innerHTML =
        "<div id='textContainer'><div class='left'>Leave:</div><div id='leaveSpan' class='right'></div></div>";
    },
    onCloseEnd() {
      leaveTime = {
        hours: this.hours,
        minutes: this.minutes,
        amOrPm: this.amOrPm,
      };
      let span = document.getElementById("leaveSpan");
      span.innerHTML = span.innerHTML = this.time + this.amOrPm;
      console.log("onClose", leaveTime);
    },
  });
  // todo: rewrite these functions
}

setUpTimesFromStorage();
setupTimepickers();
listenForSubmit();

browser.tabs
.executeScript({ file: "/content.js" })
.then(listenForSubmit)
.catch((e) => console.error("Error occured: " + e));
