/**
 * Created by chubin on 2018/4/17.
 */
module.exports = function(sequelize,DataTypes){
    var Account = sequelize.define('account',{ // 表里的具体字段
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        /*手机号码*/
        phoneNum:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false,
        },
        /*唯一标识符*/
        uuid:{
            type:DataTypes.UUID,
            unique:true,
            allowNull:false,
            defaultValue:DataTypes.UUIDV1,
        },
        /*token 用来进行身份验证*/
        token:{
            type:DataTypes.UUID,
            unique:true,
            allowNull:false,
            defaultValue:DataTypes.UUIDV4,
        },
        /*微信openID 用来进行联合登录*/
        openid:{
            type:DataTypes.STRING,
            unique:true,
        },
        /*微信session_key*/
        session_key:{
            type:DataTypes.STRING,
            unique:true,
        },
        /*绑定ID
        * 1.每个用户都会携带一个绑定ID(初始值都是默认值) 当该用户发起分享时 会将该ID携带给被邀请者
        * 被邀请者进行注册时 会将该bindingId替换为邀请者携带的ID
        * 2.如果某位用户是管理员 则会为该用户生成一个唯一的shareId 且该用户与之前所有的分享和被分享关系全部清空
        * 3.后台会维护一张share表  该字段只是作为特殊时候使用####
        * */
        shareId:{
            type:DataTypes.STRING,
            allowNull:true,
            defaultValue:'goldbee'
        },
        /*删除操作 默认未删除 0:正常 其他:删除*/
        deleteType:{
            type:DataTypes.INTEGER,
            defaultValue:0
        }
    },{
        freezeTableName: true,
        paranoid:true,
    });
   // Account.sync({force:true})
    return Account;
};