// IMPORT MODULES ==========================================

// import express module to use locally
const express = require('express');
    // declares app variable to encapsulate Express's functionality to configure web server    
    app = express(), 
    // import body-parser module
    bodyParser = require('body-parser'); 
    // import uuid module
    uuid = require('uuid');

app.use(bodyParser.json());

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


// ARRAYS ==================================================
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
        year: '1972',
        synopsis: ' this movie is about...',
        director: {
            name: 'Sam Director',
            bio: ' bio bio bio...'
        },
        genre: {
            name: 'horror'
        },
    },
    {
        title: 'movie 2',
        year: '1972',
        synopsis: ' this movie is about...',
        director: {
            name: 'Another Director',
            bio: ' bio bio bio...'
        },
        genre: {
            name: 'horror'
        },
    },
    {
        title: 'movie 3',
        year: '1972',
        synopsis: ' this movie is about...',
        director: {
            name: 'Yet Another Director',
            bio: ' bio bio bio...'
        },
        genre: {
            name: 'comedy'
        },
    },
];

// CREATE requests =========================================
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('please include new user name')
    }
}); 

// READ requests ===========================================

// returns welcome message
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// returns json object: list of movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});


// returns json object: movie by title
app.get('/movies/:title', (req, res) => {
    // const title = req.params.title;
    // more commonly written as: 
    const { title } = req.params;
    const movie = movies.find( movie => movie.title === title)
    
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
});

// returns movies by genre
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const moviesByGenre = movies.find( movies => movies.genre.name === genreName);

    if (moviesByGenre) {
        res.status(200).json(moviesByGenre);
    } else {
        res.status(400).send('no movies in that genre')
    }
})

// returns data about a director
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.director.name === directorName)

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('so director by that name')
    }
})


// listening on port 8080
app.listen(8080, () => {
    console.log('listening on port 8080')
});

