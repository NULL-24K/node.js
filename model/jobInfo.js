/**
 * Created by chubin on 2018/4/20.
 */

/*职位信息表*/
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
            type:DataTypes.STRING(5000),
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
            type:DataTypes.STRING(5000),

            allowNull:false,
        },
        /*申请人数*/
        applyNum:{
            type:DataTypes.INTEGER,
            allowNull:true,
        },
        defApplyNum:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        /*管理员ID(发布者ID)*/
        administratorId:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*删除操作 默认未删除 0:正常 其他:删除*/
        deleteType:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        /*该职位的发布状态 0表示展示 其他暂时表示隐藏*/
        showStatus:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        /*置顶状态 0:未置顶 1:置顶 2:长期置顶(长期置顶每个管理员仅仅能够设置三个)*/
        topStatus: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        /*标签 如 报名中,热招中等*/
        statusTag:{
            type:DataTypes.STRING,
            allowNull:true
        },
        /*标签地址,default表示选取默认值*/
        tagImgAddress:{
            type: DataTypes.STRING,
            allowNull:true
        },
        openCity:{
            type: DataTypes.STRING,
            allowNull:true,
            defaultValue:'合肥'
        }
    },{
        freezeTableName: true
    });
    //JobInfo.sync({ alter: true });
    //JobInfo.sync({force:true})
    return JobInfo;
}