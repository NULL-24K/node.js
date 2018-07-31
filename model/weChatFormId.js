/**
 * Created by chubin on 2018/7/31.
 */
module.exports = function(sequelize,DataTypes){
    var WeChatFormId = sequelize.define('weChatFormId',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        /*微信提交上来的formId*/
        weChatFormId:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        uuid:{
            type:DataTypes.STRING,
            unique:false
        },
        /*删除操作 默认未删除 0:正常 其他:删除*/
        deleteType:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        weChatOpenId:{
            type:DataTypes.STRING,
            unique:true,
        }
    },{
        freezeTableName: true
    });
    // WeChatAccessToken.sync({ alter: true });
    // WeChatAccessToken.sync({force:true})
    return WeChatFormId;
};