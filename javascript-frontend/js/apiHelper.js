/* jshint esversion: 6 */
"use strict";

const QUIZ_MASTER_NUMBER = 's1155590';


/**
 * Check student number using the API
 */
function loginUser(number) {
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function () {
        if (xHttp.readyState == XMLHttpRequest.DONE) {
            var response = JSON.parse(xHttp.response);
            if (xHttp.status == 200) {
                userIdentificationSucces(response);
            } else {
                userIdentificationFailed(response);
            }
        }
    };
    xHttp.onerror = function () {
        userIdentificationFailed(xHttp.statusText);
    };
    xHttp.open("GET", "https://quiz.clow.nl/v1/student/" + number, true);
    xHttp.send();
}

/**
 * Student is successfully identified
 */
function userIdentificationSucces(user) {
    updateUser(user);
    showQuestionsPage();

}

/**
 * Student number is incorrect
 */
function userIdentificationFailed(errorMessage) {
    console.error(errorMessage);
    showAlert("Je nummer is incorrect, probeer het opnieuw!");
    return;

}

/**
 * Sends score of the player to the Quiz-API.
 * @param student Student number of player
 * @param points Points of player
 */
function sendScore(student, points, time) {
    var xHttp = new XMLHttpRequest();

    xHttp.onreadystatechange = function () {
        if (xHttp.readyState == XMLHttpRequest.DONE) {
            if (xHttp.status == 200) {
                console.info("Score succesvol opgeslagen");
            } else {
                console.error("Score niet succesvol opgeslagen");
            }
        }
    };

    xHttp.onerror = function () {
        console.error("Score niet succesvol opgeslagen");
    };

    xHttp.open("POST", "https://quiz.clow.nl/v1/score", true);
    xHttp.setRequestHeader('Content-Type', 'application/json');

    console.log(time);

    xHttp.send(JSON.stringify({
        quizMaster: QUIZ_MASTER_NUMBER,
        student: student,
        points: points,
        time: time,
    }));
    
}


function getHighScores() {
    var xHttp = new XMLHttpRequest();

    xHttp.onreadystatechange = function () {
        if (xHttp.readyState == XMLHttpRequest.DONE) {
            var response = JSON.parse(xHttp.response);
            if (xHttp.status == 200) {
                updateLeaderboard(response);
            } else {
                console.error("Er ging wat fout met het ophalen van het leaderboard, probeer het opnieuw");
            }
        }
    };
        
    xHttp.onerror = function () {
        console.error("Er ging wat fout met het ophalen van het leaderboard, probeer het opnieuw");
    };

    xHttp.open("GET", "https://quiz.clow.nl/v1/highscores/" + QUIZ_MASTER_NUMBER, true);
    xHttp.send();
    
}
