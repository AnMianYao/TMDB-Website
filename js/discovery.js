var sortBy={"Popular descending order":"popularity.asc", "Popular ascending order":"popularity.desc",
    "Release date Descending":"release_date.asc","Release date ascending":"release_date.desc",
    "Title(A-Z)":"original_title.asc","Title(Z-A)":"original_title.desc",
    "Score ascending order":"vote_average.asc","Score descending order":"vote_average.desc"};

var types=[ "Adventure","Fantasy",  "Animation",  "Drama", "Horror", "Action", "Comedy",  "History",  "Western",
    "Thriller",  "Crime", "Documentary", "Science Fiction",  "Mystery",  "Music", "Romance", "Family",  "War",  "TV Movie"];

var  genres= { "Adventure":12 ,"Fantasy":14,  "Animation":16,  "Drama":18,  "Horror":27,  "Action":28,
    "Comedy":35, "History":36,  "Western":37,  "Thriller":53, "Crime" :80,  "Documentary":99,
    "Science Fiction":878,  "Mystery":9648,  "Music":10402,  "Romance":10749,
    "Family":10751,  "War":10752, "TV Movie":10770};

var year=1900;
function discoveryMovie($movieReveal,$movieList) {

    var $movies=$movieReveal.find("ul >li.card");

    $movieList.on("click",function (e) {

        var target =e.target;

        var $li=$(target).parents(".moviesCollection li");
        if($li[0]){

            var index=$li.index();
            var $show=$($movies[index]);
            $show.addClass("scale-in").removeClass("scale-out").siblings().addClass("scale-out").removeClass("scale-in");
            $li.addClass("selected").siblings().removeClass("selected");
            return;

        }
        if($(target).hasClass("btn") &&target.nodeName.toLowerCase()==="a"){
            var $container=$(".container .select-wrapper");

            var year=$("ul li.active.selected span",$($container[0])).text();
            var type=genres[$("ul li.active.selected span",$($container[1])).text()];
            var sortby=sortBy[$("ul li.active.selected span",$($container[2])).text()];

            var option={
                sortBy:sortby,
                year:year,
                type:type
            };

            movieDB.getDiscover(movieReveaAndMovieListslHTML,option);
        }


    });

    $movieReveal.on("click",function (e) {
        var target =e.target;
        if(target.nodeName.toLowerCase()==="i"&& $(target).text()==="chevron_right"){
            var current=$movieReveal.find("li.scale-in");
            var next;
            if(current[0]===$movieReveal.find("li:last-child")[0]){
                next=$movieReveal.find("li:first-child")
            }else {
                next=current.next();
            }
            next.addClass("scale-in").removeClass("scale-out").siblings().addClass("scale-out").removeClass("scale-in");
            $movieList.find(".moviesCollection li").eq(next.index()).addClass("selected").siblings().removeClass("selected");

        }else  if (target.nodeName.toLowerCase()==="i"&& $(target).text()==="chevron_left"){
            var _current=$movieReveal.find("li.scale-in");
            var _next;
            if(_current[0]===$movieReveal.find("li:first-child")[0]){
                _next=$movieReveal.find("li:last-child")
            }else {
                _next=_current.prev();
            }
            _next.addClass("scale-in").removeClass("scale-out").siblings().addClass("scale-out").removeClass("scale-in");
            var index=_next.index();
            $movieList.find(".moviesCollection li").eq(index).addClass("selected").siblings().removeClass("selected");

        }else if (target.nodeName.toLowerCase()==="i"&& $(target).text()==="close" && $(target).hasClass("Close")){
            var show=$(target).parents(".movieReveal");

            var leftDiv=show.next();

            show.animate({
                width:"100%"
            },function () {
                $(target).text("view_headline")
            });
            leftDiv.animate({
                width:"0%",
                opacity:0
            },{ queue: false });
        }else if (target.nodeName.toLowerCase()==="i"&& $(target).text()==="view_headline" && $(target).hasClass("Close")){

            var _show=$(target).parents(".movieReveal");

            var _leftDiv=_show.next();

            _show.animate({
                width:"70%"
            },function () {
                $(target).text("close")
            });
            _leftDiv.animate({
                width:"30%",
                opacity:1
            },{ queue: false });
        }else if ($(target).parents(".card-action")[0]){
            var info=$(target).parents(".card-action").attr("data-search");
            getWindowLoaction(info);

        }
    })


}
function formHTML() {
    var $releaseDate=$("#releaseDate");
    var $movieType=$("#movieType");
    var $sorting=$("#sorting");

    var sortKey=Object.keys(sortBy);
    sortKey.forEach(function (t) {
        var $node=$("<option ></option>");
        $node.attr("value",t);
        $node.text(t);
        $sorting .append($node);
    });

    types.forEach(function (t) {
        var $node=$("<option ></option>");
        $node.attr("value",t);
        $node.text(t);
        $movieType.append($node);
    });

    var now=new  Date();
    now=now.getFullYear();

    while (now>=year){
        var $node=$("<option ></option>");
        $node.attr("value",now);
        $node.text(now);
        $releaseDate.append($node);
        now--;
    }
    $('select').material_select();
}


