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
