function storeTimesSucess() {
    console.log("Succesfully stored times to local storage.");
}

function storeTimesFailure(e) {
    console.log("Failed to store times with error:", e);
}

export function saveTimesToStorage(joinTime, leaveTime) {
    //if (joinTime === undefined)
    const toStore = {joinTime: joinTime, leaveTime: leaveTime}
    console.log("Times set to ", toStore);
    browser.storage.local.set(toStore).then(storeTimesSucess, storeTimesFailure);
}

function getTimeFailure(e) {
    console.log("Failed to get stored time. error:", e)
}

function setTime(time, spanID) {
    const elemNo = spanID === "joinSpan" ? 0 : 1;
    const keyword = elemNo === 0 ? "Join" : "Leave"
    const elems = document.querySelectorAll(".timepicker");
    elems[elemNo].innerHTML = 
        `<div id='textContainer'><div class='left'>${keyword}:</div><div id='${spanID}' class='right'></div></div>`;

    const span = document.getElementById(spanID);
    span.innerHTML = `${time.hours}:${time.minutes}${time.amOrPm}`;
}

function setJoinTime(time) {
    setTime(time.joinTime, 'joinSpan')
}

function setLeaveTime(time) {
    setTime(time.leaveTime, 'leaveSpan')
}

export function setUpTimesFromStorage() {
    browser.storage.local.get('joinTime').then(setJoinTime, getTimeFailure);
    browser.storage.local.get('leaveTime').then(setLeaveTime, getTimeFailure);
}
