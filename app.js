const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser'); //afteradd

const index = require('./routes/index');
const movie = require('./routes/movie');
const director = require('./routes/director');

const app = express();
//mongo db connect

const mongoose = require('./helper/db')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/movies', movie);
app.use('/api/directors',director);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: {message: err.message, code: err.code}}); //replace with res.render('error); for exception handling and set a specific error code
});

module.exports = app;
