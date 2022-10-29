const express = require('express')
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite')
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express()
const port = 8080
const upload = multer();

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());


app.get('/questions', async (req, res) => {
    sqlite.open({
        filename: './data.sqlite',
        driver: sqlite3.Database
    }).then(async (db) => {
        const questions = await db.all('SELECT * FROM questions')
        for (const question of questions) {
            question['possible_answers'] = await db.all('SELECT * FROM possible_answers WHERE question_id = :id', {
                ':id': question['id']
            })
        }
        await res.json(questions)

    })
})

/*app.post('/high-scores', async (req, res) => {
    console.log(req)
    res.json(req.body)
})*/

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})