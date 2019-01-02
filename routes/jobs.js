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
var Sequelize = require('sequelize');//引入orm

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
                   // console.log(params +'///')
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
            console.log(result)
            console.log(req.body);
            console.log('查找职位信息')
            if(result){
                _jobInfo.jobName = result.dataValues.companyName;//由于交换了职位名称和公司名称 这里也交换过来
                _jobInfo.jobIncom = result.dataValues.salary;
                _jobInfo.singerLocation = result.dataValues.workAddress;
                _jobInfo.minEducation = result.dataValues.minEducation;
                _jobInfo.workExperienc = result.dataValues.minWorkExperience;
                _jobInfo.applyNum = result.dataValues.applyNum +result.dataValues.defApplyNum +result.dataValues.roundNum;
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
                model.msg = '该职位已停止招聘'
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

    var page = 1, pageSize = 100;
    var adminId = req.body.adminId;
    var locationCity = req.body.location;

    // adminId = 'goldbeeAdmin15157769033_'
    // locationCity = '武汉'
    var sql_where = {administratorId:'superAdminister'}
    if (adminId && adminId !='goldbee'){
        sql_where = {administratorId:[adminId,'superAdminister'],showStatus:0}
    }
    if (req.body.type == 0){
        var jobsSql = {
            order: [['topStatus','DESC'],['createdAt', 'DESC']],
            where:sql_where,
            offset:0,
            limit:pageSize
        }

        if(!adminId || adminId == 'goldbee'){
            jobsSql = {order: Sequelize.fn('RAND'),limit:10}
        }

        db.JobInfo.findAndCount(jobsSql).then(function (result) {
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
                    jobInfo.applyNum = obj.applyNum +obj.defApplyNum +obj.roundNum;
                    jobInfo.statusTag = obj.statusTag=='null'?null:obj.statusTag;
                    jobInfo.tagImgAddress = obj.tagImgAddress=='null'?null:obj.tagImgAddress;

                    jobInfo.statusTag = jobInfo.statusTag =='undefined'?null:jobInfo.statusTag;
                    if(locationCity && locationCity.length >0){

                        if(obj.workAddress.indexOf(locationCity) != -1 || obj.interViewAddress.indexOf(locationCity) != -1 || obj.openCity == locationCity){
                            //这一步 取出当前定位城市
                            jobArr.push(jobInfo);
                        }
                    }else {
                        jobArr.push(jobInfo);
                    }
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

/*职位操作*/
router.post('/jobEdit',function(req,res,next) {
    var model = new  ResModel();
    // var _jobInfo = new JOB.jobDetailModel();
    var params = req.body;
    //此处要先验证管理员权限
    if(!params.administratorId || params.administratorId.length ==0){
        model.msg = '你还不是管理员'
        res.send(JSON.stringify(model))
        return;
    }

    var sql;
    var issysn = true;
    if (params.topStatus && params.topStatus.length >0){
        sql = {topStatus:params.topStatus}
    }else if(params.showStatus && params.showStatus.length >0){
        sql = {showStatus:params.showStatus}
    }else if(params.move && params.move.length >0){
        issysn = false
        sql = {administratorId:params.newAdministratorId}
        var whereSql = {
            where:{'jobId':params.jobId}
        }

        if (params.imposed == 'imposed'){//强制转让  无需判断是否有重复职位
            moveJobIssuccess(sql,whereSql,function (isSuccess) {
                if (isSuccess){
                    model.code = 0;
                    model.msg = '转移成功'
                    res.send(JSON.stringify(model))
                }else {
                    res.send(JSON.stringify(model))
                }
            })
        }else {
            //非强制转让职位时 先判断该用户下是否存在该职位(职位名称,公司名称相同即为重复职位)
            var sqlStr = {where:{administratorId:params.newAdministratorId,companyName:params.companyName,jobName:params.jobName}};
            jobIsSame(sqlStr,function (isSame) {
                if (isSame == 0){//没有重复职位
                    var whereSql = {
                        where:{'jobId':params.jobId}
                    }
                    db.JobInfo.update(sql,whereSql).then(function (result) {
                        model.code = 0;
                        model.msg = '转移成功'
                        res.send(JSON.stringify(model))
                    }).catch(function (error) {
                        res.send(JSON.stringify(model))
                    })
                }else if(isSame ==1){//有重复职位
                    model.code = 110;
                    model.msg = '该管理员下已有相似职位'
                    res.send(JSON.stringify(model))
                }else {//操作失败
                    res.send(JSON.stringify(model))
                }
            })
        }
    }else if(params.public && params.public.length >0){
        issysn = false
        if (params.imposed == 'imposed') {//强制共享  无需判断是否有重复职位

            publicJob({where:{'jobId':params.jobId}},params.newAdministratorId,function (result) {
                if(result){
                    model.code = 0;
                    model.msg = '共享成功'
                    res.send(JSON.stringify(model))
                }else {
                    res.send(JSON.stringify(model))
                }
            })
        }else {
            var sqlStr = {where:{administratorId:params.newAdministratorId,companyName:params.companyName,jobName:params.jobName}};
            jobIsSame(sqlStr,function (isSame) {

                if (isSame == 0){//没有重复职位
                    publicJob({where:{'jobId':params.jobId}},params.newAdministratorId,function (result) {
                        if(result){
                            model.code = 0;
                            model.msg = '共享成功'
                            res.send(JSON.stringify(model))
                        }else {
                            res.send(JSON.stringify(model))
                        }
                    })
                }else if(isSame ==1){//有重复职位
                    model.code = 110;
                    model.msg = '该管理员下已有相似职位'
                    res.send(JSON.stringify(model))
                }else {//操作失败
                    res.send(JSON.stringify(model))
                }
            })
        }
    }

    if (issysn){
        var whereSql = {
            where:{'jobId':params.jobId}
        }
        db.JobInfo.update(sql,whereSql).then(function (result) {
            model.code = 0;
            model.msg = '操作成功'
            res.send(JSON.stringify(model))
        }).catch(function (error) {
            res.send(JSON.stringify(model))
        })
    }
})
/*转移职位*/
function moveJobIssuccess(sql,whereSql,callback) {
    db.JobInfo.update(sql,whereSql).then(function (result) {
        callback(true)
    }).catch(function (error) {
        callback(false)
    })
}
/*共享职位*/
function publicJob(sql,newAdministratorId,callback) {
    db.JobInfo.findOne(sql).then(function (findRes) {
        if(findRes){
            var findObj = findRes.dataValues;
            delete findObj.jobId;
            delete findObj.id;
            delete findObj.deletedAt;
            delete findObj.updatedAt;
            //重置administratorId
            findObj.administratorId = newAdministratorId;
            console.log(findObj)
            db.JobInfo.upsert(findObj).then(function (addRes) {
                callback(true)
            }).catch(function (addErr) {
                callback(false)
            })
        }
    }).catch(function (findErr) {
        callback(false)
    })
}

function jobIsSame(sql,callback) {
    console.log(sql)
    //转让/分享职位时 先判断该用户下是否存在该职位(职位名称,公司名称相同即为重复职位)
    db.JobInfo.findOne(sql).then(function (findAllRes) {
        console.log(findAllRes)
        if (findAllRes){
            //.存在相同职位 提示用户是否转让
            callback(1)
        }else {
            callback(0)
        }
    }).catch(function (findAllErr) {
        console.log(findAllErr)
        callback('error')
    })
}


router.post('/Loca1tionCityInfo',function (req,res,next) {
    var model = new ResModel();
    if (req.body.latitude && req.body.longitude){
        util.GetWeChatLocationInfo(req.body.latitude,req.body.longitude,function (cityInfo) {
            if (cityInfo == 0){
                res.send(JSON.stringify(model))
            }else {
                db.Config.findOne({where: {configName: 'opencCitys'}}).then(function (citysRes) {
                    if (citysRes){
                        var cityArr = citysRes.dataValues.configValue.split("/");
                        var returnCity = '合肥'
                        for (var i =0;i <cityArr.length; i++){
                            console.log(cityInfo.indexOf(cityArr[i]))
                            if (cityInfo.indexOf(cityArr[i]) !=-1){
                                returnCity = cityArr[i];
                                break;
                            }
                        }
                        model.code = 0;
                        model.data = returnCity;
                        model.msg = '获取位置成功'
                        res.send(JSON.stringify(model))
                    }
                }).catch(function (citysErr) {
                    res.send(JSON.stringify(model))
                })
            }
        })
    }else {
        model.msg = '地理位置信息不能为空'
        res.send(JSON.stringify(model))
    }

})


router.post('/openCityInfo',function (req,res,next) {
    var model = new ResModel();
    db.Config.findOne({where: {configName: 'opencCitys'}}).then(function (citysRes) {
        var cityArr = new Array();
        if (citysRes){
            var cityArr = citysRes.dataValues.configValue.split("/");
        }
        if(cityArr.length >1){
            model.code =1;
            model.msg = '获取开放城市成功'
            model.data = cityArr;
            console.log(req.headers);
            var location_IN = req.body.inLocationCity;
            if (!location_IN || location_IN ==null){
                location_IN = '';
            }
            userIsAdmin(req.headers.token,location_IN,function (isAdmin) {
                if (isAdmin != 1){
                    model.code = 0;
                }
                res.send(JSON.stringify(model))
            })
        }else {
            res.send(JSON.stringify(model))
        }
    }).catch(function (findErr) {
        res.send(JSON.stringify(model))
    })
})
/*判断该用户是否是管理员*/
function userIsAdmin(uuid,inLocationCity,callBack) {

    if(!uuid || uuid.length ==0){
        callBack(0)
    }else {
        if (inLocationCity && inLocationCity.length >0 && (inLocationCity =='西安'||inLocationCity =='西安市')){
            callBack(1)
        }else {
            console.log(uuid)
            console.log('管理员ID')
            db.Account.findOne({where:{uuid:uuid}}).then(function (result) {
                console.log(result.dataValues)
                console.log('结果')
                if(result){
                    db.Administer.findOne({where:{phoneNum:result.dataValues.phoneNum}}).then(function (res) {
                        if(res){
                            callBack(1)
                        }else {
                            callBack(0)
                        }
                    }).catch(function (err) {
                        callBack(0)
                    })
                }else {
                    callBack(0)
                }
            }).catch(function (error) {
                callBack(0)
            })
        }
    }
}
//eb5be150-b73f-11e8-af2e-0dbcc5fa39bf



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
                        if (adminRes.dataValues.servePhoneNum && adminRes.dataValues.servePhoneNum.length ==11){
                            servePhone =  adminRes.dataValues.servePhoneNum
                        }else {
                            servePhone =  adminRes.dataValues.phoneNum
                        }
                        model.data = {phoneNum:servePhone}
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


function test() {
    var _this = this;
    if(window.isWx){
        _this.setState({
            isWx:true
        })
    }else {
        var miniURL = GetParam('platType');
        if(miniURL && miniURL=='weChatMini'){
            window.isWx = true;
            _this.setState({
                isWx:true
            })
        }
    }

}

module.exports = router;