function movieReveaAndMovieListslHTML() {
    var data=arguments[0];
    if (data.length===0){
        alert("No Data");
        return;
    }
    var $movieReveal=$(".movieReveal");
    var $ul=$("ul",$movieReveal);

    var $movieList=$(".movieList");
    var $moviesCollection=$(".moviesCollection",$movieList);

    $ul.text("");
    $moviesCollection.text("");
    data.forEach(function (t) {
        var $node=$("<li class=\"scale-transition scale-out card sticky-action\"><div class=\"card-image waves-effect waves-block waves-light\"><img class=\"activator\"></div>" +
            "<div class=\"card-content\"><span class=\"card-title activator grey-text text-darken-4\"></span></div>" +
            "<div class=\"card-reveal\"><span class=\"card-title grey-text text-darken-4\"><i class=\"material-icons right\">close</i></span>" +
            "<div class=\"card horizontal\"><div class=\"card-image\"><img></div><div class=\"card-stacked\"><div class=\"card-content\"><h4 class=\"title\"></h4>" +
            "<ul><li><span>score</span><span class=\"score\"></span></li><li><span>Release date</span><span class=\"releaseDate\"></span></li>" +
            "<li><span>type</span><span class=\"type\"></span></li><li><span>overview</span><span class=\"overview \"></span></li></ul></div></div></div></div><div class=\"card-action\"><p><a href=\"#\">" +
            "THIS IS A LINK</a></p></div></li>");

        var $imgBg=$(" div.waves-effect> img.activator",$node);

        var $imgPoster=$(" .card.horizontal .card-image img",$node);

        var $outerTitle=$(".card-content span.card-title",$node);
        var $innerTitle=$(".card-stacked .card-content h4",$node);

        var $score=$(".card-stacked .card-content .score",$node);
        var $releaseDate=$(".card-stacked .card-content .releaseDate",$node);
        var $type=$(".card-stacked .card-content .type",$node);
        var $overview=$(".card-stacked .card-content .overview",$node);


        $imgBg.attr("src",imgUrl(movieDB.common.images.backdrop_sizes[2],t.backdrop));
        $imgPoster.attr("src",imgUrl(movieDB.common.images.poster_sizes[2],t.poster));
        //imgOnload($imgBg,imgUrl(movieDB.common.images.backdrop_sizes[2],t.backdrop),localImgBackdrop);
        // imgOnload($imgPoster,imgUrl(movieDB.common.images.poster_sizes[2],t.poster),localImgPoster);


        $outerTitle.text(t.title);
        $outerTitle.append($("<i class=\"material-icons right\">more_vert</i>"));
        $innerTitle.text(t.title);

        $score.text(t.score);
        $releaseDate.text(t.relatedData);

        $type.text(t.movieType);
        $overview.text(t.overview);

        $(".card-action",$node).attr("data-search",t.id+"&"+t.type);
        $ul.append($node);



        var $li=$("<li class=\"hoverable\"><img ></li>");
        var $img=$("img",$li);
        imgOnload($img,imgUrl(movieDB.common.images.poster_sizes[0],t.poster),localImgPoster);
        $moviesCollection.append($li);
    });

    $( $moviesCollection.children()[0]).addClass("selected");
    $($ul.children()[0]).removeClass("scale-out").addClass("scale-in");

    discoveryMovie($movieReveal,$movieList);
    $(".wrapper .progress").addClass("hide");
}
$(document).ready(function() {

    movieDB.getDiscover(movieReveaAndMovieListslHTML);

    var $movieReveal=$(".movieReveal");

    var $main=$movieReveal.parent();
    var screenHeight=window.innerHeight;
    $main.css({
        height:screenHeight
    });

    formHTML();






});