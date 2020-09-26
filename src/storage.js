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
  let joinTime, leaveThreshold, alertWords;
  try {
    const url = await getPageURL();
    const storedSettings = await browser.storage.local.get(url)[url];

    joinTime = storedSettings.joinTime;
    leaveThreshold = storedSettings.leaveThreshold;
    alertWords = storedSettings.alertWords;

    if (Object.keys(joinTime).length !== 0 && joinTime.joinTime) {
      if (getDateObject(joinTime.joinTime) > new Date()) setJoinTime(joinTime);
      else {
        delete storedSettings.joinTime;
        const toStore = {};
        toStore[url] = storedSettings;
        await browser.storage.local.set(toStore);
      }
    }
    if (leaveThreshold) setLeaveThreshold(leaveThreshold);
    if (alertWords) state.alertWords = alertWords;
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

export function storeSettings(url, joinTime, leaveThreshold, alertWords) {
  const toStore = {};
  toStore[url] = { joinTime, leaveThreshold, alertWords };
  browser.storage.local.set(toStore).then(storeSucess, storeFailure);
}
