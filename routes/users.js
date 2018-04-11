var express = require('express');
var router = express.Router();
var User = require('./UserModel.js');
var URL = require('url');
var Msg = require('./Msg');
var ResModel = require('./responseModel');
var util = require('./util');

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

/* 获取用户信息*/
router.get('/getUserInfo', function(req, res, next) {

  var model = new ResModel();

  var user_ = new User.userInfo();

   var params = URL.parse(req.url, true).query;
   if (!req.headers.token || req.headers.token.length == 0){
     model.msg = '该用户尚未登录';
     res.send(JSON.stringify(model));
     return;
   }

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
    user_.iconUrl = "http://pic29.photophoto.cn/20131204/0034034499213463_b.jpg";
    user_.sex = "男";
    user_.workIntention = 'iOS/web前端';
    user_.advantage = '本人性格开朗,代码习惯良好';
    user_.workExperienceList = workArr;
    user_.educationList = educationArr;
    user_.workYears = '5年以上'
    model.msg = '请求成功';
    model.code = 0;
    model.data = user_;
    res.send(JSON.stringify(model));

});
/*求职意向*/
router.post('/jobIntention',function(req,res,next) {
    var model = new  ResModel();
    if (!req.headers.token || req.headers.token.length == 0){
        model.msg = '请登录'
    }else {
        var intentionInfo = new User.jobIntention();
        if (req.body.type == 0){
            /*期望工作地点*/
            intentionInfo.intentionAddress ='上海市-浦东新区-唐镇';
            /*期望行业*/
            intentionInfo.intentionIndustry ='IT/通信/电子/互联网';
            /*期望职位*/
            intentionInfo.intentionPosition ='催收';
            /*期望薪资*/
            intentionInfo.intentionSalary ='24000~30000';
            /*求职状态*/
            intentionInfo.jobState ='在职-考虑更好的工作机会';
            model.code = 0;
            model.msg = '请求成功';
            model.data = intentionInfo;

        }else {

        }
    }

    res.send(JSON.stringify(model));
});

/*个人信息 type:0为获取信息 其他为提交*/
router.post('/persionInfo',function(req,res,next) {

  var model = new ResModel();
  if (!req.headers.token || req.headers.token.length == 0){
    model.msg = '该用户尚未登录';
  }else {
    var _info = new User.persionInfo();
    if (req.body.type == 0){//.获取信息
      _info.iconUrl = 'http://pic29.photophoto.cn/20131204/0034034499213463_b.jpg';
      _info.nickName = '独孤求败';
      _info.sex = '男';
      _info.phoneNum = '130****908';
      _info.emaill = '11******17@qq.com';
      _info.birthday = '1990-06-28';
      _info.education = '本科';
      _info.endEducationTime = '2014-07-01';
      _info.workYears = '5年以上';
      _info.address = '上海市-浦东新区-张江';
      model.data = [[_info.iconUrl,_info.nickName,_info.sex],
                    [_info.phoneNum,_info.emaill],
                    [_info.birthday,_info.education,_info.endEducationTime,_info.workYears,_info.address]];
      model.code = 0;
    }else {//上传信息

    }
  }

  res.send(JSON.stringify(model));

});


module.exports = router;


