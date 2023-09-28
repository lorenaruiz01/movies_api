const express = require('express');
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

// returns json object: list of movies
app.get('/movies', (req, res) => {
    res.json(top10Movies);
});


app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

app.listen(8080, () => {
    console.log('testing testing');
});

// route all requests for static files to the 'public' folder
app.use(express.static('public'));