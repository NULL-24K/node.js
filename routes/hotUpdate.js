/**
 * Created by chubin on 2018/8/16.
 */

var express = require('express');
var router = express.Router();
var URL = require('url');
var ResModel = require('./responseModel');
var JOB = require('./jobModel');
var util = require('./util');
var db = require('../sqldb');

router.post('/conf',function (req,res,next) {
    var params = req.body;
    var model = new ResModel();
    if(!params.className || params.className.length ==0){
        model.msg = 'className不能为空'
        res.send(JSON.stringify(model))
    }else  if(!params.webAddress || params.webAddress.length ==0){
        model.msg = 'webAddress不能为空'
        res.send(JSON.stringify(model))
    }else {
        var sql_ = {
            className:params.className,
            webAddress:params.webAddress,
            deleteType:0
        }
        console.log(params)
        db.HotUpdate.upsert(sql_).then(function (result) {
            model.code = 0;
            model.msg = '成功';
            res.send(JSON.stringify(model))
        }).catch(function (error) {
            res.send(JSON.stringify(model))
        })
    }
})


router.post('/getConf',function (req,res,next) {
    var model = new ResModel();
    db.HotUpdate.findAll({where:{deleteType:0}}).then(function (result) {
        var dataArr = new Array();
        for(var i =0;i <result.length; i++){
            var  obj = result[i].dataValues;
            dataArr.push(obj)
        }
        model.code = 0;
        model.data = dataArr;
        model.msg = '成功'
        res.send(JSON.stringify(model));
    }).catch(function (error) {
        res.send('admin/hotUpdateTest')
    })
})

router.post('/confEdit',function (req,res,next) {
    var params = req.body;
    var model = new ResModel();
    if(!params.className || params.className.length ==0){
        model.msg = 'className不能为空'
        res.send(JSON.stringify(model))
    }else {

        db.HotUpdate.update({deleteType:1},{where:{className:params.className}}).then(function (result) {
            model.code = 0;
            model.msg = '成功';
            res.send(JSON.stringify(model))
        }).catch(function (error) {
            res.send(JSON.stringify(model))
        })
    }
})




router.get('/admin/hotUpdateTest',function (req,res,next) {
    db.HotUpdate.findAll({where:{deleteType:0}}).then(function (result) {
        var dataArr = new Array();
        for(var i =0;i <result.length; i++){
            var  obj = result[i].dataValues;
            dataArr.push(obj)
        }
        res.render('admin/hotUpdateTest',{obj:JSON.stringify(dataArr)});
    }).catch(function (error) {
        res.render('admin/hotUpdateTest')
    })
})

module.exports = router;