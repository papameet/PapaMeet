export function getJoinButton() {
  const spans = document.getElementsByTagName("span");
  // eslint-disable-next-line no-restricted-syntax
  for (const span of spans) {
    // console.log(span.textContent)
    if (span.textContent === "Join now" || span.textContent === "Ask to join")
      return span;
  }
  return 0;
}

function getLeaveButton() {
  return document.querySelector("[aria-label='Leave call']");
}

export function leaveCall(state) {
  const leaveButton = getLeaveButton();
  if (leaveButton !== undefined) {
    leaveButton.click();
    console.log("left meeting");
  } else {
    console.error("leave button not found");
  }
  state.leaveTimerOn = false;
}

export function joinCall() {
  const joinButton = getJoinButton();
  console.log(joinButton);
  if (joinButton !== undefined) {
    console.log("joined meeting.");
    joinButton.click();
    return 1;
  }
  console.error("join button not found");
  return 0;
}

function getPeopleCount() {
  let count;
  try {
    count = document.querySelector("span.wnPUne.N0PJ8e").innerHTML;
  } catch (e) {
    count = "0";
  }
  return parseInt(count, 10);
}

let previousContent = "";

function getSubtitlesContent() {
  const selector = ".iTTPOb.VbkSUe",
    content = document.querySelector(selector).textContent;
  if (content !== previousContent) {
    previousContent = content;
    return content.toLowerCase();
  }
  return "";
}

function subtitlesContains(word) {
  word = word.toLowerCase();
  return getSubtitlesContent().includes(word) && word;
}

export function startSubtitleTimers(state) {
  if (state.subtitleTimerId) clearInterval(state.subtitleTimerId);
  function checkAndNotify() {
    state.alertWords.forEach((alertWord) => {
      if (subtitlesContains(alertWord))
        browser.runtime.sendMessage({ notify: true, alertWord });
    });
  }
  state.subtitleTimerId = setInterval(checkAndNotify, 300);
}

export function leaveWhenPeopleLessThan(state) {
  const count = state.leaveThreshold;
  state.leaveTimerOn = true;
  if (state.leaveInitId) clearInterval(state.leaveInitId);
  if (state.leaveId) clearInterval(state.leaveId);

  function leave() {
    const peopleCountNow = getPeopleCount();
    if (count > peopleCountNow) {
      console.log("leaving now. people count:", peopleCountNow);
      clearInterval(state.leaveId);
      leaveCall(state);
    }
  }

  function runInit() {
    if (getPeopleCount() > count + 2) {
      clearInterval(state.leaveInitId);
      state.leaveInitId = 0;
      state.leaveId = setInterval(leave, 1000);
    }
  }
  state.leaveInitId = setInterval(runInit, 1000);
  // change setTimeout to setTimer ?
}
