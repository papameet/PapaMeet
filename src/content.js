"use strict";

function getJoinButton() {
  const spans = document.getElementsByTagName('span');
  for (let span of spans) {
      console.log(span.textContent)
      if (span.textContent === "Join now")
      return span;
  }
}

function getLeaveButton() {
  return document.querySelector("[aria-label='Leave call']");
}

function leaveCall() {
  const leaveButton = getLeaveButton();
  if (leaveButton !== undefined){
      leaveButton.click();
      console.log("left meeting")
  } else {
    console.error("leave button not found")
  }
}

function joinCall() {
  const joinButton = getJoinButton();
  console.log(joinButton)
  if (joinButton !== undefined){
    console.log("joined meeting.")
    joinButton.click();
  } else {
    console.error("join button not found")
  }
}

function getDateObject(timeObjectFromPicker) {
  const hours = timeObjectFromPicker.hours +
                (timeObjectFromPicker.amOrPm === "PM" ? 12:0);
  const minutes = timeObjectFromPicker.minutes
  
  const date = new Date();
  date.setHours(hours, minutes);
  return date;
}

function setUpTimeouts(joinTime, leaveTime) {
  joinTime = getDateObject(joinTime);
  leaveTime = getDateObject(leaveTime);

  console.log('setting up timeouts', {join: joinTime, leave: leaveTime})

  setTimeout(joinCall, joinTime - Date.now());
  setTimeout(leaveCall, leaveTime - Date.now());
}

(function(){
  if (window.hasRun){
    return;
  }
  window.hasRun = true;

  console.log('contentscript')
  browser.runtime.onMessage.addListener((message) =>{
    const {joinTime, leaveTime} = message;
    setUpTimeouts(joinTime, leaveTime);
    console.log(joinTime, leaveTime);
  })
})();
