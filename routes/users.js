var express = require('express');
var router = express.Router();
var User = require('./User.js');
var URL = require('url');
var Msg = require('./Msg');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/getMsgInfo', function(req, res, next) {

  var msg =  new Msg();
  var params = URL.parse(req.url, true).query;

  if(params.id == '1') {
    msg.age = "1";
  }else{
    msg.age = "1";
  }

  console.log(typeof msg);
  var response = {status:1,data:msg};
  res.send(JSON.stringify(response));

});


router.get('/getUserInfo', function(req, res, next) {

  var user_ = new User.userInfo();

  var params = URL.parse(req.url, true).query;
  var msg = ''

  if(params.id == '1') {
    var workArr = new Array();
    for (var i = 0 ; i < 2 ; i ++){
        var userMode = new  User.titleModel();
        userMode.title = i==0?'科大讯飞':'阿里巴巴集团';
        userMode.detail = i==0?'2015-11-24~2017-08-08':'2017-11-24~2018-08-08';
        workArr.push(userMode);
    }

    var  educationArr = new  Array;
      for (var i = 0 ; i < 2 ; i ++){
          var userMode = new  User.titleModel();
          userMode.title = i==0?'安徽大学':'潜山中学';
          userMode.detail = i==0?'2011-09-01~2015-07-01':'2008-09-01~2011-07-01';
          educationArr.push(userMode);
      }

    user_.name = "储彬";
    user_.age = "24";
    user_.education = "本科";
    user_.phoneNum ="13095515908";
    user_.iconUrl = "";
    user_.sex = "男";
    user_.workIntention = 'iOS/web前端';
    user_.advantage = '本人性格开朗,代码习惯良好';
    user_.workExperienceList = workArr;
    user_.educationList = educationArr;
    user_.workYears = '5年以上'
    msg = '请求成功'

  }else{
    user_.name = "SPTING";
    user_.age = "1";
    user_.city = "杭州市";
  }

  console.log(typeof user_);

  var response = {code:0,msg:msg,data:user_};
  res.send(JSON.stringify(response));

});

router.get('/getUserInfo_new', function(req, res, next) {

  var xxx = new User.two();
 // var Name = {name:''}
  console.log(xxx.age +'###');
  var params = URL.parse(req.url, true).query;

  if(params.id == '1') {

    xxx.age = "ligh";

  }else{
    xxx.age = "SPTING";

  }

  var response = {status:1,data:xxx};
  res.send(JSON.stringify(response));

});

module.exports = router;


