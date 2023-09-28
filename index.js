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

app.get('/movies', (req, res) => {
    res.json(top10Movies);
});