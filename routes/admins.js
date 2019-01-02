/**
 * Created by chubin on 2019/1/2.
 */
var express = require('express');
var router = express.Router();
var URL = require('url');
var ResModel = require('./responseModel');
var util = require('./util');
var db = require('../sqldb');
var request = require('request');

router.post('/createImg',function (req,res,next) {

    var params = req.body;
    var model = new ResModel();
    if (!params.administratorId || params.administratorId.length ==0){
        model.msg = '你暂无此权限'
        res.send(JSON.stringify(model));
    }else {
        var adminQrImg = './public/resources/qrDataImg/'+params.administratorId +'.jpg'
        var typeImg = '/resources/qrDataImg/' +'xian'+'.png'
        model.code =0;
        model.data = typeImg;
        model.msg = '成功'
        res.send(JSON.stringify(model));
    }
})






module.exports = router;