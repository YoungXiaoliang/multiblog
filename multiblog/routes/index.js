var static = require('../lib/static.js').map;
var express = require('express');
var svgCaptcha = require('svg-captcha');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require('crypto');
var User_m = require('../models/user.js');
var Article_m = require('../models/article.js');
var Comment_m = require('../models/comment.js');
var credentials = require('../credentials');
var formidable = require('formidable');
var fs = require('fs');
const AVATAR_UPLOAD_FOLDER = '/avatar/';


router.get('/',function (req,res,next) {
    res.render('home-page',{title: '首页', loginUser: req.session.loginUser});
});
router.get('/login',function (req,res,next) {
    res.render('login',{title: '登录页'});
});
router.get('/study',function (req,res,next) {
    res.render('study-default',{title: '学习首页', loginUser: req.session.loginUser});
});
router.get('/node-express1',function (req,res,next) {
    res.render('template/node/node-express1',{title: 'node-express', loginUser: req.session.loginUser});
});
router.get('/node-express2',function (req,res,next) {
    res.render('template/node/node-express2',{title: 'node-express2', loginUser: req.session.loginUser});
});
router.get('/node-express3',function (req,res,next) {
    res.render('template/node/node-express3',{title: 'node-express3', loginUser: req.session.loginUser});
});
router.get('/angular1',function (req,res,next) {
    res.render('template/angular/angular1',{title: 'node-express', loginUser: req.session.loginUser});
});
router.get('/angular2',function (req,res,next) {
    res.render('template/angular/angular2',{title: 'node-express', loginUser: req.session.loginUser});
});
router.get('/angular3',function (req,res,next) {
    res.render('template/angular/angular3',{title: 'node-express', loginUser: req.session.loginUser});
});
router.get('/mongodb1',function (req,res,next) {
    res.render('template/mongodb/mongodb1',{title: 'node-express', loginUser: req.session.loginUser});
});
router.get('/mongodb2',function (req,res,next) {
    res.render('template/mongodb/mongodb2',{title: 'node-express', loginUser: req.session.loginUser});
});
router.get('/mongodb3',function (req,res,next) {
    res.render('template/mongodb/mongodb3',{title: 'node-express', loginUser: req.session.loginUser});
});
router.get('/squarePage',function (req,res,next) {
    res.render('squarePage',{title: '广场', loginUser: req.session.loginUser});
});
router.get('/friendsPage',function (req,res,next) {
    loginFilter(req, res, 'friendsPage','好友圈');
});
router.get('/publishPage',function (req,res,next) {
    loginFilter(req, res, 'publishPage','发布文章');
});
router.get('/userPage',function (req,res,next) {
    loginFilter(req, res, 'userPage','个人主页');
});
router.get('/otherUserPage',function (req,res,next) {
    loginFilter(req, res, 'otherUserPage','用户详情');
});
router.get('/oneArticle',function (req,res,next) {
    res.render('oneArticle',{title: '文章详情', loginUser: req.session.loginUser});
});
router.get('/register',function (req,res,next) {
    res.render('register',{layout: '', title: '用户注册', loginUser: req.session.loginUser});
});


/********************** MAIN *************************/
/*登录*/
router.post('/login',login);
function login(req,res,next) {
    User_m.find({username:req.body.userName})
        .exec(function (err,users) {
            var data={
                user: users[0]
            };

            if (!data.user){
                res.send('nameError');
                return;
            }else {
                if (data.user.hashed_password === hashPW(req.body.userPwd)){
                    req.session.loginUser = data.user;
                    // console.log(data);
                    res.send('登录成功');
                    return;
                }else{
                    res.send('pwdError');
                    return;
                }
            }
        })
}

/*查询登录用户*/
router.get('/getLoginUser',function (req,res,next) {
    if (req.session.loginUser){
        res.send(req.session.loginUser);
    }
});

/*退出登录*/
router.get('/trueExit',function (req,res,next) {
    req.session.loginUser = '';
    var data = req.session.loginUser;
    res.send(data);
    // return res.redirect('/');
});

