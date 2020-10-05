import { getDateObject, getPageURL } from "./helpers";

function storeSucess() {
  console.log("Succesfully stored to local storage.");
}

function storeFailure(e) {
  console.error("Failed to store with error:", e);
}

export function saveJoinTimeToStorage(joinTime) {
  browser.storage.local.set({ joinTime }).then(storeSucess, storeFailure);
}

function getTimeFailure(e) {
  console.error("Failed to get stored time. error:", e);
}

function setJoinTime(time) {
  time = time.joinTime;
  const elem = document.querySelector(".timepicker");
  elem.innerHTML = `<div id='textContainer'><div class='left'>Join:</div><div id='joinSpan' class='right'></div></div>`;
  const span = document.getElementById("joinSpan");
  span.innerHTML = `${time.hours < 10 ? `0${time.hours}` : time.hours}:${
    time.minutes < 10 ? `0${time.minutes}` : time.minutes
  }${time.amOrPm}`;
}

function setLeaveThreshold(threshold) {
  const leaveThreshold = document.getElementById("leave_threshold");
  leaveThreshold.value = threshold;
  leaveThreshold.setAttribute("value", threshold);
}

export async function setUpSettingsFromStorage(state) {
  let joinTime;
  try {
    joinTime = await browser.storage.local.get("joinTime");
    if (Object.keys(joinTime).length !== 0 && joinTime.joinTime) {
      if (getDateObject(joinTime.joinTime) > new Date()) setJoinTime(joinTime);
      else await browser.storage.local.remove("joinTime");
    }
    const { leaveThreshold } = await browser.storage.local.get(
      "leaveThreshold"
    );
    if (leaveThreshold) setLeaveThreshold(leaveThreshold);

    const { alertWords } = await browser.storage.local.get("alertWords");
    if (alertWords) {
      state.alertWords = alertWords;
    }
  } catch (e) {
    getTimeFailure(e);
  }
  state.joinTime = joinTime.joinTime;
  return { joinTime: joinTime.joinTime };
}

function clearJoinTimeOut(object) {
  clearTimeout(object.joinTimerId);
}

export function cancelPreviousTimeouts() {
  browser.storage.local
    .get("joinTimerId")
    .then(clearJoinTimeOut, getTimeFailure);
}

export function storeTimeoutIds(joinTimerId) {
  browser.storage.local.set({ joinTimerId }).then(storeSucess, storeFailure);
}

export function storeLeaveThreshold(leaveThreshold) {
  browser.storage.local.set({ leaveThreshold }).then(storeSucess, storeFailure);
}

export function storeAlertWords(alertWords) {
  browser.storage.local.set({ alertWords }).then(storeSucess, storeFailure);
}

export function storeCurrentURL() {
  getPageURL().then((url) => {
    browser.storage.local.set({ url }).then(storeSucess, storeFailure);
  });
}

export function removeCurrentURLfromStorage() {
  browser.storage.local.remove("url");
}
