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

});