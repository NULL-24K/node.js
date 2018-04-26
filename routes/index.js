var express = require('express');
var jade = require('jade')
var router = express.Router();
var ejs = require('ejs');
var URL = require('url');
var db = require('../sqldb')
var util = require('./util')

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
                    administratorId:obj.administratorId,
                    userName:obj.userName,
                    phoneNum:obj.phoneNum,
                    createdAt:obj.createdAt,
                    updatedAt:obj.updatedAt
                }
                jobArr.push(newObj);
            }
            //console.log(jobArr)
            res.render(('admin/handleCV'),{obj:jobArr,name:'ss'})
        }).catch(function (err) {

        })
    }else {
        res.render('admin/login');
    }
})

module.exports = router;
