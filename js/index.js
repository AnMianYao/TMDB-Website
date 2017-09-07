var timer;
var current;
function img_url(option,url) {
    if(!url){
        return "../films_search/imgs/self1.jpg";
    }
    return   movieDB.common.images_uri+option+url;
};

/**
 * 图片加载
 * @param node
 * @param src
 * @param localSrc
 */
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

/**
 * 图片轮播
 */
function silde(node,speed) {
    var timer;
    var $this=$(node);
    var $group=$this.find(".silde_group");
    var $sildes=$this.find(".silde");
    var $currentIndexContanier=$this.find(".currentIndex");
    var $pageNumContainer=$this.find(".pageNum");




    $currentIndexContanier.text(1);
    $pageNumContainer.text($sildes.length);

    var list=null;
    list=new DoubleLinkedList();

    $sildes.each(function (index,node) {
        list.insert(index,node);
    });

    current=list.getHead();


    function DoubleLinkedList(){
        var Node=function (element) {
            this.element=element;
            this.next=null;
            this.prev=null;
            this.index=0;
        };

        var length=0;
        var head=null;
        var tail=null;


        this.insert=function (position,element) {


            if (position>=0 && position<=length ){
                var node=new Node(element);
                node.index=position;
                var current=head;
                var prev,index=0;

                if (position===0){
                    if (!head){
                        head=node;
                        tail=node;
                        tail.next=head;
                        head.prev=tail;
                    }else {
                        node.next=current;
                        current.prev=node;
                        head=node;
                        node.prev=tail;
                    }
                } else  if (position===length){
                    current=tail;
                    current.next=node;
                    node.prev=current;
                    tail=node;
                    tail.next=head;
                    head.prev=tail;
                }else {

                    while (index++ <position){
                        prev=current;
                        current=current.next;
                    }
                    node.next=current;
                    node.prev=prev;

                    prev.next=node;
                    current.prev=node;
                }
                length++;
                return true;
            }else {
                return false;
            }
        };

        this.removeAt=function (postion) {
            if (postion>-1 && postion<length){
                var current=head;
                var prev,index=0;

                if (postion===0){
                    head=current.next;

                    current.next.prev=tail;
                    head=current.next;
                }else if (postion===length-1){
                    current=tail;

                    current.prev.next=head;
                    head.prev=current.prev;
                    tail=current.prev;
                }else {
                    while (index++ <postion){
                        prev=current;
                        current=current.next;
                    }
                    prev.next=current.next;
                    current.next.prev=prev;
                }
                length--;
                return true;
            }else {
                return false;
            }
        };

        this.indexOf=function (element) {
            var current=head,index=0;

            while (current){
                if (element===current.element){
                    return index;
                }
                index++;
                current=current.next;
            }
        };

        this.remove=function (element) {
            var index=this.indexOf(element);
            return this.removeAt(index);
        };

        this.getHead=function () {
            return head;
        };

        this.getSize=function () {
            return length;
        }
    }
    function advance() {
        clearTimeout(timer);
        timer=setTimeout(function () {
            move(current.next);
        },speed);
    }
    function move(newNode) {
        var animationLeft,sildeLeft;
        advance();
        if ($group.is(":animated")|| current===newNode){
            return false;
        }

        if (current.next===newNode){
            sildeLeft="100%";
            animationLeft="-100%";
        }
        if (current.prev===newNode){
            sildeLeft="-100%";
            animationLeft="100%";
        }
        $(newNode.element).css({
            left:sildeLeft,
            display:"block"
        });

        $group.animate({
            left:animationLeft
        },1000,function () {
            $(current.element).css({display:"none"});
            $(newNode.element).css({left:"0%"});
            $group.css({left:"0%"});
            $currentIndexContanier.text((newNode.index)+1);
            current=newNode;
        });
    }
    function left() {
        var newNode=window.current.prev;
        move(newNode);
    }
    function right() {
        var newNode=window.current.next;
        move(newNode);
    }

    $this.find(".left").on("click",left);

    $this.find(".right").on("click",right);
    advance();
}
function html_silde_view(view,info,parent,option,img_path,_height) {

    var html_silde=function (data,parent) {
        var node=$("<div class=\"silde\"><img ><div><h5 class=\"title\"></h5>" +
            "<div><span class=\"score\"></span><i class=\"fa fa-star\"></i></div></div></div>");

        node.attr("data-movieID",data.id);

        var $img=node.find("img");
        imgOnload($img,img_url(option,data[img_path]),"file:///D:/www/films_search/imgs/self2.jpg");
       // $img.attr("src",img_url(option,data[img_path]));
        var $title=node.find(".title");
        $title.text(data.original_title);
        var $score= node.find(".score");
        $score.text(data.vote_average);
        parent.append(node);

    }

    var fill_silde=function () {
        parent.text("");
        for (var i=0,len=info.length;i<len;i++){
            var item =info[i];
          html_silde(item,parent);
        }

        view.css({
            height:_height
        })

    };
    fill_silde();
    silde(view,5000);
}

