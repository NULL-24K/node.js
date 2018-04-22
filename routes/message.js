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

/*获取简历列表*/
router.post('/msglist',function (req,res,next) {

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
        console.log(result);
    }).catch(function (err) {

    })
})

/*获取简历处理状态明细*/
router.post('/msgDetail',function (req,res,next) {

})