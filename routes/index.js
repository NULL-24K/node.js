var express = require('express');
var jade = require('jade')
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '这是首页',name:'你妹'});
});

router.get('/admin',function (req,res,next) {
    res.render('admin',{title:'欢迎进入蜜蜂直聘后台管理系统'})
})


module.exports = router;
