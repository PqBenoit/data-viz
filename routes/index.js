var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Kikeriki' });
});

/* GET home page. */
router.get('/viz', function(req, res, next) {
  res.render('viz');
});

module.exports = router;
