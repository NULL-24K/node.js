/**
 * Created by chubin on 2018/4/11.
 */


var express = require('express');
var router = express.Router();
var URL = require('url');
var ResModel = require('./responseModel');
var util = require('./util');
var db = require('../sqldb')

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
        db.Account.findOne({
            where: {
                phoneNum:params.phoneNum
            }
        }).then(function (result) {
            //.此处判断用户是否注册过
            if (result && result.dataValues){
                model.data = {token:result.dataValues.token}
                model.code = 0;
                model.msg = '登录成功'
                res.send(JSON.stringify(model));
            }else {
                var saveInfo = {phoneNum:params.phoneNum}
                db.Account.create(saveInfo).then(function (result) {
                    model.code = 0;
                    model.msg = '注册成功';
                    model.data = {token:result.dataValues.token}
                    res.send(JSON.stringify(model));
                }).catch(function (err) {
                    console.log(err )
                    model.msg = '网络异常 请稍后再试'
                    res.send(JSON.stringify(model));
                })
            }
        }).catch(function (err) {
            console.log(err)
            model.msg = '网络异常 请稍后再试'
            res.send(JSON.stringify(model));
        })
    }
    isAsync?null:res.send(JSON.stringify(model));
})


module.exports = router;