// 登录过滤
function loginFilter(req, res, view,title) {
    if (req.session.loginUser) {
        res.render(view, {
            title: title,
            loginUser: req.session.loginUser
        });
    } else {
        res.render('login');
    }
}


/****************注册页面********************/
/*验证码*/
router.get('/captcha', function (req, res,next) {
    var text = svgCaptcha.randomText();
    var captcha = svgCaptcha(text);
    req.session.captcha = text;
    res.set('Content-Type', 'image/svg+xml');
    res.status(200).send(captcha);
});
/*注册*/
router.post('/register',register);
function hashPW(pwd) {
    return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}
function register(req,res) {
    if (req.session.captcha.toLowerCase() !== req.body.userCaptcha.toLowerCase()){
        var data = {captchaErrorMsg: '验证码错误！'};
        return res.send(data);
    }
    var user = new User_m({username:req.body.userName});
    user.set('hashed_password',hashPW(req.body.userPwd));
    user.set('useremail',req.body.userEmail);
    user.set('createTime',Date.now());
    user.save(function (err) {
        if (err){
            var data = {registerError: err};
            console.log(err);
            return res.send(data);
        }else {
            console.log('=====register-save=====' + user.id + '=name=' + user.username + '=PWD=' + user.hashed_password);
            // emailService.send(req.body.userEmail,'Thank you for signup!',"GALIGEIGEI");
            req.session.loginUser = user;
            // req.session.username = user.userName;
            // req.session.msg = 'Authenticated as' + user.username;
            return res.redirect('/');
            // return res.send(11);
        }
    })
}
/*测试*/
/*router.get('/insert',function (req,res,next) {
    Article_m.find().where('_id').equals(req.query.artiId)
        .exec(function (err,articles) {
            var data={
                article:articles[0]
            };
            console.log(data);
            var browse=data.article.browse.concat(123456789);
            if(!browse.indexOf('123456789',0)){
                Article_m.update({_id:req.query.artiId},{browse:browse},function (err) {
                    if (err){
                        console.log(err);
                        return;
                    }else {
                        console.log('修改成功');
                        return;

                    }
                });
            }

        });
});*/
/*********************个人主页******************/
/*上传头像*/
router.post('/photo/:year/:month/:timestr',function (req,res,next) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;
    form.keepExtensions = true;
    form.parse(req,function (err,fields,files) {
        if (err) return res.redirect(303,'/error');
        var extName = ''; //后缀名
        switch (files.photo.type){
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        // console.log(files);
        var newPath = 'public\\avatar\\' + req.params.timestr + '.' + extName;
        //更改文件路径/
        fs.renameSync(files.photo.path,newPath);
        var imgpath = '/avatar/' + req.params.timestr + '.' + extName;
        console.log(imgpath);
        User_m.update({_id:req.session.loginUser._id},{picture:imgpath},function (err) {
            if (err){
                console.log('上传失败：'+err);
                return;
            }else {
                req.session.loginUser.picture = imgpath;
                return res.redirect('/userPage');
            }
        });
    })
});
/*编辑个人信息*/
/*获取全部邮箱*/
router.get('/getAllemail',function (req,res,next) {
    User_m.find({'username':{$nin:req.session.loginUser.username}},{"useremail":1}).exec(function (err,users) {
        if (err){
            console.log('获取全部邮箱失败'+err);
            return;
        }else{
            var allEmails = users;
            res.send(allEmails);
        }
    })
})
router.post('/editUser',editUser);
function editUser(req,res) {
    var updateMess = {
        realName: req.body.realName || null,
        useremail:req.body.useremail,
        age:req.body.age,
        gender:req.body.gender || null,
        address:req.body.address || null,
        phone:req.body.phone || null,
        job:req.body.job || null,
        brief:req.body.brief || null
    };
    User_m.update({_id:req.body._id},updateMess,{$upsert:true},function (err) {
        if (err){
            console.log(err);
            return ;
        }else {
            User_m.find().where('_id').equals(req.body._id).exec(function (err,users) {
                var data = users[0];
                req.session.loginUser = data;
                res.send(data);
                return ;
            });

        }
    });

}
/*获取发布的文章*/
router.get('/getLoginUserArticles',function (req,res,next) {
    Article_m.find().where('articleAuthor').equals(req.session.loginUser.username).exec(function (err,articles){
        var article = articles;
        res.send(article);
    })
});
/*获取待编辑的文章信息*/
router.get('/getEditArticle',function (req,res,next) {
    Article_m.find().where('_id').equals(req.query.articleId).exec(function (err,articles){
        var article = articles[0];
        res.send(article);
        // console.log(article);
    })
});
/*编辑文章*/
router.post('/editArticle',function (req,res) {
    var newArticle = {
        articleTitle: req.body.articleTitle,
        articleType: req.body.articleType,
        articleContent: req.body.articleContent,
        whoSee: req.body.whoSee
    };
    Article_m.update({_id:req.body._id},newArticle,{$upsert:true},function (err,article) {
        if (err){
            console.log('更新文章出错：'+err);
            return;
        }else{
            Article_m.find({'articleAuthor':req.session.loginUser.username},function (err,articles) {
                if (err){
                    console.log('重新请求文章出错：'+err);
                    return;
                }else{
                    var articles = articles;
                    return res.send(articles);
                }
            })
        }
    });
});
/*删除已发布的文章*/
router.get('/delArticle',function (req,res,next) {
    Article_m.remove().where('_id').equals(req.query.delArticleId).exec(function (err,articles) {
        if (err){
            console.log('删除文章失败'+err);
        }else{
            Article_m.find({'articleAuthor':req.session.loginUser.username},function (err,articles) {
                if (err){
                    console.log('重新请求文章出错：'+err);
                    return;
                }else{
                    var articles = articles;
                    return res.send(articles);
                }
            })
        }
    })
   /* Article_m.find().where('_id').equals(req.query.delArticleId).exec(function (err,articles) {
        var data = articles[0];
        if (err){
            console.log(err);
            return;
        }else{
            console.log(data);
        }

    })*/
});
/*获取我的关注*/
router.get('/getMyFollows',function (req,res,next) {
    User_m.find({'username':{$in:req.session.loginUser.follows}}).exec(function (err,users) {
        var myFollows = users;
        res.send(myFollows);
        return;
    })
});
/*取消关注*/
router.get('/docancleFollow',function (req,res,next) {
    User_m.find({_id:req.session.loginUser._id},{follows:1},function (err,users) {
        var loginUFollows = users[0];
        removeByValue(loginUFollows.follows,req.query.canclefollowname);
        User_m.update({_id:req.session.loginUser._id},{follows:loginUFollows.follows},function (err){
            if (err){
                console.log(err);
                return;
            }else{
                User_m.find({username:req.query.canclefollowname},{fans:1},function (err,users) {
                    var userFans = users[0];
                    removeByValue(userFans.fans,req.session.loginUser.username);
                    User_m.update({username:req.query.canclefollowname},{fans:userFans.fans},function (err){
                        if (err){
                            console.log(err);
                            return;
                        }else{
                            req.session.loginUser.follows = loginUFollows.follows;
                            User_m.find({'username':{$in:loginUFollows.follows}}).exec(function (err,users) {
                                var myFollows = users;
                                return res.send(myFollows);
                            })
                        }
                    })
                })
            }
        })
    })
})
/*获取我的粉丝*/
router.get('/getMyFans',function (req,res,next) {
    User_m.find({'username':{$in:req.session.loginUser.fans}}).exec(function (err,users) {
        var myFans = users;
        res.send(myFans);
        return;
    })
})
/*获取我的收藏*/
router.get('/getMyKeeps',function (req,res,next) {
    getAuthorList()
        .then(function (data) {
            return getPic(data);
        })
        .then(function (data) {
            res.send(data);
        });
    function getAuthorList() {
        var data = {};
        return new Promise(function (resolve) {
            Article_m.find({'_id':{$in:req.session.loginUser.keeps}},function (err,articles) {
                if (err) return console.log('查找文章出错：'+ err);
                var articleList = articles;
                if (articleList == '') {
                    resolve('noArticle');
                }else{
                    var authorList = [];
                    for (var i=0;i<articleList.length;i++){
                        authorList[i] = articleList[i].articleAuthor;
                    }
                    data.articles = articleList;
                    data.author = authorList;
                    resolve(data);
                }
            });
        });
    }
    function getPic(data) {
        if (data == 'noArticle'){
            return(data);
        }else{
            return new Promise(function (resolve) {
                var length = data.author.length;
                var pic = [];
                for(var i=0; i<length; i++) {
                    getPicList(i);
                }
                function getPicList(index) {
                    User_m.find({username:data.author[index]},{picture:1},function (err,authorPics){
                        pic[index] = authorPics[0].picture;
                        if(index == length-1) {
                            data.articles[length] = pic;
                            resolve(data.articles);
                        }
                    })
                }
            });
        }
    }
});
/*取消收藏*/
router.get('/docancelKeep',function (req,res,next) {
    User_m.find({_id:req.session.loginUser._id},{keeps:1},function (err,users) {
        var loginUFollows = users[0];
        removeByValue(loginUFollows.keeps,req.query.cancleArticleId);
        User_m.update({_id:req.session.loginUser._id},{keeps:loginUFollows.keeps},function (err){
            if (err){
                console.log(err);
                return;
            }else{
                Article_m.find({_id:req.query.cancleArticleId},{keep:1},function (err,articles) {
                    var article = articles[0];
                    removeByValue(article.keep,req.session.loginUser.username);
                    Article_m.update({_id:req.query.cancleArticleId},{keep:article.keep},function (err){
                        if (err){
                            console.log(err);
                            return;
                        }else{
                            req.session.loginUser.keeps = loginUFollows.keeps;
                            Article_m.find({'_id':{$in:loginUFollows.keeps}}).exec(function (err,articles) {
                                var myKeeps = articles;
                                return res.send(myKeeps);
                            })
                        }
                    })
                })
            }
        })
    })
})

