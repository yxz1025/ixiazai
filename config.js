var express = require('express');
var app = express();
//全局配置文件
if (app.get('env') == 'production') {
    var Config = {
        'REDIS': {
            'RDS_PORT': '6379',
            'RDS_HOST': '345f3d5ba0be4626.m.cnhza.kvstore.aliyuncs.com',
            'RDS_AUTH': 'xiguanChuanmei901',
            'RDS_DB': 4
        }
    };
} else {
    var Config = {
        'REDIS': {
            'RDS_PORT': '6379',
            'RDS_HOST': '114.55.102.24',
            'RDS_AUTH': 'xiguanChuanmei901',
            'RDS_DB': 8
        }
    };
}
module.exports = Config;