/**
 * Created by tongwenya on 2018/4/20.
 */
module.exports = function(sequelize,DataTypes){
    var Order = sequelize.define('order',{ // 表里的具体字段
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
            unique:true,
            allowNull:false,
            defaultValue:DataTypes.UUIDV1
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
        },
        // /*删除操作 默认未删除 0:正常 其他:删除*/
        // deleteType:{
        //     type:DataTypes.INTEGER,
        //     defaultValue:0
        // }
    },{
        freezeTableName: true
    });
    // Order.sync({force:true})
    return Order;
};