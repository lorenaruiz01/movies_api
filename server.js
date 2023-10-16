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
        id: 1,
        name: 'Sam Name',
        username: 'samName',
        password: '****',
        email: 'someemail@email.com',
        favoriteMovies: []
    },
    {
        id: 2,
        name: 'Otter Name',
        username: 'otterName',
        password: '****',
        email: 'myemail@email.com',
        favoriteMovies: ['movie 1', 'movie 2']
    }, 
    {
        id: 3,
        name: 'Otter Otter Name',
        username: 'otterName2',
        password: '****',
        email: 'my.email@email.com',
        favoriteMovies: ['movie 3']
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
            name: 'horror',
            description: 'The genre of horror encompasses many styles...'
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
            name: 'horror',
            description: 'The genre of horror encompasses many styles...'
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
            name: 'comedy',
            description: 'Comedy is a genre loved by many for its ability to....'
        },
    },
];


// CRUD requests ===========================================

// READ - returns welcome message
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// READ - returns json object: list of movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});


// READ - returns json object: movie by title
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

// READ - returns data about a genre
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const moviesByGenre = movies.find( movies => movies.genre.name === genreName).genre;

    if (moviesByGenre) {
        res.status(200).json(moviesByGenre);
    } else {
        res.status(400).send('no information available for that genre')
    }
})

// how can I pull a list of all movies in the same genre? This request currently only returns the first movie that matches the requested parameter.
// Answer: Instead of find you can use filter to return all matching results. find only returns the first matching item.
// const moviesByGenre = movies.filter( movies => movies.genre.name === genreName);

// READ - returns data by genre
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const moviesByGenre = movies.find( movies => movies.genre.name === genreName);

    if (moviesByGenre) {
        res.status(200).json(moviesByGenre);
    } else {
        res.status(400).send('no movies in that genre')
    }
})

// READ - returns data about a director
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.director.name === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('so director by that name')
    }
})


// CREATE - add a new user 
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


// UPDATE - allow a user to update their username. 
// Can this be done using the username as the parameter instead of the id?
// Answer: 

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );

    if (user) {
        user.username = updatedUser.username;
        res.status(200).json(user) 
    } else {
        res.status(400).send('no user with that id exists')
    }
})

// UPDATE - allow a user to add a new movie to their list of favorites
app.post('/users/:id/:movieTitle',  (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to ${user.username}'s list of favorite movies`);
    } else {
        res.status(400).send('no such user')
    }
})



// DELETE - allow a user to remove a movie from their list of favorites
app.delete('/users/:id/:movieTitle',  (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been deleted from ${user.username}'s list of favorite movies`);
    } else {
        res.status(400).send('no such user')
    }
})


// DELETE - allow a user to deregister
app.delete('/users/:id',  (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
        users = users.find( user => user.id != id);
        res.status(200).send(`user ${user.username}'s account has been deleted`);
    } else {
        res.status(400).send('no such user')
    }
})

// listening on port 8080
app.listen(8080, () => {
    console.log('listening on port 8080')
});

