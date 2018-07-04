/**
 * Created by chubin on 2018/4/11.
 */


var express = require('express');
var router = express.Router();
var URL = require('url');
var ResModel = require('./responseModel');
var util = require('./util');
var db = require('../sqldb');
var request = require('request');

/*用户登录*/
router.post('/Login',function(req,res,next) {
    var model = new ResModel();
    var params = req.body;
    var isAsync = false;
    if (!params.phoneNum){
        model.msg = '手机号码不能为空'
    }else if(!params.psd){
        model.msg = '验证码不能为空'
    // }else if(!util._isPhoneNum(params.phoneNum)){
    //     model.msg = '手机号码格式不正确'
    // }else if(params.psd.length != 6){
    //    model.msg = '验证码码格式不正确';
    }else {
        isAsync = true;
        //.这里还要判断验证码是否正确***
        db.MsgCode.findOne({where:{phoneNum:params.phoneNum}}).then(function (msgResult) {
            var obj = msgResult.dataValues;
            var timestamp = Date.parse(new Date());
            var msgCreatetime = obj.msgCreatetime;
           // console.log(obj.msgCreatetime +'时间'+timestamp);
            if((timestamp -msgCreatetime) > 1800000){//超时
                model.msg = '验证码已失效'
                res.send(JSON.stringify(model));
            }else if(obj.inputNum > 5){
                model.msg = '操作频繁,请重新获取'
                res.send(JSON.stringify(model));
            }else if(obj.msgCode !=params.psd){
                model.msg = '验证码错误'
                res.send(JSON.stringify(model));
            }else {//验证码正确
                db.Account.findOne({
                    where: {
                        phoneNum:params.phoneNum
                    }
                }).then(function (result) {
                    //.此处判断用户是否注册过
                    if (result && result.dataValues){
                        model.data = {token:result.dataValues.uuid,shareId:result.dataValues.shareId}
                        model.code = 0;
                        model.msg = '登录成功'
                        res.send(JSON.stringify(model));
                        console.log(result.dataValues)
                        //.判断是否携带openID且数据库未存储没有openId
                        if(!result.dataValues.openid && params.openid){
                            db.Account.update({openid:params.openid,session_key:params.session_key},{where:{phoneNum:params.phoneNum}}).then(function (upsult) {
                                console.log('插入openID成功')
                            })
                        }

                    }else {
                        var saveInfo = {phoneNum:params.phoneNum}
                        if(params.session_key){
                            saveInfo.session_key =params.session_key
                        }
                        if(params.openid){
                            saveInfo.openid =params.openid
                        }
                        console.log(saveInfo);
                        db.Account.create(saveInfo).then(function (result) {
                            //.如果该用户携带了shareID 插入share表中
                            if (params.shareId && params.shareId != 'goldbee'){
                                var shareSql = {shareID:params.shareId,uuid:result.dataValues.uuid}
                                db.Share.create(shareSql).then(function (res) {
                                    console.log('添加shareID成功')
                                }).catch(function (err) {

                                })
                            }
                            model.code = 0;
                            model.msg = '注册成功';
                            model.data = {token:result.dataValues.uuid,shareId:result.dataValues.shareId}
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
            var donum = obj.inputNum +1;
            console.log(donum)
            db.MsgCode.update({inputNum:donum},{where:{phoneNum:params.phoneNum}})
        }).catch(function (err) {
            model.msg = '网络异常 请稍后再试'
            res.send(JSON.stringify(model));
        })
    }
    isAsync?null:res.send(JSON.stringify(model));
})

router.post('/setAdmin',function (req,res,next) {
    var params = req.body;
    var model = new ResModel();
    if(params.administratorId !='superAdminister'){
        model.msg = '对不起,您没有权限进行此项操作'
        res.send(JSON.stringify(model))
        return;
    }

    if(params.type == 1){//增加
        var timestamp = Date.parse(new Date());
        var sql = {administratorId:'goldbeeAdmin'+params.phoneNum+'_',phoneNum:params.phoneNum,name:params.name,deleteType:0}
        db.Administer.upsert(sql).then(function (result) {
            //成功 更新用户表 将account中shareID替换
            console.log('更新超级管理员信息'+result)

                model.code = 0;
                model.msg = '添加成功'
                db.Account.upsert({phoneNum:params.phoneNum,shareId:sql.administratorId},{where:{phoneNum:params.phoneNum}}).then(function (addres) {
                    console.log('修改管理员shareID成功'+addres.dataValues)
                }).catch(function (upErr) {
                    console.log(upErr+'修改错误')
                })

                //model.msg = '您已经添加该管理员,无需重复添加'

            res.send(JSON.stringify(model))
        }).catch(function (err) {
            res.send(JSON.stringify(model))
        })

    }else if(params.type == 2){//删除
        if(params.phoneNum == 18767090623){
            model.msg = '超级管理员无法删除,如需要删除 请联系开发'
            res.send(JSON.stringify(model))
            return;
        }
        db.Administer.update({deleteType:1},{where:{phoneNum:params.phoneNum}}).then(function (result) {
            db.Account.upsert({phoneNum:params.phoneNum,shareId:'goldbee'},{where:{phoneNum:params.phoneNum}}).then(function (addres) {

            })
            db.Share.update({shareId:'goldbee'},{where:{shareID:params.shareId}});
            model.msg = '删除成功'
            model.code = 0;
            res.send(JSON.stringify(model))
        }).catch(function (err) {
            model.code = 1;
            model.msg = '删除失败'
            res.send(JSON.stringify(model))
        })
    }
})

router.post('/getMsg',function (req,res,next) {
    var model = new ResModel();
    if(!req.body.phoneNum || req.body.phoneNum.length == 0){
        model.msg = '手机号码不能为空'
        res.send(JSON.stringify(model))
    }else if(req.body.phoneNum.length != 11) {
        model.msg = '手机号码格式不正确'
        res.send(JSON.stringify(model))
        // }else if(!util._isPhoneNum(req.body.phoneNum)){
        //     model.msg = '手机号码格式不正确'
        //     res.send(JSON.stringify(model))
        // }
    } else {
        var msgcode_ = util.createCode();
        var params = [msgcode_];
        util.sendMsg(req.body.phoneNum,params,function (err, msgRes, resData) {
            if (err) {
                console.log("err: ", err);
                model.msg = '短信发送失败'
                model.code = 1;
                res.send(JSON.stringify(model))
            }else{
                model.msg = '短信发送成功'
                model.code = 0;
                res.send(JSON.stringify(model))
                db.MsgCode.upsert({inputNum:0,phoneNum:req.body.phoneNum,msgCode:msgcode_,msgCreatetime:Date.parse(new Date())},{where:{phoneNum:req.body.phoneNum}}).then(function (msgRes) {
                    console.log(msgRes +'生成短信')
                }).catch(function (msgerr) {
                    console.log(msgerr+'修改短信错误')
                })
            }
                console.log("response data:", resData);
        })
    }
})

/*解析微信登录 获取openID*/
router.post('/weChatLogin',function (req,res,next) {
    var model = new ResModel()
    var params = req.body;
    var reqUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid=wx00055f7fcfe5a043&secret=9c551050a085e321b60164c793f88fdd&grant_type=authorization_code&js_code='+params.code;
    request(reqUrl, function (error, response, body) {//9c551050a085e321b60164c793f88fdd 秘钥 2018-7-4
        if (!error && response.statusCode == 200) {
            console.log(body) // Show the HTML for the baidu homepage.
            model.code = 0;
            model.msg = '获取成功'
            var obj = JSON.parse(body);

            db.Account.findOne({where:{openid:obj.openid}}).then(function (accountRes) {
                console.log(accountRes +'###');
                if(accountRes){
                    obj.token = accountRes.dataValues.uuid
                }
                model.data = obj
                res.send(JSON.stringify(model))
            }).catch(function (err) {
                model.data = obj
                res.send(JSON.stringify(model))
            })
        }else {
            model.msg = '解析失败'
            res.send(JSON.stringify(model))
        }
    })
})

/*管理员登录*/
router.post('/adminLogin',function (req,res,next) {
    var params = req.body;
    var model = new ResModel();
    if(!params.phoneNum || params.phoneNum.length != 11){
        model.msg = '手机号码格式不正确'
        res.send(JSON.stringify(model));
        return;
    }

    db.Administer.findOne({where:{phoneNum:params.phoneNum,deleteType:0}}).then(function (result) {
        if(result){
            if(params.psd != result.dataValues.psd){
                model.msg = '密码错误'
            }else {
                model.msg = '登录成功'
                var obj = {
                    administratorId:result.dataValues.administratorId,
                    phoneNum:result.dataValues.phoneNum,
                    name:result.dataValues.name
                }
                model.data = obj;
                model.code = 0;
            }
            res.send(JSON.stringify(model));
        }else {
            model.msg = '您还不是管理员,请联系超级管理员添加';
            res.send(JSON.stringify(model));
        }
    }).catch(function (err) {
        model.msg = '网络异常,请稍后重试'
        console.log(err)
        res.send(JSON.stringify(model));
    })
})



module.exports = router;

