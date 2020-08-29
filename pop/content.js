"use strict";

(function(){
  if (window.hasRun){
    return;
  }
  window.hasRun = true;

  browser.runtime.onMessage.addListener((message) =>{
    console.log('hi')
    const {joinTime, leaveTime} = message;
    console.log(joinTime, leaveTime)
  })
})();

console.log('contentscript')