/********************发布文章********************/
/*发布*/
router.post('/publish',publish);
function publish(req,res) {
    var article = new Article_m({articleAuthor:req.session.loginUser.username});
    article.set('articleTitle',req.body.articleTitle);
    article.set('articleType',req.body.articleType);
    article.set('articleContent',req.body.articleContent);
    article.set('whoSee',req.body.whoSee);
    article.set('createTime',Date.now());
    article.save(function (err) {
        if (err){
            var data = {publishError: err};
            console.log(err);
            return res.send(data);
        }else {
            console.log('=====publish=====' + article.id + '=author=' + article.articleAuthor + '=title=' + article.articleTitle);
            // emailService.send(req.body.userEmail,'Thank you for signup!',"GALIGEIGEI");
            // req.session.loginUser = {userID:user.id,username:user.username,useremail:user.email};
            // req.session.username = user.userName;
            // req.session.msg = 'Authenticated as' + user.username;
            return res.redirect('/');
            // return res.send(11);
        }
    })
}

/********************** 交流广场 *****************************/
/*获取全部文章*/
router.get('/getArticles',function (req,res,next) {
    //查看全部的记录4
    getAuthorList()
        .then(function (data) {
            return getPic(data);
        })
        .then(function (data) {
            res.send(data);
        });
    function getAuthorList() {
        var data = {};
        return new Promise(function (resolve) {
            Article_m.find({whoSee:'公开'},function (err,articles) {
                if (err) return console.log('查找文章出错：'+ err);
                var articleList = articles;
                if (articleList == '') {
                    resolve('noArticle');
                }else{
                    var authorList = [];
                    for (var i=0;i<articleList.length;i++){
                        authorList[i] = articleList[i].articleAuthor;
                    }
                    data.articles = articleList;
                    data.author = authorList;
                    resolve(data);
                }
            });
        });
    }
    function getPic(data) {
        if (data == 'noArticle'){
            return(data);
        }else{
            return new Promise(function (resolve) {
                var length = data.author.length;
                var pic = [];
                for(var i=0; i<length; i++) {
                    getPicList(i);
                }
                function getPicList(index) {
                    User_m.find({username:data.author[index]},{picture:1},function (err,authorPics){
                        pic[index] = authorPics[0].picture;
                        if(index == length-1) {
                            data.articles[length] = pic;
                            resolve(data.articles);
                        }
                    })
                }
            });
        }
    }
});

