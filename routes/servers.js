/**
 * Created by chubin on 2018/8/29.
 */
var express = require('express');
var router = express.Router();
var URL = require('url');
var ResModel = require('./responseModel');
var JOB = require('./jobModel');
var util = require('./util');
var db = require('../sqldb');
var Sequelize = require('sequelize');//引入orm



router.post('/searchNotif',function (req,res,next) {
    var model = new ResModel();
    var params = req.body;
    if(params.administratorId && params.administratorId.length>0){
        searchFormInfo(params.jobId,params.administratorId,function (results) {
            if(results.code ==0){
                model.code =0;
                model.msg = '成功'
                model.data = results.data;
            }else {
                model.code =1;
                model.msg = '失败'
            }
            res.send(JSON.stringify(model));
        })
    }else {
        console.log('$$$')
        model.msg = '你还不是管理员'
        res.send(JSON.stringify(model));
    }
})


/*检索用户信息,用于填充模板信息*/
function searchFormInfo(jobId,adminId,callBack) {
    var formInfo = {};
    db.Administer.findOne({where:{administratorId:adminId}}).then(function (findRes) {
        if(findRes.dataValues){
            var obj = findRes.dataValues;
            formInfo.servePhoneNum = obj.servePhoneNum.length ==0?obj.phoneNum:obj.servePhoneNum;
            formInfo.nickName = obj.adminNickName.length ==0?obj.name:obj.adminNickName;
            formInfo.tipS = '请按时参加面试';
            searchJobInfo(jobId,function (jobInfo) {
                if(jobInfo.code ==0){
                    formInfo.companyName = jobInfo.data.companyName;
                    formInfo.jobName = jobInfo.data.jobName;
                    formInfo.interViewAddress = jobInfo.data.interViewAddress;
                    formInfo.interviewTimes = jobInfo.data.interviewTimes;
                    callBack({'code':0,'data':formInfo})
                }else {
                    callBack({'code':0,'data':formInfo})
                }
            })
        }else {
            callBack({'code':1,'data':null})
        }
    }).catch(function (findErr) {
        callBack({'code':1,'data':null})
    })
}

function searchJobInfo(jobId,callBack) {
    var jobInfo = {}
    db.JobInfo.findOne({where:{jobId:jobId}}).then(function (findRes) {
        if(findRes){
            jobInfo.companyName = findRes.dataValues.companyName;
            jobInfo.jobName = findRes.dataValues.jobName;
            jobInfo.interViewAddress = findRes.dataValues.interViewAddress;
            jobInfo.interviewTimes = findRes.dataValues.interviewTimes;
            callBack({'code':0,'data':jobInfo})
        }else {
            callBack({'cdoe':1,'data':null})
        }
    }).catch(function (findErr) {
        callBack({'cdoe':1,'data':null})
    })
}

/*{
 "keyword1": {
 "value": "南京笃信教育"
 },
 "keyword2": {
 "value": "开发工程师"
 },
 "keyword3": {
 "value": "杭州市滨江区阡陌路482＃"
 } ,
 "keyword4": {
 "value": "2017-01-11 21:50"
 },
 "keyword5": {
 "value": "18815280356"
 },
 "keyword6": {
 "value": "刘先生"
 } ,
 "keyword7": {
 "value": "请按时参加面试"
 }
 }*/
router.post('/sendNotif',function (req,res,next) {
    var model = new ResModel();
    var params = req.body;
    if((typeof params.sendInfoArr) == 'string'){
        params.sendInfoArr = params.sendInfoArr.split(",")
    }

    console.log(typeof params.sendInfoArr)
    console.log( params.sendInfoArr)
    if(params.administratorId && params.administratorId.length>0){
        if(params.sendInfoArr && params.sendInfoArr.length ==7){
            var sendData = {
                "keyword1": {
                    "value": params.sendInfoArr[0]
                },
                "keyword2": {
                    "value": params.sendInfoArr[1]
                },
                "keyword3": {
                    "value": params.sendInfoArr[2]
                } ,
                "keyword4": {
                    "value": params.sendInfoArr[3]
                },
                "keyword5": {
                    "value": params.sendInfoArr[4]
                },
                "keyword6": {
                    "value": params.sendInfoArr[5]
                } ,
                "keyword7": {
                    "value": params.sendInfoArr[6]
                }
            };

            util.sendWeChatMsg(params.uuid,sendData,function (sendRes) {
                console.log(sendRes)
                if(sendRes.code ==0){
                    model.code =0;
                    model.msg = '发送成功';
                }else {
                    model.code = 1
                    model.msg = '发送失败';
                }
                res.send(JSON.stringify(model));
            })
        }else {
            model.msg = '数据存在不全'
            res.send(JSON.stringify(model));
        }
    }else {
        console.log('$$$')
        model.msg = '你还不是管理员'
        res.send(JSON.stringify(model));
    }
})



module.exports = router;