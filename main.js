function getJoinButton() {
    const spans = document.getElementsByTagName('span');
    for (let span of spans) {
        console.log(span.textContent)
        if (span.textContent === "Join now")
        return span;
    }
}

function getJoinButtonFromClass() {
    return document.getElementsByClassName('NPEfkd')[0];
}

function getLeaveButton() {
    return document.querySelector("[aria-label='Leave call']");
}

function leaveCall() {
    let leave = prompt('leave call?', 'yes');
    if (leave){
        getLeaveButton().click();
    }
}

function clickJoin() {
    const joinButton = getJoinButton();
    console.log(joinButton)
    if (joinButton !== undefined)
        joinButton.click();
}

console.log("cblicking");
console.log(clickJoin());

//todo: audio recognition for your name, and it starts beeping