function html_film(data) {
    var $film=$("#film");


    /**
     * header
     */
    var $header=$film.find("header")
    $header.find(".title").text(data.detail.original_title);
    $header.find(".score").text(data.detail.vote_average);

    /**
     * brief_introduction
     */
    var $brief_introduction=$film.find("#brief_introduction");
    imgOnload($brief_introduction.find(".detail img"),img_url(movieDB.common.images.backdrop_sizes[2],data.detail.poster_path),"file:///D:/www/films_search/imgs/self2.jpg")
   // $brief_introduction.find(".detail img").attr("src",img_url(movieDB.common.images.backdrop_sizes[2],data.detail.poster_path));
    $brief_introduction.find(".detail p").text(data.detail.overview);
    var lists=$brief_introduction.find(".detail ul");


    var genres=data.detail.genres;

    function getlist(array,key) {
        var lists=[];
        for(var i=0,len=array.length;i<len;i++){
            lists.push(array[i][key]);
        }
        return lists.join(",")
    }
    var production_countries=data.detail.production_countries;


    lists.find(".classification").text(getlist(genres,"name"));
    lists.find(".origin").text(getlist(production_countries,"name"));
    lists.find(".release_date").text(data.detail.release_date);

    /**
     * director_actors
     */
    var $director_actors=$film.find('#director_actors');

    var $lists_director_actor_ul= $director_actors.find(".list_people");
    $lists_director_actor_ul.text("");

    var lists_person_info=data.credits.splice(0,12);


    var html_person =function (data) {
        var node=$("<div class=\"participants\"><div class=\"img_hover\"><img></div>" +
            "<h5 class='name'></h5><p class='character'></p></div>");

        node.attr("data-personID",data.id);

        var $img=node.find("img");
        imgOnload($img,img_url(movieDB.common.images.profile_sizes[2],data.profile_path),"file:///D:/www/films_search/imgs/self2.jpg")
       // $img.attr("src",img_url(movieDB.common.images.profile_sizes[2],data.profile_path));

        var $name=node.find(".name");
        $name.text(data.name);

        var $character=node.find(".character");
        $character.text(data.character);

        return node;
    };

    var people_ul=function (index,ul,data) {
        var length=data.length;

        if (length==0){
            ul.html("<p>Sorry,there is no data!<p>");
            return false
        }
        for(var i=0;i<length;i++){
            var item=data[i];
            var div=html_person(item);
            var $li;

            if (i%index===0){
                $li=$("<li></li>");
                ul.append($li);

            }else {
                $li=ul.children().last();
            }
            $li.append(div);
        }
    };
    people_ul(3,$lists_director_actor_ul,lists_person_info);


    /***
     * recommendations
     */
    var recommendations_info=data.recommendations;
    var $node_recommendations=$("#recommendations");

    if (recommendations_info.length===0){
        $node_recommendations.html("<h3 class=\"link_name\">recommendations</h3><p>Sorry ,there is no recommendations!</p>");
        return false
    }


    var $silde_group=$node_recommendations.find(".silde_group");
    var $silde_view=$node_recommendations.find(".silde_view");
    clearTimeout(timer)
    current=null;
    html_silde_view($silde_view,recommendations_info,$silde_group,movieDB.common.images.backdrop_sizes[3],"backdrop_path",600)






}

