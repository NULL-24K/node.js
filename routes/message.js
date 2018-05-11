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
        where:{uuid:req.headers.token}
    }
    db.Order.findAll(intentionListSql).then(function (result) {
        var jobArr = new  Array();
        model.msg = '请求成功'
        model.code = 0
        if(result){
            for(var i =0;i <result.length; i++){
                var  obj = result[i].dataValues;
                obj.intentionStatus = util.intentionStatusENUM(obj.intentionStatus)
                obj.updatedAt = moment(obj.updatedAt).format('YYYY-MM-DD HH:mm:ss');
                jobArr.push(obj)
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
    var orderLisSql = {where:{uuid:req.headers.token,orderId:params.orderId}};
    db.OrderApplyList.findAll(orderLisSql).then(function (result) {
        model.msg = '获取成功'
        model.code = 0;
        var objArr = new Array();
        if(result){
            for(var i =0;i <result.length;i ++){
                var obj = result[i].dataValues;
                obj.intentionStatus = util.intentionStatusENUM(obj.intentionStatus)
                obj.createdAt = moment(obj.createdAt).format('YYYY-MM-DD HH:mm:ss');
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


module.exports = router;