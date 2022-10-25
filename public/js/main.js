let questions = []
let currentQuestion = -1
let pointsAmount = 0
let answerCooldownEnabled = false
const http = new XMLHttpRequest()
http.open('GET', 'http://localhost:8080/questions')
http.send()

http.onreadystatechange = (e) => {
    questions = JSON.parse(http.responseText)
}

//Event handlers for submitting the questions
document.getElementById('answer-a').addEventListener("click", function () {
    submitAnswer("a")
})
document.getElementById('answer-b').addEventListener("click", function () {
    submitAnswer("b")
})
document.getElementById('answer-c').addEventListener("click", function () {
    submitAnswer("c")
})
document.getElementById('answer-d').addEventListener("click", function () {
    submitAnswer("d")
})

//Submitting the name and starting the quiz
const startQuizButton = document.getElementById('start_quiz_button');
startQuizButton.addEventListener("click", function () {
    const playerName = document.getElementById('name_input').value

    /**
     * XSS vulnerability #1
     * If you use .innerHTML instead of .innerText you allow the end user to input everything they want, for example the following
     * <img src=x onerror=alert()>
     * This allows for any javascript that is in the onerror to be executed
     */
    document.getElementById('student_name').innerText = 'Student: ' + playerName
    document.getElementById('home').style.display = 'none'
    document.getElementById('stats').style.display = 'flex'
    document.getElementById('quiz').style.display = 'block'
    //nextQuestion()
    finishQuiz()
});

function nextQuestion() {
    currentQuestion++
    document.getElementById('current_question_number').innerText = currentQuestion + 1

    const newQuestion = questions[currentQuestion]
    const questionElement = document.getElementById('question-text')
    questionElement.innerText = newQuestion['question'] //XSS vulnerability #2, again using innerText instead of innerHTML
    for (let i = 0; i < 4; i++) {
        const answer = newQuestion['possible_answers'][i]
        const answerElement = document.getElementById('answer-' + answer['question_letter'] + '-text')
        answerElement.innerText = answer['answer']
    }
    updateBalls()
}

function updateBalls() {
    for (let i = 0; i < questions.length; i++) {
        if (i < currentQuestion) {
            document.getElementById("status-ball-" + i).innerHTML = "<a href=\"#\" class=\"block h-2.5 w-2.5 rounded-full bg-orange-600\"></a>"
        }
        if (i === currentQuestion) {
            document.getElementById("status-ball-" + i).innerHTML = "<a href=\"#\" class=\"relative flex items-center justify-center\" aria-current=\"step\"><span class=\"absolute flex h-5 w-5 p-px\" aria-hidden=\"true\"><span class=\"h-full w-full rounded-full animate-ping bg-orange-200\"></span></span><span class=\"relative block h-2.5 w-2.5 rounded-full bg-orange-600\" aria-hidden=\"true\"></span></a>"
        }
        if (i > currentQuestion) {
            document.getElementById("status-ball-" + i).innerHTML = "<a href=\"#\" class=\"block h-2.5 w-2.5 rounded-full bg-gray-200\"></a>"
        }
    }
}

function addPoint() {
    pointsAmount++
    document.getElementById('points').innerText = pointsAmount
}

function submitAnswer(letter) {
    if (answerCooldownEnabled) return
    answerCooldownEnabled = true

    const question = questions[currentQuestion]
    const wrongAnswers = ['a', 'b', 'c', 'd']
    wrongAnswers.splice(wrongAnswers.indexOf(question['correct_answer']), 1);

    if (letter === question['correct_answer']) {
        addPoint()
    }

    wrongAnswers.forEach(wrongAnswerLetter => {
        document.getElementById('answer-' + wrongAnswerLetter).setAttribute('aria-answer-correct', false);
    })
    document.getElementById('answer-' + question['correct_answer']).setAttribute('aria-answer-correct', true);

    if (currentQuestion === (questions.length - 1)) {
        finishQuiz()
    } else {
        setTimeout(function () {
            wrongAnswers.forEach(wrongAnswerLetter => {
                document.getElementById('answer-' + wrongAnswerLetter).setAttribute('aria-answer-correct', null);
            })
            document.getElementById('answer-' + question['correct_answer']).setAttribute('aria-answer-correct', null);

            nextQuestion()
            answerCooldownEnabled = false
        }, 500)
    }
}

function finishQuiz() {
    document.getElementById('quiz').style.display = 'none'
    document.getElementById('ending').style.display = 'block'


    console.log("Finished")
}
