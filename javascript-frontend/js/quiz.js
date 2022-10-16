/* jshint esversion: 6 */
"use strict";

var currentQuestion = {};
var points = 0;
var currentQuestionNumber = 1;
var answerdQuestions = [];
var images = {
    '1': "git.png",
    '2': "html.png",
    '4': "ul.png",
    '5': "comment.png",
    '8': "code.png",
    '10': "code.png"
};

/**
 * Add actions to page buttons 
 */
function addButtonActions() {
    var startButton = document.getElementById('button-start');
    var questionsButton = document.getElementById('button-questions');

    var answerAButton = document.getElementById('answerA');
    var answerBButton = document.getElementById('answerB');
    var answerCButton = document.getElementById('answerC');
    var answerDButton = document.getElementById('answerD');


    var nextButton = document.getElementById('next');
    var prevButton = document.getElementById('prev');


    startButton.addEventListener("click", function () {
        showStartPage();
    });
    questionsButton.addEventListener("click", function () {
        handleLoginForm();
    });

    answerAButton.addEventListener("click", function () {
        handleAnswer("A");
    });
    answerBButton.addEventListener("click", function () {
        handleAnswer("B");
    });
    answerCButton.addEventListener("click", function () {
        handleAnswer("C");
    });
    answerDButton.addEventListener("click", function () {
        handleAnswer("D");
    });

    nextButton.addEventListener("click", function () {
        loadNextQuestion();
    });
    prevButton.addEventListener("click", function () {
        loadPreviousQuestion();
    });

}

/**
 * Hide all pages
 */
function hideAllPages() {
    var startPage = document.getElementById('page-start');
    var questionsPage = document.getElementById('page-questions');
    var endPage = document.getElementById('page-end');

    startPage.style.display = 'none';
    questionsPage.style.display = 'none';
    endPage.style.display = 'none';
    hideAllAlerts();
}

/**
 * Show start page
 */
function showStartPage() {
    var page = document.getElementById('page-start');
    hideAllPages();
    page.style.display = 'grid';
    getHighScores();

    console.info('Je bent nu op de startpagina');
}


/**
 * Show questions page
 */
function showQuestionsPage() {

    var page = document.getElementById('page-questions');

    hideAllPages();

    page.style.display = 'block';
    loadQuestion();
    startTimer();

    console.info('Je bent nu op de vragenpagina'); 
}


/**
 * Show end page
 */
function showEndPage() {
    var page = document.getElementById('page-end');

    hideAllPages();

    page.style.display = 'block';
    document.getElementById("twitter-button").href=`https://twitter.com/intent/tweet?text=Ik%20heb%20zojuist%20de%20frontend%20quiz%20gemaakt%20in%20${timeInSeconds}%20seconden%20en%20mijn%20score%20was%20${points}!`; 

    console.info('Je bent nu op de eind pagina');
}


/**
 * Load the next question
 */
function loadQuestion() {
    currentQuestion = questions[currentQuestionNumber];
    changeAnswer("A", currentQuestion.answers[1]);
    changeAnswer("B", currentQuestion.answers[2]);
    changeAnswer("C", currentQuestion.answers[3]);
    changeAnswer("D", currentQuestion.answers[4]);
    setQuestion(currentQuestion.question);
    var questionTitle = document.getElementById("question-title");
    questionTitle.innerHTML = `Vraag ${currentQuestionNumber}`;
    hideAllAnswers();
    hideAllAlerts();
    

}


/**
 * Change the current question
 */
function setQuestion(newQuestion) {
    var question = document.getElementById("question");
    question.innerHTML = newQuestion;
}


/**
 * Change one of the four answers
 */
function changeAnswer(answerChar, newAnswer) {
    var element = document.getElementById("answer" + answerChar);
    element.innerHTML = `<span class="answer-char">${answerChar}</span> ${newAnswer}`;

}

function handleAnswer(answer) {
    if(answerdQuestions.includes(currentQuestionNumber)) {
        showAlert("Je hebt deze vraag al beantwoord!");
        return;
    }
    if(answer == currentQuestion.correctAnswer) {
        addPoint();
        addScore(currentQuestionNumber, true);
    } else {
        showAlert("Dit is het verkeerde antwoord!");
        addScore(currentQuestionNumber, false);

    }
    showAnswer("A");
    showAnswer("B");
    showAnswer("C");
    showAnswer("D");
    answerdQuestions.push(currentQuestionNumber);

}

function addPoint() {
    points++;
    document.getElementById("points").innerHTML = `Punten: ${points}`;
}

function addScore(number, correct) {

    var cssClass = correct ? 'answer-correct' : 'answer-wrong';
    document.getElementById(`dot${number}`).classList.add(cssClass);

}

function showAnswer(answer) {
    var element = document.getElementById("answer" + answer);
    if(answer == currentQuestion.correctAnswer) {
        element.classList.add("answer-correct");

    } else {
        element.classList.add("answer-wrong");

    }
}

function hideAllAnswers() {
    hideAnswer("A");
    hideAnswer("B");
    hideAnswer("C");
    hideAnswer("D");
} 

function hideAnswer(answer) {
    var element = document.getElementById("answer" + answer);
    element.classList.remove("answer-correct");
    element.classList.remove("answer-wrong");

}


function loadPreviousQuestion() {
    if(currentQuestionNumber !== 1) {
        currentQuestionNumber = currentQuestionNumber - 1;
        loadQuestion();
        loadNextPicture();
        showAnswer("A");
        showAnswer("B");
        showAnswer("C");
        showAnswer("D");

    } else {
        showAlert("Dit is de eerste vraag!");
        return;
    }
}

function loadNextQuestion() {
    if(!answerdQuestions.includes(currentQuestionNumber)) {
        showAlert("Je moet eerst deze vraag beantwoorden!");
        return;
    }
    if(currentQuestionNumber < 10) {
        currentQuestionNumber++;
        loadQuestion();
        loadNextPicture();
        if(answerdQuestions.includes(currentQuestionNumber)) {
            showAnswer("A");
            showAnswer("B");
            showAnswer("C");
            showAnswer("D");    
        }
    } else {
        handleQuizEnding();
    }
}

function handleQuizEnding() {
    console.log("De quiz is klaar!");
    getQuizDuration();
    showEndPage();
    sendScore(student, points, timeInSeconds);
    var element = document.getElementById("end-score");
    element.innerHTML = `Je hebt ${points} van de 10 vragen goed!`;
    
}

function loadNextPicture() {
    var fotoElement = document.getElementById("vraag-foto");
    if(images[currentQuestionNumber]) {
        fotoElement.src = "img/" + images[currentQuestionNumber];
        fotoElement.style.display = "block";

    } else {
        fotoElement.style.display = "none";
    }
}


// Initialize
addButtonActions();
showStartPage();
