//redis连接池
var Redis = require('ioredis');
var Config = require('../config');
var RedisClient = {
    connection: function() {
        var args = {
            port: Config.REDIS.RDS_PORT,
            host: Config.REDIS.RDS_HOST,
            family: 4,
            password: Config.REDIS.RDS_AUTH,
            db: 8
        };
        var client = new Redis(args);
        return client;
    }
};
module.exports = RedisClient;