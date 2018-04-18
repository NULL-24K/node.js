/**
 * Created by chubin on 2018/4/18.
 */
/*工作经历表*/
module.exports = function(sequelize,DataTypes){
    var JobIntention = sequelize.define('jobIntention',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        intentionAddress:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        intentionIndustry:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        intentionPosition:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        intentionSalary:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        jobState:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        uuid:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false,
        },
    },{
        freezeTableName: true
    });
    // JobIntention.sync({force:true})
    return JobIntention;
};