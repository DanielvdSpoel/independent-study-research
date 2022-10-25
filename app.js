const express = require('express')
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite')

const app = express()
const port = 8080

app.use(express.static('public'))

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

app.post('/high-scores', async (req, res) => {

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})