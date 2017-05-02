var express = require('express');
var router = express.Router();

/* GET drums page. */
router.get('/drums', function(req, res, next) {
  // res.render('drums', { title: 'ejs' });
  res.send('hi')
});

module.exports = router;