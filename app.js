const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const app = express()
const port = 8080

app.use(express.static('public'))

app.get('/questions', (req, res) => {
    let db = new sqlite3.Database('./data.sqlite');

    db.all('SELECT * FROM questions', (err, rows) => {
        res.json(rows)

    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})