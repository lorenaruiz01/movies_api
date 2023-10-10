// import express module to use locally
const express = require('express');
    // declares app variable to encapsulate Express's functionality to configure web server    
    app = express(), 
    // import body-parser module
    bodyParser = require('body-parser'); 
    // import uuid module
    uuid = require('uuid');

app.use(bodyParser.json());

let users = [
    {
        name: 'Sam Name',
        username: 'samName',
    },
    {
        name: 'Otter Name',
        username: 'otterName',
    }, 
    {
        name: 'Otter Otter Name',
        username: 'otterName2'
    }
]

let movies = [
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

// import morgan middleware
const morgan = require('morgan');

// passes Morgan functionality into app.use() function
app.use(morgan('common'));

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

// error handling middleware function logs all application-level errors to the terminal
app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// ===========================================
// READ requests

// returns welcome message
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// returns json object: list of movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});


// returns json object: list of movies
app.get('/movies:title', (req, res) => {
    // const title = req.params.title;
    // more commonly written as: 
    const { title } = req.params;
    res.status(200).json(movies);
});



// listening on port 8080
app.listen(8080, () => {
    console.log('listening on port 8080')
});

