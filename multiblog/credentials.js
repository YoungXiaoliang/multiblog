/**
 * Created by Administrator on 2016/11/25.
 */
module.exports = {
    cookieSecret: '把你的cookie密钥放在这里',
    mongo: {
        development: {
            connectionString: 'mongodb://yang:123456@localhost:27017/multiBlog'
        },
        production: {
            connectionString: 'mongodb://yang:123456@localhost:27017/multiBlog'
        }
    }
};