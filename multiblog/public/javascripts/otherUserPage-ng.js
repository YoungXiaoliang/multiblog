/*控制器*/
$(document).ready(function(){
    $('.user-page-btn-list button').click(function () {
        $('.user-page-btn-list button').removeClass('activeBtn');
        $(this).addClass('activeBtn');
    })
});
mainApp.controller('otherUserController',['$http',function ($http) {
    var self = this;

    /*获取地址栏文章地址*/
    var url = window.location.search ;
    var otherusername = url.substring(url.lastIndexOf('=')+1, url.length);
    var otheruserName = decodeURI(otherusername);
    $http.get('/getLoginUser').then(
        function (resp) {
            self.loginUser = resp.data;
            if (contains(self.loginUser.follows,otheruserName)){
                $('.followUser').text('已关注');
                $('.followUser').unbind("click");

            }else{
                $('.followUser').text('关注');
            }
        });
    /*获取用户信息*/
    $http.get('/getOtherUser?otheruser='+otheruserName).then(function (resp) {
        self.otheruser = resp.data;
    });
    /*获取用户的文章*/
    $http.get('/getOtherUserArticles?otheruser='+otheruserName).then(function (resp) {
        self.otheruserArticles = resp.data;
    });
    /*获取用户的关注*/
    $http.get('/getOtherUserFollows?otheruser='+otheruserName).then(function (resp) {
        self.otheruserFollows = resp.data;
    });
    /*获取用户的粉丝*/
    $http.get('/getOtherUserFans?otheruser='+otheruserName).then(function (resp) {
        self.otheruserFans = resp.data;
    });

    /*关注用户*/
    self.doFollow =function (otherusername) {
        $http.get('/doFollow?followName='+otherusername).then(function (resp) {
            $('.tipBox').addClass('showTime').text('关注成功');
            self.otheruserFans = self.otheruserFans.concat(resp.data);
            $('.followUser').text('已关注');
            $('.followUser').unbind("click");
            console.log(self.otheruserFans);
        })
    };
    self.doNologinFollow = function () {
        $("#loginMain").css({"visibility":"visible","height":"400px"});
    };


    /*查询数组中是否存在某个值*/
    function contains(arr, obj) {
        if (!arr){
            return false;
        }else{
            var i = arr.length;
            while (i--) {
                if (arr[i] == obj) {
                    return true;
                }
            }
            return false;
        }
    }
}]);

