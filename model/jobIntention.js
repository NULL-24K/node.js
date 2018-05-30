/**
 * Created by chubin on 2018/4/18.
 */
/*求职意向表*/
module.exports = function(sequelize,DataTypes){
    var JobIntention = sequelize.define('jobIntention',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        /*期望工作地址*/
        intentionAddress:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*期望行业*/
        intentionIndustry:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*期望职位*/
        intentionPosition:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*期望薪资*/
        intentionSalary:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*工作状态*/
        jobState:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        uuid:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false,
        },
        /*删除操作 默认未删除 0:正常 其他:删除*/
        deleteType:{
            type:DataTypes.INTEGER,
            defaultValue:0
        }
    },{
        freezeTableName: true
    });
    // JobIntention.sync({force:true})
    return JobIntention;
};