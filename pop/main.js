import { Timepicker } from "materialize-css";
import onInit from './oninit'

import "materialize-css/dist/css/materialize.min.css";
import "./index.css";

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".timepicker");
  var instances = Timepicker.init(elems);
});