function html_home_section_movie(data,div) {
    var node=$("<div class=\"movie\"><img ><div><div><div><marquee class=\"title\"></marquee><div><span class=\"score\"></span> <i class=\"fa fa-star\"></i></div>" +
        "</div><div><div><i class=\"fa fa-calendar\"></i><span class=\"time\"></span> </div><p class=\"type\"></p></div></div><p class=\"overview\"></p></div></div>");
    var imgUrl=img_url(movieDB.common.images.poster_sizes[2],data.poster_path);
    var title=data.original_title;
    if (title.length<20){
        node.find(".title").replaceWith($("<h4 class=\"title\"></h4>"))
    }
    var date=data.release_date;
    var score =data.vote_average;
    var type=data.genre_ids;
    var overview =data.overview;

    var types=movieDB.getType(type).join(",");

    var img=node.find("img");
    imgOnload(img,imgUrl,"file:///D:/www/films_search/imgs/self2.jpg");
    node.find(".title").text(title);
    node.find(".time").text(date);
    node.find(".score").text(score);
    node.find(".type").text(types);
    node.find(".overview").text(overview);
    node.attr("data-movieID",data.id);
    div.append(node);
    return node;
}

function home_discovery() {
    var data=arguments[0];
    var div=$("#movie_container");
    div.text("");
    for (var i=0,len=data.length;i<len;i++){
        html_home_section_movie(data[i],div);
    }

}

function text_no_(text) {
    return text.replace(/_/g," ")
}
function carrousel($node,width,height,tranzlateZ) {
    var width=width||300;
    var height=height||200;
    var tranzlateZ=tranzlateZ||300
    $node.css({
        width:width,
        height:height,
        left:width
    });
    $node.parent().css({
        height:1.2*height
    })

    var transform = function (element, value, key) {
        key = key || "Transform";
        ["Moz", "O", "Ms", "Webkit", ""].forEach(function (prefix)
        {
            element.style[prefix + key] = value;
        });

        return element;
    };
    var $list_li=$node.find("li");
    var length=$list_li.length;
    $list_li.each(function (index,item) {

        var deg=index*360/length;
        var vaule="rotateY("+deg+"deg) translateZ("+tranzlateZ+"px)";
        transform(item,vaule);
    })
}
function html_person(section,data) {
    var $header=section.find("#name");
    var $intro=section.find("#intro");
    var $personal_info=section.find("#personal_info");
    var $latest_works=section.find("#latest_works");
    var $know_for=section.find("#known_for");
    var $all_works=section.find("#all_works");

    var bg_div=[$intro,$personal_info,$latest_works];
    var bg_imges=data.images
    var fill_bg=function () {
      for (var i=0,len=bg_div.length;i<len;i++){
          var url=img_url(movieDB.common.images.backdrop_sizes[3],data.movies[i].backdrop_path);
          bg_div[i].css({
              background: "url("+url+") no-repeat fixed",
              backgroundSize: "cover"
          })
      }
    }();
    /**
     * header
     */
    $header.find("h1").text(data.base.name);

    /**
     * intro
     */
    $intro.find("h1").text(data.base.name);
    $intro.find("p").text(data.base.biography);

    /**
     * Personal infro
     */
    var $dl=$personal_info.find("dl");

    var html_dl=(function (dl,info) {
        dl.text("");
        var gender=[null,"female","male"]
        var keys=["name","gender","birthday","place_of_birth","homepage","also_known_as"];
        for (var i=0,len=keys.length;i<len;i++){
            if (!info[keys[i]] ||info[keys[i]].length==0){
                continue;
            }
            var $dt=$("<dt></dt>");
            $dt.text(text_no_(keys[i]));

            var $dd=$("<dd></dd>");
            if (keys[i]=="gender"){
                $dd.text(gender[info[keys[i]]]);
            }else {
                $dd.text(info[keys[i]])
            }
            dl.append($dt);
            dl.append($dd);
        }
    })($dl,data.base);

    /**
     *latest_works
     */
    var movies=data.movies;
    movies=movies.sort(function (item1,item2) {
        return item1.release_date-item2.release_date>0?-1:1
    });

    var $ul=$latest_works.find(".carrousel");

    function carrousel_li(data) {
        var $li=$("<li><img><span class='title'></span> </li>");
        var imgUrl=img_url(movieDB.common.images.poster_sizes[3],data.poster_path);
        imgOnload($li.find("img"),imgUrl,"file:///D:/www/films_search/imgs/self1.jpg");



        $li.find(".title").text(data.title);
        $li.attr("data-movieID",data.id);
        $ul.append($li);
    }

    (function () {
        $ul.text("");
        for (var i=0;i<6;i++){
            carrousel_li(movies[i]);
        }
        carrousel($ul,100,200,120);
    })()



    /**
     *known_for
     */

    var html_item=function (data,parent) {
        var node=$("<div class=\"item_work \"><div class=\"img_hover\"><img ></div><p></p></div>");
        var $img=node.find("img");
        var $p=node.find("p");

        imgOnload($img,img_url(movieDB.common.images.poster_sizes[3],data.poster_path),"file:///D:/www/films_search/imgs/self2.jpg");
       // $img.attr("src",img_url(movieDB.common.images.poster_sizes[3],data.poster_path));
        $p.text(data.original_title);
        node.attr("data-movieID",data.id);

        parent.append(node);
    };

    var know_for_movies=data.movies;
    know_for_movies.sort(function (item1,item2) {
        return item1.popularity-item2.popularity>0?-1:1;
    });
    know_for_movies=know_for_movies.splice(0,6);
    var $works=$know_for.find(".works");
    (function () {
       for (var i=0,len=know_for_movies.length;i<len;i++){
           var item=know_for_movies[i];
           html_item(item,$works);
       }
    })();

    /**
     * all_work
     */
    var movies_sortByTime=function (data) {
        var movie_time={};
        for (var i=0,len=data.length;i<len;i++){
            var item=data[i];
            var time=item["release_date"];
            if (time){
                time=time.substring(0,4);
                var title=item.original_title;
                var id=item.id;

                if (!movie_time[time]){
                    movie_time[time]=[];
                }
                movie_time[time].push({title:title,id:id})
            }
        }

        return movie_time;
    };
    movies_time_info=movies_sortByTime(data.movies);


    var $all_works_ul=$all_works.find("ul");

    var keys=Object.keys(movies_time_info);
    keys.sort(function (item1,item2) {
        return item1-item2>0?-1:1;
    });
    var item_work_li=function (data,key,parent ) {
        var node=$(" <li><div class=\"time\"></div><div class=\"items\"></div></li>");
        var $time=node.find(".time");
        $time.text(key);

        var $items=node.find(".items");
        var works_array =data[key];

        for (var i=0,len=data[key].length;i<len;i++){
            var $p=$("<p></p>");

            var item=data[key][i];
            $p.attr("data-movieID",item.id);
            $p.text(item.title);
            $items.append($p);
        }
        parent.append(node);

    };

    (function () {
        $all_works_ul.text("");
        for (var i=0,len=keys.length;i<len;i++){
            var item =keys[i]
            item_work_li(movies_time_info,item,$all_works_ul,$works);


        }
    })()



}
function addHints(data) {

    var type=data.media_type;
    var img;
    var name;
    var date;

    if (type==="movie"){
        img=img_url(movieDB.common.images.poster_sizes[0],data.poster_path)
        name=data.original_title;
        date=data.release_date;
    }else if (type==="person"){
        img=img_url(movieDB.common.images.profile_sizes[0],data.profile_path);
        name=data.name;
        var info=data.known_for;
        var knowFor=[];
        var length=info.length>=3?3:info.length;
        for (var i=0;i<length;i++){

            if (info[i].media_type==="movie"){
                knowFor.push(info[i].original_title);
            }
        }
        date=knowFor.join(",");
    }else {
        return false;
    }

    var node=$("<li ><div><img ><div><h4 class=\"name\"></h4><p class=\"date\"></p></div></div><div class=\"type\"></div></li>");
    node.attr("data-search",data.id+"&"+type)
    imgOnload( node.find("img"),img,"file:///D:/www/films_search/imgs/self2.jpg");
    //node.find("img")[0].src=img;
    node.find(".name").text(name);
    node.find(".date").text(date);
    node.find(".type").text(type);

    return node;
}

