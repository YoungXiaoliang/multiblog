mainApp.controller('publishController',['$http',function ($http) {
    var self = this;
    self.publish = function () {
        if (!$('input:radio[name="type"]:checked').val()){
            alert('请选择文章类型');
        }else if(!$('input:radio[name="whoSee"]:checked').val()){
            alert('请选择文章可见人群');
        }else{
            $http.post('/publish',self.article).then(function (resp) {
                if (resp.data.publishError){
                    alert('发布出错' + resp.data.publishError);
                }else{
                    window.location = 'http://localhost:2017/squarePage';
                }
            })
        }

    };
}]);