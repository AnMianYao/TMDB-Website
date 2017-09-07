function card() {
    $(".card").each(function () {
        var $this=$(this);
        var $cardImg=$this.find(".card-img");
        var $cardShow=$this.find(".card-show");
        var $cardTitle=$this.find(".card-title");
        var $clickIcon=$this.find(".card-title i");
        var $clickUrl=$this.find(".card-url");
        $this.on("click",function (e) {
            var target =e.target;

            if (target===$clickIcon[0]){
                $cardShow.removeClass("hide");
                $cardShow.css({
                    height:$cardTitle.outerHeight()+$cardImg.height(),
                    top:$cardTitle.outerHeight()+$cardImg.height()
                });
                $cardShow.animate({
                    top:0
                },500)
            }
            if(target===$cardShow.find("i")[0]){
                $cardShow.animate({
                    top:$cardTitle.outerHeight()+$cardImg.height()
                },500,function () {
                    $cardShow.css({
                        top:0,
                        height:130
                    });
                    $cardShow.addClass("hide");
                })
            }
        })
    })
}
function cardhtml(data) {
    var data=arguments[0]
    var page=data.page;
    var maxPage=data.totalPage;
    var data=data.results;
    var key=Object.keys(data).toString();
    var $div;
    data=data[key];

    if (data.length===0){
        return false;
    }
    switch (key){
        case "popularMovie":
            $div=$("#movie");
            data.forEach(function (t) {
                var $node=$("<div class=\"card hoverable\"><div class=\"card-img \"><img class=\"activator\"></div><div><div class=\"card-title\">" +
                    "<span class=\" activator grey-text text-darken-4\"></span></div><div class=\"card-show hide\"><span class=\" grey-text text-darken-4\"></span>" +
                    "<p></p></div><div class=\"card-url\"><p><a href=\"#\">This is a link</a></p></div></div></div>");

                var $imgBg=$(".card-img img.activator",$node);
                imgOnload($imgBg,imgUrl(movieDB.common.images.backdrop_sizes[0],t.backdrop),localImgBackdrop);

                var $outerTitle=$(".card-title span.activator",$node);
                $outerTitle.text(t.title);
                $outerTitle.append($("<i class=\"material-icons right\">more_vert</i>"));

                var $innerTitle=$(".card-show span",$node);
                $innerTitle.text(t.title);
                $innerTitle.append($("<i class=\"material-icons right\">more_vert</i>"));

                var $p=$(".card-show p",$node);
                $p.text(t.overview);

                var $a=$(".card-url",$node);
                $a.attr("data-search",t.id+"&"+t.type);

                $div.append($node);
            });
            window.sessionStorage.setItem("moviePage",page);
            window.sessionStorage.setItem("movieMaxPage",maxPage);
            break;
        case "popularTV":
            $div=$("#tv");
            data.forEach(function (t) {
                var $node=$("<div class=\"card hoverable\"><div class=\"card-img \"><img class=\"activator\"></div><div><div class=\"card-title\">" +
                    "<span class=\" activator grey-text text-darken-4\"></span></div><div class=\"card-show hide\"><span class=\" grey-text text-darken-4\"></span>" +
                    "<p></p></div><div class=\"card-url\"><p><a href=\"#\">This is a link</a></p></div></div></div>");

                var $imgBg=$(".card-img img.activator",$node);
                imgOnload($imgBg,imgUrl(movieDB.common.images.backdrop_sizes[0],t.backdrop),localImgBackdrop);

                var $outerTitle=$(".card-title span.activator",$node);
                $outerTitle.text(t.title);
                $outerTitle.append($("<i class=\"material-icons right\">more_vert</i>"));

                var $innerTitle=$(".card-show span",$node);
                $innerTitle.text(t.title);
                $innerTitle.append($("<i class=\"material-icons right\">more_vert</i>"));

                var $p=$(".card-show p",$node);
                $p.text(t.overview);

                var $a=$(".card-url",$node);
                $a.attr("data-search",t.id+"&"+t.type);

                $div.append($node);
            });
            window.sessionStorage.setItem("tvPage",page);
            window.sessionStorage.setItem("tvMaxPage",maxPage);
            break;
        case "popularPerson":
            $div=$("#person");
            data.forEach(function (t) {
                var $node=$("<div class=\"card hoverable\"><div class=\"card-img \"><img class=\"activator\"></div><div><div class=\"card-title\">" +
                    "<span class=\" activator grey-text text-darken-4\"></span></div><div class=\"card-show hide\"><span class=\" grey-text text-darken-4\"></span>" +
                    "<p></p></div><div class=\"card-url\"><p><a href=\"#\">This is a link</a></p></div></div></div>");

                var $imgBg=$(".card-img img.activator",$node);
                imgOnload($imgBg,imgUrl(movieDB.common.images.profile_sizes[2],t.profile),localImgPoster);

                var $outerTitle=$(".card-title span.activator",$node);
                $outerTitle.text(t.name);
                $outerTitle.append($("<i class=\"material-icons right\">more_vert</i>"));

                var $innerTitle=$(".card-show span",$node);
                $innerTitle.text(t.name);
                $innerTitle.append($("<i class=\"material-icons right\">more_vert</i>"));

                var $p=$(".card-show p",$node);
                t.knowFor.forEach(function (t2) {
                    var $node=$("<span class='item'></span>");
                    $node.text(t2.title);
                    $node.attr("data-search",t2.id+"&"+t.type);
                    $p.append($node);
                });

                var $a=$(".card-url",$node);
                $a.attr("data-search",t.id+"&"+t.type);

                $div.append($node);
            });
            window.sessionStorage.setItem("personPage",page);
            window.sessionStorage.setItem("personMaxPage",maxPage);
            break;
        default:
            break;
    }
    $(".wrapper .progress").addClass("hide");
    card();
}
$(document).ready(function () {
    $(".button-collapse").sideNav();
    $(".arrangement").on("click",function (e) {
        var target =e.target;

        $(".card").each(function () {
            var $this=$(this);
            var $cardImg=$this.find(".card-img");
            var $cardShow=$this.find(".card-show");
            var $cardTitle=$this.find(".card-title");

            if ($(target).text()==="view_headline"){


                $this.addClass("headline");
                $cardTitle.addClass("hide");
                $cardShow.removeClass("hide");
            }else  if ($(target).text()==="view_module"){
                $this.removeClass("headline");
                $cardTitle.removeClass("hide");
                $cardShow.addClass("hide");
            }

        })

    });

    movieDB.getPopularTV(cardhtml);
    movieDB.getPopularMovie(cardhtml);
    movieDB.getPopularPerson(cardhtml);

    $(".wrapper").on("click",function (e) {
        var target =e.target;
        var $cardUrl=$(target).parents(".card .card-url");


        if ($cardUrl[0]){
            var info=$cardUrl.attr("data-search");
            getWindowLoaction(info);
            return;
        }

        var $movieMore=$(target).parents("#movie a.more");
        var $tvMore=$(target).parents("#tv a.more");
        var $personMore=$(target).parents("#person a.more");

        if ($movieMore[0]){
            var page=window.sessionStorage["moviePage"]+1;
            var maxPage=window.sessionStorage["movieMaxPage"];

            if (page>maxPage){
                var $toastContent = $('<span>there is no data</span>');
                Materialize.toast($toastContent, 2000);
                return;
            }
            var scrollTop=$(document).scrollTop();
            movieDB.getPopularMovie(cardhtml,page);
            $("html,body").animate({
                scrollTop:scrollTop
            },500);

            return ;
        }

        if($tvMore[0]){
            var page=window.sessionStorage["tvPage"]+1;
            var maxPage=window.sessionStorage["tvMaxPage"];

            if (page>maxPage){
                var $toastContent = $('<span>there is no data</span>');
                Materialize.toast($toastContent, 2000);
                return;
            }
            var scrollTop=$(document).scrollTop();
            movieDB.getPopularTV(cardhtml,page);
            $("html,body").animate({
                scrollTop:scrollTop
            },500);
            return ;
        }

        if($personMore[0]){
            var page=window.sessionStorage["personPage"]+1;
            var maxPage=window.sessionStorage["personMaxPage"];

            if (page>maxPage){
                var $toastContent = $('<span>there is no data</span>');
                Materialize.toast($toastContent, 10000);
                return;
            }
            var scrollTop=$(document).scrollTop();
            movieDB.getPopularPerson(cardhtml,page);
            $("html,body").animate({
                scrollTop:scrollTop
            },500);
            return ;
        }

        if ($(target).parents(".up.btn-floating")[0]){
            $("html,body").animate({
                scrollTop:0
            },1000);
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

})