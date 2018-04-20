/**
 * Created by chubin on 2018/4/20.
 */


module.exports = function(sequelize,DataTypes) {
    var JobInfo = sequelize.define('jobInfo',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        jobId:{
            type:DataTypes.UUID,
            unique:true,
            allowNull:false,
            defaultValue:DataTypes.UUIDV1
        },
        companyName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        jobName:{

            type:DataTypes.STRING,
            allowNull:false,
        },
        companyImgUrl:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        companyDescrie:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        workAddress:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        minEducation:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        minWorkExperience:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        interviewTimes:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        salary:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        wellArr:{
            type:DataTypes.JSON,
            allowNull:false,
        },
        interViewAddress:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        jobDescribe:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        applyNum:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        AdministratorId:{
            type:DataTypes.STRING,
            allowNull:false,
        },
    },{
        freezeTableName: true
    });
    //JobInfo.sync({force:true})
    return JobInfo;
}