function search_results_li(data) {

    var type=data.media_type;
    var img;
    var name;
    var date;
    var node;
    var p;
    if (type==="movie"){
        img=img_url(movieDB.common.images.poster_sizes[4],data.poster_path)
        name=data.original_title;
        date=data.release_date;

        node=$("<li><img ><div><div><div><h4 class=\"name\">/h4><div><i class=\"fa fa-calendar-times-o\"></i><span class=\"time\"></span> </div>\n" +
            "</div><div><div class=\"score \">8.7</div><div class=\"classification \"></div></div></div><p class=\"description\"></p></div></li>");

        node.find(".time").text(date);
        node.find(".classification").text(type);
        p=data.overview;

    }else if (type==="person"){

        img=img_url(movieDB.common.images.profile_sizes[3],data.profile_path);
        name=data.name;
        var info=data.known_for;
        var knowFor=[];
        for (var i=0;i<info.length;i++){

            if (info[i].media_type==="movie"){
                knowFor.push(info[i].original_title);
            }
        }
        p=knowFor.join(",");

        node=$("<li><img ><div><div><div><h4 class=\"name\"></h4></div></div><p class=\"description\"></p></div></li>");


    }else {
        return false;
    }

    node.find(".description").text(p)
    node.attr("data-search",data.id+"&"+type);
    imgOnload( node.find("img"),img,"file:///D:/www/films_search/imgs/self2.jpg");
   // node.find("img")[0].src=img;
    node.find(".name").text(name);


    return node;
}


