mainApp.controller("userPageController",['$http','$scope',function ($http,$scope) {
    var self = this;
    $http.get('/getLoginUser').then(
        function (resp) {
            self.loginUser = resp.data;
        }
    );
    var now = new Date();
    self.year = now.getFullYear();
    self.month = now.getMonth();
    self.timestr = Date.now();
    /*修改个人信息*/
    self.getLoginMess = function () {
        $http.get('/getLoginUser').then(
            function (resp) {
                self.login = resp.data;
            });
        $http.get('/getAllemail').then(function (resp) {
            self.allEmails = resp.data
        });
        $('div.editMess-Model').fadeIn();
    };
    function checkEmail() {
        var i = self.allEmails.length;
        while (i--) {
            if (self.allEmails[i].useremail === self.login.useremail) {
                return true;
            }
        }
        return false;
    }
    self.edit = function () {
        if (checkEmail()){
            alert(1111);
        }else{
            $http.post('/editUser',self.login).then(function (resp) {
                $('.tipBox').addClass('showTime').text('修改成功');
                setTimeout(function () {
                    $('.tipBox').removeClass('showTime');
                },1000);
                $('div.editMess-Model').fadeOut();
                self.loginUser = resp.data;
            })
        }
    };
    /*获取发布的文章*/
    $http.get('/getLoginUserArticles').then(function (resp) {
            self.loginUserArticles = resp.data.reverse();
        });
    /*编辑文章*/
    self.getEditArticle = function (articleId) {
        $http.get('/getEditArticle?articleId='+articleId).then(function (resp) {
            self.editArticle = resp.data;
        });
        $('div.editArticle-Model').fadeIn();
    };
    self.doEditArticle = function () {
        $http.post('/editArticle',self.editArticle).then(function (resp) {
            $('.tipBox').addClass('showTime').text('编辑成功');
            setTimeout(function () {
                $('.tipBox').removeClass('showTime');
            },1000);
            self.loginUserArticles = resp.data.reverse();
            $('div.editArticle-Model').fadeOut();
            /*setTimeout(function(){
                window.location.reload();
            },1000);*/
        });
    };
    /*删除文章*/
    self.delArticleAlert = function (articleId,articleTitle) {
        self.delArticleTitle = articleTitle;
        self.delArticleId = articleId;
        $('div.delArticle-Model').fadeIn();
    };
    self.delArticle = function (delArticleId) {
        $http.get('/delArticle?delArticleId='+delArticleId).then(function (resp) {
            // alert(resp.data.delMess);
            $('div.delArticle-Model').fadeOut();
            $('.tipBox').addClass('showTime').text('删除成功');
            setTimeout(function () {
                $('.tipBox').removeClass('showTime');
            },1000);
            self.loginUserArticles = resp.data.reverse();
        });
    };
    
    /*获取我的关注*/
    $http.get('/getMyFollows').then(function (resp) {
        self.myFollows = resp.data;
    });
    /*取消关注*/
    self.cancleFollow = function (cancelName) {
        self.cancelFollowName = cancelName;
        $('div.calcelFollow-Model').fadeIn();
    };
    self.docancleFollow = function (canclefollowname) {
        $http.get('/docancleFollow?canclefollowname='+canclefollowname).then(function (resp) {
            $('.tipBox').addClass('showTime').text('取关成功');
            setTimeout(function () {
                $('.tipBox').removeClass('showTime');
            },1000);
            self.myFollows = resp.data;
            $('div.calcelFollow-Model').fadeOut();
        })
    };
    /*获取我的粉丝*/
    $http.get('/getMyFans').then(function (resp) {
        self.myFans = resp.data;
    });
    /*获取我的收藏*/
    $http.get('/getMyKeeps').then(function (resp) {
        self.myKeepsMess = resp.data;
        console.log(self.myKeepsMess);
        if (self.myKeepsMess != 'noArticle'){
            var l = self.myKeepsMess.length;
            self.myKeeps = self.myKeepsMess.slice(0,l-1).reverse();
            self.keepAuthorPics = self.myKeepsMess[l-1];
        }
    });
    /*取消收藏*/
    self.cancelKeep = function (cancelKeepId,cancelKeepTitle) {
        self.cancelKeepId = cancelKeepId;
        self.cancelKeepTitle = cancelKeepTitle;
        $('div.calcelKeep-Model').fadeIn();
    };
    self.docancelKeep = function (cancleArticleId) {
        $http.get('/docancelKeep?cancleArticleId='+cancleArticleId).then(function (resp) {
            $('.tipBox').addClass('showTime').text('操作成功');
            setTimeout(function () {
                $('.tipBox').removeClass('showTime');
            },1000);
            self.myKeeps = resp.data;
            $('div.calcelKeep-Model').fadeOut();
        })
    };
    
}]);

