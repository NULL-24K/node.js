/**
 * Created by chubin on 2018/5/8.
 */

module.exports = function(sequelize,DataTypes){
    var Administer = sequelize.define('administer',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        /*管理员ID 该ID是唯一值*/
        administratorId:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false,
        },
        /*管理员手机号码*/
        phoneNum:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false,
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        psd:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue:'123456'
        },
        /*删除操作 默认未删除 0:正常 其他:删除*/
        deleteType:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        /*管理员客户电话*/
        servePhoneNum:{
            type:DataTypes.STRING,
            defaultValue:''
        }
    },{
        freezeTableName: true
    });
   // Administer.sync({ alter: true })
    // Administer.sync({force:true})
    return Administer;
};