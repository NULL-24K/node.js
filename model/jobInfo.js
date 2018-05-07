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
        /*工作ID*/
        jobId:{
            type:DataTypes.UUID,
            unique:true,
            allowNull:false,
            defaultValue:DataTypes.UUIDV1
        },
        /*公司名称*/
        companyName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*职位名称*/
        jobName:{

            type:DataTypes.STRING,
            allowNull:false,
        },
        /*公司icon*/
        companyImgUrl:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*公司描述*/
        companyDescrie:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        /*工作地址*/
        workAddress:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*最低学历要求*/
        minEducation:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*最低工作经验*/
        minWorkExperience:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*面试时间*/
        interviewTimes:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*工资收入*/
        salary:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*福利 json类型(本质是数组)*/
        wellArr:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*面试地点*/
        interViewAddress:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*职位描述*/
        jobDescribe:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*申请人数*/
        applyNum:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        /*管理员ID*/
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