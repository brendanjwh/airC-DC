var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ejs' });
  var drums = require('./routes/drums');
  next(drums);
});

module.exports = router;
