/**
 * Created by chubin on 2018/4/12.
 */


var express = require('express');
var router = express.Router();
var URL = require('url');
var ResModel = require('./responseModel');
var util = require('./util');
var db = require('../sqldb');


/*工作申请*/
router.post('/applyJob',function (req,res,next) {

    var model = new ResModel();

    //.用户鉴权
    var token = req.headers.token;
    if (token.length > 0){
        //.判断用户是否有权限申请(是否申请/申请次数是否超过限制)
        model.msg = '申请成功';
        model.code = 0;
        var orderSql = {
            /*职位ID*/
            jobId:'',
            /*求职者UUID*/
            uuid:'',
            /*公司*/
            companyName:'',
            /*职位*/
            jobName:'',
            /*简历处理状态*/
            intentionStatus:1,
            /*职位发布者ID*/
            administratorId:'',
        }
        db.Order.upsert().then(function (result) {

        }).catch(function (err) {

        })
    }else {
        model.msg = '该用户尚未登录'
        model.code = 1;
    }
    res.send(JSON.stringify(model))

})

router.post('/',function (req,res,next) {
    var model = new ResModel();

    var  token = req.headers.token;
})




module.exports = router;