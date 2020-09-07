/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/content.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/content.js":
/*!************************!*\
  !*** ./src/content.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _join_leave_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./join_leave.js */ "./src/join_leave.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers.js */ "./src/helpers.js");
/* harmony import */ var _storage_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./storage.js */ "./src/storage.js");






function setUpTimeouts(joinTime, leaveTime) {
  joinTime = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["getDateObject"])(joinTime);
  leaveTime = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["getDateObject"])(leaveTime);

  console.log("setting up timeouts", { join: joinTime, leave: leaveTime });

  const joinTimerId = setTimeout(_join_leave_js__WEBPACK_IMPORTED_MODULE_0__["joinCall"], joinTime - Date.now());
  const leaveTimerId = setTimeout(_join_leave_js__WEBPACK_IMPORTED_MODULE_0__["leaveCall"], leaveTime - Date.now());
  Object(_storage_js__WEBPACK_IMPORTED_MODULE_2__["cancelPreviousTimeouts"])();
  Object(_storage_js__WEBPACK_IMPORTED_MODULE_2__["storeTimeoutIds"])(joinTimerId, leaveTimerId);
}

(function () {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  console.log("contentscript");
  browser.runtime.onMessage.addListener((message) => {
    const { joinTime, leaveTime } = message;
    setUpTimeouts(joinTime, leaveTime);
  });
})();


/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/*! exports provided: getDateObject, to24hours */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDateObject", function() { return getDateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "to24hours", function() { return to24hours; });
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage */ "./src/storage.js");




function getDateObject(timeObjectFromPicker) {
  const hours =
    timeObjectFromPicker.hours +
    (timeObjectFromPicker.amOrPm === "PM" ? 12 : 0);
  const minutes = timeObjectFromPicker.minutes;

  const date = new Date();
  date.setHours(hours, minutes, 0);
  return date;
}

function to24hours(time) {
  let str24hr = "";
  console.log(time)
  const hours = time.hours + (time.amOrPm === "PM" ? 12 : 0);
  const minutes = time.minutes;
  str24hr += hours + ":" + minutes;
  console.log(str24hr);
  return str24hr;
}


/***/ }),

/***/ "./src/join_leave.js":
/*!***************************!*\
  !*** ./src/join_leave.js ***!
  \***************************/
/*! exports provided: leaveCall, joinCall */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "leaveCall", function() { return leaveCall; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "joinCall", function() { return joinCall; });


function getJoinButton() {
    const spans = document.getElementsByTagName('span');
    for (let span of spans) {
        // console.log(span.textContent)
        if (span.textContent === "Join now") //Ask to join?
            return span;
    }
}

function getLeaveButton() {
    return document.querySelector("[aria-label='Leave call']");
}

function leaveCall() {
    const leaveButton = getLeaveButton();
    if (leaveButton !== undefined) {
        leaveButton.click();
        console.log("left meeting")
    } else {
        console.error("leave button not found")
    }
}

function joinCall() {
    const joinButton = getJoinButton();
    console.log(joinButton)
    if (joinButton !== undefined) {
        console.log("joined meeting.")
        joinButton.click();
    } else {
        console.error("join button not found")
    }
}


/***/ }),

/***/ "./src/storage.js":
/*!************************!*\
  !*** ./src/storage.js ***!
  \************************/
/*! exports provided: saveTimesToStorage, setUpTimesFromStorage, cancelPreviousTimeouts, storeTimeoutIds */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveTimesToStorage", function() { return saveTimesToStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setUpTimesFromStorage", function() { return setUpTimesFromStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cancelPreviousTimeouts", function() { return cancelPreviousTimeouts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "storeTimeoutIds", function() { return storeTimeoutIds; });
function storeSucess() {
  console.log("Succesfully stored to local storage.");
}

function storeFailure(e) {
  console.log("Failed to store with error:", e);
}

function saveTimesToStorage(joinTime, leaveTime) {
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

async function setUpTimesFromStorage() {
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

function cancelPreviousTimeouts() {
  console.log("Clearing previous timeouts.");
  browser.storage.local
    .get("leaveTimerId")
    .then(clearLeaveTimeout, getTimeFailure);
  browser.storage.local
    .get("joinTimerId")
    .then(clearJoinTimeOut, getTimeFailure);
}

function storeTimeoutIds(joinTimerId, leaveTimerId) {
  console.log("storing timeout ids");
  const toStore = { joinTimerId: joinTimerId, leaveTimerId: leaveTimerId };
  browser.storage.local.set(toStore).then(storeSucess, storeFailure);
}


/***/ })

/******/ });
//# sourceMappingURL=content.js.map