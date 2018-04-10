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

  var user_ = new User.one();

  var params = URL.parse(req.url, true).query;



  if(params.id == '1') {

    user_.name = "储彬";
    user_.age = "24";
    user_.dop = "本科";
    user_.phoneNum ="13095515908";
    user_.iconUrl = "";
    user_.sex = "男";

  }else{
    user_.name = "SPTING";
    user_.age = "1";
    user_.city = "杭州市";
  }

  console.log(typeof user_);



  var response = {status:1,data:user_};
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


