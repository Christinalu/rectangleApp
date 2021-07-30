var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('create');
});

router.get('/update/:id', function(req, res, next) {
  res.render('update', {myId: req.params.id});
});

module.exports = router;