/*滚动效果*/
var mouseP = 1;
$(function () {
    $("header").mousemove(function () {
        $(this).css("opacity","1");
        mouseP = 0;
    });
    $("header").mouseout(function () {
        if ($(window).scrollTop() > 0 ){
            $(this).css("opacity",".4");
        }
        mouseP = 1;
    });
});
$('body').scroll(function () {
    if ($('body').scrollTop() > 0 ){
        alert(1);
        if (mouseP == 1){
            $("header").css("opacity",".4");
            $("nav.row").css({"padding-top":"0","padding-bottom":"0"});
        }
    }else{
       $("header").css("opacity","1");
       $("nav.row").css({"padding-top":"10px","padding-bottom":"10px"});
    }
});

/*登录*/
$("#loginBtn").click(function () {
    $("#loginMain").css({"visibility":"visible","height":"400px"});
});
$("#closeBtn").click(function () {
    $("#loginMain").css("height","0px");
    setTimeout(function(){$("#loginMain").css("visibility","hidden")},500);

});
$(".username").focus(function () {
    $(this).next().hide();
});
$(".userpassword").focus(function () {
    $(this).next().hide();
});

/*退出登录*/
$(".loginOpear").click(function () {
    $("#exit-tip-modal").css({"height":"180px","visibility":"visible"});
});
$(".cancel-exit").click(function () {
    $("#exit-tip-modal").css("height","0px");
    setTimeout(function(){$("#exit-tip-modal").css("visibility","hidden")},500);
});
$(".true-exit").click(function () {
    $("#exit-tip-modal").css("height","0px");
    setTimeout(function(){$("#exit-tip-modal").css("visibility","hidden")},500);
});

