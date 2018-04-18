var express = require('express');
var router = express.Router();
var User = require('./UserModel.js');
var URL = require('url');
var Msg = require('./Msg');
var ResModel = require('./responseModel');
var util = require('./util');
var db = require('../sqldb');
var xxx = require('sequelize');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/education',function (req,res,next) {
    var  model = new ResModel();
    if (req.headers.token.length > 0){

        var educationInfo = {
            startTime:'2010-09-01',
            endTime:'2014-07-01',
            school:'清华大学',
            specialize:'计算机科学与技术',
            diploma:'本科',
            id:'999'
        }
        model.code = 0;
        model.msg = '请求成功';
        model.data = educationInfo;

    }else {
        model.msg = '请登录'
    }

    res.send(JSON.stringify(model));
})


/*工作经历*/
router.post('/workExperience',function (req,res,next) {


    var model = new ResModel();
    if (!req.headers.token || req.headers.token.length == 0){
        model.msg = '该用户尚未登录';
        res.send(JSON.stringify(model));
        return;
    }
    if(req.body.type == 0){
        console.log('获取')
        db.JobExperience.findOne({where:{uuid:req.headers.token}}).then(function (result) {
            model.msg = '请求成功';
            model.code = 0;
            if (result && result.dataValues){

                
            }else {

            }
            res.send(JSON.stringify(model));
        }).catch(function (err) {
            res.send(JSON.stringify(model));
        })
    }else {
        var jobExprienceSql = {
            uuid:req.headers.token,
            companyName:req.body.companyName,
            jobName:req.body.jobName,
            startTime:req.body.startTime,
            endTime:req.body.endTime,
            jobDescribe:req.body.jobDescribe,
        }
        if(req.body.jobExprienceId && req.body.jobExprienceId.length > 0){
            jobExprienceSql['jobExprienceId'] = req.body.jobExprienceId
        }
        db.JobExperience.upsert(jobExprienceSql).then(function (result) {
            model.code = 0;
            model.msg = '提交成功'
            res.send(JSON.stringify(model));
            //.更新User表中jobExpress字段
            db.JobExperience.findAll({where:{uuid:req.headers.token}}).then(function (resul) {
                if(resul){
                    var jobsArr = [];
                    for(var i=0;i < resul.length;i ++){
                        var obj = {title:resul[i].dataValues.companyName,detail:resul[i].dataValues.startTime,
                            id:resul[i].dataValues.jobExprienceId}
                        jobsArr.push(obj);
                    }
                    var jobexreienceSql = {
                        uuid:req.headers.token,
                        jobExpress:JSON.stringify(jobsArr)
                    }
                    db.User.upsert(jobexreienceSql);
                }
            }).catch(function (err) {
                console.log(err +'||')
            })
        }).catch(function (err) {
            res.send(JSON.stringify(model));
        })
    }

    // var model = new ResModel();
    // if(req.headers.token.length > 0){
    //     if(req.body.type == 0){//按照id来获取信息
    //
    //         var resData = {
    //             companyName:'科大讯飞',
    //             jobName:'项目经理',
    //             startTime:'2014-8-8',
    //             endTime:'2018-3-6',
    //             jobDescribe:'这个工作其实很简单...'
    //         }
    //         model.data = resData;
    //         model.code = 0;
    //         model.msg = '请求成功'
    //     }else {//.提交
    //         model.code = 0;
    //         model.msg = '提交成功';
    //     }
    // }else {
    //     model.msg = '请先登录'
    // }
    // res.send(JSON.stringify(model));
})

/*工作经历list*/
router.post('/workList',function (req,res,next) {

    db.JobExperience.findAll({where:{uuid:req.headers.token}}).then(function (ress) {
        console.log(ress +'&&&')
    }).catch(function (err) {

    })

})

/* 获取用户信息*/
router.get('/getUserInfo', function(req, res, next) {
    if (!req.headers.token || req.headers.token.length == 0){
        model.msg = '该用户尚未登录';
        res.send(JSON.stringify(model));
        return;
    }

    var sqlInfo = {where:{
        uuid:req.headers.token
    }}
    var model = new ResModel();
    db.User.findOne(sqlInfo).then(function (result) {
        model.code = 0;
        model.msg = '请求成功'
        if(result && result.dataValues){
            var user_ = new User.userInfo();
            var workArr = new Array();
            var Arr = JSON.parse(result.dataValues.jobExpress)
            if(Arr){
                for (var i = 0 ; i < Arr.length; i ++){
                    var userMode = new  User.titleModel();
                    userMode.title = Arr[i].title;
                    userMode.detail = Arr[i].detail;
                    userMode.id = Arr[i].id;
                    workArr.push(userMode);
                }
            }

            var  educationArr = new  Array;
            var Arr_ = JSON.parse(result.dataValues.educations)
            if(Arr_){
                for (var i = 0 ; i < Arr_.length ; i ++){
                    var userMode = new  User.titleModel();
                    userMode.title = Arr_[i].title;
                    userMode.detail = Arr_[i].detail;
                    userMode.id = Arr_[i].id;
                    educationArr.push(userMode);
                }
            }
            user_.name = result.dataValues.nickName;
            user_.education = result.dataValues.education;
            user_.phoneNum =result.dataValues.phoneNum;
            user_.iconUrl = result.dataValues.iconUrl;
            user_.sex = result.dataValues.sex == 0?'女':'男';
            user_.workIntention = result.dataValues.jobIntenview;
            user_.advantage = result.dataValues.advantage;
            user_.workExperienceList = workArr;
            user_.educationList = educationArr;
            user_.workYears = result.dataValues.workExpressTimes;
            model.data = user_;
        }
        res.send(JSON.stringify(model));
    }).catch(function (err) {
        console.log((err))
        res.send(JSON.stringify(model));
    })
});

