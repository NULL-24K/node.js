/**
 * Created by chubin on 2018/4/17.
 */
'use strict'
module.exports = function(sequelize,DataTypes){
    var User = sequelize.define('user',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        uuid:{
            type:DataTypes.STRING,
            unique:true
        },
        /*用户头像*/
        iconUrl:{
          type:DataTypes.STRING
        },
        /*昵称*/
        nickName:{
            type:DataTypes.STRING
        },
        /*性别*/
        sex:{
            type:DataTypes.INTEGER
        },
        /*手机号码*/
        phoneNum:{
            type:DataTypes.STRING
        },
        /*求职意向*/
        jobIntenview:{
          type:DataTypes.STRING
        },
        /*工作经验*/
        jobExpress:{
          type:DataTypes.JSON
        },
        /*教育经历json(本质为数组) 后期*/
        educations:{
          type:DataTypes.JSON
        },
        /*邮箱*/
        email:{
            type:DataTypes.STRING
        },
        /*生日*/
        birthday:{
            type:DataTypes.STRING
        },
        /*学历*/
        education:{
            type:DataTypes.STRING
        },
        /*毕业时间*/
        endEducationTime:{
            type:DataTypes.STRING
        },
        /*工作年限*/
        workExpressTimes:{
            type:DataTypes.STRING
        },
        /*地址*/
        address:{
            type:DataTypes.STRING
        },
        /*姓名*/
        name:{
            type:DataTypes.STRING
        },
        /*自我描述*/
        advantage:{
            type:DataTypes.STRING
        }
    },{
        freezeTableName: true
    });
    //.同步数据模型到数据库
    //User.sync({force: true});
    return User;
};