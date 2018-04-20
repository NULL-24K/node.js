/**
 * Created by tongwenya on 2018/4/11.
 */

var express = require('express');
var router = express.Router();
var URL = require('url');
var ResModel = require('./responseModel');
var JOB = require('./jobModel');
var util = require('./util');
var db = require('../sqldb');


router.post('/jobDetail',function (req,res,next) {
    var model = new  ResModel();
    var _jobInfo = new JOB.jobDetailModel();
    var jobDetailSql = {where:{jobId:req.body.jobID}}
    if (req.headers.token && req.headers.token.length >0){//用户已登录 需要查找该用户是否已申请该职位

    }else {

    }

    db.JobInfo.findOne(jobDetailSql).then(function (result) {
        model.code = 0;
        if(result){
            _jobInfo.jobName = result.dataValues.jobName;
            _jobInfo.jobIncom = result.dataValues.salary;
            _jobInfo.singerLocation = result.dataValues.workAddress;
            _jobInfo.minEducation = result.dataValues.minEducation;
            _jobInfo.workExperienc = result.dataValues.minWorkExperience;
            _jobInfo.applyNum = result.dataValues.applyNum;
            _jobInfo.wellArr = JSON.parse(result.dataValues.wellArr);
            _jobInfo.interviewTime = result.dataValues.interviewTimes;
            _jobInfo.interViewLocation = result.dataValues.interViewAddress;
            _jobInfo.jobLocation = result.dataValues.workAddress;
            _jobInfo.jobDescribe = result.dataValues.jobDescribe;
            _jobInfo.applyState = result.dataValues.jobName;
            _jobInfo.jobid = result.dataValues.jobId;
            model.data = _jobInfo;
            model.msg = '请求成功'
        }else {
            model.msg = '暂无数据'
        }
        res.send(JSON.stringify(model))
    }).catch(function (err) {
        res.send(JSON.stringify(model))
    })


    //
    // if (req.body.jobID == 666){
    //     _jobInfo.jobName = '超跑体验官';
    //     _jobInfo.jobIncom = '20k~30k';
    //     _jobInfo.singerLocation = '德国';
    //     _jobInfo.minEducation = '本科';
    //     _jobInfo.workExperienc = '5年以上';
    //     _jobInfo.applyNum = '10';
    //     _jobInfo.wellArr = ['五险一金','随时飞车','定期体检','加班双薪','季度旅游','美女如云'];
    //     _jobInfo.interviewTime = '04月08日 下午';
    //     _jobInfo.interViewLocation = '合肥市蜀山区莲花路莲花电子商务产业园';
    //     _jobInfo.jobLocation = '德国慕尼黑保时捷总部';
    //     _jobInfo.jobDescribe = '关注“失控奔驰车”事件的最新进展。上周，央视新闻频道《法治在线》栏目连续两天播出了针对这一事件调查，' +
    //         '4月8日晚上，栏目组收到了奔驰公司专门给法治在线发来的一封情况说明。在这份情况说明当中，奔驰方面首次公布了对车辆情况的初步分析结果，' +
    //         '初步判断车辆的定速巡航系统及驾驶系统当晚运行正常，并表示正在与薛先生沟通下一步的车辆检测工作。同时，车主薛先生也表示，希望可以尽快检测车辆，' +
    //         '回归正常生活。这份《关于薛先生用车经历的进一步情况说明》提到，目前已有的相关车辆的技术信息，包括当晚从车辆中远程获取的信息，' +
    //         '显示相关系统在事发当晚运行正常，包括大家关注的定速巡航及制动系统等。';
    //     _jobInfo.applyState = '已申请';
    //     _jobInfo.jobid = '666';
    // }else if(req.body.jobID == 777){
    //     _jobInfo.jobName = '职业玩家';
    //     _jobInfo.jobIncom = '3k~8k';
    //     _jobInfo.singerLocation = '蜀山区';
    //     _jobInfo.minEducation = '本科';
    //     _jobInfo.workExperienc = '24岁以下';
    //     _jobInfo.applyNum = '8';
    //     _jobInfo.wellArr = ['五险一金','全款皮肤','定期体检','比赛奖金','季度旅游','美女如云'];
    //     _jobInfo.interviewTime = '04月08日 下午';
    //     _jobInfo.interViewLocation = '合肥市蜀山区莲花路莲花电子商务产业园';
    //     _jobInfo.jobLocation = '安庆市潜山县梅城镇县政府';
    //     _jobInfo.jobDescribe = '英雄联盟》(简称LOL)是由美国拳头游戏(Riot Games)开发、中国大陆地区腾讯游戏代理运营的英雄对战MOBA竞技网游。' +
    //         '游戏里拥有数百个个性英雄，并拥有排位系统、符文系统等特色养成系统。《英雄联盟》还致力于推动全球电子竞技的发展，除了联动各赛区发展职业联赛、' +
    //         '打造电竞体系之外，每年还会举办“季中冠军赛”“全球总决赛”“All Star全明星赛”三大世界级赛事，获得了亿万玩家的喜爱，形成了自己独有的电子竞技文化';
    //     _jobInfo.applyState = '立即申请';
    //     _jobInfo.jobid = '777';
    // }else {
    //     _jobInfo.jobName = 'UI设计';
    //     _jobInfo.jobIncom = '8k~15k';
    //     _jobInfo.singerLocation = '政务区';
    //     _jobInfo.minEducation = '大专';
    //     _jobInfo.workExperienc = '24岁以下';
    //     _jobInfo.applyNum = '8';
    //     _jobInfo.wellArr = ['五险一金','全款皮肤','定期体检','比赛奖金','季度旅游','美女如云'];
    //     _jobInfo.interviewTime = '03月09日 下午';
    //     _jobInfo.interViewLocation = '合肥市蜀山区莲花路莲花电子商务产业园';
    //     _jobInfo.jobLocation = '上海市浦东新区唐镇';
    //     _jobInfo.jobDescribe = '战争学院是英雄联盟裁决瓦罗兰政治纠纷之地。这里是绝对中立的领土，严禁任何纷争。' +
    //         '违反者将面对学院的士兵和魔法。学院坐落于一座巨型水晶枢纽之上，由黑曜石、贵金属和魔法塑形而成。它位于' +
    //         '莫格罗恩关隘的北方入口，刚好位于相互敌对的城邦德玛西亚和诺克萨斯之间。';
    //     _jobInfo.applyState = '立即申请';
    //     _jobInfo.jobid = '888';
    // }
    //
    //
    //
    // model.msg = '请求成功';
    // model.code = 0;
    // model.data = _jobInfo;
    //
    // res.send(JSON.stringify(model));

})

