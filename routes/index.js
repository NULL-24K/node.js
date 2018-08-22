var express = require('express');
var jade = require('jade')
var router = express.Router();
var ejs = require('ejs');
var URL = require('url');
var db = require('../sqldb');
var util = require('./util');
var User = require('./UserModel.js');
var ResModel = require('./responseModel');
var moment = require('moment');

util.initConfig();

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index');
});

router.get('/favicon.ico', function(req, res, next) {
   console.log('无效请求')
})

/*登录*/
router.get('/admin/login',function (req,res,next) {
    res.render('admin/login');
})

/*首页*/
router.get('/admin/main',function (req,res,next) {
    //administratorId
    console.log(getClientIp(req));
    var params = URL.parse(req.url, true).query;
    var adminId = params.administratorId;
    if(!adminId || adminId.length ==0){
        res.render('admin/login',{name:'ssss',title:'这是title'});
    }else {
        db.Administer.findOne({where:{administratorId:adminId}}).then(function (result) {
            if(result){
                res.render('admin/main',{name:result.dataValues.name,adminId:adminId})
            }else {
                res.render('admin/login');
            }
        }).catch(function (err) {
            res.render('admin/login');
        })
    }
})

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

/*职位管理*/
router.get('/admin/jobs',function (req,res,next) {
    var params = URL.parse(req.url, true).query;
  //  console.log(params.data)
    if(params.data){
        var obj = JSON.parse(params.data);
        db.JobInfo.findOne({where:{jobId:obj.jobId}}).then(function (result) {
            if(result){
                var resObj = result.dataValues;
                console.log(resObj.wellArr)
                resObj.wellArr = JSON.parse(resObj.wellArr);
                resObj.jobDescribe = resObj.jobDescribe.replace(new RegExp("\n","gm"),"\\n");
                resObj.companyDescrie = resObj.companyDescrie.replace(new RegExp("\n","gm"),"\\n");
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
        res.render('admin/login');
    }else {
        db.JobInfo.findAll({order: [['createdAt', 'DESC']],where:{administratorId:params.administratorId}}).then(function (result) {
            var jobArr = new  Array();
            for(var i =0;i <result.length; i++){
                var  obj = result[i].dataValues;
                var  newObj = {
                    jobId:obj.jobId,
                    companyName:obj.companyName,
                    jobName:obj.jobName,
                    companyImgUrl:obj.companyImgUrl,
                 //   companyDescrie:obj.companyDescrie,
                    workAddress:obj.workAddress,
                    minEducation:obj.minEducation,
                    minWorkExperience:obj.minWorkExperience,
                    interviewTimes:obj.interviewTimes,
                    salary:obj.salary,
                    //wellArr:JSON.parse(obj.wellArr),
                    interViewAddress:obj.interViewAddress,
                    applyNum:obj.applyNum,
                    defApplyNum:obj.defApplyNum,
                    administratorId:obj.administratorId,
                    createdAt:moment(obj.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                    updatedAt:obj.updatedAt,
                    showStatus:obj.showStatus,
                    topStatus:obj.topStatus,
                    statusTag : obj.statusTag,
                    tagImgAddress :obj.tagImgAddress,
                    openCity:obj.openCity
                }
                jobArr.push(newObj);
            }
           // console.log(jobArr[0])
            res.render(('admin/joblist'),{obj:JSON.stringify(jobArr),administratorId:params.administratorId})
        }).catch(function (err) {
            console.log(err)
            res.render('admin/main',{name:'',adminId:params.administratorId})
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
                    createdAt:moment(obj.createdAt).format('YYYY-MM-DD HH:mm:ss'),
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
    var adminId = params.administratorId;
    if(adminId && adminId.length >0){
        var sqlInfo = {where:{
            uuid:params.uuid
        }}
        db.User.findOne(sqlInfo).then(function (result) {

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
            user_.administratorId = params.administratorId
            console.log('什么')
            res.render(('admin/cvdetail'),{obj:user_})
        }).catch(function (err) {
            console.log(err+'错误')
            res.render(('admin/cvdetail'),{obj:null})
        })
    }else {
        res.render('admin/login');
    }
})


router.get('/admin/setAdmin',function (req,res,next) {

    var params = URL.parse(req.url, true).query;
    if(params.administratorId !='superAdminister'){
        res.render('admin/login');
        return;
    }

    //.获取
        db.Administer.findAll({where:{deleteType:0}}).then(function (result) {
            var jobArr = new  Array();
            for(var i =0;i <result.length; i++){
                var  obj = result[i].dataValues;
                var  newObj = {
                    name:obj.name,
                    phoneNum:obj.phoneNum,
                    administratorId:obj.administratorId
                }
                jobArr.push(newObj);
            }
            res.render(('admin/setAdmin'),{obj:jobArr});
        }).catch(function (err) {
            res.render('admin/setAdmin',{obj:null});
        })

})
/*配置管理*/
router.get('/admin/config',function (req,res,next) {

    var params = URL.parse(req.url, true).query;
    if(params.administratorId !='superAdminister'){
        res.render('admin/login');
        return;
    }

    //.获取
    db.Config.findAll().then(function (result) {
        var jobArr = new  Array();
        for(var i =0;i <result.length; i++){
            var  obj = result[i].dataValues;
            var  newObj = {
                configName:obj.configName,
                configValue:obj.configValue,
            }
            jobArr.push(newObj);
        }
        res.render(('admin/config'),{obj:jobArr});
    }).catch(function (err) {
        console.log(err)
        res.render('admin/config',{obj:null});
    })
})

/*管理员 服务号码设置*/
router.get('/admin/servePhoneSetting',function (req,res,next) {
    var params = URL.parse(req.url, true).query;
    if (!params.administratorId || params.administratorId.length ==0){
        res.render('admin/main');
        return;
    }else {
        db.Administer.findOne({where:{administratorId:params.administratorId}}).then(function (result) {
            if(result){
                var servePhone = ''
                if (result.dataValues.servePhoneNum && result.dataValues.servePhoneNum.length ==11){
                    servePhone =  result.dataValues.servePhoneNum
                }else {
                    servePhone =  result.dataValues.phoneNum
                }
                var dataObj = {
                    phoneNum:servePhone,
                    administratorId:params.administratorId
                }
                res.render('admin/servePhoneSetting',{obj:dataObj});
            }else {
                res.render('admin/main');
            }
        }).catch(function (error) {
            res.render('admin/main');
        })
    }
})
/*获取管理员 分享二维码*/
router.get('/admin/getAdminQrCodeImg',function (req,res,next) {
    var timestamp = Date.parse(new Date());
    var params = URL.parse(req.url, true).query;
    if (!params.administratorId || params.administratorId.length ==0){
        res.render('admin/main');
        return;
    }else {
        //判断本地是否存在已生成的二维码
        util.getAdminQrImg(params.administratorId,function (isSuccess) {
            var data = {administratorId:params.administratorId}
            if (isSuccess){
                data.imagePath = '/resources/qrDataImg/'+params.administratorId +'.jpg';
            }
            res.render('admin/getAdminQrCodeImg',{obj:data})
        })
    }
})


router.get('/admin/moveAndPublicJob',function (req,res,next) {
    var timestamp = Date.parse(new Date());
    var params = URL.parse(req.url, true).query;
    if (!params.administratorId || params.administratorId.length ==0){
        res.render('admin/main');
        return;
    }else {
        db.JobInfo.findOne({where:{jobId:params.jobId}}).then(function (result) {
            var data = new Object();
            if (result){
                data = {
                    companyName:result.dataValues.companyName,
                    jobName:result.dataValues.jobName,
                    jobId:params.jobId
                }
            }else {

            }
            res.render('admin/moveAndPublicJob',{obj:data,administratorId:params.administratorId,type:params.type})
        }).catch(function (error) {

        })
        res.render('admin/moveAndPublicJob',{obj:data})
    }
})


router.get('/admin/web_one',function (req,res,next) {
   res.render('admin/web_one') ;
})


router.get('/admin/web_two',function (req,res,next) {

    res.render('admin/web_two') ;
})

router.get('/test',function (req,res,next) {
    var  model = new ResModel();
    model.data = {vcName:'native_dyvc'}
    model.code =0;
    model.msg = '成功'
    res.send(JSON.stringify(model))
})

module.exports = router;
