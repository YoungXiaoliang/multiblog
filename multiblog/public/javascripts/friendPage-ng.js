$(document).ready(function(){
    $('.friend-btn-list button').click(function () {
        $('.friend-btn-list button').removeClass('activeBtn');
        $(this).addClass('activeBtn');
    })
});
mainApp.controller('friendPageController',['$http',function ($http) {
    var self = this;
    $http.get('/getLoginUser').then(
        function (resp) {
            self.loginUser = resp.data;
            if (self.loginUser.follows == ''){
                $('.nofriends').show();
                $('.yesfriends').hide();
            }else{
                $('.nofriends').hide();
                $('.yesfriends').show();
                getFriendMess();
            }
        }
    );
    function getFriendMess() {
        $http.get('/getMyFriends').then(function (resp) {
            self.myFriends = resp.data.myFriends;
            self.oneFriend = self.myFriends[0];
            self.friendArticles = resp.data.friendArticles;
            self.friendFollows = resp.data.friendFollows;
            self.friendFans = resp.data.friendFans;
        })
    }

    self.getOneFollow = function (index) {
        self.oneFriend = self.myFriends[index];
        $http.get('/getOneFriend?oneFriend='+self.myFriends[index].username).then(function (resp) {
            self.friendArticles = resp.data.friendArticles;
            self.friendFollows = resp.data.friendFollows;
            self.friendFans = resp.data.friendFans;
        })
    }

}]);