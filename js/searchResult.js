function collectionLiHTML(data,parents) {
    var $node=$("<li class=\"collection-item avatar\"><img  class=\"circle hoverable\"><span class=\"title\"></span>" +
        "<p class=\"overview\"></p><a class=\"secondary-content\"><span class=\"score\"></span><i class=\"material-icons\">grade</i></a></li>");

    $node.attr("data-search",data.id+"&"+data.type);

    var $img=$("img",$node);
    var $title=$(".title",$node);
    var $overview=$(".overview",$node);
    var $score=$(".score",$node);

    var type=data.type;
    var option,_url;
    switch (type){
        case "movie":
            option=movieDB.common.images.poster_sizes[4];
            _url=data.poster;
            break;
        case "tv":
            option=movieDB.common.images.poster_sizes[4];
            _url=data.poster;
            break;
        case "person":
            option=movieDB.common.images.profile_sizes[2];
            _url=data.profile;
    }

    var url=imgUrl(option,_url);

    $title.text(data.title);
    $overview.text(data.overview);
    $score.text(data.score);

    imgOnload($img,url,localImgPoster);

    parents.append($node);
}

function searchResultHTML() {
    var data=arguments[0];
    window.sessionStorage.setItem("maxPage",data.totalPage);
    data=data.results;
    for (var key in data){

        var nodeID="#"+key;
        var parents=$(nodeID);
        parents.text("");

        if (data[key].length!==0){
            parents.removeClass("hide");
            var $header=$("<li class=\"collection-header\"><h4></h4></li>");
            $("h4",$header).text(key);
            parents.append($header);

            var typeData=data[key];
            for (var i=0;i<typeData.length;i++){
                collectionLiHTML(typeData[i],parents);
            }
        }

    }

    $(".wrapper .progress").addClass("hide");
}

function searchOnload() {
    var searchResult=window.localStorage["searchResult"];
    var searchKeyword=searchResult.split("&")[0];
    var searchKeyType=searchResult.split("&")[1];


    if (searchKeyword){

        switch (searchKeyType){
            case "multi":
                movieDB.multiSearch(searchKeyword,searchResultHTML);
                break;
            case "movie":
                movieDB.movieSearch(searchKeyword,searchResultHTML);
                break;
            case "tv":
                movieDB.tvSearch(searchKeyword,searchResultHTML);

                break;
            case "person":
                movieDB.personSearch(searchKeyword,searchResultHTML);
                break;
            default:
                break;
        }

    }

}
$(document).ready(function () {
    searchOnload();

    $(".wrapper").on("click",function (e) {
        var target=e.target;


        var $item=$(target).parents("div#results .collection.with-header .collection-item.avatar");
        if ($item[0]){
            var info=$item.attr("data-search");
            getWindowLoaction(info);
            return;

        }else if ($(target).parents(".up.btn-floating")[0]){
            $("html,body").animate({
                scrollTop:0
            },1000);
            return;
        }else if (target.nodeName.toLowerCase()==="a" && $(target).hasClass("btn")){
            var info=window.localStorage["searchResult"].split("&");
            var key=info[0],searchType=info[1],page=info[2]+1;
            window.localStorage["searchResult"]=key+"&"+searchType+"&"+page;
            if (page>window.sessionStorage["maxPage"]){
                var $toastContent = $('<span>there is no data</span>');
                Materialize.toast($toastContent, 2000);
                return;
            }

            switch (searchType){
                case "multi":
                    movieDB.multiSearch(key,function () {
                        var data=arguments[0];
                        data=data.results;
                        for (var key in data){
                            var nodeID="#"+key;
                            var parents=$(nodeID);

                            if (data[key].length!==0){
                                var typeData=data[key];
                                for (var i=0;i<typeData.length;i++){
                                    collectionLiHTML(typeData[i],parents);
                                }
                            }

                        }
                    },page);
                    break;

                case "movie":
                    movieDB.movieSearch(key,function () {
                        var data=arguments[0];
                        data=data.results;
                        for (var key in data){
                            var nodeID="#"+key;
                            var parents=$(nodeID);

                            if (data[key].length!==0){
                                var typeData=data[key];
                                for (var i=0;i<typeData.length;i++){
                                    collectionLiHTML(typeData[i],parents);
                                }
                            }

                        }
                    },page);
                    break;
                case "tv":
                    movieDB.tvSearch(key,function () {
                        var data=arguments[0];
                        data=data.results;
                        for (var key in data){
                            var nodeID="#"+key;
                            var parents=$(nodeID);

                            if (data[key].length!==0){
                                var typeData=data[key];
                                for (var i=0;i<typeData.length;i++){
                                    collectionLiHTML(typeData[i],parents);
                                }
                            }

                        }
                    },page);
                    break;

                case "person":
                    movieDB.personSearch(key,function () {
                        var data=arguments[0];
                        data=data.results;
                        for (var key in data){
                            var nodeID="#"+key;
                            var parents=$(nodeID);

                            if (data[key].length!==0){
                                var typeData=data[key];
                                for (var i=0;i<typeData.length;i++){
                                    collectionLiHTML(typeData[i],parents);
                                }
                            }

                        }
                    },page);

                    break;
                default:
                    break;
            }


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