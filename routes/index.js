var express = require('express');
var router = express.Router();
var loldy = require('../model/loldy');
/* GET home page. */
router.get('/', function(req, res, next) {
  loldy.lolIndex().then(function(list){
  	res.render('index', list);
  });
});

router.get('/detail', function(req, res, next) {
  var url = req.query.url || '';
  loldy.detailPc(url).then(function(detail){
  	res.render('detail', detail);
  });
});

router.post('/search', function(req, res, next) {
  var keywords = req.body.keyword || '';
  loldy.searchWeb(keywords).then(function(list){
  	res.render('search', list);
  });
});

//电源分类
router.get('/category', function(req, res, next){
  var cid = req.query.cid || '1';
  cid = loldy.getCid(cid);
  //Dongzuodianying
  loldy.category(cid).then(function(list){
    res.render('category', list);
  });
});
module.exports = router;
