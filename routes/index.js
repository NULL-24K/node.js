var express = require('express');
var jade = require('jade')
var router = express.Router();
var ejs = require('ejs');
var URL = require('url');
var db = require('../sqldb')
var util = require('./util')
var ResModel = require('./responseModel');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '这是首页',name:'你妹'});
});

/*登录*/
router.get('/admin/login',function (req,res,next) {
    res.render('admin/login',{name:'ssss',title:'这是title'});
})

/*首页*/
router.get('/admin/main',function (req,res,next) {
    util.updataImg('1.PNG',function (result) {
        console.log(result);
    })
    res.render('admin/main',{name:'大兵'})
})

/*职位管理*/
router.get('/admin/jobs',function (req,res,next) {
    var params = URL.parse(req.url, true).query;
    console.log(params.data)
    if(params.data){
        var obj = JSON.parse(params.data);
        db.JobInfo.findOne({where:{jobId:obj.jobId}}).then(function (result) {
            if(result){
                var resObj = result.dataValues;
                console.log(resObj.wellArr)
                resObj.wellArr = JSON.parse(resObj.wellArr);
                res.render('admin/jobs',{obj:resObj})
            }
        }).catch(function (err) {
            res.render('admin/jobs',{obj:null})
        })
    }else {
        res.render('admin/jobs',{obj:null})
    }
})

/*职位列表*/
router.get('/admin/joblist',function (req,res,next) {
    var params = URL.parse(req.url, true).query;
    if(!params.administratorId || params.administratorId.length ==0){
        res.render('admin/login',{name:'ssss',title:'这是title'});
    }else {
        db.JobInfo.findAll({where:{AdministratorId:params.administratorId}}).then(function (result) {
            var jobArr = new  Array();
            for(var i =0;i <result.length; i++){
                var  obj = result[i].dataValues;
                var  newObj = {
                    jobId:obj.jobId,
                    companyName:obj.companyName,
                    jobName:obj.jobName,
                    companyImgUrl:obj.companyImgUrl,
                    companyDescrie:obj.companyDescrie,
                    workAddress:obj.workAddress,
                    minEducation:obj.minEducation,
                    minWorkExperience:obj.minWorkExperience,
                    interviewTimes:obj.interviewTimes,
                    salary:obj.salary,
                    wellArr:JSON.parse(obj.wellArr),
                    interViewAddress:obj.interViewAddress,
                    jobDescribe:obj.jobDescribe,
                    applyNum:obj.applyNum,
                    AdministratorId:obj.AdministratorId,
                    createdAt:obj.createdAt,
                    updatedAt:obj.updatedAt,
                }
                jobArr.push(newObj);
              //  console.log(typeof obj.wellArr)
            }
           // console.log(jobArr[0])
            res.render(('admin/joblist'),{obj:jobArr,name:'牛逼'})
        }).catch(function (err) {

        })
    }
})

/*简历处理*/
router.get('/admin/handleCV',function (req,res,next) {
    var params = URL.parse(req.url, true).query;
    var adminId = params.administratorId;
    if(adminId && adminId.length >0){
        db.Order.findAll({where:{administratorId:adminId}}).then(function (result) {
            var jobArr = new  Array();
            for(var i =0;i <result.length; i++){
                var  obj = result[i].dataValues;
                var  newObj = {
                    jobId:obj.jobId,
                    orderId:obj.orderId,
                    uuid:obj.uuid,
                    companyName:obj.companyName,
                    jobName:obj.jobName,
                    intentionStatus:util.intentionStatusENUM(obj.intentionStatus),
                    intentionStatus_Int:obj.intentionStatus,
                    administratorId:obj.administratorId,
                    userName:obj.userName,
                    phoneNum:obj.phoneNum,
                    createdAt:obj.createdAt,
                    updatedAt:obj.updatedAt
                }
                jobArr.push(newObj);
            }
            //console.log(jobArr)
            res.render(('admin/handleCV'),{obj:jobArr,administratorId:params.administratorId})
        }).catch(function (err) {

        })
    }else {
        res.render('admin/login');
    }
})

router.get('/admin/cvdetail',function (req,res,next){
    var params = URL.parse(req.url, true).query;
    var adminId = params.administeratorId;
    if(adminId && adminId.length >0){
        var sqlInfo = {where:{
            uuid:params.token
        }}
        db.User.findOne(sqlInfo).then(function (result) {
            if (result && result.dataValues) {
                var user_ = new User.userInfo();
                var workArr = new Array();
                var Arr = JSON.parse(result.dataValues.jobExpress)
                if (Arr) {
                    for (var i = 0; i < Arr.length; i++) {
                        var userMode = new User.titleModel();
                        userMode.title = Arr[i].title;
                        userMode.detail = Arr[i].detail;
                        userMode.id = Arr[i].id;
                        workArr.push(userMode);
                    }
                }

                var educationArr = new Array;
                var Arr_ = JSON.parse(result.dataValues.educations)
                if (Arr_) {
                    for (var i = 0; i < Arr_.length; i++) {
                        var userMode = new User.titleModel();
                        userMode.title = Arr_[i].title;
                        userMode.detail = Arr_[i].detail;
                        userMode.id = Arr_[i].id;
                        educationArr.push(userMode);
                    }
                }
                user_.name = result.dataValues.nickName;
                user_.education = result.dataValues.education;
                user_.phoneNum = result.dataValues.phoneNum;
                user_.iconUrl = result.dataValues.iconUrl;
                user_.sex = result.dataValues.sex == 0 ? '女' : '男';
                user_.workIntention = result.dataValues.jobIntenview;
                user_.advantage = result.dataValues.advantage;
                user_.workExperienceList = workArr;
                user_.educationList = educationArr;
                user_.workYears = result.dataValues.workExpressTimes;
            }
        }.catch(function (err) {

        })
        )
        res.render(('admin/cvdetail'),{administratorId:params.administeratorId})
    }else {
        res.render('admin/login');
    }
})

router.post('/updata',function (req,res,next) {
    var model = new ResModel();
    var params = req.body;
    if(req.body.imgUrl){
        util.updataImg(req.body.img,function (result) {
            if(result.status == 0){
                model.code = 0;
                model.msg = '上传成功'
                model.data = {imgUrl:result.imgUrl}
                res.send(JSON.stringify(model))
            }else {
                model.code = 1;
                model.msg = '上传失败'
                res.send(JSON.stringify(model))
            }
        })
    }else {
        model.msg = '请求无效,请选择图片'
        res.send(JSON.stringify(model));
    }
})


module.exports = router;
