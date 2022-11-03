const express = require('express')
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite')
const bodyParser = require('body-parser');
const multer = require('multer');

const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const { randomBytes } = require('crypto');

const app = express()
const port = 8080
const upload = multer();

const dotenv = require('dotenv');
dotenv.config();

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cookieParser());

app.use(cookieSession({
    name: 'session',                              // name of the cookie
    secret: process.env.COOKIE_SECRET,            // key to encode session
    maxAge: 24 * 60 * 60 * 1000,                  // cookie's lifespan
    sameSite: 'lax',                              // controls when cookies are sent
    path: '/',                                    // explicitly set this for security purposes
    secure: process.env.NODE_ENV === 'production',// cookie only sent on HTTPS
    httpOnly: true                                // cookie is not available to JavaScript (client)
}));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {

    /**
     * CSRF vulnerability #1
     * We give the frontend a token to make state-changing requests with, this is so the requests always has to be submitted using our website
     */
    if (req.session.csrf === undefined) {
        req.session.csrf = randomBytes(100).toString('base64'); // convert random data to a string
    }
    res.render('home', {
        'token': req.session.csrf
    });
});


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

app.get('/high-scores', async (req, res) => {
    sqlite.open({
        filename: './data.sqlite',
        driver: sqlite3.Database
    }).then(async (db) => {
        const result = await db.all(`SELECT * FROM scores ORDER BY score DESC, time LIMIT 20`)
        res.json(result)
    })
})

app.post('/high-scores', async (req, res) => {
    if (!req.body.csrf || req.body.csrf !== req.session.csrf) {
        res.status(401);
        res.json({
            "message": "CSRF token mismatch, please refresh the page!"
        })
        return;
    }

    sqlite.open({
        filename: './data.sqlite',
        driver: sqlite3.Database
    }).then(async (db) => {
        const player = req.body.player
        const score = parseInt(req.body.score)
        const time = parseInt(req.body.time)
        try {
            /**
             * We use a prepared statement to make sure we aren't vulnerable to SQL injection
             * @type {ISqlite.RunResult<sqlite3.Statement>}
             */
            const result = await db.run(
                'INSERT INTO scores (player, score, time) VALUES (?, ?, ?)', player, score, time
            )
            res.status(201);
            return res.json({
                "message": "Success!"
            })
        } catch (error) {
            console.log(error)
            res.status(400);
            res.json({
                "message": "Your request is incorrect!"
            })
        }

    })

})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${port}`)
})