/**
 * Created by chubin on 2018/5/31.
 */
var express = require('express');
var router = express.Router();
var URL = require('url');
var ResModel = require('./responseModel');
var util = require('./util');
var db = require('../sqldb');
var sequelize = require('sequelize')


router.post('/config',function (req,res,next) {
    var params = req.body;
    var model = new ResModel();
    if(params.type ==0){
        db.Config.findAll().then(function (result) {
            var configArr = new  Array();
            for(var i =0;i <result.length; i++){
                var  obj = result[i].dataValues;
                var  newObj = {
                    configName:obj.configName,
                    configValue:obj.configValue,
                }
                configArr.push(newObj);
            }

            model.code =0;
            model.msg = '成功'
            model.data = configArr
            res.send(JSON.stringify(model));
        }).catch(function (err) {
            res.send(JSON.stringify(model));
        })
    }else {
        if(params.administratorId !='superAdminister'){
            model.msg = '对不起,您没有权限进行此项操作'
            res.send(JSON.stringify(model))
            return;
        }
        if(!params.configValue || params.configValue.length <=1){
            model.msg = params.configName +'不能为空'
            res.send(JSON.stringify(model));
            return;
        }else {
            db.Config.upsert({configName:params.configName,configValue:params.configValue}).then(function (result) {
                model.code = 0;
                model.msg = '提交成功'
                res.send(JSON.stringify(model));
            }).catch(function (err) {
                res.send(JSON.stringify(model));
            })
        }
    }
})


module.exports = router;