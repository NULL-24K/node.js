/**
 * Created by chubin on 2018/4/17.
 */
module.exports = function(sequelize,DataTypes){
    var Account = sequelize.define('account',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        phoneNum:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false,
        },
        uuid:{
            type:DataTypes.UUID,
            unique:true,
            allowNull:false,
            defaultValue:DataTypes.UUIDV1,
        },
        token:{
            type:DataTypes.UUID,
            unique:true,
            allowNull:false,
            defaultValue:DataTypes.UUIDV4,
        }
    },{
        freezeTableName: true
    });

    return Account;
};