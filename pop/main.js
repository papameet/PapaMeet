import { Timepicker } from "materialize-css";
import $ from "jquery";
import onInit from './oninit'

import "materialize-css/dist/css/materialize.min.css";
import "./index.css";

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".timepicker");
  var instances = Timepicker.init(elems);
});

console.log('main.js')

document.getElementById('submit').addEventListener('click', () => {
  console.log('popup loaded')
})

// let submit = document.getElementsByClassName("submit")[0];
// submit.addEventListener("click", () => {
//   document.getElementsByClassName("datepicker")[0].click();
// });
// onInit()

// document.addEventListener("DOMContentLoaded", onInit, false);
