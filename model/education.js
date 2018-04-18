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
        schoolName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        doploma:{
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
        educationId:{
            type:DataTypes.UUID,
            unique:true,
            allowNull:false,
            defaultValue:DataTypes.UUIDV1
        }
    },{
        freezeTableName: true
    });
    // Account.sync({force:true})
    return Education;
};