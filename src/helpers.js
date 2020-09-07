"use strict";

import { saveTimesToStorage } from "./storage";

export function getDateObject(timeObjectFromPicker) {
  const hours =
    timeObjectFromPicker.hours +
    (timeObjectFromPicker.amOrPm === "PM" ? 12 : 0);
  const minutes = timeObjectFromPicker.minutes;

  const date = new Date();
  date.setHours(hours, minutes, 0);
  return date;
}

export function to24hours(time) {
  let str24hr = "";
  console.log(time)
  const hours = time.hours + (time.amOrPm === "PM" ? 12 : 0);
  const minutes = time.minutes;
  str24hr += hours + ":" + minutes;
  console.log(str24hr);
  return str24hr;
}