/*求职意向*/
router.post('/jobIntention',function(req,res,next) {
    var model = new  ResModel();
    if (!req.headers.token || req.headers.token.length == 0){
        model.msg = '请登录'
        res.send(JSON.stringify(model));
    }else {
        if (req.body.type == 0){
            //.获取工作经验信息
            db.JobIntention.findOne({where:{uuid:req.headers.token}}).then(function (result) {
                model.code = 0;
                model.msg = '请求成功';
                if (result && result.dataValues){
                    var intentionInfo = new User.jobIntention();
                    /*期望工作地点*/
                    intentionInfo.intentionAddress =result.dataValues.intentionAddress;
                    /*期望行业*/
                    intentionInfo.intentionIndustry =result.dataValues.intentionIndustry;
                    /*期望职位*/
                    intentionInfo.intentionPosition =result.dataValues.intentionPosition;
                    /*期望薪资*/
                    intentionInfo.intentionSalary =result.dataValues.intentionSalary;
                    /*求职状态*/
                    intentionInfo.jobState = util.workStatusENUM(result.dataValues.jobState);
                    model.data = intentionInfo;
                }else {

                }
                res.send(JSON.stringify(model));
            }).catch(function (err) {
                res.send(JSON.stringify(model));
            })
        }else {
            var intentionSql = {
                intentionAddress:req.body.intentionAddress,
                intentionIndustry:req.body.intentionIndustry,
                intentionPosition:req.body.intentionPosition,
                intentionSalary:req.body.intentionSalary,
                jobState:req.body.jobState,
                uuid:req.headers.token
            }
            db.JobIntention.upsert(intentionSql).then(function (result) {
                model.code =0;
                model.msg = '上传成功'
                res.send(JSON.stringify(model))
            }).catch(function (err) {
                console.log(err+'错误')
              res.send(JSON.stringify(model))
            })
            //.此时 修改user表中求职意向数据
            db.User.upsert({uuid:req.headers.token,jobIntenview:req.body.intentionPosition});
        }
    }
});

/*个人信息 type:0为获取信息 其他为提交*/
router.post('/persionInfo',function(req,res,next) {
    var model = new ResModel();
    if (!req.headers.token || req.headers.token.length == 0){
        model.msg = '该用户尚未登录';
        res.send(JSON.stringify(model));
    }
    var _info = new User.persionInfo();
    if (req.body.type == 0){//.获取信息
        
        db.User.findOne({where:{uuid:req.headers.token}}).then(function (result) {
            model.code = 0;
            model.msg = '请求成功';
            if (result && result.dataValues){
                _info.iconUrl = result.dataValues.iconUrl;
                _info.nickName = result.dataValues.nickName;
                _info.sex = result.dataValues.sex ==0?'女':'男';
                _info.phoneNum = result.dataValues.phoneNum;
                _info.emaill = result.dataValues.email;
                _info.birthday = result.dataValues.birthday;
                _info.education = result.dataValues.education;
                _info.endEducationTime = result.dataValues.endEducationTime;
                _info.workYears = result.dataValues.workExpressTimes;
                _info.address = result.dataValues.address;
                model.data = [[_info.iconUrl,_info.nickName,_info.sex],
                    [_info.phoneNum,_info.emaill],
                    [_info.birthday,_info.education,_info.endEducationTime,_info.workYears,_info.address]];
            }else {

            }
            res.send(JSON.stringify(model));
        }).catch(function (err) {
            res.send(JSON.stringify(model))
        })
    }else {//上传信息
        //.对上传的信息做校验
        console.log('上传')
        var sql = {
            uuid:req.headers.token,
            iconUrl:req.body.iconUrl,
            nickName:req.body.nickName,
            sex:req.body.sex == '男'?1:0,
            phoneNum:req.body.phoneNum,
            emaill:req.body.emaill,
            birthday:req.body.birthday,
            education:req.body.education,
            endEducationTime:req.body.endEducationTime,
            workExpressTimes:req.body.workYears,
            address:req.body.address
        }
        db.User.upsert(sql).then(function (result) {
            model.msg = '上传成功';
            model.code = 0;
            res.send(JSON.stringify(model));
        }).catch(function (err) {
            console.log(err)
            res.send(JSON.stringify(model));
        })

    }
});


module.exports = router;


