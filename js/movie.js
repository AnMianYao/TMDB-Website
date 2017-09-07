
function Silde($element) {
    var $container=$(".itemsContainer",$element);
    var $left=$(".Left",$element);
    var $right=$(".Right",$element);
    var items=$container.find(".item");

    var limteLeft=$container.width()-($(items[0]).width()+10)*items.length+10;

    var timer;
    $element.on("mouseover", function(e) {

        var target=e.target;
        if (target===$left[0] || $(target).parents(".Left")[0]){
            clearInterval(timer);

            timer=setInterval(function () {

                if($container.position().left>=0){
                    clearInterval(timer);
                }else {
                    $container.css({
                        left:"+=5"
                    });
                }
            },16)
        }else if(target===$right[0] || $(target).parents(".Right")[0]){
            clearInterval(timer);
            timer=setInterval(function () {

                if($container.position().left<limteLeft){
                    clearInterval(timer);
                }else {
                    $container.css({
                        left:"-=5"
                    })
                }

            },16)
        }else {
            clearInterval(timer)
        }
    }).on('mouseout', function() {
        clearInterval(timer);
    });
}

function briefHTML(data) {
    var credits=data.credits;
    var data=data.detail;

    var $section=$("#brief");
    var $bgImg=$(".bg img",$section);

    imgOnload($bgImg,imgUrl(movieDB.common.images.backdrop_sizes[3],data.backdrop),localImgBackdrop);

    var $filmCard=$(".filmCard",$section);
    var $Cardimg=$(".img img",$filmCard);
    imgOnload($Cardimg,imgUrl(movieDB.common.images.poster_sizes[4],data.poster),localImgPoster,localImgPoster);

    var $container=$("#container");
    var $cardTitle=$("h4",$container);
    $cardTitle.text(data.title);


    var $cardUl=$("ul",$container);

    var crewInfo=[];
    credits.forEach(function (t) {
        crewInfo.push(t.name+"("+t.character+")");
    });
    $("span.overview",$cardUl).text(data.overview);
    $("span.crew",$cardUl).text(crewInfo.join(", "));

    if(data.type==="movie"){
        $("span.type",$cardUl).text(data.movieType.join(", "));
    }else  if(data.type==="tv"){
        $("span.type",$cardUl).text(data.tvType.join(", "));
    }
    $("span.company",$cardUl).text(data.company.join(", "));

    $section.css({
        height:window.innerHeight-$(".wrapper header").height()
    });

    $('.collapsible').collapsible();

}


function creditsHTML(data) {
    var title=data.detail.title;
    var data=data.credits;
    var $section=$("#credits");

    $section.removeClass("hide");

    if(data.length==0){
        $section.addClass("hide");
        return false;
    }


    $("h2",$section).text(title);

    var $carousel=$(".carousel",$section);
    $carousel.text("");

    data.forEach(function (t) {
        var $node=$("<a class=\"carousel-item\" ><img><span href=\"Person.html\" class=\"character\"></span></a>");

        var $img=$("img",$node);
        var $character=$(".character",$node);
        $character.attr("data-search",t.id+"&"+t.type);

        imgOnload($img,imgUrl(movieDB.common.images.profile_sizes[2],t.profile),localImgPoster);
        $character[0].innerHTML=t.name+"<br>"+t.character;

        $carousel.append($node);

    });

    $('.carousel').carousel();


}

function reviewsHTML(data) {
    var title=data.detail.title;
    var data=data.reviews;
    var $section=$("#reviews");
    $section.removeClass("hide");
    console.log(data)
    if(!data || data.reviews.length===0){
        $section.addClass("hide");
        return false;
    }
    data=data.reviews;
    $("h2 .title",$section).text(title);


    var $ul=$("ul",$section);
    $ul.text("");
    data.forEach(function (t) {
        var $node=$("<li><h5>A review by <span class=\"name\"></span> </h5><p></p></li>");
        var $author=$(".name",$node);
        var $content=$("p",$node);


        $author.text(t.author);
        $content.text(t.content);
        showMoreText($content);
        $ul.append($node);
    })


}

