/**
 * Created by chubin on 2018/4/11.
 */

var db = require('../sqldb');
var QcloudSms = require("qcloudsms_js");
var sequelize = require('sequelize')

function isPhoneNum(phoneNum) {
    var reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
    return reg.test(phoneNum);
}


function db_add(table,obj,callback) {
    var keyStr = '(';
    var valueStr = '(';
    var keyArr = Object.keys(obj);
    for(var i=0 ; i < keyArr.length;i ++){
        var key = keyArr[i];
        var addStr = i==keyArr.length-1?')':',';
        keyStr += key +addStr;
        valueStr += obj[key] + addStr;
    }
    var sql = "insert into "+table+keyStr +' values' +valueStr;
    db.query(sql,function (err,rows) {
        if (err){
            console.log(err)
            callback(false)
        }else {
            callback(true)
        }
    })
}

function workStatusENUM(status) {
    var statusObj = ['正在找工作-随时到岗', '在职-正在考虑换工作', '在职-考虑更好的工作机会', '在职-暂无跳槽意向'];
    return statusObj[status];
}

function intentionViewStatus(status) {
    var statusObj = ['立即申请','已申请','已邀请面试','已面试','没有获得面试机会','放弃面试'];
    return statusObj[status];
}


function updataImg(imagePath,callBack) {
    if(!imagePath || imagePath.length == 0){
        return;
    }
    var fs = require('fs');
    var path = require('path');
    var COS = require('cos-nodejs-sdk-v5');

    var SecretId = 'AKID8A2iHgkzsa6QbfrFk3A5pOrpdIm47B0d'; // 替换为用户的 SecretId
    var SecretKey = 'd63ueDbbQ4bwIf2SqKrKbhcLtJXdgqv1';    // 替换为用户的 SecretKey
    var Bucket = 'goldbee-1256585845';                        // 替换为用户操作的 Bucket
    var Region = 'ap-chengdu';                           // 替换为用户操作的 Region

    var cos = new COS({SecretId: SecretId, SecretKey: SecretKey});
    cos.putObject({
        Bucket: Bucket,
        Region: Region,
        Key: imagePath,
        Body: fs.readFileSync(path.resolve(__dirname,imagePath))
    }, function (err, data) {
        console.log(data || err);
        if(data){
            callBack({status:0,imgUrl:data.Location})
        }else {
            callBack({status:1})
        }
    });
}

function updataImg__(image,imgName,callBack) {

    if(!image ){
        return;
    }
    var fs = require('fs');
    var path = require('path');
    var COS = require('cos-nodejs-sdk-v5');

    var SecretId = 'AKID8A2iHgkzsa6QbfrFk3A5pOrpdIm47B0d'; // 替换为用户的 SecretId
    var SecretKey = 'd63ueDbbQ4bwIf2SqKrKbhcLtJXdgqv1';    // 替换为用户的 SecretKey
    var Bucket = 'goldbee-1256585845';                        // 替换为用户操作的 Bucket
    var Region = 'ap-chengdu';                           // 替换为用户操作的 Region


    var cos = new COS({SecretId: SecretId, SecretKey: SecretKey});
    cos.putObject({
        Bucket: Bucket,
        Region: Region,
        Key: imgName,
        Body: image
    }, function (err, data) {
        console.log(data || err);
        if(data){
            callBack({status:0,imgUrl:data.Location})
        }else {
            callBack({status:1})
        }
    });
}

function sendMsg(phoneNumber,params,callback) {
    var appid = 1400091097;
    var appkey = "a88915ebf500988de475ce536a2b5151";
   // var phoneNumbers = [phoneNumbers];
    var templId = 118889;
    var qcloudsms = QcloudSms(appid, appkey);
    var ssender = qcloudsms.SmsSingleSender();
    ssender.sendWithParam(86, phoneNumber, templId,
        params,"", "", "",callback);
}

function createCode() {
    // var codeInput = document.getElementsByClassName("code")[0];
    var codeArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var length = 6;
    code = "";
    for (var i = 0; i < length; i++) {
        var randomI = Math.floor(Math.random() * 10);
        code += codeArr[randomI];
    }
    console.log(code);
    return code;
}

function initConfig() {
   var sql ={administratorId:'superAdminister',phoneNum:'18767090623',name:'洪大鹏',psd:'goldbee'}
    db.Administer.upsert(sql).then(function (res) {
        console.log('添加超级管理员成功')
    }).catch(function (err) {
        console.log('添加超级管理员失败')
    })
}

module.exports = {
    _isPhoneNum:isPhoneNum,
    db_add:db_add,
    workStatusENUM:workStatusENUM,
    intentionStatusENUM:intentionViewStatus,
    updataImg:updataImg,
    updataImg__:updataImg__,
    sendMsg:sendMsg,
    createCode:createCode,
    initConfig:initConfig
}