/**
 * Created by chubin on 2018/4/12.
 */


var express = require('express');
var router = express.Router();
var URL = require('url');
var ResModel = require('./responseModel');
var util = require('./util');
var db = require('../sqldb');


/*工作申请*/
router.post('/applyJob',function (req,res,next) {

    var model = new ResModel();

    //.用户鉴权
    var token = req.headers.token;
    if (token.length > 0){
        //.判断用户是否有权限申请(是否申请/申请次数是否超过限制)
        db.Order.findOne({where:{uuid:req.headers.token,jobId:req.body.jobId}}).then(function (result) {
            console.log(result +'***')
            if(result){
                model.msg = '您已申请该职位,无需再申请'
                res.send(JSON.stringify(model))
            }else {//向order表中插入数据
                //.查询用户的基本信息
                db.User.findOne({where:{uuid:req.headers.token}}).then(function (userResrlt) {
                    if(!userResrlt || !userResrlt.dataValues.nickName ||!userResrlt.dataValues.jobExpress ||!userResrlt.dataValues.educations||!userResrlt.dataValues.jobIntenview){
                        model.code = -1;
                        model.msg = '您尚未完善您的简历,请先完成您的简历'
                        res.send(JSON.stringify(model))
                    } else {
                        var orderSql = {
                            jobId:req.body.jobId,
                            /*求职者UUID*/
                            uuid:req.headers.token,
                            /*公司*/
                            companyName:req.body.companyName,
                            /*职位*/
                            jobName:req.body.jobName,
                            /*简历处理状态*/
                            intentionStatus:1,
                            /*职位发布者ID*/
                            administratorId:req.body.administratorId,
                            userName:userResrlt.dataValues.nickName,
                            phoneNum:userResrlt.dataValues.phoneNum
                        }
                        db.Order.upsert(orderSql).then(function (result) {
                            model.code = 0;
                            if(result){
                                model.msg = '添加成功';
                            }else {
                                model.msg = '修改成功'
                            }
                            model.data = {};
                            res.send(JSON.stringify(model))
                        }).catch(function (err) {
                            res.send(JSON.stringify(model))
                        })
                    }
                }).catch(function (userErr) {
                    res.send(JSON.stringify(model))
                })
            }
        }).catch(function (err) {
            res.send(JSON.stringify(model))
        })
    }else {
        model.msg = '该用户尚未登录'
        model.code = 1;
        res.send(JSON.stringify(model))
    }
     
    
    if(0){
        db.Order.update({where:{orderId:''},intentionStatus:''}).then(function (result) {
            
        }).catch(function (err) {
            
        })
    }
    
   

})

router.post('/',function (req,res,next) {
    var model = new ResModel();

    var  token = req.headers.token;
})

module.exports = router;