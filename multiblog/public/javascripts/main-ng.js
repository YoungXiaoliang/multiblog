var mainApp = angular.module('mainApp',[]);
mainApp .controller('mainCtroller',['$http','$scope',function ($http,$scope) {
        var self = this;
        /*$http.get('/getLoginUser').then(
            function (resp) {
                self.loginUser = resp.data;
            }
        );*/
        
        self.login = function () {
            $http.post('/login',self.user).then(
                function (resp) {
                    var loginUserMess = resp.data;
                    if(loginUserMess == 'nameError'){
                        $("#usernameMes").css("display","block");
                    }else if(loginUserMess == 'pwdError'){
                        $("#pwdMes").css("display","block");
                    }else{
                        // console.log(loginUserMess.users[0].username);
                        window.location.reload();
                    }
                }
            );
        };
        
        self.trueExit = function () {
            $http.get('/trueExit').then(
                function (resp) {
                    window.location.reload();
                }
            );
        }
    }]).filter('trustHtml', function ($sce) {
    return function (input, output) {
        return $sce.trustAsHtml(input);
        //$sce是angularJS自带的安全处理模块，$sce.trustAsHtml(input)方法便是将数据内容以html的形式进行解析并返回。
    }
});