function hints_show(ul,keyword,html) {
    ul.text("");
    movieDB.getID(keyword,function () {
        var resource =Array.prototype.slice.call(arguments)[0];
        if(resource.length!==0){
            for (var i=0,len=resource.length;i<len;i++){
                var li=html(resource[i]);
                ul.append(li);
            }
        }

    });
}

function search_movie(id) {
    $("body,html").scrollTop(0);
    $("#film").find(".search_suggestion").addClass("hide");
    $("#timg").removeClass("hide");
    movieDB.getMovieInfo(id,function () {
        $("#timg").addClass("hide")
        var data=arguments[0];
        bg_url=img_url(movieDB.common.images.backdrop_sizes[2],data.detail.backdrop_path)
        $("#timg").addClass("hide")
        var $film_section= $("#film");
        $film_section.removeClass("hide").siblings().addClass("hide");
        $film_section.css({
            background: "url("+bg_url+") no-repeat fixed",
            backgroundSize: "cover"
        })
        html_film(data);
        $film_section.filmSectionAnimate();
    });
}

function search_person(id) {
    $("body,html").scrollTop(0);
    $("#timg").removeClass("hide")
    $("#character").find(".search_suggestion ").addClass("hide");
    movieDB.getPeopleInfo(id,function () {

        var info=arguments[0];
        $("#timg").addClass("hide")
        var $person_section=$("#character");
        $person_section.removeClass("hide").siblings().addClass("hide");
        html_person($person_section,info);
       _character();

    })
}
function search(target) {
    var data_search=target.attr("data-search");
    var id=data_search.split("&")[0];
    var type=data_search.split("&")[1];

    target.closest("section").addClass("hide");
    /**
     * trigger search section show;
     */

    if (type==="movie"){
       search_movie(id)
    }else  if (type==="person"){
        search_person(id)
    }
}


(function ($) {
    /**
     * show search suggestion
     */

    $.fn.search=function () {



        $(".search ").each(function () {
            var $this=$(this);
            var $input=$this.find("input");
            var $i=$this.find("i");
            var $search_suggestion=$this.find(".search_suggestion");

            /**
             *搜索框得到焦点 输入触发提示框
             */
            $input.on("input keyup keydown",function (e) {

               $search_suggestion.removeClass("hide");
                var $ul=$search_suggestion.find("ul");

                var eventType=e.type.toLowerCase();

                /**
                 * 上下键盘触发 提示框选择背景变化
                 */
                var  current=(!$ul.find("li.selected")[0])? $ul.find("li:first-child"):$ul.find("li.selected");

                if(e.keyCode===40){
                    if(eventType=="keydown"){
                        var next;
                        var keyword;
                        if(!$ul.find("li.selected")[0]){
                            next=$ul.find("li:first-child");

                        }else {
                            if(current[0]===current.parent().find("li:last-child")[0]){
                                next=current.parent().find("li:first-child");
                            }else {
                                next=current.next();
                            }


                        }
                        keyword=next.find(".name").text();
                        $(this).val(keyword);
                        next.addClass("selected").siblings().removeClass("selected");
                        var scrollTop=next[0].offsetTop-$search_suggestion.offset().top;
                        $ul.animate({
                            scrollTop: scrollTop
                        }, 500);

                    }

                }else if(e.keyCode===38){
                   if(eventType=="keydown"){
                       var next;
                       if(current[0]===current.parent().find("li:first-child")[0]){
                           next= current.parent().find("li:last-child");

                       }else {
                           next=current.prev();
                       }
                       keyword=next.find(".name").text();
                       $(this).val(keyword);
                       next.addClass("selected").siblings().removeClass("selected");
                       var scrollTop=next[0].offsetTop-$search_suggestion.offset().top;
                       $ul.animate({
                           scrollTop: scrollTop
                       }, 500);
                   }

                }else if(e.keyCode==13){
                    e.preventDefault();
                    var $li = $search_suggestion.find("li.selected");
                    if (!$li[0]) {
                       var $search_results_section =$("#search_results");
                       $(this).parents("section").addClass("hide");
                       $search_results_section.removeClass("hide");
                       var $ul=$search_results_section.find("ul");
                        var keyword=$(this).val();
                        if (keyword){
                            hints_show($ul,keyword,search_results_li);
                        }
                        $(this).parents("section").find(".search ul").addClass("hide");
                    }else {
                        search($li);
                    }

                }else {
                    var keyword=$(this).val();
                    if (keyword){
                        hints_show($ul,keyword,addHints);
                    }

                }
            });





            /**
             * 提示框选项点击后，提示框消失，触发查询
             */
            $search_suggestion.on("click",function (e){
                var target=$(e.target).closest("li");
                search($(target));

            });

            /***
             * 搜索符点击，触发查询
             */
            $i.on('click',function (e) {
                var keyword=$input.val();
                /**
                 * trigger search section show;
                 */

                var $search_results_section =$("#search_results");
                $(this).parents("section").addClass("hide");
                $search_results_section.removeClass("hide");
                var $ul=$search_results_section.find("ul");
                if (keyword){
                    hints_show($ul,keyword,search_results_li);
                }
                $(this).parents("section").find(".search ul").addClass("hide");
            });
            /***
             * 鼠标滑提示框，选择像背景变化
             */
            $search_suggestion.on("mouseover ",function (e) {
                var targe =e.target;
                if (targe.nodeName.toUpperCase()==="LI"){
                    $(targe).addClass("selected ").siblings().removeClass("selected ");
                }

            });

            /**
             * 点击搜索form意外元素，提示框消失；
             */
            $("html").on("click",function (e) {
                var targe =e.target;
               if(targe!==$search_suggestion[0] && targe!==$input[0]){
                  $search_suggestion.addClass("hide");

               }
            })
        });

        $("#search_results").on("click",function (e) {
            var $target=$(e.target);

            var $li=$target.parents("li");

            if ($li[0]){
                var info=$li.attr("data-search");
                var id=info.split("&")[0];
                var type=info.split("&")[1];

                if(type==="movie"){
                    search_movie(id);
                }else if(type==="person"){
                    search_person(id);
                }
            }
        })
    }
})(jQuery);
$("body").search();


