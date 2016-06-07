/*
 *电影来源为天堂网
 */
var cheerio = require("cheerio"); //引用cheerio模块,使在服务器端像在客户端上操作DOM,不用正则表达式
var httpHelper = require("../lib/httpHelper");
var host = 'http://m.loldytt.com';
var http = require('http');
var Buffer = require('buffer').Buffer;
var Q = require('q');

var Loldy = {
	search: function(keyword, callback){
        var deferred = Q.defer();
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B176 MicroMessenger/4.3.2',
            'Referer': 'http://m.loldytt.com',
            'Host': 'm.loldytt.com'
        };
        var data = {
            keyword: keyword
        };
        httpHelper.post(host + '/search.asp', 3000, data,
            function(err, data) {
                if (err) {
                    deferred.resolve({status: 1});
                }
                var doc = data.toString();
                var $ = cheerio.load(doc); 
                var box = $('.box').find('ul').children('li');
                var list = [];
                var obj = {};
                box.each(function(){
                    var li = {};
                    var url = $(this).find('a').attr('href');
                    var tmp_url = url.split("http://m.loldytt.com");
                    li.url = tmp_url[1];
                    li.img = $(this).find('img').attr('src');
                    li.title = $(this).find('a').attr('title')
                    list.push(li);
                });      
                obj.status = 0;
                obj.list = list;
                deferred.resolve(obj);
            }, 'gbk', headers, 'gbk', false);
        return deferred.promise;
	},

	//获取下载链接
	list: function(url){
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B176 MicroMessenger/4.3.2',
            'Referer': 'http://m.loldytt.com',
            'Host': 'm.loldytt.com'
        };
        var deferred = Q.defer();
        httpHelper.get(host + url, 3000, function(err, data) {
            if (err) {
                deferred.resolve({status: 1});
            }
            var doc = data.toString();
            var $ = cheerio.load(doc);

            var obj = {};
            obj.status = 0;
            //数据列表
            var list = [];
            $('.box2').find('#list').find('li').each(function() {
                var data = {};
                data.url = $(this).find('a').attr('href');
                data.img = $(this).find('img').attr('src');
                data.title = $(this).find('a').attr('title');
                data.sNum = $(this).find('em').text();
                list.push(data);
            });
            obj.list = list;
            deferred.resolve(obj);
            return;
        }, 'gbk', headers);
        return deferred.promise;		
	},
    detail: function(url, callback){
        var deferred = Q.defer();
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B176 MicroMessenger/4.3.2',
            'Referer': 'http://m.loldytt.com',
            'Host': 'm.loldytt.com'
        };
        httpHelper.get(host + url, 3000, function(err, data){
            if (err) {
                deferred.resolve({status: 1});
            }
            var doc = data.toString();
            var $ = cheerio.load(doc);

            var obj = {};
            obj.status = 0;
            var json = [];
            obj.desc = $('.guess_you_jq').text();
            $('.wrap').find('.list_wrap').each(function(){
                var list = {};
                $(this).find('.list_second').find('ul').find('li').each(function(){
                    list.url = $(this).find('a').attr('href');
                    list.title = $(this).find('a').attr('title');
                });
                json.push(list);
            });
            obj.download = json;
            deferred.resolve(obj);
        }, 'gbk', headers);
        return deferred.promise;
    },


    //网站电影数据抓取 ----  首页推荐
    lolIndex: function(){
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B176 MicroMessenger/4.3.2',
            'Referer': 'http://www.loldytt.com',
            'Host': 'www.loldytt.com'
        };
        var deferred = Q.defer();
        httpHelper.get('http://www.loldytt.com', 3000, function(err, data) {
            if (err) {
                deferred.resolve({status: 1});
            }
            var doc = data.toString();
            var $ = cheerio.load(doc);

            var obj = {};
            obj.status = 0;
            //数据列表
            obj.dy_youce = [];
            obj.dy_zuoce = [];

            //电影右侧
            $('#fenlei').eq(0).find('.youce').find('ul').find('li').each(function(){
                var list = {};
                list.title = $(this).find('a').text();
                var link = $(this).find('a').attr('href');
                list.url = link.split('http://www.loldytt.com')[1];
                obj.dy_youce.push(list);
            });
            //电影左侧
            $('#fenlei').eq(0).find('.zuoce').find('ul').find('li').each(function(){
                var list = {};
                list.title = $(this).find('a').text();
                var link = $(this).find('a').attr('href');
                list.url = link.split('http://www.loldytt.com')[1];
                list.ctime = $(this).find('p').text();
                obj.dy_zuoce.push(list);
            });

            obj.dsj_youce = [];
            obj.dsj_zuoce = [];
            //电视剧右侧
            $('#fenlei').eq(1).find('.youcey').find('ul').find('li').each(function(){
                var list = {};
                list.title = $(this).find('a').text();
                var link = $(this).find('a').attr('href');
                list.url = link.split('http://www.loldytt.com')[1];
                obj.dsj_youce.push(list);
            });
            //电视剧左侧
            $('#fenlei').eq(1).find('.zuocez').find('ul').find('li').each(function(){
                var list = {};
                list.title = $(this).find('a').text();
                var link = $(this).find('a').attr('href');
                list.url = link.split('http://www.loldytt.com')[1];
                list.ctime = $(this).find('p').text();
                obj.dsj_zuoce.push(list);
            });

            obj.dm_youce = [];
            obj.dm_zuoce = [];
            //动漫右侧
            $('#fenlei').eq(2).find('.youcey').find('ul').find('li').each(function(){
                var list = {};
                list.title = $(this).find('a').text();
                var link = $(this).find('a').attr('href');
                list.url = link.split('http://www.loldytt.com')[1];
                obj.dm_youce.push(list);
            });
            //动漫左侧
            $('#fenlei').eq(2).find('.zuocez').find('ul').find('li').each(function(){
                var list = {};
                list.title = $(this).find('a').text();
                var link = $(this).find('a').attr('href');
                list.url = link.split('http://www.loldytt.com')[1];
                list.ctime = $(this).find('p').text();
                obj.dm_zuoce.push(list);
            });

            obj.zy_youce = [];
            obj.zy_zuoce = [];
            //动漫右侧
            $('#fenlei').eq(3).find('.youcey').find('ul').find('li').each(function(){
                var list = {};
                list.title = $(this).find('a').text();
                var link = $(this).find('a').attr('href');
                list.url = link.split('http://www.loldytt.com')[1];
                obj.zy_youce.push(list);
            });
            //动漫左侧
            $('#fenlei').eq(3).find('.zuocez').find('ul').find('li').each(function(){
                var list = {};
                list.title = $(this).find('a').text();
                var link = $(this).find('a').attr('href');
                list.url = link.split('http://www.loldytt.com')[1];
                list.ctime = $(this).find('p').text();
                obj.zy_zuoce.push(list);
            });

            //排行榜
            obj.rank = [];
            //动漫右侧
            $('#fenlei').eq(3).find('.jqxz').find('ul').each(function(){
                var list = {};
                list.ranklist = [];
                $(this).find('li').each(function(item){
                    var tmp = {};
                    tmp.num = $(this).find('p').text();
                    tmp.title = $(this).find('a').text();
                    var link = $(this).find('a').attr('href');
                    tmp.url = link.split('http://www.loldytt.com')[1];
                    list.ranklist.push(tmp);
                });
                obj.rank.push(list);
                
            });
            deferred.resolve(obj);
        }, 'gbk', headers);
        return deferred.promise;        
    },

    //lol网站电影搜索
    searchWeb: function(keyword){
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B176 MicroMessenger/4.3.2',
            'Referer': 'http://www.loldytt.com/',
            'Host': 'so.loldytt.com',
            'Origin': 'http://www.loldytt.com/'
        };
        var data = {
            keyword: keyword
        };
        var deferred = Q.defer();
        httpHelper.post('http://so.loldytt.com/search.asp', 3000, data,
            function(err, data) {
                if (err) {
                    deferred.resolve({status: 1});
                }
                var doc = data.toString();
                var $ = cheerio.load(doc); 
                var box = $('.solb').find('ol');
                var obj = {};
                obj.list = [];
                box.each(function(){
                    var item = {};
                    item.title = $(this).find('label').find('a').text();
                    var link = $(this).find('label').find('a').attr('href');
                    item.url = link.split('http://www.loldytt.com')[1];
                    item.type = $(this).find('b').text();
                    item.ctime = $(this).find('strong').text();
                    obj.list.push(item);
                });      
                obj.status = 0;
                deferred.resolve(obj);
            }, 'gbk', headers, 'gbk', false);
        return deferred.promise;
    },

    //LOL电影pc详情下载链接
    detailPc: function(url){
        var headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B176 MicroMessenger/4.3.2',
            'Referer': 'http://www.loldytt.com',
            'Host': 'www.loldytt.com'
        };
        var deferred = Q.defer();
        httpHelper.get('http://www.loldytt.com' + url, 3000, function(err, data){
            if (err) {
                deferred.resolve({status: 1});
            }
            var doc = data.toString();
            var $ = cheerio.load(doc);

            var obj = {};
            obj.status = 0;
            obj.list = [];
            obj.img = $('.biaoti').find('.dingwei-a').find('.haibao').find('img').attr('src');
            obj.director = $('.biaoti').find('.dingwei-a').find('.zhuyan').find('li').text();
            var downurl = $('#liebiao').find('#jishu').eq(0).find('.downurl');
            downurl.find('li').each(function(){
                var item = {};
                item.downurl = $(this).find('a').attr('href');
                item.title = $(this).find('a').text();
                obj.list.push(item);
            });
            obj.info = $('.neirong').find('p').text();
            obj.title = $('#juqing').find('#jqjs').find('a').text();
            deferred.resolve(obj);
        }, 'gbk', headers);
        return deferred.promise;
    }, 

    //电影分类
    category: function(url){
        var headers = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36',
            'Referer': 'http://www.loldytt.com',
            'Host': 'www.loldytt.com',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
        };
        var deferred = Q.defer();
        httpHelper.get('http://www.loldytt.com/' + url + '/index.html', 3000, function(err, data){
            if (err) {
                deferred.resolve({status: 1});
            }
            var doc = data.toString();
            var $ = cheerio.load(doc);
            var obj = {};
            obj.status = 0;
            obj.gengxin = [];
            //最新更新
            $('.gengxin').find('ul').each(function(){
                var list = {};
                list.ranklist = [];
                $(this).find('li').each(function(item){
                    var tmp = {};
                    tmp.title = $(this).find('a').text();
                    var link = $(this).find('a').attr('href');
                    tmp.url = link.split('http://www.loldytt.com')[1];
                    tmp.ctime = $(this).find('p').text();
                    list.ranklist.push(tmp);
                });
                obj.gengxin.push(list);               
            });

            //全部更新
            obj.allgengxin = [];
            $('.classpage').find('#classpage2').each(function(){
                var list = {};
                list.top = $(this).find('.middle2aa1').find('.middle2aa1_h').find('a').text();
                list.ranklist = [];
                $(this).find('.middle2aa1').find('ul').find('li').each(function(){
                    var tmp = {};
                    tmp.title = $(this).find('a').text();
                    var link = $(this).find('a').attr('href');
                    tmp.url = link.split('http://www.loldytt.com')[1];
                    list.ranklist.push(tmp);
                });
                obj.allgengxin.push(list);
            });
            deferred.resolve(obj);
        }, 'gbk', headers);
        return deferred.promise;
    },
    //分类
    getCid: function(cid){
        switch(cid){
            case '1':
                return 'Dongzuodianying';
                break;
            case '2':
                return 'Kehuandianying';
                break;
            case '3':
                return 'Kongbudianying';
                break;
            case '4':
                return 'Xijudianying';
                break;
            case '5':
                return 'Aiqingdianying';
                break;
            case '6':
                return 'Juqingdianying';
                break;
            case '7':
                return 'Zhanzhengdianying';
                break;
            case '8':
                return 'Anime';
                break;
            case '9':
                return 'Zuixinzongyi';
                break;
        }
    }      
};

module.exports = Loldy;
