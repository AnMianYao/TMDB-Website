var srollTops=[$("#about")[0].offsetTop,$("#personInformation")[0].offsetTop,
    $("#knowFor")[0].offsetTop,$("#acting")[0].offsetTop];

function rightBarTHML(data) {
    var $rightBar=$(" .main .rightBar");

    var $img=$("img",$rightBar);

    imgOnload($img,imgUrl(movieDB.common.images.profile_sizes[1],data.detail.profile),localImgPoster);
    $("h4",$rightBar).text(data.detail.name);
}
function aboutHTML(data) {

    var url=data.tagged[0].bg;
    var data=data.detail;
    var $section=$("#about");
    var $bg=$(".content .personBg img");

    imgOnload($bg,imgUrl("original",url),localImgBackdrop);


    var $p=$("p",$section);
    $p.text(data.biography);
    showMoreText($p);

}

function personInformationHTML(data) {
    var data=data.detail;

    var $section=$("#personInformation");

    var $img=$(".info img",$section);
    imgOnload($img,imgUrl("w300_and_h450_bestv2",data.profile),localImgPoster);

    $("span.gender",$section).text(data.gender);
    $("span.birthday",$section).text(data.birthday);
    $("span.placeOfBirth",$section).text(data.placeOfBirth);
    var anotherName=data.anotherName.length===0?"None":data.anotherName.join(", ");
    $("span.anotherName",$section).text(anotherName);

    var homePage=data.homepage?data.homepage:"Null";
    $("span.homepage",$section).text(homePage);
    $("span.popularity",$section).text(data.popularity.toFixed(2));

}

function knowForHTML(data) {
    var $section=$("#knowFor");
    var data=data.tagged;

    var $ul=$("ul",$section);
    $ul.text("");
    data.forEach(function (t) {
        var $node=$("<li class='hoverable'><div class=\"img\"><img></div><div><h5></h5><p class=\"overview\"></p></div></li>");

        var $img=$("img",$node);

        imgOnload($img,imgUrl(movieDB.common.images.poster_sizes[2],t.poster),localImgPoster);
        $("h5",$node).text(t.title);
        $(".overview",$node).text(t.overview);

        $node.attr("data-search",t.id+"&"+t.type);
        $ul.append($node);
    })
}

function actingHTML(data) {
    var $section=$("#acting");
    var data=data.acting;


    var $ul=$("ul",$section);
    $ul.text("");

    var times=Object.keys(data).reverse();
    times.forEach(function (t, number) {
        var $li=$("<li><div class=\"time\"></div><div class=\"works\"></div></li>");
        if (number>5){
            $li.addClass("hiding")
        }
        $(".time",$li).text(t);
        var $node=$(".works",$li);


        data[t].forEach(function (t1) {
            var $item=$(" <div class=\"chip\"></div>");
            var $img=$("<img >");
            imgOnload($img,imgUrl(movieDB.common.images.profile_sizes[0],t1.poster),localImgPoster);

            var title=document.createTextNode(t1.title);
            $item.append($img);
            $item[0].appendChild(title);

            $item.attr("data-search",t1.id+"&"+t1.type);
            $node.append($item);


        });

        $ul.append($li)
    });

}

function htmlPerson() {
    var data=arguments[0];
    rightBarTHML(data);
    aboutHTML(data);
    personInformationHTML(data);
    knowForHTML(data);
    actingHTML(data);

    $(".wrapper .progress").addClass("hide");
}

$(document).ready(function(){

    var searchResult=window.localStorage["personID"];


    var searchID=searchResult.split("&")[0];

    movieDB.getPeopleInfo(searchID,htmlPerson);

    $(window).scroll(function () {

        var scrollTop=$(window).scrollTop()-$("header").height();

        var $collection=$(".rightBar .collection").find("a");
        var index;
        if( scrollTop<srollTops[0]){
            index=0

        }else if (scrollTop>srollTops[0]  && scrollTop<srollTops[1] ){
            index=1;
        }else if (scrollTop>srollTops[1]  && scrollTop<srollTops[2]){
            index=2
        }else if (scrollTop>srollTops[2]  && scrollTop<srollTops[3]){
            index=2
        }else if ( scrollTop>srollTops[3]){
            index=3
        }

        $($collection[index]).addClass("active").siblings().removeClass("active");
    });
    var $wrapper=$(".wrapper");

    $wrapper.on("click",function (e) {
        var target=e.target;

        var $div=$(target).parents(".button");

        /**
         * icon meun
         */
        if ($div[0]){
            var $main=$(target).parents(".main");
            var $rightBar=$(".rightBar",$main);
            if(!$div.hasClass("moveRight")){
                $main.addClass("move");
                $rightBar.addClass("move");
            }else {
                $main.removeClass("move");
                $rightBar.removeClass("move");
            }
            $div.toggleClass("moveRight");
            return;
        }

        var $collection=$(target).parents(".collection");

        if($collection[0] && target.nodeName.toLowerCase()==="a"){
            $(target).addClass("active").siblings().removeClass("active");
            return;
        }

        /**
         * know for  click
         */

        var $knowLi=$(target).parents("#knowFor ul li");

        if ($knowLi[0]){
            var knowForInfo=$knowLi.attr("data-search");
            getWindowLoaction(knowForInfo);
            return;
        }

        var $actingChip=$(target).parents("#acting .chip");
        if ($actingChip[0]){

            var actingInfo=$actingChip.attr("data-search");
            getWindowLoaction(actingInfo)
            return;
        }

        /**
         * more acting click
         */
        if (target.nodeName.toLowerCase()==="a" && $(target).hasClass("btn")){
            if ($(target).text()==="more"){
                $("#acting ul li").each(function (index) {
                    var $li=$(this);
                    $li.removeClass("hiding");
                });
                $(target).text("closed");
            }else if ($(target).text()==="closed"){
                $("#acting ul li").each(function (index) {
                    var $li=$(this);
                    if (index>5){
                        $li.addClass("hiding");
                    }
                });
                $(target).text("more");

            }
            $("#acting ul li").each(function (index) {
                var $li=$(this);

            })
        }


    });
});