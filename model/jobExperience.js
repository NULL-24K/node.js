/**
 * Created by chubin on 2018/4/18.
 */
/*工作经历表*/
module.exports = function(sequelize,DataTypes){
    var JobExperience = sequelize.define('jobExperience',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
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
        /*开始时间*/
        startTime:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*结束时间*/
        endTime:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*工作描述*/
        jobDescribe:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*每个人会有多个工作经历 该字段不能为唯一*/
        uuid:{
            type:DataTypes.STRING,
            //unique:true,
            allowNull:false,
        },
        /*工作经验唯一标识符*/
        jobExprienceId:{
            type:DataTypes.UUID,
            unique:true,
            allowNull:false,
            defaultValue:DataTypes.UUIDV1
        }
    },{
        freezeTableName: true
    });
    // JobExperience.sync({force:true})
    return JobExperience;
};