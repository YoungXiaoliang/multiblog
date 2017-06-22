var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path');
var favicon = require('serve-favicon');
//handlebars模板引擎
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',//默认布局
    extname: '.hbs', //视图后缀名
    //辅助函数
    helpers: {
        static: function (name) {
            return require('./lib/static').map(name);
        },
        section: function (name,options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('hbs',handlebars.engine);
app.set('view engine','hbs');

//静态资源
app.use(express.static(__dirname + '/public'));
//网页图标
app.use(favicon(path.join(__dirname,'public','favicon.ico')));
//导入自定义路由
var route = require('./routes/index');
//设置端口号
app.set('port',process.env.PORT || 2017);

app.use(bodyParser());

var credentials = require('./credentials');
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

//database configuration
var mongoose = require('mongoose');
var options = {
    server: {
        socketOptions: {keepAlive: 1}
    }
};
mongoose.Promise = global.Promise;
switch (app.get('env')){
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString,options);
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString,options);
        break;
    default:
        throw new Error('Unknow execution environment:' + app.get('env'));
}

//默认路由
app.use('/',route);
//404
app.use(function(req,res){
    res.status(404);
    res.render('errors/404',{title: 'not found'});
});
//500
app.use(function(err,req,res,next){
    console.error(err.stack);
    res.status(500);
    res.render('errors/500',{title: 'server error'});
});

app.listen(app.get('port'),function(){
    console.log('start:http://localhost:' + app.get('port') + '; stop:ctrl+c');
});
