/**
 * Created by chubin on 2018/4/18.
 */

//分享表 该表维护管理员(具有唯一分享标识的用户)和邀请者关系 如果注册用户的shareID为初始ID 则不向该表插入数据

module.exports = function(sequelize,DataTypes){
    var Share = sequelize.define('share',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        /*分享者的shareID*/
        shareID:{
            type:DataTypes.STRING,
            unique:false,
            allowNull:false,
        },
        /*被邀请者的UUID*/
        uuid:{
            type:DataTypes.STRING,
            unique:true,
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
   // Share.sync({force:true})
    return Share;
};