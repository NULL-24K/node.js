/**
 * Created by chubin on 2018/4/11.
 */


function isPhoneNum(phoneNum) {
    var reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
    return reg.test(phoneNum);
}

module.exports = {
    _isPhoneNum:isPhoneNum
}