/**
 * Film sextion animation
 */
(function ($) {
    $.fn.filmSectionAnimate=function () {
        var $header=$("#film header");
        var $header_i=$("#film header i");
        var $nav=$("#film .film_content > nav");

        var screen_height=window.innerHeight;
        var nav_height=$nav.height();

        /**
         * 初始位置设置
         */
        $header.css({
            paddingTop:100
        });
        $nav.parent().css({
            paddingTop:screen_height-$header.outerHeight()-nav_height
        });

        /**
         * 滚动事件 与header元素显示
         */
        $(window).on("scroll",function () {
            var scrollTop=$(window).scrollTop();

            if(0<scrollTop && scrollTop <200){
                $header.removeClass("is_scroll");
            }else  if (scrollTop>300){
                $header.addClass("is_scroll");
            }
        });

        /**
         * 导航栏点击事件
         */
        $nav.on("click",function (e) {
            var $currentLi=$(e.target).parent();
            $currentLi.addClass("selected").siblings().removeClass("selected");
        });
        /**
         * header 中I元素点击事件
         */
        $header_i.on("click",function () {
            var $this=$(this);
            $header.addClass("is_scroll");
            $("html,body").animate({
                scrollTop:500
            },500)
        })




        $("#film").on("click",function (e) {
            var $target =$(e.target);

            /**
             * button more information
             */
            if($target.parents("#film .film_content_part")[0] &&$target[0].nodeName.toLowerCase()==="button"){
                if ($target.text()==="More Information"){
                    $target.text("Hide Information");
                    $target.next().removeClass("hide");
                }else if($target.text()==="Hide Information"){
                    $target.text('More Information');
                    $target.next().addClass("hide");
                }

            }

            /**
             * person click
             */

            var person_div=$target.parents(".participants");
            var movie_div=$target.parents(".silde");

            if(person_div[0] ){
                var person_id=person_div.attr("data-personID");
                $target.parents("section").addClass("hide");
                search_person(person_id);
            }

            /**
             * movie  click
             */


            if (movie_div[0] ){
                $target.parents("section").addClass("hide");
                var movie_id=movie_div.attr("data-movieID");
                search_movie(movie_id);
            }
        })
    }


})(jQuery)

/**
 * character section
 */
