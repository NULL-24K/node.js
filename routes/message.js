/**
 * Created by tongwenya on 2018/4/21.
 */
var express = require('express');
var router = express.Router();
var User = require('./UserModel.js');
var URL = require('url');
var ResModel = require('./responseModel');
var util = require('./util');
var db = require('../sqldb');
var moment = require('moment');

/*获取简历列表*/
router.post('/msgList',function (req,res,next) {
    var model = new ResModel();
    if(!req.headers.token || req.headers.token.length == 0){
        model.msg = '请登录';
        res.send(JSON.stringify(model));
        return;
    }
    var intentionListSql = {
        order: [['updatedAt', 'DESC']],where:{uuid:req.headers.token}
    }
    db.Order.findAll(intentionListSql).then(function (result) {
        var jobArr = new  Array();
        model.msg = '请求成功'
        model.code = 0
        if(result){
            for(var i =0;i <result.length; i++){
                var  obj = result[i].dataValues;
                obj.intentionStatus = util.intentionStatusENUM(obj.intentionStatus);
                obj.updatedAt = moment(obj.updatedAt).format('YYYY-MM-DD HH:mm:ss');
                jobArr.push(obj);
                console.log(obj.createdAt);
            }

        }
        model.data = jobArr;
        model.msg = '请求成功'
        res.send(JSON.stringify(model))
    }).catch(function (err) {
        res.send(JSON.stringify(model))
    })
})

/*获取简历处理状态明细*/
router.post('/msgDetail',function (req,res,next) {
   var model = new ResModel();
    var params = req.body;
    if(!req.headers.token || req.headers.token.length == 0){
        model.msg = '请登录';
        res.send(JSON.stringify(model));
        return;
    }
    var orderLisSql = {order: [['createdAt', 'DESC']],where:{uuid:req.headers.token,orderId:params.orderId}};
    db.OrderApplyList.findAll(orderLisSql).then(function (result) {
        model.msg = '获取成功'
        model.code = 0;
        var objArr = new Array();
        if(result){
            for(var i =0;i <result.length;i ++){
                var obj = result[i].dataValues;
                obj.intentionStatus = util.intentionStatusENUM(obj.intentionStatus)
                obj.updatedAt = moment(obj.updatedAt).format('YYYY-MM-DD HH:mm:ss');
                objArr.push(obj);
            }
        }
        model.data = objArr;
        res.send(JSON.stringify(model))
    }).catch(function (err) {
        console.log(err +'获取简历处理详情-')
        res.send(JSON.stringify(model))
    })

})

/*查找微信formId*/
router.post('/findFormId',function (req,res,next){
    var model = new ResModel();
    var params = req.body;
    if (params.body.uuid && params.body.uuid.length >0){
        findFormId(params.body.uuid,function (status,msg) {
            if (status == 0){
                model.msg = msg;
                model.code = 0;
            }else {
                model.msg = msg;
            }
            res.send(JSON.stringify(model))
        })
    }else {
        model.msg = 'UUID为空'
        res.send(JSON.stringify(model))
    }
})




function findFormId(uuid,callBack) {
    if (uuid && uuid.length >0){
        db.WeChatFormId.findAll({where:{deleteType:0,uuid:uuid}}).then(function (res) {
            if(res&&res.length>0){
                callBack(0,'存在可用ID');
                //token,res[0].dataValues.weChatOpenId,res[0].dataValues.weChatFormId
            }else {
                callBack(1,'暂无可用模板ID,请检查是否是否已经发送过模板信息')
            }
        }).catch(function (error) {
            callBack(1,'findErr')
        })
    }else {
        callBack(1,'UUID不能为空')
    }
}






module.exports = router;