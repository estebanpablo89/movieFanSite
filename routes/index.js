var express = require('express');
var router = express.Router();
const request = require('request');

const apiKey = '';
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'https://image.tmdb.org/t/p/w300';

router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
  // request.get takes 2 args:
  // 1. it takes the url to 'get'
  // 2. the callback to run when the http response is back. Takes 3 args
  //  1. error (if any)
  //  2. http response
  //  3. json/data the server sent back
  request.get(nowPlayingUrl, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData); //or response.body
    //res.json(parsedData);

    res.render('index', { parsedData: parsedData.results });
  });
});

// /movie/:id is a wildcard route
// that means that :id is going to be stored in
router.get('/movie/:id', (req, res, next) => {
  //res.json(req.params.id);
  const movieId = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;
  //res.send(thisMovieUrl);
  request.get(thisMovieUrl, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData);
    res.render('singleMovie', { parsedData: parsedData });
  });
});

router.post('/search', (req, res, next) => {
  const userSeatchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;

  const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSeatchTerm}&api_key=${apiKey}`;

  //res.send(movieUrl);

  request.get(movieUrl, (error, response, movieData) => {
    let parsedData = JSON.parse(movieData);
    //    res.json(parsedData);
    if (cat === 'person') {
      parsedData.results = parsedData.results[0].known_for;
    }
    res.render('index', {
      parsedData: parsedData.results,
    });
  });
});

module.exports = router;