/*获取某一类型文章*/
router.get('/getArticlesByType',function (req,res,next) {
    //查看全部的记录getArticlesByType
    getAuthorList()
        .then(function (data) {
            return getPic(data);
        })
        .then(function (data) {
            res.send(data);
        });
    function getAuthorList() {
        var data = {};
        return new Promise(function (resolve) {
            Article_m.find({whoSee:'公开',articleType:req.query.articleType},function (err,articles) {
                if (err) return console.log('查找文章出错：'+ err);
                var articleList = articles;
                if (articleList == '') {
                    resolve('noArticle');
                }else{
                    var authorList = [];
                    for (var i=0;i<articleList.length;i++){
                        authorList[i] = articleList[i].articleAuthor;
                    }
                    data.articles = articleList;
                    data.author = authorList;
                    resolve(data);
                }
            });
        });
    }
    function getPic(data) {
        if (data == 'noArticle'){
            return(data);
        }else{
            return new Promise(function (resolve) {
                var length = data.author.length;
                var pic = [];
                for(var i=0; i<length; i++) {
                    getPicList(i);
                }
                function getPicList(index) {
                    User_m.find({username:data.author[index]},{picture:1},function (err,authorPics){
                        pic[index] = authorPics[0].picture;
                        if(index == length-1) {
                            data.articles[length] = pic;
                            resolve(data.articles);
                        }
                    })
                }
            });
        }
    }
});
/*获取热门文章*/
router.get('/getHotArticles',function (req,res,next) {
    //查看全部的记录getArticlesByType
    Article_m.find({whoSee:'公开'}).sort({"like":-1}).exec(function (err,articles) {
        if (err){
            console.log(err);
            return;
        }else{
            var hotArticles = articles;
            // console.log(hotArticles);
            return res.send(hotArticles);
        }
    })
});
/*收藏*/
router.get('/doKeep',function (req,res,next) {
    if (!contains(req.session.loginUser.keeps,req.query.articleId)){
        User_m.find({"_id":req.session.loginUser._id}).exec(function (err,users) {
            var loginU = users[0];
            var keeps = loginU.keeps.concat(req.query.articleId);
            User_m.update({_id:req.session.loginUser._id},{keeps:keeps},function (err){
                if (err){
                    console.log(err);
                    return;
                }else{
                    Article_m.find().where('_id').equals(req.query.articleId).exec(function (err,articles) {
                        var articles = articles[0];
                        var keep = articles.keep.concat(req.session.loginUser.username);
                        Article_m.update({_id:req.query.articleId},{keep:keep},function (err){
                            if (err){
                                console.log(err);
                                return;
                            }else{
                                req.session.loginUser.keeps=keeps;
                                res.send('success');
                            }
                        })
                    })
                }
            })
        });

    }else{
        res.send('already');
        return;
    }
});
/*点赞*/
router.get('/doLike',function (req,res,next) {
    Article_m.find().where('_id').equals(req.query.articleId)
        .exec(function (err,articles) {
            var data={
                article:articles[0]
            };
            var likes=data.article.like;
            if(!contains(likes,req.session.loginUser.username)){
                likes=data.article.like.concat(req.session.loginUser.username);
                Article_m.update({_id:req.query.articleId},{like:likes},function (err) {
                    if (err){
                        console.log(err);
                        // console.log('点赞失败');
                        return;
                    }else {
                        // console.log('点赞成功');
                        res.send('success');
                        return;
                    }
                });
            }else{
                res.send('already');
            }

        });
});

