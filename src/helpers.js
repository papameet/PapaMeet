export function getDateObject(timeObjectFromPicker) {
  const hours =
      timeObjectFromPicker.hours +
      (timeObjectFromPicker.amOrPm === "PM" ? 12 : 0),
    { minutes } = timeObjectFromPicker,
    date = new Date();
  date.setHours(hours, minutes, 0);
  return date;
}

export function to24hours(time) {
  let str24hr = "",
    hours = time.hours + (time.amOrPm === "PM" ? 12 : 0);
  if (hours < 10) hours = `0${hours}`;
  const minutes = time.minutes < 10 ? `0${time.minutes}` : time.minutes;
  str24hr += `${hours}:${minutes}`;
  return str24hr;
}
