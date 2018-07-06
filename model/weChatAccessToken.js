/**
 * Created by chubin on 2018/7/6.
 */
module.exports = function(sequelize,DataTypes){
    var WeChatAccessToken = sequelize.define('weChatAccessToken',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        /*token*/
        accessToken:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false,
        },
        markStr:{
            type:DataTypes.STRING,
            unique:true,
            defaultValue:'goldbee'
        }
    },{
        freezeTableName: true
    });
    //WeChatAccessToken.sync({ alter: true });
    // WeChatAccessToken.sync({force:true})
    return WeChatAccessToken;
};