/**************************文章详情页************************************/
/*获取文章信息*/
router.get('/getOneArticle',getArticleById);
function getArticleById(req,res,next) {
    Article_m.find({_id:req.query.articleId},function (err,articles) {
         if (err) return console.log('查找相关文章出错：'+err);
        var article=articles[0];
        article.browse +=1;
        Article_m.update({_id:req.query.articleId},{browse:article.browse},function (err) {
            return res.send(article);
        });
    })
}
/*获取文章评论*/
router.get('/getComment',function (req,res,next) {
    getComment(req,res,req.query.article);
});
/*发表评论*/
router.post('/doComment',doComment);
function doComment(req,res) {
    var comment = new Comment_m({commentAuthor:req.session.loginUser.username});
    comment.set('commentArticle',req.body.commentArticle);
    comment.set('commentContent',req.body.commentContent);
    comment.set('commentReply',req.body.commentReply);
    comment.set('createTime',Date.now());
    comment.save(function (err) {
        if (err){
            console.log(err);
            return;
        }else {
            console.log('=====comment=====' + comment.id + '=author=' + comment.commentAuthor + '=content=' + comment.commentContent);
            // return res.send(comment);
            getComment(req,res,req.body.commentArticle);
        }
    })
}

function getComment(req,res,requirement) {
    getComment_AuthorList()
        .then(function (data) {
            return getPic(data);
        })
        .then(function (data) {
            res.send(data);
        });
    function getComment_AuthorList() {
        var data = {};
        return new Promise(function (resolve) {
            Comment_m.find({commentArticle:requirement},function (err,comments) {
                if (err) return console.log('查找评论出错：'+ err);
                var commentList = comments;
                var authorList = [];
                for (var i=0;i<commentList.length;i++){
                    authorList[i] = commentList[i].commentAuthor;
                }
                data.comments = commentList;
                data.authors = authorList;
                resolve(data);
            });
        });
    }
    function getPic(data) {
        return new Promise(function (resolve) {
            var length = data.authors.length;
            var pic = [];
            for(var i=0; i<length; i++) {
                getPicList(i);
            }
            function getPicList(index) {
                User_m.find({username:data.authors[index]},{picture:1},function (err,authorPics){
                    pic[index] = authorPics[0].picture;
                    if(index == length-1) {
                        data.comments[length] = pic;
                        resolve(data.comments);
                    }
                })
            }
        });
    }
}
/*删除评论*/
router.post('/delMyComment',function (req,res) {
   /* console.log(req.body.commentId);
    console.log(req.body.delCommentArticle);*/
    Comment_m.remove({_id:req.body.commentId},function (err) {
        if (err) return console.log('删除评论出错' + err);
        getComment(req,res,req.body.delCommentArticle);
    })
})



