/**
 * Created by chubin on 2018/4/17.
 */
'use strict'
module.exports = function(sequelize,DataTypes){
    var User = sequelize.define('user',{ // 表里的具体字段
        id:{
            type:DataTypes.UUID,
            primaryKey:true,
            allowNull:false,
            defaultValue:DataTypes.UUIDV1
        },
        name:{
            type:DataTypes.STRING
        },
        age:{
            type:DataTypes.INTEGER
        },
        height:{
            type:DataTypes.INTEGER
        },
        weight:{
            type:DataTypes.INTEGER
        }
    },{
        freezeTableName: true
    });
    return User;
};