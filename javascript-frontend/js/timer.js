var startedAt;
var timeInSeconds = 0;

function startTimer() {
    startedAt = new Date().getTime();
}

function getQuizDuration() {
    var timeInMiliseconds = new Date().getTime() - startedAt;
    timeInSeconds = timeInMiliseconds / 1000;
}

