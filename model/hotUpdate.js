/**
 * Created by chubin on 2018/8/16.
 */
module.exports = function(sequelize,DataTypes){
    var HotUpdate = sequelize.define('hotUpdate',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },

        className:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        webAddress:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:false
        },
        /*删除操作 默认未删除 0:正常 其他:删除*/
        deleteType:{
            type:DataTypes.INTEGER,
            defaultValue:0
        }
    },{
        freezeTableName: true
    });
    return HotUpdate;
};