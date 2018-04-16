/**
 * Created by chubin on 2018/4/11.
 */


var express = require('express');
var router = express.Router();
var URL = require('url');
var ResModel = require('./responseModel');
var util = require('./util');
var db = require('./dataBase/db')

/*用户登录*/
router.post('/Login',function(req,res,next) {

    var model = new ResModel();
    var params = req.body;
    var isAsync = false;
    if (!params.phoneNum){
        model.msg = '手机号码不能为空'
    }else if(!params.psd){
        model.msg = '密码不能为空'
    }else if(!util._isPhoneNum(params.phoneNum)){
        model.msg = '手机号码格式不正确'
    }else if(params.psd.length < 6){
        model.msg = '密码不能小于6位';
    }else if(params.psd.length > 20){
        model.msg = '密码不能大于20位';
    }else {
        isAsync = true;
        var sql = "select * from account" +" where phone = '"+ params.phoneNum +"'";
        sql.replace("and","where");
        db.query(sql, function (err, rows) {
            if (err){
                model.msg = '网络异常 请稍后再试'
            }else {
                //.此处判断用户是否注册过
                if(rows && rows.length ==1){
                    console.log('***')
                    model.data = {token:'123456789'}
                    model.code = 0;
                    model.msg = '登录成功'
                }else {
                    //.没有注册过 生成一条用户账户信息

                    model.code = 0;
                    model.msg = '注册成功';
                    model.data = {token:'88888888'}
                }
            }
            res.send(JSON.stringify(model));
        })
    }
    isAsync?null:res.send(JSON.stringify(model));
})


module.exports = router;

