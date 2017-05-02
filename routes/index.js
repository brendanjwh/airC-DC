var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ejs' });
  var bass = require('./routes/bass');
  next(bass);
  var dj1 = require('./routes/dj1');
  next(dj1);
  var dj2 = require('./routes/dj2');
  next(dj2);
  var drums = require('./routes/drums');
  next(drums);
  var piano = require('./routes/piano');
  next(piano);
  var team = require('./routes/team');
  var scenes = require('./routes/scenes');
  next(scenes);
  next(team);
  var trump = require('./routes/trump');
  next(trump);
});

module.exports = router;
