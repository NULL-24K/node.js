/**
 * Created by chubin on 2018/4/16.
 */



var config = require('../config');//引入基础配置
var Sequelize = require('sequelize');//引入orm

var db = {
    sequelize:new Sequelize(config.sequelize.database,config.sequelize.username,config.sequelize.password,config.sequelize)
};

db.User = db.sequelize.import('../model/user'); // 引入model 数据user表
db.Account = db.sequelize.import('../model/account');
db.Education = db.sequelize.import('../model/education');
db.Share = db.sequelize.import('../model/share');
db.JobExperience = db.sequelize.import('../model/jobExperience');
db.JobIntention = db.sequelize.import('../model/jobIntention')

module.exports = db; //通过common.js 来导出