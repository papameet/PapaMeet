"use strict";

export function getDateObject(timeObjectFromPicker) {
    const hours = timeObjectFromPicker.hours +
        (timeObjectFromPicker.amOrPm === "PM" ? 12 : 0);
    const minutes = timeObjectFromPicker.minutes

    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date;
}