/*******************好友圈******************/
/*默认获取第一个好友*/
router.get('/getMyFriends',function (req,res,next) {
    var friendPageMess = {};
   User_m.find({'username':{$in:req.session.loginUser.follows}},function (err,friends) {
       if (err){
           console.log(err);
           return
       }else{
           friendPageMess.myFriends = friends;
           Article_m.find({'articleAuthor':friendPageMess.myFriends[0].username},function (err,articles) {
               if (err){
                   console.log(err);
                   return;
               }else{
                   friendPageMess.friendArticles = articles;
                   User_m.find({'username':{$in:friendPageMess.myFriends[0].follows}},function (err,friendFs) {
                       if (err){
                           console.log(err);
                           return;
                       }else{
                           friendPageMess.friendFollows = friendFs;
                           User_m.find({'username':{$in:friendPageMess.myFriends[0].fans}},function (err,friendFas) {
                               if (err){
                                   console.log(err);
                                   return;
                               }else{
                                   friendPageMess.friendFans = friendFas;
                                   return res.send(friendPageMess);
                               }
                           });
                       }
                   });
               }
           });
       }
   })
});
/*选择获取一个好友*/
router.get('/getOneFriend',function (req,res,next) {
    User_m.find({'username':req.query.oneFriend},function (err,friend) {
        var friendMess = {};
        var friend = friend[0];
        Article_m.find({'articleAuthor':friend.username},function (err,articles) {
            if (err){
                console.log(err);
                return;
            }else{
                friendMess.friendArticles = articles;
                User_m.find({'username':{$in:friend.follows}},function (err,friendFs) {
                    if (err){
                        console.log(err);
                        return;
                    }else{
                        friendMess.friendFollows = friendFs;
                        User_m.find({'username':{$in:friend.fans}},function (err,friendFas) {
                            if (err){
                                console.log(err);
                                return;
                            }else{
                                friendMess.friendFans = friendFas;
                                return res.send(friendMess);
                            }
                        });
                    }
                });
            }
        });
    });


});


