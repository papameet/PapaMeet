function storeSucess() {
  console.log("Succesfully stored to local storage.");
}

function storeFailure(e) {
  console.log("Failed to store with error:", e);
}

export function saveJoinTimeToStorage(joinTime) {
  browser.storage.local.set({joinTime}).then(storeSucess, storeFailure);
}

function getTimeFailure(e) {
  console.log("Failed to get stored time. error:", e);
}

function setJoinTime(time) {
  time = time.joinTime;
  const elem = document.querySelector(".timepicker");
  elem.innerHTML = `<div id='textContainer'><div class='left'>Join:</div><div id='joinSpan' class='right'></div></div>`;
  const span = document.getElementById('joinSpan');
  span.innerHTML = `${time.hours}:${time.minutes}${time.amOrPm}`;
}

function setLeaveThreshold(threshold) {
  const leaveThreshold = document.getElementById("leave_threshold");
  leaveThreshold.value = threshold;
}

export async function setUpSettingsFromStorage() {
  let joinTime;
  try {
    joinTime = await browser.storage.local.get("joinTime");
    console.log('join', joinTime);
    if (Object.keys(joinTime).length !== 0)
      setJoinTime(joinTime);

    let leaveThreshold = (await browser.storage.local.get("leaveThreshold")).leaveThreshold;
    if (leaveThreshold)
      setLeaveThreshold(leaveThreshold);

  } catch (e) {
    getTimeFailure(e);
  }
  return { joinTime: joinTime.joinTime };
}

function clearJoinTimeOut(object) {
  clearTimeout(object.joinTimerId);
}

export function cancelPreviousTimeouts() {
  console.log("Clearing previous timeouts.");
  browser.storage.local
    .get("joinTimerId")
    .then(clearJoinTimeOut, getTimeFailure);
}

export function storeTimeoutIds(joinTimerId) {
  console.log("storing timeout ids");
  browser.storage.local.set({joinTimerId}).then(storeSucess, storeFailure);
}

export function storeLeaveThreshold(leaveThreshold) {
  browser.storage.local.set({leaveThreshold}).then(storeSucess, storeFailure);
}
