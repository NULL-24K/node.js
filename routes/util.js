/**
 * Created by chubin on 2018/4/11.
 */

var db = require('../sqldb');

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

module.exports = {
    _isPhoneNum:isPhoneNum,
    db_add:db_add,
    workStatusENUM:workStatusENUM,
    intentionStatusENUM:intentionViewStatus
}