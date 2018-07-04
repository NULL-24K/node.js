/**
 * Created by tongwenya on 2018/4/11.
 */

var express = require('express');
var router = express.Router();
var URL = require('url');
var ResModel = require('./responseModel');
var JOB = require('./jobModel');
var util = require('./util');
var db = require('../sqldb');


router.post('/jobDetail',function (req,res,next) {
    var model = new  ResModel();
    var _jobInfo = new JOB.jobDetailModel();

    if(req.body.type == 1 || req.body.type == 'delete'){//提交/修改参数

        var params = req.body;
        //此处要先验证管理员权限
        if(!params.administratorId || params.administratorId.length ==0){
            model.msg = '你还不是管理员'
            res.send(JSON.stringify(model))
            return;
        }

        db.Administer.findOne({where:{administratorId:params.administratorId }}).then(function (result) {

            if(result){
                if(req.body.type == 1){
                    if(req.body.type){
                        delete params.type;
                    }
                    if(typeof params.wellArr != 'string'){
                        params.wellArr = JSON.stringify(params.wellArr);
                    }
                    console.log(params +'///')
                    db.JobInfo.upsert(params).then(function (result) {
                        model.code =0;
                        if(result == false){
                            model.msg = '修改成功'
                        }else {
                            model.msg = '添加成功'
                        }
                        res.send(JSON.stringify(model))
                    }).catch(function (err) {
                        console.log(err)
                        console.log('###')
                        res.send(JSON.stringify(model))
                    })
                }else {
                    db.JobInfo.destroy({where:{jobId:req.body.jobId}}).then(function (result) {
                        model.code =0;
                        model.msg = '删除成功'
                        res.send(JSON.stringify(model))
                    }).catch(function (err) {
                        res.send(JSON.stringify(model))
                    })
                }
            }else {
                model.msg = '你好像不是该职位的管理员'
                res.send(JSON.stringify(model))
            }
        }).catch(function (err) {
            console.log(err +'错误')
            res.send(JSON.stringify(model))
        })

    }else {//获取职位详情
        var jobDetailSql = {where:{jobId:req.body.jobId}}
        db.JobInfo.findOne(jobDetailSql).then(function (result) {
            model.code = 0;
            if(result){
                _jobInfo.jobName = result.dataValues.companyName;//由于交换了职位名称和公司名称 这里也交换过来
                _jobInfo.jobIncom = result.dataValues.salary;
                _jobInfo.singerLocation = result.dataValues.workAddress;
                _jobInfo.minEducation = result.dataValues.minEducation;
                _jobInfo.workExperienc = result.dataValues.minWorkExperience;
                _jobInfo.applyNum = result.dataValues.applyNum +result.dataValues.defApplyNum;
                _jobInfo.wellArr = JSON.parse(result.dataValues.wellArr);
                _jobInfo.interviewTime = result.dataValues.interviewTimes;
                _jobInfo.interViewLocation = result.dataValues.interViewAddress;
                _jobInfo.jobLocation = result.dataValues.workAddress;
                _jobInfo.jobDescribe = result.dataValues.jobDescribe;
                _jobInfo.applyState = '立即申请';
                _jobInfo.companyDescribe = result.dataValues.companyDescrie;
                _jobInfo.administratorId = result.dataValues.administratorId;
                _jobInfo.jobid = result.dataValues.jobId;
                _jobInfo.companyName = result.dataValues.jobName;//由于交换了职位名称和公司名称 这里也交换过来
                model.data = _jobInfo;
                model.msg = '请求成功'
            }else {
                model.msg = '暂无数据'
            }

            //用户已登录 需要查找该用户是否已申请该职位
            if (req.headers.token && req.headers.token.length >0){
               // console.log(req.body)
                db.Order.findOne({where:{uuid:req.headers.token,jobId:req.body.jobId}}).then(function (result) {

                    if(result){
                     model.data.applyState = '已申请';//util.intentionStatusENUM(result.dataValues.intentionStatus)
                    }
                    res.send(JSON.stringify(model))
                }).catch(function (err) {
                    res.send(JSON.stringify(model))
                })
            }else {
                res.send(JSON.stringify(model))
            }

        }).catch(function (err) {
            res.send(JSON.stringify(model))
        })
    }


})

router.post('/jobList',function(req,res,next) {
    var  model = new ResModel();

    var page = 1, pageSize = 10;
    var adminId = req.body.adminId;
    var sql_where = {administratorId:'superAdminister'}
    if (adminId && adminId !='goldbee'){
        sql_where = {administratorId:[adminId,'superAdminister']}
    }
    console.log(sql_where)
    if (req.body.type == 0){
        var jobsSql = {
            order: [['createdAt', 'DESC']],
            where:sql_where,
            offset:(page - 1) * pageSize,
            limit:pageSize
        }
        db.JobInfo.findAndCountAll(jobsSql).then(function (result) {
            model.code = 0;
            if(result){
                var jobArr = new  Array();
                for(var i =0;i <result.rows.length; i++){
                    var  obj = result.rows[i].dataValues;
                    var jobInfo = new JOB.companyModel();
                    jobInfo.companyName = obj.companyName;
                    jobInfo.jobName = obj.jobName;
                    jobInfo.companyImgUrl = obj.companyImgUrl;
                    jobInfo.workAddress = obj.workAddress;
                    jobInfo.minEducation = obj.minEducation;
                    jobInfo.workExperienc = obj.minWorkExperience;
                    jobInfo.ID = obj.jobId;
                    jobInfo.salary = obj.salary;
                    jobInfo.time = obj.interviewTimes;
                    jobInfo.administratorId = obj.administratorId;
                    jobInfo.applyNum = obj.applyNum +obj.defApplyNum;
                    jobArr.push(jobInfo);
                }
                model.data = jobArr;
                model.msg = '请求成功'
            }else {

            }
            res.send(JSON.stringify(model));
        }).catch(function (err) {
            res.send(JSON.stringify(model));
        })

    }else {
        res.send(JSON.stringify(model));
    }

})


router.post('/adminPhoneNum',function (req,res,next) {
    var token = req.headers.token;
    var model = new ResModel();

    if (token.length >0){
        db.User.findOne({where:{uuid:token}}).then(function (userResrlt) {
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
                db.Administer.findOne({where:{administratorId:req.body.administratorId}}).then(function (adminRes) {
                    if (adminRes){
                        model.code = 0;
                        model.msg = '获取成功';
                        model.data = {phoneNum:adminRes.dataValues.phoneNum}
                    }else {
                        model.msg = '暂未获取该HR联系方式';
                    }
                    res.send(JSON.stringify(model))
                }).catch(function (adminerr) {
                    res.send(JSON.stringify(model))
                })
            }
        }).catch(function (error) {
            res.send(JSON.stringify(model))
        })
    }else {
        console.log('###')
        res.send(JSON.stringify(model));
    }
})

module.exports = router;

