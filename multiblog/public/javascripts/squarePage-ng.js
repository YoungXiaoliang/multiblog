mainApp.controller('squareController',['$http',function ($http) {
    var self = this;
    self.articleLikes = [];
    self.articleKeeps = [];

    $http.get('/getLoginUser').then(
        function (resp) {
            self.loginUser = resp.data;
        }
    );
    /*获取全部文章*/
    $http.get('/getArticles').then(function (resp) {
        self.ArticleMess = resp.data;
        if (self.ArticleMess == 'noArticle'){
            alert('没有内容');
        }else{
            var l = self.ArticleMess.length;
            self.Articles = self.ArticleMess.slice(0,l-1).reverse();
            self.authorPics = self.ArticleMess[l-1].reverse();
            for (var i=0;i<self.Articles.length;i++){
                self.articleKeeps[i] = self.Articles[i].keep.length;
            }
            for (var j=0;j<self.Articles.length;j++){
                self.articleLikes[j] = self.Articles[j].like.length;
            }
        }
    });
    /*获取全部文章*/
    self.getAllArticles = function () {
        $http.get('/getArticles').then(function (resp) {
            self.ArticleMess = resp.data;
            if (self.ArticleMess == 'noArticle'){
                $('.tipBox').addClass('showTime').text('没有内容');
                setTimeout(function () {
                    $('.tipBox').removeClass('showTime');
                },1000)
            }else{
                var l = self.ArticleMess.length;
                self.Articles = self.ArticleMess.slice(0,l-1).reverse();
                self.authorPics = self.ArticleMess[l-1].reverse();
                for (var i=0;i<self.Articles.length;i++){
                    self.articleKeeps[i] = self.Articles[i].keep.length;
                }
                for (var j=0;j<self.Articles.length;j++){
                    self.articleLikes[j] = self.Articles[j].like.length;
                }
            }
        });
    };
    /*按类型获取文章*/
    self.getArticlesByType = function (articleType) {
        $http.get('/getArticlesByType?articleType='+articleType).then(function (resp) {
            self.ArticleMess = resp.data;
            if (self.ArticleMess == 'noArticle'){
                self.Articles = '';
                $('.tipBox').addClass('showTime').text('没有相关内容');
                setTimeout(function () {
                    $('.tipBox').removeClass('showTime');
                },1000)
            }else{
                var l = self.ArticleMess.length;
                self.Articles = self.ArticleMess.slice(0,l-1).reverse();
                self.authorPics = self.ArticleMess[l-1].reverse();
                for (var i=0;i<self.Articles.length;i++){
                    self.articleKeeps[i] = self.Articles[i].keep.length;
                }
                for (var j=0;j<self.Articles.length;j++){
                    self.articleLikes[j] = self.Articles[j].like.length;
                }
            }
        });
    };
    /*获取热门文章*/
    $http.get('/getHotArticles').then(function (resp) {
        self.hotArticles = resp.data.slice(0,5);
    });
    /*收藏*/
    self.doKeep = function (articleId,index) {
        if (!self.loginUser){
            $("#loginMain").css({"visibility":"visible","height":"400px"});
        }else{
            $('.doKeep').eq(index).css("color","#FF3030");
            $http.get('/doKeep?articleId='+articleId).then(
                function (resp) {
                    $('.tipBox').addClass('showTime');
                    if (resp.data == 'success'){
                        self.articleKeeps[index]++;
                        $('.tipBox').text('收藏成功');
                        setTimeout(function () {
                            $('.tipBox').removeClass('showTime');
                        },1000)
                    }else{
                        $('.tipBox').text('已收藏过');
                        setTimeout(function () {
                            $('.tipBox').removeClass('showTime');
                        },1000)
                    }
                }
            );
        }
    };
    /*点赞*/
    self.doLike = function (articleId,index) {
        if (!self.loginUser){
            $("#loginMain").css({"visibility":"visible","height":"400px"});
        }else{
            $('.doLike').eq(index).css("color","#FF3030");
            $http.get('/doLike?articleId='+articleId).then(
                function (resp) {
                    $('.tipBox').addClass('showTime');
                    if (resp.data == 'success'){
                        self.articleLikes[index]++;
                        $('.tipBox').text('点赞成功');
                        setTimeout(function () {
                            $('.tipBox').removeClass('showTime');
                        },1000)
                    }else{
                        $('.tipBox').text('已赞过');
                        setTimeout(function () {
                            $('.tipBox').removeClass('showTime');
                        },1000)
                    }

                    /*alert(resp.data);*/

                }
            );
        }
    };
    /*查看用户*/
    self.seeUser = function(articleAuthor){
        if (!self.loginUser){
            $("#loginMain").css({"visibility":"visible","height":"400px"});
        }else if (self.loginUser.username === articleAuthor){
            window.location = 'http://localhost:2017/userPage';
        }else {
            window.location="http://localhost:2017/otherUserPage?otherUser="+articleAuthor;
        }
    };
    /*去发布*/
    self.toPublish =function () {
        if (!self.loginUser){
            $("#loginMain").css({"visibility":"visible","height":"400px"});
        }else {
            window.location="http://localhost:2017/publishPage";
        }
    }
    // console.log(self.loginUser);
}]);
