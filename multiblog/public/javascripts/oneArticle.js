/*展开评论*/
$(document).ready(function(){
    var showCommentVa = ['展开评论','收起评论'],
        showCommentIndex=1,
        replyText = ['回复','取消'],
        replyIndex = 1;
    $('div.show-comment span').click(function () {
        $('div.article-comment').toggle();
        $(this).text(showCommentVa[showCommentIndex]);
        showCommentIndex++;
        if (showCommentIndex>1){
            showCommentIndex=0;
        }
    });
    $('.canceldelComment').click(function () {
        $('.delComment-Model').fadeOut();
    });
    
});


/*控制器*/
mainApp.controller('oneArticleController',['$http','$scope',function ($http,$scope) {
    var self = this;
    var length;
    $http.get('/getLoginUser').then(
        function (resp) {
            self.loginUser = resp.data;
        }
    );
    /*获取地址栏文章地址*/
    var url = window.location.search ;
    self.articleId = url.substring(url.lastIndexOf('=')+1, url.length);

    /*获取文章信息*/
    $http.get('/getOneArticle?articleId='+self.articleId).then(function (resp) {
        self.OneArticle = resp.data;
        self.articleKeep = resp.data.keep.length;
        self.articleLike = resp.data.like.length;
    });
    /*获取评论信息*/
    $http.get('/getComment?article='+self.articleId).then(function (resp) {
        doCommentMess(resp.data);
    });
    /*repeat评论结束后*/
    $scope.renderFinish = function(){
        $('.delComment').click(function () {
            $('.delComment-Model').fadeIn();
        });
        for (var i=0;i<self.commentCount;i++){
            if (!self.articleComments[i].commentReply){
                $('.replyText').eq(i).hide();
            }
            if (self.articleComments[i].commentAuthor == self.loginUser.username){
                $('.doReply').eq(i).hide(); 
                $('.delComment').eq(i).show();
            }
        }
    };
    /*评论的操作函数*/
    self.inComment =function (index) {
        $('.replyBtn').eq(index).show();
    };
    self.outComment =function (index) {
        $('.replyBtn').eq(index).hide();
    };
    self.replyShow = function (index) {
        if (!self.loginUser){
            $("#loginMain").css({"visibility":"visible","height":"400px"});
        }else{
            $('.doReply').eq(index).hide();
            $('.cancelReply').eq(index).show();
            $('.replyForm').eq(index).show();
        }
    };
    self.replyHide = function (index) {
        $('.cancelReply').eq(index).hide();
        $('.doReply').eq(index).show();
        $('.replyForm').eq(index).hide();
    };
    /*删除评论*/
    self.delCommentMess = {};
    self.toDelComment = function (commentId,delcommentAuthor) {
        self.delComId = commentId;
        self.delComAut = delcommentAuthor;
    };
    self.delComment = function (commentId,commentAuthor) {
        $('.delComment-Model').fadeOut();
        if (self.loginUser.username != commentAuthor){
            $('.tipBox').addClass('showTime').text('非法操作');
            setTimeout(function () {
                $('.tipBox').removeClass('showTime');
            },1000);
        }else{
            self.delCommentMess.commentId = commentId;
            self.delCommentMess.delCommentArticle = self.articleId;
            $http.post('/delMyComment',self.delCommentMess).then(function (resp) {
                doCommentMess(resp.data);
                $('.tipBox').addClass('showTime').text('删除成功');
                setTimeout(function () {
                    $('.tipBox').removeClass('showTime');
                },1000);
            })
        }
    };
    /*发表评论*/
    self.doComment = function () {
        // console.log(self.loginUser);
        if (!self.loginUser){
            $("#loginMain").css({"visibility":"visible","height":"400px"});
        }else{
            self.comment.commentArticle = self.articleId;
            $http.post('/doComment',self.comment).then(function (resp) {
                self.comment.commentContent = "";
                doCommentMess(resp.data);
                $('.tipBox').addClass('showTime').text('评论成功');
                setTimeout(function () {
                    $('.tipBox').removeClass('showTime');
                },1000);
            });
        }
    };
    /*回复*/
    self.doReply = function (index) {
        if (!self.loginUser){
            $("#loginMain").css({"visibility":"visible","height":"400px"});
        }else{
            $('.replyForm').eq(index).hide();
            self.replyComment[index].commentReply = self.articleComments[index].commentAuthor;
            self.replyComment[index].commentArticle = self.articleId;
            $http.post('/doComment',self.replyComment[index]).then(function (resp) {
                self.replyComment[index].commentContent = "";
                doCommentMess(resp.data);
                setTimeout(function () {
                    $('.tipBox').removeClass('showTime');
                },1000);
            });
        }
    };
    /*收藏*/
    self.doKeep = function (articleId,index) {
        if (!self.loginUser){
            $("#loginMain").css({"visibility":"visible","height":"400px"});
        }else{
            $http.get('/doKeep?articleId='+articleId).then(
                function (resp) {
                    $('.tipBox').addClass('showTime');
                    if (resp.data == 'success'){
                        $('.tipBox').text('收藏成功');
                        setTimeout(function () {
                            $('.tipBox').removeClass('showTime');
                        },1000);
                        self.articleKeep++;
                    }else{
                        $('.tipBox').text('已收藏过');
                        setTimeout(function () {
                            $('.tipBox').removeClass('showTime');
                        },1000)
                    }
                });
        }
    };
    /*点赞*/
    self.doLike = function (articleId,index) {
        if (!self.loginUser){
            $("#loginMain").css({"visibility":"visible","height":"400px"});
        }else{
            $http.get('/doLike?articleId='+articleId).then(
                function (resp) {
                    $('.tipBox').addClass('showTime');
                    if (resp.data == 'success'){
                        $('.tipBox').text('点赞成功');
                        setTimeout(function () {
                            $('.tipBox').removeClass('showTime');
                        },1000);
                        self.articleLike++;
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
            window.open("http://localhost:2017/otherUserPage?otherUser="+articleAuthor);
        }
    };
    /*评论信息打包*/
    function doCommentMess(data) {
        self.articleCommentsMess = data;
        length = self.articleCommentsMess.length;
        self.articleComments = self.articleCommentsMess.slice(0,length-1).reverse();
        self.commentAuthorPics = self.articleCommentsMess[length-1].reverse();
        self.commentCount = self.articleComments.length;
    }
    
    
}]).directive('repeatFinish',function(){
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
                scope.$eval( attr.repeatFinish )
            }
        }
    }
});