function similarHTML(data) {
    var $section=$("#similar");
    var data=data.similar.similarity;
    $section.removeClass("hide");

    if(data.length==0){
        $section.addClass("hide");
        return false;
    }

    var $similarDiv=$(".similarDiv",$section);
    $similarDiv.text("");
    data.forEach(function (t) {
        var $node=$("<div class=\" similarFilm\"><img class=\"materialboxed\" ><p></p></div>");

        var $img=$("img",$node);
        $img.attr("data-caption",t.title);
        imgOnload($img,imgUrl(movieDB.common.images.backdrop_sizes[1],t.backdrop),localImgBackdrop);
        var $p=$("p",$node);
        $p.text(t.overview);
        var $span=$("<span >know about more</span>");
        $span.attr("data-search",t.id+"&"+t.type);
        $span.insertAfter($p);
        var $a=$("a",$node);
        $a.attr("data-search",t.id+"&"+t.type);

        $similarDiv.append($node);
    });

    $('.materialboxed').materialbox();

}

function recommendationsHTML(data) {
    var data=data.recommendations;

    var $section=$("#recommendations");
    $section.removeClass("hide");

    if(data.length==0){
        $section.addClass("hide");
        return false;
    }

    var $itemsContainer=$(".itemsContainer",$section);
    var $gallery=$("#gallery");

    $itemsContainer.text("");
    data.forEach(function (t) {
        var $node=$(" <div class=\"item\"><div class=\"img\"><img></div><h6></h6></div>");

        var $img=$("img",$node);
        imgOnload($img,imgUrl(movieDB.common.images.backdrop_sizes[0],t.backdrop),localImgBackdrop);
        var $h6=$("h6",$node);
        $h6.text(t.title);

        $node.attr("data-search",t.id+"&"+t.type);

        $itemsContainer.append($node);
    })

    Silde($gallery);

}

function html() {
    var data=arguments[0];
    briefHTML(data);
    creditsHTML(data);
    reviewsHTML(data);
    similarHTML(data);
    recommendationsHTML(data);
    $(".wrapper .progress").addClass("hide");

}

function showMovieOrTV (){
    $("html,body").scrollTop(0);
    var searchResult=window.localStorage["movieID"];
    var searchID=searchResult.split("&")[0];
    var searchType=searchResult.split("&")[1];
    switch (searchType){
        case "movie":
            movieDB.getMovieInfo(searchID,html);
            break;
        case "tv":
            movieDB.getTVInfo(searchID,html);
            break;
        default:
            movieDB.getMovieInfo(searchID,html);
            break
    }


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
$(document).ready(function(){

    showMovieOrTV();

    $(".wrapper").on("click",function (e) {
        var target =e.target;

        /**
         * credits click
         */
        if ($(target).parents(".carousel > a")[0] && $(target).hasClass("character")){
            var creditInfo=$(target).attr("data-search");
            getWindowLoaction(creditInfo)
        }

        /**
         * similar click
         */
        if ($(target).parents(".similarFilm")[0] && target.nodeName.toLowerCase()==='span'){

            window.localStorage.setItem("movieID",$(target).attr("data-search"));
            location.reload();
            return;
        }

        /**
         *
         * recommendations click
         */

        if ($(target).parents("#gallery .item")[0]){

            var $recommendations =$(target).parents("#gallery .item");
            window.localStorage["movieID"]=$recommendations.attr("data-search");
            location.reload();
            return;
        }

        if ($(target).parents(".up.btn-floating")[0]) {
            $("html,body").animate({
                scrollTop: 0
            }, 1000);
            return;
        }
    });

    window.onscroll=function () {
        if ($(document).scrollTop()>=document.documentElement.clientHeight/2){
            $(".wrapper a.up").removeClass("hide");
        }else {
            $(".wrapper a.up").addClass("hide");
        }
    }
});