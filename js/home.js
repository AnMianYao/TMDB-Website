function hintsLiHTML(data,type,parent) {
    var $node=$("<li class=\"collection-item avatar\"><img class=\"circle\"><span class=\"title\">Title</span><p class=\"time\"></p><a class=\"secondary-content type\"></a></li>");
    var $img=$("img",$node);
    var $title=$(".title",$node);
    var $time=$(".time",$node);
    var $type=$(".type",$node);

    $node.attr("data-search",data.id+"&"+data.type);

    var url=imgUrl(movieDB.common.images.poster_sizes[0],data.poster);

    $title.text(data.title);
    $type.text(data.type);
    imgOnload($img,url,localImgPoster);

    switch (type){
        case "movie":
            $time.text(data.releaseDate);
            break;
        case "tv":
            $time.text(data.firstAirDate);
            break;
        case "person":
            $time.text(data.knowFor.join(", "));
    }

    parent.append($node);

}
function hintsHTML(data,$ul) {
    var data=data.results;

    for (var key in data){
        var typeData=data[key];
        for (var i=0;i<typeData.length;i++){
            hintsLiHTML(typeData[i],key,$ul);
        }
    }
}

$(document).ready(function () {



    $(".dropdown-button").dropdown();


    function hintsShow($ul,keyword,searchType) {
        $ul.text("");

        switch (searchType){
            case "multi":
                movieDB.multiSearch(keyword,function () {
                    var data=arguments[0];
                    hintsHTML(data,$ul);
                });
                break;
            case "movie":
                movieDB.movieSearch(keyword,function () {
                    var data=arguments[0];
                    hintsHTML(data,$ul);
                });
                break;
            case "tv":
                movieDB.tvSearch(keyword,function(){
                    var data=arguments[0];
                    hintsHTML(data,$ul);
                });
                break;
            case "person":
                movieDB.personSearch(keyword,function () {
                    var data=arguments[0];
                    hintsHTML(data,$ul);
                });
                break;
            default:
                break;
        }
    }


    function search(node,selection) {

        var $form=$(node);
        var $input=$("input",$form);

        var $i=$(".search",$form);
        var $hints=$(".hints",$form);

        var searchType=$(".selected ",$(selection)).text().toLowerCase();

        /**
         *搜索框得到焦点 输入触发提示框
         */
        $input.on("input keyup keydown",function (e) {

            $hints.removeClass("hide");

            var eventType=e.type.toLowerCase();

            /**
             * 上下键盘触发 提示框选择背景变化
             */
            var  current=(!$hints.find("li.selected")[0])? $hints.find("li:first-child"):$hints.find("li.selected");

            if(e.keyCode===40){
                if(eventType==="keydown"){
                    var nextDown;
                    var keywordDown;
                    if(!$hints.find("li.selected")[0]){
                        nextDown=$hints.find("li:first-child");

                    }else {
                        if(current[0]===current.parent().find("li:last-child")[0]){
                            nextDown=current.parent().find("li:first-child");
                        }else {
                            nextDown=current.next();
                        }
                    }
                    keywordDown=nextDown.find(".title").text();
                    $(this).val(keywordDown);
                    nextDown.addClass("selected").siblings().removeClass("selected");

                    var scrollTop=nextDown[0].offsetTop-100;
                    $hints.animate({
                        scrollTop: scrollTop
                    }, 500);

                }

            }else if(e.keyCode===38){
                if(eventType==="keydown"){
                    var nextUp;
                    var keywordUp;
                    if(current[0]===current.parent().find("li:first-child")[0]){
                        nextUp= current.parent().find("li:last-child");

                    }else {
                        nextUp=current.prev();
                    }
                    keywordUp=nextUp.find(".title").text();
                    $(this).val(keywordUp);
                    nextUp.addClass("selected").siblings().removeClass("selected");
                    var scrollTop=nextUp[0].offsetTop-100;
                    $hints.animate({
                        scrollTop: scrollTop
                    }, 500);
                }

            }else if(e.keyCode===13){
                e.preventDefault();
                var $li =$("li.selected",$hints);
                if (!$li[0]) {
                    var keyword=$(this).val();

                    if (keyword && searchType){
                        /**
                         *直截跳转到搜索页面，
                         * 传递参数 keyword&searchType值
                         **/
                        window.localStorage.setItem("searchResult",keyword+"&"+searchType+"&1");
                        window.location.href="SearchResult.html";
                    }

                }else{
                    /**
                     *直截跳转到搜索结果
                     * */
                    var info=$li.attr("data-search");
                    getWindowLoaction(info);
                }

            }else {
                var keyword=$(this).val();
                if (keyword){
                    hintsShow($hints,keyword,searchType);
                }

            }
        });

        /***
         * 鼠标滑提示框，选择像背景变化
         */
        $hints.on("mouseover ",function (e) {
            var target =e.target;
            if (target.nodeName.toUpperCase()==="LI"){
                $(target).addClass("selected ").siblings().removeClass("selected ");
            }

        });



        $(".wrapper").on("click",function (e) {
            var target =e.target;

            /**
             * 点击搜索form意外元素，提示框消失；
             */
            if(target!==$hints[0] && target!==$input[0]){
                $hints.addClass("hide");
            }


            /**
             * 提示框选项点击后，提示框消失，触发查询
             */
            var $li=$(e.target).closest("li");
            if ($li && $li.hasClass("collection-item")){

                var id=$li.attr("data-search").split("&")[0];
                var type=$li.attr("data-search").split("&")[1];
                console.log($li.attr("data-search"));
                var href=locationHref[type];
                var attr;
                if(type==="movie"||type==="tv"){
                    attr="movie"+"ID";
                }else {
                    attr= type+"ID";
                }

                window.localStorage.setItem(attr,id+"&"+type);
                window.location.href=href;
            }
        });
    }


    search($("form.search"),$("div.selection"));
});