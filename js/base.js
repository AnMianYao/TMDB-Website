


const locationHref ={
    person:"Person.html",
    tv:"Movie.html",
    movie:"Movie.html"
};
const localImgPoster="imgs/poster.jpg";
const localImgBackdrop ="imgs/home_bg.jpg";


function getWindowLoaction(info) {
    var location ={
        person:"Person.html",
        tv:"Movie.html",
        movie:"Movie.html"
    };
    var type=info.split("&")[1];

    if (type==="movie" || type==="tv"){
        window.localStorage.setItem("movieID",info);
    }else  if (type==="person"){
        window.localStorage.setItem("personID",info);
    }
    window.location.href=location[type];
}
function imgUrl(option,url) {
    if (!url) {
        return "../imgs/home_bg.jpg";
    }
    return movieDB.common.images_uri + option + url;
}
function getWindowLoaction(info) {
    var location ={
        person:"Person.html",
        tv:"Movie.html",
        movie:"Movie.html"
    };
    var type=info.split("&")[1];

    if (type==="movie" || type==="tv"){
        window.localStorage.setItem("movieID",info);
    }else  if (type==="person"){
        window.localStorage.setItem("personID",info);
    }
    window.location.href=location[type];
}
function showMoreText(element){

    var content= element.text();

    var $newBox=$("<div></div>");
    var $btn = $("<span></span>");

    if(content.length<=500){
        $btn.text("");
        $newBox.text(content);
    }else {

        $newBox.text(content.substring(0,500));
        $btn.text("...read more");
    }
    element.css({
        position:"relative "
    });
    $btn.css({
        position:"absolute",
        right:0,
        bottom:0,
        color:"#26a69a",
        fontWeight:"bold"
    });

    $btn.on("click",function (e) {
        if($btn.text()==="...read more"){
            $newBox.text(content);

            $btn.text("...closed");

        }else if ($btn.text()==="...closed"){
            $newBox.text(content.substring(0,500));
            $btn.text("...read more");
        }
    });
    element.text("");
    element.append($newBox);
    element.append($btn);
}

function imgOnload(node,src,localSrc) {
    var src=src;
    var myImage=(function () {
        return function (node,src) {
            node.attr("src",src);
        }
    })();

    var proxyImage=(function () {
        var img=new Image();

        img.onload=function () {
            myImage(node,this.src);
        };

        return function (src) {
            myImage(node,localSrc);
            $(img).attr("src",src);
        }
    })();
    proxyImage(src);

}

$(document).ready(function () {
    $(".wrapper").on("click",function (e) {
        var target =e.target;
        var $loginLi=$(target).parents(".header li ");
        var $loginCover=$(".wrapper .loginCover");
        var $login=$(".wrapper .loginCover .login");


        if($loginLi[0] && $loginLi.attr("id")==="login"){
            $loginCover.removeClass("hide");

            $loginCover.css({
                height:document.documentElement.clientHeight
            });
            $login.css({
                top:(document.documentElement.clientHeight-$login.height())/2
            });
            return
        }


        if ($(target).hasClass("btn") && $(target).parents(".login")[0]){
            window.localStorage.setItem("username",$("#username",$login).val());
            window.localStorage.setItem("password",$("#password",$login).val());
            movieDB.login(window.localStorage["username"],window.localStorage["password"],function () {
                var data=arguments[0];
                window.localStorage.setItem("loginID",data);
                $("#login").remove();
                $("#me").removeClass("hide");
                $("#me> a.dropdown-button").text(window.localStorage["username"]);
                $loginCover.addClass("hide");

            });
            return

        }


        if ($(target).hasClass("Close") &&$(target).parents(".login")[0]){
            $loginCover.addClass("hide");
            return
        }

        var $liFavorite=$(target).parent("#dropdown1 li");
        if ($liFavorite[0]){
            window.localStorage["favorite"]=$liFavorite.attr("data-f");
            console.log(window.localStorage["favorite"])
        }
    });

    if (window.localStorage["loginID"]){
        console.log(window.localStorage["loginID"])
        $("#login").remove();
        $("#me").removeClass("hide");
        $("#me> a.dropdown-button").text(window.localStorage["username"]);
    }
});