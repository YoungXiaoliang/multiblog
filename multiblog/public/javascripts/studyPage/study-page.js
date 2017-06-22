$(function(){
    $(".tree").treemenu({delay:300}).openActive();
});

// alert($('#catalog2').offset().top);
/*目录高度*/
var navMaxHeight = $(window).height()-75;
$(".catalog-nav").css("max-height",navMaxHeight+'px');

function clickCatalogName(bodySTop) {
    $('body').animate({scrollTop:$('#'+bodySTop+'').offset().top-55 + 'px'},500)
}
/*点击目录章节展开按钮*/
$(document).ready(function(){
    $(".toggler").click(function () {
        $(".toggler").parents("li.catalog-list").removeClass("active");
        $(this).parents("li.catalog-list").addClass("active");
    })
});
/*滚动目录位置*/
$(window).scroll(function () {
    if ($(window).scrollTop() > 380 ){
        $("nav.catalog-nav").css({"position":"fixed","left":"60px","top":"105px"});
    }else{
        $("nav.catalog-nav").css({"position":"relative","left":"0px","top":"0px"});
    }
});
