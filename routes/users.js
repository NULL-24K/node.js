var express = require('express');
var router = express.Router();
var User = require('./UserModel.js');
var URL = require('url');
var Msg = require('./Msg');
var ResModel = require('./responseModel');
var util = require('./util');
var db = require('../sqldb');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/education',function (req,res,next) {
    var  model = new ResModel();
    if(!req.headers.token|| req.headers.token.length == 0){
        model.msg = '请登录'
        res.send(JSON.stringify(model));
        return;
    }

    if (req.body.type == 0){
        db.Education.findOne({where:{educationId:req.body.educationId}}).then(function (result) {
            model.code = 0;
            model.msg = '请求成功'
            if (result){
                var  educationInfo = {
                    startTime:result.dataValues.startTime,
                    endTime:result.dataValues.endTime,
                    school:result.dataValues.schoolName,
                    specialize:result.dataValues.department,
                    diploma:result.dataValues.doploma,
                    educationId:result.dataValues.educationId
                }
                model.data = educationInfo
            }
            res.send(JSON.stringify(model));
        }).catch(function (err) {
            res.send(JSON.stringify(model));
        })
    }else {
        var educationSql = {
            uuid:req.headers.token,
            startTime:req.body.startTime,
            endTime:req.body.endTime,
            schoolName:req.body.school,
            department:req.body.specialize,
            doploma:req.body.diploma
        }
        if(req.body.educationId && req.body.educationId.length >0){
            educationSql['educationId'] = req.body.educationId
        }
        db.Education.upsert(educationSql).then(function (result) {
            model.code = 0;
            model.msg = '上传成功'
            res.send(JSON.stringify(model));
            //.此时 查询教育信息 并更新User表中教育信息字段
            db.Education.findAll({where:{uuid:req.headers.token}}).then(function (resul) {
                if(resul){
                    var educationsArr = [];
                    for(var i=0;i < resul.length;i ++){
                        var obj = {title:resul[i].dataValues.schoolName,detail:resul[i].dataValues.doploma,
                            id:resul[i].dataValues.educationId}
                        educationsArr.push(obj);
                    }
                    var educationSql = {
                        uuid:req.headers.token,
                        educations:JSON.stringify(educationsArr)
                    }
                    db.User.upsert(educationSql);
                }
            }).catch(function (err) {
                console.log(err )
            })
        }).catch(function (err) {
            res.send(JSON.stringify(model));
        })
    }

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
        db.JobExperience.findOne({where:{jobExprienceId:req.body.jobExprienceId}}).then(function (result) {
            model.msg = '请求成功';
            model.code = 0;
            if (result){
                var resObj = {
                    companyName:result.dataValues.companyName,
                    jobName:result.dataValues.jobName,
                    startTime:result.dataValues.startTime,
                    endTime:result.dataValues.endTime,
                    jobDescribe:result.dataValues.jobDescribe
                }
                model.data = resObj
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
})

/*工作经历list*/
router.post('/workList',function (req,res,next) {

    var model = new ResModel();
    if (!req.headers.token || req.headers.token.length == 0){
        model.msg = '该用户尚未登录';
        res.send(JSON.stringify(model));
        return;
    }
    db.JobExperience.findAll({where:{uuid:req.headers.token}}).then(function (resul) {
        model.code = 0;
        model.msg = '请求成功'
        if(resul) {
            var jobsArr = [];
            for (var i = 0; i < resul.length; i++) {
                var obj = {
                    title: resul[i].dataValues.companyName,
                    detail: resul[i].dataValues.startTime,
                    jobExprienceId: resul[i].dataValues.jobExprienceId
                }
                jobsArr.push(obj);
            }
            model.data = jobsArr;
        }
        res.send(JSON.stringify(model))
    }).catch(function (err) {
        res.send(JSON.stringify(model))
    })
})

/* 获取用户信息*/
router.get('/getUserInfo', function(req, res, next) {


    // var  addSql = {
    //     companyName:'腾讯',
    //     jobName:'软件开发',
    //     companyImgUrl:'http://pic28.photophoto.cn/20130830/0005018667531249_b.jpg',
    //     companyDescrie:'牛逼',
    //     workAddress:'上海市浦东新区唐镇',
    //     minEducation:'硕士',
    //     interviewTimes:'03月09日 下午',
    //     wellArr:JSON.stringify(['五险一金','全款皮肤','定期体检','比赛奖金','季度旅游','美女如云']),
    //     interViewAddress:'上海市浦东新区',
    //     jobDescribe:'战争学院是英雄联盟裁决瓦罗兰政治纠纷之地。这里是绝对中立的领土，严禁任何纷争。' +
    //              '违反者将面对学院的士兵和魔法。学院坐落于一座巨型水晶枢纽之上，由黑曜石、贵金属和魔法塑形而成。它位于' +
    //             '莫格罗恩关隘的北方入口，刚好位于相互敌对的城邦德玛西亚和诺克萨斯之间。',
    //     applyNum:8,
    //     salary:'20~30k',
    //     minWorkExperience:'5年以上',
    //     AdministratorId:'123'
    // }
    //
    // db.JobInfo.upsert(addSql).then(function (ress) {
    //     console.log(ress)
    //
    // }).catch(function (err) {
    //     console.log(err)
    //
    // })



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


