// import express module locally
const express = require('express');

// declares app variable to encapsulate Express's functionality to configure web server
const app = express();

// import morgan middleware
const morgan = require('morgan');

// passes Morgan functionality into app.use() function
app.use(morgan('common'));

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

// adds a property to the request object that’s been set to the timestamp of the request
let requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
};

app.use(requestLogger);
app.use(requestTime)

// route all requests for static files to the 'public' folder
app.use(express.static('public'));

// returns json object: list of movies
app.get('/movies', (req, res) => {
    res.json(top10Movies);
});

// returns welcome message
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// error handling middleware function logs all application-level errors to the terminal
app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listening on port 8080
app.listen(8080, () => {
    console.log('testing testing');
});

