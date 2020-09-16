function PlayAudio() {
  const audio = new Audio("./swiftly.mp3");
  audio.play();
}

function notify(word) {
  browser.notifications.create({
    "type": "basic",
    "title": 'AutoMeet',
    "message": `The word '${word}' has appeared!`,
  });
}

browser.runtime.onMessage.addListener((message) => {
  if (message.notify) {
    PlayAudio();
    notify(message.alertWord);
  }
});
