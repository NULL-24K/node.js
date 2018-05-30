/**
 * Created by chubin on 2018/5/9.
 */

module.exports = function(sequelize,DataTypes){
    var MsgCode = sequelize.define('msgCode',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        /*手机号码*/
        phoneNum:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false,
        },
        /*验证码操作次数*/
        inputNum:{
            type:DataTypes.INTEGER,
            unique:false,
            allowNull:false,
            defaultValue:0
        },
        /*短信验证码*/
        msgCode:{
            type:DataTypes.STRING,
            unique:false,
            allowNull:false,
        },
        /*创建时间*/
        msgCreatetime:{
            type:DataTypes.STRING,
            unique:false,
            allowNull:false,
        },
        /*删除操作 默认未删除 0:正常 其他:删除*/
        deleteType:{
            type:DataTypes.INTEGER,
            defaultValue:0
        }
    },{
        freezeTableName: true
    });
   // MsgCode.sync({force:true})
    return MsgCode;
};