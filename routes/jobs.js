/**
 * Created by tongwenya on 2018/4/11.
 */

var express = require('express');
var router = express.Router();
var URL = require('url');
var ResModel = require('./responseModel');
var JOB = require('./jobModel');
var util = require('./util');


router.post('/jobList',function(req,res,next) {
    
    var  model = new ResModel();
    if (req.body.type == 0){
        var jobArr = new  Array();
        for(var i=0 ; i<10 ; i ++){
            var jobInfo = new JOB.companyModel();

            if(i == 0 || i == 3 || i == 5 || i == 7){
                jobInfo.companyName = '超跑体验官';
                jobInfo.jobName = '保时捷-研发部';
                jobInfo.companyImgUrl = 'http://img.wanchezhijia.com/A/2015/5/6/9/48/c6344b4e-07a8-48a4-b5b9-b08cc7269d62.jpg';
                jobInfo.workAddress = '慕尼黑';
                jobInfo.minEducation = '本科';
                jobInfo.workExperienc = '5年以上';
                jobInfo.ID = 666 +i;
                jobInfo.salary = '20k~30k';
                jobInfo.time = '04月08日';
            }else if(i == 1 || i == 4 || i == 6){
                jobInfo.companyName = '职业玩家';
                jobInfo.jobName = '龙族战队';
                jobInfo.companyImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523470288818&di=d834bb60999e2017915743685398a55e&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2Fc%2F56ef81b4ccf04.jpg';
                jobInfo.workAddress = '蜀山区';
                jobInfo.minEducation = '本科';
                jobInfo.workExperienc = '24岁以下';
                jobInfo.ID = 666 +i;
                jobInfo.salary = '3k~8k';
                jobInfo.time = '04月08日';
            }else {
                jobInfo.companyName = 'UI设计';
                jobInfo.jobName = '腾讯-天美艺游';
                jobInfo.companyImgUrl = 'http://pic28.photophoto.cn/20130830/0005018667531249_b.jpg';
                jobInfo.workAddress = '政务区';
                jobInfo.minEducation = '大专';
                jobInfo.workExperienc = '1-3年';
                jobInfo.ID = 666 +i;
                jobInfo.salary = '8k~15k';
                jobInfo.time = '03月09日';
            }
            jobArr.push(jobInfo);
        }
        model.msg = '请求成功';
        model.code = 0;
        model.data = jobArr;
    }


    res.send(JSON.stringify(model));

})


module.exports = router;

