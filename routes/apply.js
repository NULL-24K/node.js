/**
 * Created by chubin on 2018/4/12.
 */


var express = require('express');
var router = express.Router();
var URL = require('url');
var ResModel = require('./responseModel');
var util = require('./util');
var db = require('../sqldb');
var sequelize = require('sequelize')


/*工作申请*/
router.post('/applyJob',function (req,res,next) {

    var model = new ResModel();

    //.用户鉴权
    var token = req.headers.token;
    if (token.length > 0){
        //.判断用户是否有权限申请(是否申请/申请次数是否超过限制)
        db.Order.findOne({where:{uuid:req.headers.token,jobId:req.body.jobId}}).then(function (result) {

            if(result){
                model.msg = '您已申请该职位,无需再申请'
                res.send(JSON.stringify(model))
            }else {//向order表中插入数据
                //.查询用户的基本信息
                db.User.findOne({where:{uuid:req.headers.token}}).then(function (userResrlt) {
                    if(!userResrlt || !userResrlt.dataValues.nickName  ||!userResrlt.dataValues.educations||!userResrlt.dataValues.jobIntenview){

                        if (!userResrlt){
                            model.code = -1;
                            model.msg = '您尚未完善您的简历,请先完成您的简历'
                        }else if(!userResrlt.dataValues.nickName){
                            model.code = -2;
                            model.msg = '您尚未完善您的基本信息,请先完成您的基本信息'
                        }else if(!userResrlt.dataValues.educations){
                            model.code = -3;
                            model.msg = '您尚未完善您的教育信息,请先完成您的教育信息'
                        }else if(!userResrlt.dataValues.jobIntenview){
                            model.code = -4;
                            model.msg = '您尚未完善您的求职意向,请先完成您的求职意向'
                        }

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
                       // console.log(sequelize.DataTypes.UUIDV1() +'####')
                        db.JobInfo.findOne({where:{jobId:req.body.jobId}}).then(function (findJobRes) {
                            if (findJobRes){
                                console.log(findJobRes.dataValues)
                                db.JobInfo.update({applyNum:findJobRes.dataValues.applyNum+1},{where:{jobId:req.body.jobId}}).then(function (jobRest) {
                                    console.log('修改申请人数成功'+jobRest)
                                }).catch(function (jobErr) {
                                    console.log('修改申请人数错误'+jobErr)
                                })
                            }
                        }).catch(function (findJobErr) {
                            console.log('查询申请人数错误'+jobErr)
                        })

                        db.Order.create(orderSql).then(function (result) {
                            //.修改之后 向简历处理详情中插入一条数据
                            model.code = 0;
                            if(result){
                                db.OrderApplyList.create(result.dataValues).then(function (addRes) {
                                    console.log('简历处理' +addRes)
                                }).catch(function (adderr) {
                                    console.log('简历处理错误' +adderr)
                                })
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

})


router.post('/orderStatus',function (req,res,next) {
    var model = new ResModel();
    var params = req.body;
    if(params.administratorId && params.administratorId.length>0){
        db.Order.update({intentionStatus:params.intentionStatus},{where:{orderId:params.orderId}}).then(function (result) {
            model.code = 0;
            model.msg = '操作成功'
            console.log(result)
            //.修改之后 向简历处理详情中插入一条数据
            db.OrderApplyList.create(params).then(function (addRes) {
                console.log('简历处理' +addRes)
            }).catch(function (adderr) {
                console.log('简历处理' +adderr)
            })
            res.send(JSON.stringify(model));
        }).catch(function (err) {
            console.log(err)
            res.send(JSON.stringify(model));
        })
    }else {
        console.log('$$$')
        model.msg = '你还不是管理员'
        res.send(JSON.stringify(model));
    }
})

module.exports = router;