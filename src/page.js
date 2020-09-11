"use strict";

export function getJoinButton() {
  const spans = document.getElementsByTagName("span");
  for (let span of spans) {
    // console.log(span.textContent)
    if (span.textContent === "Join now" || span.textContent === "Ask to join")
      return span;
  }
  return 0;
}

function getLeaveButton() {
  return document.querySelector("[aria-label='Leave call']");
}

export function leaveCall() {
  const leaveButton = getLeaveButton();
  if (leaveButton !== undefined) {
    leaveButton.click();
    console.log("left meeting");
  } else {
    console.error("leave button not found");
  }
}

export function joinCall() {
  const joinButton = getJoinButton();
  console.log(joinButton);
  if (joinButton !== undefined) {
    console.log("joined meeting.");
    joinButton.click();
    return(1)
} else {
    console.error("join button not found");
    return(0)
  }
}

function getPeopleCount() {
  let count;
  try {
    count = document.querySelector("span.wnPUne.N0PJ8e").innerHTML;
  } catch (e) {
    count = "0";
  }
  return parseInt(count);
}

export let leaveTimeoutId, leaveInitTimeoutId;

export function leaveWhenPeopleLessThan(count) {
  clearTimeout(leaveInitTimeoutId);
  clearTimeout(leaveTimeoutId);
  function run() {
    console.log("leave run");
    let people_count_now = getPeopleCount();
    if (count > people_count_now) {
      console.log("leaving now. people count:", people_count_now);
      leaveCall();
    } else {
      leaveTimeoutId = setTimeout(run, 1000, count);
    }
  }

  (function runInit() {
    if (getPeopleCount() > count + 2) {
      run();
    } else {
      leaveInitTimeoutId = setTimeout(runInit, 1000);
    }
  })();
// change setTimeout to setTimer ?
}
