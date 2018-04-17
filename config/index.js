/**
 * Created by chubin on 2018/4/17.
 */
/**这里是配置数据库基础信息 */
'use strict'

var all = {
    sequelize:{
        username: 'root',
        password: 'chubinwenya1208',
        database: 'goldbee',
        host: "localhost",
        dialect: 'mysql',
        define: {
            underscored: false,
            timestamps: true,
            paranoid: true
        }
    }
};

module.exports = all;
