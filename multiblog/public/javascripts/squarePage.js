var squareMenuBox = document.getElementsByClassName("square-menu")[0],
    squareMenuT = document.getElementById("square-menu-title"),
    squareMenuUl = document.getElementById("square-menu-list"),
    squareMenuList = squareMenuUl.getElementsByTagName("li");

squareMenuBox.onmouseover = function () {
    squareMenuUl.style.height = "250px";
};
squareMenuBox.onmouseout = function () {
    squareMenuUl.style.height = "0";
};
for (var i=0;i<squareMenuList.length;i++){
    squareMenuList[i].index = i;
    squareMenuList[i].onclick = function () {
        squareMenuT.innerHTML = this.innerHTML;
        squareMenuUl.style.height = 0;
    }
}

/*滚动目录位置*/
$(window).scroll(function () {
    if ($(window).scrollTop() > 680 ){	
        $("div.square-menu").css({"position":"fixed","left":"100px","top":"95px"});
    }else{
        $("div.square-menu").css({"position":"absolute","left":"100px","top":"160px"});
    }
});
/*滚动热门推荐位置*/
$(window).scroll(function () {
    if ($(window).scrollTop() > 680 ){
        $("div.hot-article").css({"position":"fixed","right":"30px","top":"95px"});
    }else{
        $("div.hot-article").css({"position":"absolute","right":"30px","top":"160px"});
    }
});