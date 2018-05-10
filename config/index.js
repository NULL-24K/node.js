/**
 * Created by chubin on 2018/4/17.
 */
/**这里是配置数据库基础信息 */
'use strict'
//ngjcltj5yr
var all = {
    sequelize:{
        username: 'root',
        password: 'chubinwenya1208',
        database: 'goldbee',
        host: 'localhost',
        dialect: 'mysql',
        operatorsAliases: false,
        define: {
            underscored: false,
            timestamps: true,
            paranoid: true,
            timezone: '+08:00'
        }
    }
};

module.exports = all;
