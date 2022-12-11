const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

//list top 10
router.get('/top10', (req, res) =>{
  const promise = Movie.find({}).limit(10).sort({imdb_score: -1});
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json({"Has Error: ":err});
  });
});

//listing all movies
router.get('/', (req, res) =>{
  const promise = Movie.aggregate([
    {
      $lookup: {
        from: 'directors',
        localField: 'director_id',
        foreignField: '_id',
        as: 'director',
      }
    },
    {
      $unwind: '$director',
    }
  ]);
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json({"Has Error: ":err});
  });
}); 

//find a movie with id
router.get('/:movie_id', (req, res,next) => {
  const promise = Movie.findById(req.params.movie_id);
  promise.then((data) => {
    if(!data)
      next({message: 'Not Found a movie', code: 1});
    res.json(data);
  }).catch((err) => {
    res.json({'Did Not find': err});
  });
});

//update a movie 
router.put('/:movie_id', (req, res,next) => {
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id, 
    req.body,
    {
      new :true
    }
    );
  promise.then((data) => {
    if(!data)
      next({message: 'Not Found a movie', code: 2});
    res.json({"Status": "Update successfully"});
  }).catch((err) => {
    res.json({'Did not update': err});
  });
});

//delete movie
router.delete('/:movie_id', (req, res,next) => {
  const promise = Movie.findByIdAndRemove(req.params.movie_id);
  promise.then((data) => {
    if(!data)
      next({message: 'Not Found a movie', code: 2});
    res.json({"Status": "Delete successfully"});
  }).catch((err) => {
    res.json({'Did Not Delete': err});
  });
});

//add a new movie with post method
router.post('/', (req, res, next) => {
  const movie = new Movie(req.body);
  const promise = movie.save();

  promise.then((data) => {
    console.log("data has been save");
    res.json({status: "saved"})
  }).catch((err) => {
    console.log("data did not save");
    res.json({"not saved": err})
  });

});

//find movie between two dates
router.get('/between/:start_date/:end_date', (req, res) =>{
  const { start_date, end_date } = req.params;
  const promise = Movie.find({
    year: { "$gte": parseInt(start_date), "$lte": parseInt(end_date), },
  });

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json({"Has Error: ":err});
  });
});

module.exports = router;
