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
        iconUrl:{
          type:DataTypes.STRING
        },
        nickName:{
            type:DataTypes.STRING
        },
        sex:{
            type:DataTypes.INTEGER
        },
        phoneNum:{
            type:DataTypes.STRING
        },
        jobIntenview:{
          type:DataTypes.STRING
        },
        jobExpress:{
          type:DataTypes.JSON
        },
        educations:{
          type:DataTypes.JSON
        },
        email:{
            type:DataTypes.STRING
        },
        birthday:{
            type:DataTypes.STRING
        },
        education:{
            type:DataTypes.STRING
        },
        endEducationTime:{
            type:DataTypes.STRING
        },
        workExpressTimes:{
            type:DataTypes.STRING
        },
        address:{
            type:DataTypes.STRING
        },
        name:{
            type:DataTypes.STRING
        },
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