function storeSucess() {
  console.log("Succesfully stored to local storage.");
}

function storeFailure(e) {
  console.log("Failed to store with error:", e);
}

export function saveTimesToStorage(joinTime, leaveTime) {
  //if (joinTime === undefined)
  const toStore = { joinTime: joinTime, leaveTime: leaveTime };
  console.log("Times set to ", toStore);
  browser.storage.local.set(toStore).then(storeSucess, storeFailure);
}

function getTimeFailure(e) {
  console.log("Failed to get stored time. error:", e);
}

function setTime(time, spanID) {
  const elemNo = spanID === "joinSpan" ? 0 : 1;
  const keyword = elemNo === 0 ? "Join" : "Leave";
  const elems = document.querySelectorAll(".timepicker");
  elems[
    elemNo
  ].innerHTML = `<div id='textContainer'><div class='left'>${keyword}:</div><div id='${spanID}' class='right'></div></div>`;

  const span = document.getElementById(spanID);
  span.innerHTML = `${time.hours}:${time.minutes}${time.amOrPm}`;
}

function setJoinTime(time) {
  if (time.joinTime) setTime(time.joinTime, "joinSpan");
}

function setLeaveTime(time) {
  if (time.leaveTime) setTime(time.leaveTime, "leaveSpan");
}

export async function setUpTimesFromStorage() {
  let joinTime, leaveTime;
  try {
    joinTime = await browser.storage.local.get("joinTime");
    setJoinTime(joinTime);
    leaveTime = await browser.storage.local.get("leaveTime");
    setLeaveTime(leaveTime);
  } catch (e) {
    getTimeFailure(e);
  }
  return { joinTime: joinTime.joinTime, leaveTime: leaveTime.leaveTime };
}

function clearLeaveTimeout(object) {
  clearTimeout(object.leaveTimerId);
}

function clearJoinTimeOut(object) {
  clearTimeout(object.joinTimerId);
}

export function cancelPreviousTimeouts() {
  console.log("Clearing previous timeouts.");
  browser.storage.local
    .get("leaveTimerId")
    .then(clearLeaveTimeout, getTimeFailure);
  browser.storage.local
    .get("joinTimerId")
    .then(clearJoinTimeOut, getTimeFailure);
}

export function storeTimeoutIds(joinTimerId, leaveTimerId) {
  console.log("storing timeout ids");
  const toStore = { joinTimerId: joinTimerId, leaveTimerId: leaveTimerId };
  browser.storage.local.set(toStore).then(storeSucess, storeFailure);
}
