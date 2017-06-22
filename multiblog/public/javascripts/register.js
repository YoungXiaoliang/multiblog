$(document).ready(function(){
    $('input').focus(function () {
        $(this).next().css('display','none');
    });
    $(".pwd").blur(function () {
        if ($(".pwdAgain").val() != '' && $(this).val() != $(".pwdAgain").val()){
            $(".pwd-tip-mess").css('display','block');
        }
    });
    $(".pwdAgain").blur(function () {
        if ($(this).val() != $(".pwd").val()){
            $('.pwd-tip-mess').css('display','block');
        }
    });
});