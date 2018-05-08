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
        //.这里还要判断验证码是否正确***
        db.Account.findOne({
            where: {
                phoneNum:params.phoneNum
            }
        }).then(function (result) {
            //.此处判断用户是否注册过
            if (result && result.dataValues){
                model.data = {token:result.dataValues.token,shareId:result.dataValues.shareId}
                model.code = 0;
                model.msg = '登录成功'
                res.send(JSON.stringify(model));
            }else {
                var saveInfo = {phoneNum:params.phoneNum}
                db.Account.create(saveInfo).then(function (result) {
                    //.如果该用户携带了shareID 插入share表中
                    if (params.shareId && params.shareId != 'goldbee'){
                        var shareSql = {shareID:params.shareId,uuid:result.dataValues.uuid}
                        db.Share.create({}).then(function (res) {
                            console.log('添加shareID成功')
                        }).catch(function (err) {

                        })
                    }
                    model.code = 0;
                    model.msg = '注册成功';
                    model.data = {token:result.dataValues.token,shareId:result.dataValues.shareId}
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

router.post('/setAdmin',function (req,res,next) {
    var params = req.body;
    var model = new ResModel();
    if(params.administerId !='superAdminister'){
        model.msg = '对不起,您没有权限进行此项操作'
        res.send(JSON.stringify(model))
    }

    //.获取
    if(params.type == 1){//增加
        var timestamp = Date.parse(new Date());
        var sql = {administerId:'goldbeeAdmin'+params.phoneNum+'_'+timestamp,phoneNum:params.phoneNum,name:params.name}
        db.Administer.create(sql).then(function (result) {
            //成功 更新用户表 将account中shareID替换
            console.log(result)
            if(result){

            }else {

            }
            res.send(JSON.stringify(model))
        }).catch(function (err) {
            res.send(JSON.stringify(model))
        })
    }else if(params.type == 2){//删除
        db.Administer.destroy({where:{phoneNum:params.phoneNum}}).then(function (result) {
            res.send(JSON.stringify(model))
        }).catch(function (err) {
            res.send(JSON.stringify(model))
        })
    }
})


module.exports = router;