function _character() {
    var $character_p=$("#character div#intro p");
    var $section_intro=$("#intro");
    var $section_personal_info=$("#personal_info");
    var $section_latest_works=$("#latest_works");
    var $section_known_for=$("#known_for");
    var $section_all_works=$("#all_works");




    $(window).on("scroll",function () {

        var sectionScrollTop={
            section_intro:window.innerHeight/3,
            section_personal_info:innerHeight,
            section_latest_works:$section_latest_works.offset().top-50,
            section_known_for:$section_known_for.offset().top-50,
            section_all_works:$section_all_works.offset().top-50,
        };

        var scrollTop=$(window).scrollTop();
        var $section_intro_div=$($section_intro.children()[0]);
        var $section_personal_info_div=$section_personal_info.find("div.right");
        var $section_latest_works_div=$section_latest_works.find("div.left");
        var $section_known_for_div=$section_known_for.find("div.item_work");
        var $section_all_works_ul=$section_all_works.find("ul");

        var section_all_works_ul_height=$section_all_works_ul.height();


        if (0<scrollTop && scrollTop<sectionScrollTop.section_intro){

            $section_intro_div.removeClass("intro_animate");
            $section_personal_info_div.removeClass("personal_info_animate");
            $section_latest_works_div.removeClass("latest_works_animate");
            $section_known_for_div.each(function (index,item) {
                $(item).removeClass("item_work_animate");
            });

            $section_all_works_ul.removeClass("all_works_animate");
            $section_all_works_ul.css({
                bottom:-section_all_works_ul_height*1.2
            });
        }else if (scrollTop>sectionScrollTop.section_intro && scrollTop<$section_intro_div.outerHeight()){
            $section_intro_div.addClass("intro_animate");


        }else if (scrollTop>sectionScrollTop.section_personal_info && scrollTop<sectionScrollTop.section_latest_works){

            $section_intro_div.addClass("intro_animate");
            $section_personal_info_div.addClass("personal_info_animate");

            $section_latest_works_div.removeClass("latest_works_animate");
            $section_known_for_div.each(function (index,item) {

                $(item).removeClass("item_work_animate");
            });

            $section_all_works_ul.removeClass("all_works_animate");
            $section_all_works_ul.css({
                bottom:-section_all_works_ul_height*1.2
            });
        }else if (scrollTop<sectionScrollTop.section_known_for && scrollTop>=sectionScrollTop.section_latest_works){

            $section_intro_div.removeClass("intro_animate");
            $section_personal_info_div.removeClass("personal_info_animate");
            $section_latest_works_div.addClass("latest_works_animate");
            $section_known_for_div.each(function (index,item) {

                $(item).removeClass("item_work_animate");
            });

            $section_all_works_ul.removeClass("all_works_animate");
            $section_all_works_ul.css({
                bottom:-section_all_works_ul_height*1.2
            });

        }else if (scrollTop>=sectionScrollTop.section_known_for &&scrollTop<sectionScrollTop.section_all_works ){

            $section_intro_div.removeClass("intro_animate");
            $section_personal_info_div.removeClass("personal_info_animate");
            $section_latest_works_div.removeClass("latest_works_animate");
            $section_known_for_div.each(function (index,item) {
                $(item).addClass("item_work_animate");
            });
            $section_all_works_ul.css({
                bottom:-section_all_works_ul_height*1.2
            });

        }else if (scrollTop>=sectionScrollTop.section_all_works){

            $section_intro_div.removeClass("intro_animate");
            $section_personal_info_div.removeClass("personal_info_animate");
            $section_latest_works_div.removeClass("latest_works_animate");
            $section_known_for_div.each(function (index,item) {
                $(item).removeClass("item_work_animate");
            });


            $section_all_works_ul.stop().animate({
                bottom:0
            },1000);

        }
    });
    function show_moreText(element){

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
            bottom:0
        });

        $btn.on("click",function (e) {
            if($btn.text()==="...read more"){
                $newBox.text(content);
                $newBox.css({
                    overflowY:"scroll",
                    height:200,
                });
                $btn.text("...closed");
                $btn.css({
                    right:"1em",
                    bottom:"-2em"
                })
            }else if ($btn.text()==="...closed"){
                $newBox.text(content.substring(0,500));
                $btn.text("...read more");
                $newBox.css({
                    overflowY:"hidden"
                });
                $btn.css({
                    right:0,
                    bottom:0
                })
            }
        })
        element.text("");
        element.append($newBox);
        element.append($btn);
    }
    show_moreText($character_p);


    $("#character").on("click",function (e) {
        var $target =$(e.target);

        var movie_id;
        /**
         * Latest Works
         */

        var $li=$target.parents("li");
        var itemWork_div=$target.parents(".item_work");
        var $p=$target;



        if($li[0] &&$li.parents(".carrousel")[0]){
            movie_id=$li.attr("data-movieID");
            $target.parents("section").addClass("hide");
            search_movie(movie_id);

        }
        if(itemWork_div[0]){
            /**
             * Known For
             */
            movie_id=itemWork_div.attr("data-movieID");
            $target.parents("section").addClass("hide");
            search_movie(movie_id);

        }

        /**
         * All Works
         */

        if ($target.parents(".items")[0]){
            movie_id=$p.attr("data-movieID");
            $target.parents("section").addClass("hide");
            search_movie(movie_id);
        }


    });
}




