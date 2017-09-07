var captionStype=["center-align","left-align","right-align"];
function getFavoriteLi(data,index,parent) {
    var $node=$("<li><img ><div class=\"caption\"><h3 class=\"title\"></h3><h5 class=\"type\"></h5></div></li>");

    var $img=$("img",$node);

    imgOnload($img,imgUrl(movieDB.common.images.backdrop_sizes[3],data.backdrop),localImgBackdrop);

    var $div=$("div",$node);
    $div.addClass(captionStype[index%3]);
    var time;
    if (data.type==="movie"){
        time=data.releaseDate?data.releaseDate.substr(0,4):"";
    }else if (data.type==="tv"){
        time=data.firstAirDate?data.firstAirDate.substr(0,4):"";
    }
    $(".title",$node).text(data.title+"("+time+")");
    var key=data.type+"Type";
    $(".type",$node).text(data[key]);
    $node.attr("data-search",data.id+"&"+data.type);
    parent.append($node);
}
function favoriteHTML() {

    var data=arguments[0];
    data=data.results;
    var key=window.localStorage["favorite"];

    data=data[key];


    if (data.length===0){
        var $toastContent = $('<span>there is no data</span>');
        Materialize.toast($toastContent, 2000);
        return;
    }
    var $ul=$(".wrapper .slider ul");
    $ul.text("");
    data.forEach(function (t,index ) {
        getFavoriteLi(t,index,$ul);
    });

    $('.slider').slider();
    $(".wrapper .progress").addClass("hide");
}
$(document).ready(function () {

    var type= window.localStorage.getItem("favorite");


    switch (type){
        case "movie":

            movieDB.getMyFavoriteMovie(window.localStorage["loginID"],favoriteHTML);
            break;
        case "tv":

            movieDB.getMyFavoriteTV(window.localStorage["loginID"],favoriteHTML);
            break;
        default:

            break;
    }

    $(".wrapper ").on("click",function (e) {
        var target=e.target;

        var $li=$(target).parents("ul.slides >li");
        if($li[0]){
            var info=$li.attr("data-search");
            getWindowLoaction(info);
        }
    })
});