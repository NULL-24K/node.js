/**
 * Created by chubin on 2018/4/18.
 */
/*工作经历表*/
module.exports = function(sequelize,DataTypes){
    var Education = sequelize.define('education',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        /*学校*/
        schoolName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*学历*/
        doploma:{
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
        /*专业*/
        department:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        /*每个人会有多个工作经历 该字段不能为唯一*/
        uuid:{
            type:DataTypes.STRING,
            //unique:true,
            allowNull:false,
        },
        /*教育经历的唯一标识符*/
        educationId:{
            type:DataTypes.UUID,
            unique:true,
            allowNull:false,
            defaultValue:DataTypes.UUIDV1
        }
    },{
        freezeTableName: true
    });
    // Education.sync({force:true})
    return Education;
};