/**
 * home section
 */

$(document).ready(function() {
    var $form=$("#select");

    var $select_Time=$("#time",$form);

    var time=new Date();
    var index=time.getFullYear();

    while (index>=1900){
        var option=$("<option></option>");
        option.text(index);
        $select_Time.append(option)
        index--;
    }

    var hot={"Popular descending order":"popularity.asc", "Popular ascending order":"popularity.desc",
        "Release date Descending":"release_date.asc","Release date ascending":"release_date.desc",
        "Title(A-Z)":"original_title.asc","Title(Z-A)":"original_title.desc",
        "Score ascending order":"vote_average.asc","Score descending order":"vote_average.desc"};

    var $select_Hot=$("#hot",$form);
    var hot_keys=Object.keys(hot);
    for (var i=0,len= hot_keys.length;i<len;i++){
        var option_hot=$("<option></option>");
        option_hot.text(hot_keys[i]);
        $select_Hot.append(option_hot);
    }

    var types=[ "Adventure","Fantasy",  "Animation",  "Drama", "Horror", "Action", "Comedy",  "History",  "Western",
        "Thriller",  "Crime", "Documentary", "Science Fiction",  "Mystery",  "Music", "Romance", "Family",  "War",  "TV Movie"];
    movieDB.disvover(home_discovery);

    var $select_Type=$("#type",$form);
    for (var j=0,_len=types.length;j<_len;j++){
        var option_type=$('<option></option>');
        option_type.text(types[j]);
        $select_Type.append(option_type);
    }

    var $movie_container=$("#movie_container");
    $movie_container.on("click",function (e) {
        var target=e.target;
        var $click_item=$(target).parents(".movie");

        if(!$click_item[0]){
            return false;
        }
        var movie_id=$click_item.attr("data-movieID");
        if(movie_id){
            $(target).parents("section").addClass("hide");
            search_movie(movie_id);
        }
    });
    $movie_container.mouseover(function (e) {
        var $target=$(e.target);
        var $movie_div=$target.parents(".movie");
        var _height=$movie_div.height();
        if ($movie_div[0]){
            var $p=$movie_div.find("p.overview");
            var top=$p[0].offsetTop;
            var left=$p[0].offsetLeft;
            var node=$("<div></div>");
            node.attr("class","hover_detail")
            node.css({
                position:"absolute",
                left:left,
                top:top,
                height:_height-top-16,
                background:"#fff",
                display:"none",
                textAlign: "justify",
                fontSize: "0.9em",
                fontWeight: "bolder",
                overflowY: "scroll"
            });
            var text=$p.text();
            node.text(text);
            $p.parent().append(node);
            node.fadeIn(500);
        }
    }).mouseout(function (e) {
        var $target=$(e.target);
        var $movie_div=$target.parents(".movie");
        if ($movie_div[0]){
            var $p=$movie_div.find(".hover_detail");
            $p.fadeOut(500,function () {
                $(this).remove();
            })
        }
    })



    $form.find("select").each(function () {


        var $this=$(this);

        $this.on("change",function (e) {

            var arguments={
                hot:hot[$("option:selected",$select_Hot).val()],
                time:$("option:selected",$select_Time).val(),
                type:$("option:selected",$select_Type).val()
            };

            var key=this.id;
            var $option=$("option:selected",this);
            var value=$option.val();

            if(key==="hot"){
                arguments[key]=hot[value];
            }else {
                arguments[key]=value;
            }


            if (!type && !value){
                return false;
            };

            movieDB.disvover.apply(movieDB,[home_discovery,arguments])

        })
    })
});


