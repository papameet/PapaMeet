const elems = document.querySelectorAll(".timepicker");
const instances = M.Timepicker.init(elems, {container: '#timepicker'});
function listenForClick() {
  const join = document.getElementById("join");
  const leave = document.getElementById("leave");
  let leaveTime, joinTime;
  function catchError(e) {
    console.log(e);
  }
  function success(e) {
    console.log("success");
  }
  function onSubmitClick() {
    joinTime = join.value;
    leaveTime = leave.value;
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs
        .sendMessage(tabs[0].id, {
          joinTime,
          leaveTime,
        })
        .then(success)
        .catch(catchError);
    });
  }
  const submit = document.getElementById("submit");
  submit.addEventListener("click", onSubmitClick);
}
const catchError = (e) => {console.error(e)}
console.log("hweawea");
browser.tabs
  .executeScript({ file: "/content.js" })
  .then(listenForClick)
  .catch(catchError);
const timepicker = document.getElementById('timepicker')
var instance = M.Timepicker.getInstance(elems[0]);
// timepicker modal comfort zone 300x450
instance.open();