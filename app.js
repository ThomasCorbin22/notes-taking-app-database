// NPM modules
const express = require('express');
const basicAuth = require('express-basic-auth')
const hb = require('express-handlebars');
const bodyParser = require('body-parser')
const https = require('https');
const fs = require('fs');

const app = express();

// Get user modules
const myAuthorizer = require('./Auth/myAuthorizer.js')
const NoteService = require('./Service/NoteService.js')
const NoteRouter = require('./Router/NoteRouter.js')

// Set up port
const port = 8080

// Set up basic authentication
app.use(basicAuth({
    authorizer: myAuthorizer,
    challenge: true,
    authorizeAsync: true,
    realm: 'My Application'
}));

// Set up new NoteService variable that connects to the JSON notes file
const noteService = new NoteService()

// Set up handlebars middleware
app.engine('handlebars', hb({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set up static files
app.use(express.static("public"));

// Set up body parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    noteService.listNotes(req.auth.user)
        .then((data) => {
            res.render('index', {
                user: req.auth.user,
                number: data.length,
                notes: data
            })
        })
});

// Route any requests going to /notes to our NoteRouter class
app.use("/notes", new NoteRouter(noteService).route());

// Listen to a port
const options = {
    cert: fs.readFileSync('./localhost.crt'),
    key: fs.readFileSync('./localhost.key')
};

console.log("Application listening to port " + port);
https.createServer(options, app).listen(port);

module.exports = app