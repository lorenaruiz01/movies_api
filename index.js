// import express module locally
const express = require('express');
// declares app variable to encapsulate Express's functionality to configure web server
const app = express();

let top10Movies = [
    {
        title: 'movie 1',
        director: 'Some Director'
    },
    {
        title: 'movie 2',
        director: 'Another Director'
    },
    {
        title: 'movie 3',
        director: 'Yet Another Director'
    }
];

// use middleware to log requests to the server
let requestLogger = (req, res, next) => {
    console.log(req.url);
    next();
};

app.use(requestLogger);

// returns json object: list of movies
app.get('/movies', (req, res) => {
    res.json(top10Movies);
});

// returns welcome message
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// listening on port 8080
app.listen(8080, () => {
    console.log('testing testing');
});

// route all requests for static files to the 'public' folder
app.use(express.static('public'));