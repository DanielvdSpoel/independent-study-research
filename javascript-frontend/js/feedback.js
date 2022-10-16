/* jshint esversion: 6 */
"use strict";

const ALERT_BOX = `<span class="closebtn" onclick="this.parentElement.style.display='none';"> &times; </span> %%message%%`;

function showAlert(message) {

    var element = document.getElementById("alert-box");
    var message = ALERT_BOX.replace("%%message%%", message);
    element.innerHTML = message;
    element.style.display = "block";

}

function hideAllAlerts() {
    var element = document.getElementById("alert-box");
    element.style.display = "none";
}