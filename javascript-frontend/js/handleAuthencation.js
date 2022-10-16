/* jshint esversion: 6 */
"use strict";

var student = "";

function handleLoginForm() {
    var userNumber = document.getElementById("studentNumber").value;

    if(!isNaN(userNumber)) {
        showAlert("Je nummer is incorrect, probeer het opnieuw!");
        return;
    }

    if(userNumber.startsWith('s')) {
        var number = userNumber.slice(1);
        if(isNaN(Number(number))) {
            showAlert("Je nummer is incorrect, probeer het opnieuw!");
            return;
        }
    } else {
        var number = userNumber.slice(2);
        if(isNaN(Number(number))) {
            showAlert("Je nummer is incorrect, probeer het opnieuw!");
            return;
        }
    }

    loginUser(userNumber);

}

function updateUser(user) {
    student = user.number;
    document.getElementById('studentName').innerText = `Student: ${user.firstName} ${user.lastName}`;

}