router.post('/jobList',function(req,res,next) {
    var  model = new ResModel();

    var page = 1, pageSize = 10;
    if (req.body.type == 0){
        var jobsSql = {
            where:'',
            offset:(page - 1) * pageSize,
            limit:pageSize
        }
        db.JobInfo.findAndCountAll(jobsSql).then(function (result) {
            model.code = 0;
            if(result){
                var jobArr = new  Array();
                for(var i =0;i <result.rows.length; i++){
                    var  obj = result.rows[i].dataValues;
                    var jobInfo = new JOB.companyModel();
                    jobInfo.companyName = obj.companyName;
                    jobInfo.jobName = obj.jobName;
                    jobInfo.companyImgUrl = obj.companyImgUrl;
                    jobInfo.workAddress = obj.workAddress;
                    jobInfo.minEducation = obj.minEducation;
                    jobInfo.workExperienc = obj.minWorkExperience;
                    jobInfo.ID = obj.jobId;
                    jobInfo.salary = obj.salary;
                    jobInfo.time = obj.interviewTimes
                    jobArr.push(jobInfo);
                }
                model.data = jobArr;
                model.msg = '请求成功'
            }else {

            }
            res.send(JSON.stringify(model));
        }).catch(function (err) {
            res.send(JSON.stringify(model));
        })

        // var  addSql = {
        //     companyName:'百度',
        //     jobName:'职业玩家',
        //     companyImgUrl:'http://img.wanchezhijia.com/A/2015/5/6/9/48/c6344b4e-07a8-48a4-b5b9-b08cc7269d62.jpg',
        //     companyDescrie:'666',
        //     workAddress:'上海市浦东新区唐镇',
        //     minEducation:'本科',
        //     interviewTimes:'03月09日 下午',
        //     wellArr:JSON.stringify(['五险一金','全款皮肤','定期体检','比赛奖金','季度旅游','美女如云']),
        //     interViewAddress:'合肥市蜀山区莲花路莲花电子商务产业园',
        //     jobAddress:'上海市浦东新区唐镇',
        //     jobDescribe:'英雄联盟》(简称LOL)是由美国拳头游戏(Riot Games)开发、中国大陆地区腾讯游戏代理运营的英雄对战MOBA竞技网游。' +
        //     '游戏里拥有数百个个性英雄，并拥有排位系统、符文系统等特色养成系统。《英雄联盟》还致力于推动全球电子竞技的发展，除了联动各赛区发展职业联赛、' +
        //     '打造电竞体系之外，每年还会举办“季中冠军赛”“全球总决赛”“All Star全明星赛”三大世界级赛事，获得了亿万玩家的喜爱，形成了自己独有的电子竞技文化',
        //     applyNum:8,
        //     AdministratorId:'123'
        // }
        //
        // db.JobInfo.upsert(addSql).then(function (ress) {
        //     console.log(ress)
        //     res.send(JSON.stringify(model));
        // }).catch(function (err) {
        //     console.log(err)
        //     res.send(JSON.stringify(model));
        // })
        // for(var i=0 ; i<10 ; i ++){
        //     var jobInfo = new JOB.companyModel();
        //
        //     if(i == 0 || i == 3 || i == 5 || i == 7){
        //         jobInfo.companyName = '超跑体验官';
        //         jobInfo.jobName = '保时捷-研发部';
        //         jobInfo.companyImgUrl = 'http://img.wanchezhijia.com/A/2015/5/6/9/48/c6344b4e-07a8-48a4-b5b9-b08cc7269d62.jpg';
        //         jobInfo.workAddress = '慕尼黑';
        //         jobInfo.minEducation = '本科';
        //         jobInfo.workExperienc = '5年以上';
        //         jobInfo.ID = 666;
        //         jobInfo.salary = '20k~30k';
        //         jobInfo.time = '04月08日';
        //     }else if(i == 1 || i == 4 || i == 6){
        //         jobInfo.companyName = '职业玩家';
        //         jobInfo.jobName = '龙族战队';
        //         jobInfo.companyImgUrl = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523470288818&di=d834bb60999e2017915743685398a55e&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2Fc%2F56ef81b4ccf04.jpg';
        //         jobInfo.workAddress = '蜀山区';
        //         jobInfo.minEducation = '本科';
        //         jobInfo.workExperienc = '24岁以下';
        //         jobInfo.ID = 777;
        //         jobInfo.salary = '3k~8k';
        //         jobInfo.time = '04月08日';
        //     }else {
        //         jobInfo.companyName = 'UI设计';
        //         jobInfo.jobName = '腾讯-天美艺游';
        //         jobInfo.companyImgUrl = 'http://pic28.photophoto.cn/20130830/0005018667531249_b.jpg';
        //         jobInfo.workAddress = '政务区';
        //         jobInfo.minEducation = '大专';
        //         jobInfo.workExperienc = '1-3年';
        //         jobInfo.ID = 888;
        //         jobInfo.salary = '8k~15k';
        //         jobInfo.time = '03月09日';
        //     }
        //     jobArr.push(jobInfo);
        // }
        // model.msg = '请求成功';
        // model.code = 0;
        // model.data = jobArr;
    }else {
        res.send(JSON.stringify(model));
    }

})


module.exports = router;

