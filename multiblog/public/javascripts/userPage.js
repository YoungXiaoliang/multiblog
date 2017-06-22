$(document).ready(function(){
    $('.user-page-btn-list button').click(function () {
        $('.user-page-btn-list button').removeClass('activeBtn');
        $(this).addClass('activeBtn');
    });
    $('.cancelUpload').click(function () {
        $('div.upload-Model').fadeOut();
    });
    $('.user-picture button').click(function () {
        $('div.upload-Model').fadeIn();
    });
    $('.cancel').click(function () {
        $('div.editMess-Model').fadeOut();
    });
    $('.cancelArticle').click(function () {
        $('div.editArticle-Model').fadeOut();
    });
    $('.canceldelArticle').click(function () {
        $('div.delArticle-Model').fadeOut();
    });
    $('.cancelCancelFollow').click(function () {
        $('div.calcelFollow-Model').fadeOut();
    });
    $('.cancelKeep').click(function () {
        $('div.calcelKeep-Model').fadeOut();
    });

    // 图片上传前预览
    function imgShow(input, imgbox) {
        $(input).change(function () {
            var objUrl = getObjectURL(this.files[0]);
            if (objUrl) {
                $(imgbox).attr('src', objUrl);
            }
        });

        //建立一个可存取到该file的url
        function getObjectURL(file) {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            return url;

        }
    }
    imgShow('.file','#img-show');
});