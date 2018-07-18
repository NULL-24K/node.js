/**
 * Created by chubin on 2018/4/11.
 */

var db = require('../sqldb');
var QcloudSms = require("qcloudsms_js");
var sequelize = require('sequelize')
var request = require('request');
var path = require('path')//把path模块导入进来

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
    var smsSign = "蜜蜂直聘";
    var qcloudsms = QcloudSms(appid, appkey);
    var ssender = qcloudsms.SmsSingleSender();
    ssender.sendWithParam(86, phoneNumber, templId,
        params,smsSign, "", "",callback);
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
    // getAdminQrImg('goldbeeAdmin17315828372_',function (imgPath) {
    //     console.log(imgPath)
    // })
}
/*生成管理员二维码 返回true表示当前存在或者已生成*/
function getAdminQrImg(adminId,callBack) {

    var imgPath = './public/resources/qrDataImg/'+adminId+'.jpg';
    console.log(imgPath);
    var fs = require('fs');
    fs.exists(imgPath,function(exists){
        console.log(exists);
        console.log('###')
        if (exists){
            callBack(true)
        }else {
            //本地暂无管理员分享码 调用生成二维码函数
            getAdminShareCode(adminId,function (getCodeImgRes) {
                callBack(true)
            });
        }
    })
}


function getAdminShareCode(administratorId,callback) {

    var fs = require('fs');
    getAdminShareCodeToken(function (token) {
        if (token){
            var url = 'https://api.weixin.qq.com/wxa/getwxacode?access_token='+token;
            var requestData = {
                path:'pages/index/index?shareId='+administratorId
            }
            request({
                url: url,
                method: "POST",
                json: true,
                responseType:'stream',
                headers: {
                    "content-type": "application/json"
                },
                body: requestData
            }).pipe(fs.createWriteStream('./public/resources/qrDataImg/' + administratorId + '.jpg'));
            callback(true)
        }else {
            callback(false)
        }
    })
}

/*获取token*/
function getAdminShareCodeToken(callBack) {
    wechatTokenIsEnable(function (result) {
        console.log(result.dataValues)
        console.log("*****")
        if (result){
            callBack(result);
        }else {
            var reqUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx00055f7fcfe5a043&secret=9c551050a085e321b60164c793f88fdd';
            request(reqUrl, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //获取成功 将该参数添加至数据库
                    db.WeChatAccessToken.upsert({accessToken:JSON.parse(body).access_token}).then(function (addRes) {
                        console.log(addRes.dataValues)
                    })
                    callBack(JSON.parse(body).access_token);
                }else {
                    callBack(false); 
                }
            })
        }
    })
}
/*判断token是否过期*/
function wechatTokenIsEnable(callBack) {
    db.WeChatAccessToken.findOne({where:{markStr:'goldbee'}}).then(function (tokenRes) {
        if (tokenRes){
            var timestamp = Date.parse(new Date());
            var lastTokentimestamp = Date.parse(tokenRes.dataValues.updatedAt);
            console.log(tokenRes)
            if (timestamp -lastTokentimestamp < 7200){
                callBack(tokenRes.dataValues.accessToken)
            }else {
                callBack(false)
            }
        }else {
            callBack(false);
        }
    }).catch(function (tokenErr) {
        callBack(false);
    })

    //你调用该函数 并用参数'get'表示是H5自己调用
    getLocationInfo('get',function (locationInfo) {
       //这里是客户度的回调值
    })

}


//getLocationInfo这个是客户端回调你的函数
function getLocationInfo(data,callback) {
    if (data != 'get'){//如果data不是'get' 表示是来自客户端的回调
        callback(data)
    }else {//如果data是'get' 表示是自己调用该函数
        //这里是调用客户端的逻辑
        window.webkit.messageHandlers.getUserLocation.postMessage();
    }
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
    initConfig:initConfig,
    getAdminQrImg:getAdminQrImg
}

/*
*
* server {
 listen       443;
 server_name  ahgoldbee.cn;
 charset utf-8;
 ssl on;
 ssl_certificate /data/home/key_dir/1_www.ahgoldbee.cn_bundle.crt;
 ssl_certificate_key /data/home/key_dir/2_www.ahgoldbee.cn.key;
 }
*
* */

