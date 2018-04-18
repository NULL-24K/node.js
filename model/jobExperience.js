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
        companyName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        jobName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        startTime:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        endTime:{
            type:DataTypes.STRING,
            allowNull:false,
        },
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