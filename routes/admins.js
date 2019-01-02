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

        var typeImg = '/resources/qrDataImg/' +cityToImgUrl(params.city)+'.png'
        model.code =0;
        model.data = typeImg;
        model.msg = '成功'
        res.send(JSON.stringify(model));
    }
})


function cityToImgUrl(city) {
    var citysDic = {'合肥':'goldbee_hefei',
                    '武汉':'goldbee_wuhan',
                    '成都':'goldbee_chengdu',
                    '西安':'goldbee_xian',
                    '重庆':'goldbee_chonqing',
                    '上海':'goldbee_shanghai',
                    '北京':'goldbee_beijn',
                    '天津':'goldbee_tianjing',
                    '长沙':'goldbee_changsha',
                    '南京':'goldbee_nanjin'}
    return citysDic[city];
}






module.exports = router;