/**
 * Created by chubin on 2018/5/11.
 */

/*简历处理详情表*/
module.exports = function(sequelize,DataTypes){
    var OrderApplyList = sequelize.define('orderApplyList',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        /*职位ID*/
        jobId:{
            type:DataTypes.STRING,
            unique:false,
            allowNull:false,
        },
        /*职位申请ID*/
        orderId:{
            type:DataTypes.UUID,
            unique:false,
            allowNull:false
        },
        /*求职者UUID*/
        uuid:{
            type:DataTypes.STRING,
            unique:false,
            allowNull:false,
        },
        /*公司*/
        companyName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        /*职位*/
        jobName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        /*简历处理状态*/
        intentionStatus:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        /*职位发布者ID*/
        administratorId:{
            type:DataTypes.STRING,
            allowNull:false
        },
        userName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        phoneNum:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },{
        freezeTableName: true
    });
     //OrderApplyList.sync({force:true})
    return OrderApplyList;
};