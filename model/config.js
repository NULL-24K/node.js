/**
 * Created by chubin on 2018/5/31.
 */
/**
 * Created by chubin on 2018/5/8.
 */

module.exports = function(sequelize,DataTypes){
    var Config = sequelize.define('config',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        /*配置的名称*/
        configName:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false,
        },
        /*配置的值*/
        configValue:{
            type:DataTypes.STRING,
            allowNull:false,
        }
    },{
        freezeTableName: true
    });
    // Config.sync({force:true})
    return Config;
};