/****************查看其他用户***********************/
/*获取用户信息*/
router.get('/getOtherUser',getOtherUserByName);
function getOtherUserByName(req,res,next) {
    User_m.find().where('username').equals(req.query.otheruser)
        .exec(function (err,users) {
            var data={
                user:users[0]
            };
            /*if (data.users.gender === ''){
             data.users.gender = 1;
             }*/
            return res.send(data.user);
        })
}
/*获取他的文章*/
router.get('/getOtherUserArticles',function (req,res,next) {
    Article_m.find({'articleAuthor':req.query.otheruser,whoSee:'公开'}).exec(function (err,articles) {
        if (err){
            console.log(err);
            return;
        }else{
            var data = articles;
            res.send(data);
            return;
        }
    })
});
/*获取他的关注*/
router.get('/getOtherUserFollows',function (req,res,next) {
    User_m.find({username:req.query.otheruser},{follows:1},function (err,users) {
        if (err){
            console.log(err);
            return;
        }else{
            var user = users[0];
            User_m.find({'username':{$in:user.follows}}).exec(function (err,follows) {
                var follows = follows;
                res.send(follows);
                return;
            })
        }
    })
});
/*获取他的粉丝*/
router.get('/getOtherUserFans',function (req,res,next) {
    User_m.find({username:req.query.otheruser},{fans:1},function (err,users) {
        if (err){
            console.log(err);
            return;
        }else{
            var user = users[0];
            User_m.find({'username':{$in:user.fans}}).exec(function (err,fans) {
                var fans = fans;
                return res.send(fans);
            })
        }
    })
});
/*关注Ta*/
router.get('/doFollow',function (req,res,next) {
    if (!contains(req.session.loginUser.follows,req.query.followName)){
        User_m.find({"_id":req.session.loginUser._id}).exec(function (err,users) {
            var loginU = users[0];
            var follows = loginU.follows.concat(req.query.followName);
            User_m.update({_id:req.session.loginUser._id},{follows:follows},function (err){
                if (err){
                    console.log(err);
                    return;
                }else{
                    User_m.find().where('username').equals(req.query.followName).exec(function (err,users) {
                        var followU = users[0];
                        fans = followU.fans.concat(req.session.loginUser.username);
                        User_m.update({username:req.query.followName},{fans:fans},function (err){
                            if (err){
                                console.log(err);
                                return;
                            }else{
                                req.session.loginUser.follows=follows;
                                res.send(req.session.loginUser);
                                return;
                            }
                        })
                    })
                }
            })
        });

    }else{
        res.send('已关注过');
        return;
    }
});





/*查询数组中是否存在某个值*/
function contains(arr, obj) {
    if (!arr){
        return false;
    }else{
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }
}
/*删除数组中的某个值*/
function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

module.exports = router;


























