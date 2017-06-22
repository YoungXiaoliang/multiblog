var wrapBox = document.getElementById("main-content-box"),
	sectionList = wrapBox.getElementsByTagName("section"),
	screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
	bodyBox = document.getElementsByTagName("body")[0],
	startTime=0,endTime=0,picBgindex=0, 
	/*图片展示*/
	imageShow = document.getElementById("image-show-box"),
	imageBtnList = document.getElementById("image-btn-list").getElementsByTagName("li"),
	imageShowTitle = document.getElementById("image-title"),
	imgShowAddr = ["/study","/squarePage","/friendsPage","/publishPage"]
	imageShowTitleArr = ["学习天地-学习超牛技术","交流广场-你有技术我有看法","朋友圈-有朋友，不孤独","随心发表-该出手时就出手"];
	/*页面滚动监听*/
	nowSection = document.getElementsByClassName("module-img");

/*模块高度*/
for(var i=0;i<sectionList.length;i++){
	sectionList[i].style.height = screenHeight + 'px';
}

bodyBox.setAttribute("onmousewheel","return false;");

//页面滚动
function scrollFun(event) {
    startTime = new Date().getTime();  
    var delta = -(event.detail)  || event.wheelDelta,
    	scrollT = document.documentElement.scrollTop = document.body.scrollTop;
    	nowTop = wrapBox.offsetTop;

    if ((startTime - endTime) > 1000) {
        if (delta < 0 && parseInt(nowTop) > -(screenHeight*4) ) {
            nowTop = nowTop - screenHeight;
            toPage(nowTop);
            if (parseInt(nowTop) == -(screenHeight*4)){
                // setTimeout(function () {
				// 	bodyBox.setAttribute("onmousewheel","return true;");
				// },1000);
				bodyBox.setAttribute("onmousewheel","return true;");
            }
        }
        if (delta > 0 && parseInt(nowTop) < 0 && scrollT  < 100) {
            nowTop = nowTop + screenHeight;
            toPage(nowTop);
			bodyBox.setAttribute("onmousewheel","return false;");

        }
        
            endTime = new Date().getTime();  
    } else {  
            event.preventDefault();    
        }    
}

//兼容调动函数
if ((navigator.userAgent.toLowerCase().indexOf("firefox") != -1)) {   
    document.addEventListener("DOMMouseScroll",scrollFun,false);
} else if (document.addEventListener) {  
    document.addEventListener("mousewheel",scrollFun,false);  
} else if (document.attachEvent) {  
    document.attachEvent("onmousewheel",scrollFun);   
} else {  
    document.onmousewheel = scrollFun;  
}

//重置wrapBox的offsetTop值
function toPage(nowT) {
     wrapBox.style.top = nowT+'px';
}

//图片展示
	//图片切换
function ChImgShow(img){
	imageShow.style.backgroundImage = "url(/images/homePage/home-page-show"+img+".jpg)"
	imageShow.href = imgShowAddr[img];
}
	//按钮变化
function imageBtnActive(btn){
	for(var i=0;i<imageBtnList.length;i++){
		imageBtnList[i].className = "";
	}
	imageBtnList[btn].className = "active-btn";
}
	//标题变化
function imageTitlt(title){
	imageShowTitle.innerHTML = imageShowTitleArr[title];
}
function showWindow(){
	if(picBgindex<4){
		ChImgShow(picBgindex);
		imageBtnActive(picBgindex);
		imageTitlt(picBgindex);
        picBgindex++;
    }else{
        ChImgShow(0);
        imageBtnActive(0);
        imageTitlt(0);
        picBgindex=1;
    }

    setTimeout(showWindow,5000);
}
showWindow();

	//点击按钮
for(var i=0;i<imageBtnList.length;i++){
	imageBtnList[i].index = i;
	imageBtnList[i].onclick = function(){
		ChImgShow(this.index);
		imageBtnActive(this.index);
		imageTitlt(this.index);
		picBgindex = this.index;
	}
}

/*滚动动画事件*/
//添加动画
function addAnimation(nowIndex){
	for(var i = 0;i<nowSection.length;i++){
		nowSection[i].classList.remove("animation-module");
	}
	if (!nowSection[nowIndex].classList.contains("animation-module")){
		nowSection[nowIndex].classList.add("animation-module");
	}
	
}
/*监听函数*/
function scrollEven(){
	var mytop = - wrapBox.offsetTop;
	if(mytop < screenHeight){
		nowSection[0].classList.remove("animation-module");
	}
	else if (mytop >= screenHeight && mytop<1.5*screenHeight){
		addAnimation(0);
	}
	else if(mytop >= 2*screenHeight && mytop<2.5*screenHeight){
		addAnimation(1);
	}
	else if(mytop >= 3*screenHeight && mytop<3.5*screenHeight){
		addAnimation(2);
	}
	else if(mytop >= 4*screenHeight){
		addAnimation(3);
	}
}


setInterval(scrollEven,500);