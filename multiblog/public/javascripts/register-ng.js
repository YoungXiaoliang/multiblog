angular.module('registerApp',[])
    .controller('registerController', ['$http', function ($http) {
        var self = this;
        self.captchaUrl = 'captcha';
        self.updataCaptcha = function () {
            self.captchaUrl = 'captcha?t=' + Date.now() + Math.random();
        };
        self.hh = 'ddd';
        //注册
        self.register = function () {
            if (self.user.userPwd == self.user.userPwdagain){
                $http.post('/register',self.user).then(
                    function (resp) {
                        if (resp.data.captchaErrorMsg){
                            $('.captcha-tip-mess').css('display','block');
                            return;
                        }else if(resp.data.registerError){
                            $('.name-email-tip-mess').css('display','block');
                            return;
                        }
                        window.location = 'http://localhost:2017';

                    }
                )
            }

        }
}]);