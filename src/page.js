"use strict";

export function getJoinButton() {
    const spans = document.getElementsByTagName('span');
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
        console.log("left meeting")
    } else {
        console.error("leave button not found")
    }
}

export function joinCall() {
    const joinButton = getJoinButton();
    console.log(joinButton)
    if (joinButton !== undefined) {
        console.log("joined meeting.")
        joinButton.click();
    } else {
        console.error("join button not found")
    }
}

function getPeopleCount() {
	return parseInt(document.querySelector("span.wnPUne.N0PJ8e").innerHTML);
}

export let leaveTimeoutId;

export function leaveWhenPeopleLessThan(count = 10) {
	leaveTimeoutId = setTimeout(function run(count){
		console.log("leave run");
		let people_count_now = getPeopleCount();
		if (count > people_count_now) {
			console.log("leaving now. people count:", people_count_now)
			leaveCall()
			clearTimeout(leaveTimeoutId);
		} else {
			leaveTimeoutId = setTimeout(run, 10, count);
		}
	}, 10, count)
}
