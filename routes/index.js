var express = require('express');
var jade = require('jade')
var router = express.Router();
var ejs = require('ejs');
var URL = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '这是首页',name:'你妹'});
});

router.get('/admin/login',function (req,res,next) {
    res.render('admin/login',{name:'ssss',title:'这是title'});
})

router.get('/admin/main',function (req,res,next) {
    res.render('admin/main',{name:'大兵'})
})

router.get('/admin/jobs',function (req,res,next) {
    res.render('admin/jobs',{name:'大兵'})
})

router.get('/admin/post',function (req,res,next) {
    res.render('admin/main',{name:'大兵'})
   // console.log(req.headers);
})

module.exports = router;
