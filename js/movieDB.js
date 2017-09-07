var movieDB={};
var gender={
    1:"female",
    2:"man"
};
var sortBy={"Popular descending order":"popularity.asc", "Popular ascending order":"popularity.desc",
    "Release date Descending":"release_date.asc","Release date ascending":"release_date.desc",
    "Title(A-Z)":"original_title.asc","Title(Z-A)":"original_title.desc",
    "Score ascending order":"vote_average.asc","Score descending order":"vote_average.desc"};

movieDB.common={
    api_key: "dcc18672beb28dd5960858c5c3e3b174",
    base_uri: "https://api.themoviedb.org/3/",
    images_uri: "https://image.tmdb.org/t/p/",
    images:{
        backdrop_sizes: ["w300", "w780", "w1280", "original"],
        poster_sizes: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
        profile_sizes: ["w45", "w185", "h632", "original"]
    },
    genres: {12: "Adventure", 14: "Fantasy", 16: "Animation", 18: "Drama", 27: "Horror", 28: "Action",
        35: "Comedy", 36: "History", 37: "Western", 53: "Thriller", 80: "Crime", 99: "Documentary",
        878: "Science Fiction", 9648: "Mystery", 10402: "Music", 10749: "Romance",
        10751: "Family", 10752: "War", 10770: "TV Movie"}
};

movieDB.multiSearch=function (keyword,callback,page,language) {
    var language=language||"en-US"||"zh-CN";
    var page=page||1;
    var url=movieDB.common.base_uri+"search/multi?api_key="+movieDB.common.api_key+"&language="+language+"&query="+keyword+"&page="+page+"&include_adult=false";
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        data:{},

        dataFilter:function (data) {
            var Data=JSON.parse(data)
            var data=Data["results"];

            var person=[];
            var movie=[];
            var tv=[];

            for(var i=0;i<data.length;i++){
                var type=data[i]["media_type"];

                switch (type){
                    case "movie":

                        movie.push({
                            id:data[i].id,
                            title:data[i]["title"],
                            type:type,
                            originalTitle:data[i]["original_title"],
                            movieType:getType(data[i]['genre_ids']),
                            backdrop:data[i]["backdrop_path"],
                            poster:data[i]["poster_path"],
                            releaseDate:data[i]["release_date"],
                            score:data[i]["vote_average"],
                            originalLanguage:data[i]["original_language"],
                            overview:data[i]["overview"]
                        });
                        break;
                    case "person":

                        var know=data[i]["known_for"];
                        var knowFor=[];
                        if (know){
                            know.forEach(function (item) {
                                knowFor.push({
                                    title:item["title"],
                                    id:item.id,
                                    type:item["media_type"],
                                    originalTitle:item["original_title"]
                                })
                            });
                        }
                        person.push({
                            name:data[i]["name"],
                            id:data[i].id,
                            popularity:data[i]["popularity"],
                            profile:data[i]["profile_path"],
                            knowFor:knowFor,
                            type:type
                        });
                        break;
                    case "tv":
                        tv.push({
                            id:data[i].id,
                            title:data[i]["name"],
                            type:type,
                            originalTitle:data[i]["original_title"],
                            tvType:getType(data[i]['genre_ids']),
                            backdrop:data[i]["backdrop_path"],
                            poster:data[i]["poster_path"],
                            firstAirDate:data[i]["first_air_date"],
                            score:data[i]["vote_average"],
                            popularity:data[i]["popularity"],
                            overview:data[i]["overview"],
                            originCountry:data[i]["origin_country"]
                        })
                }
            }

            return{
                page:Data.page,
                totalPage:Data["total_pages"],
                results :{
                    person:person,
                    movie:movie,
                    tv:tv
                }
            };
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */
            callback(data);

        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
           console.log(XMLHttpRequest.status);
           console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })

};
movieDB.movieSearch=function (keyword,callback,page,language,regions,year) {
    var language=language||"en-US"||"zh-CN";
    var page=page||1;
    var regions=regions?"&region="+regions:"";
    var year=year?"&year="+year:"";
    var url=movieDB.common.base_uri+"search/movie?api_key="+movieDB.common.api_key+"&language="+language+"&query="+keyword+"&page="+page+"&include_adult=false"+regions+year;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        data:{},

        dataFilter:function (data) {
            var Data=JSON.parse(data);
            var data=Data["results"];

            var movie=[];
            console.log(data);

            data.forEach(function (item) {
                movie.push({
                    id:item.id,
                    type:"movie",
                    title:item["title"],
                    originalTitle:item["original_title"],
                    movieType:getType(item["genre_ids"]),
                    backdrop:item["backdrop_path"],
                    poster:item["poster_path"],
                    releaseDate:item["release_date"],
                    score:item["vote_average"],
                    originalLanguage:item["original_language"],
                    overview:item["overview"]
                });
            });

            return{
                page:Data.page,
                totalPage:Data["total_pages"],
                results :{
                    movie:movie

                }
            };
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */

            console.log(data);
            callback(data);

        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
           console.log(XMLHttpRequest.status);
           console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })

};
movieDB.personSearch=function (keyword,callback,page,language,regions) {
    var language=language||"en-US"||"zh-CN";
    var page=page||1;
    var regions=regions?"&region="+regions:"";

    var url=movieDB.common.base_uri+"search/person?api_key="+movieDB.common.api_key+"&language="+language+"&query="+keyword+"&page="+page+"&include_adult=false"+regions;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        data:{},

        dataFilter:function (data) {
            var Data=JSON.parse(data);
            var data=Data["results"];

            var person=[];
            console.log(data);

            data.forEach(function (item) {
                var know=item["known_for"];
                var knowFor=[];

                if (know){
                    know.forEach(function (index) {
                        knowFor.push({
                            title:index["title"],
                            id:index.id,
                            type:index["media_type"],
                            originalTitle:index["original_title"]
                        });
                    });
                }
                person.push({
                    name:item["name"],
                    id:item.id,
                    type:"person",
                    popularity:item["popularity"],
                    profile:item["profile_path"],
                    knowFor:knowFor
                });
            });

            return{
                page:Data.page,
                totalPage:Data["total_pages"],
                results :{
                    person:person
                }
            };
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */

            console.log(data);
            callback(data);

        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
           console.log(XMLHttpRequest.status);
           console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })

};
movieDB.tvSearch=function (keyword,callback,page,language,year) {
    var language=language||"en-US"||"zh-CN";
    var page=page||1;
    var year=year?"&first_air_date_year"+year:"";
    var url=movieDB.common.base_uri+"search/tv?api_key="+movieDB.common.api_key+"&language="+language+"&query="+keyword+"&page="+page+"&include_adult=false"+year;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        data:{},

        dataFilter:function (data) {
            var Data=JSON.parse(data);
            var data=Data["results"];

            var tv=[];
            console.log(data);

            data.forEach(function (item) {
                tv.push({
                    id:item.id,
                    type:"tv",
                    title:item["name"],
                    originalTitle:item["original_name"],
                    tvType:getType(item["genre_ids"]),
                    backdrop:item["backdrop_path"],
                    poster:item["poster_path"],
                    firstAirDate:item["first_air_date"],
                    score:item["vote_average"],
                    originalCountry:item["origin_country"],
                    popularity:item["popularity"],
                    overview:item["overview"]
                });
            });

            return{
                page:Data.page,
                totalPage:Data["total_pages"],
                results :{
                    tv:tv

                }
            };
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */

            console.log(data);
            callback(data);

        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })

};


function getType (arrary) {

    if (!arrary || arrary.length==0 ){
        return [];
    }
    var types=[];

    for (var i=0,len=arrary.length;i<len;i++){
        types.push(movieDB.common.genres[arrary[i]]);
    }
    return types;

}
function getKey (arrary,key) {
    var results =[];
    if (!(arrary && key)){
        return false;
    }
    arrary.forEach(function (t) {
        results.push(t[key]);
    });
    return results;
}

movieDB.getPeopleInfo=function (id,callback,language,page) {
    var language=language||"en-US"||"zh-CN";
    var page=page||1;
    var detailUrl=this.common.base_uri+"person/"+id+"?api_key="+this.common.api_key+"&language="+language;
    var tageedImageUrl=this.common.base_uri+"person/"+id+"/tagged_images?api_key="+this.common.api_key+"&language="+language+"page="+page;
    var actingUrl=this.common.base_uri+"person/"+id+"/combined_credits?api_key="+this.common.api_key+"&language="+language;



    $.when(
        $.ajax({
            type:"GET",
            url:detailUrl,
            dataType:"text",
            dataFilter:function (data) {
                var data=JSON.parse(data);
                var detail={
                    birthday:data["birthday"],
                    id:data.id,
                    name: data["name"],
                    anotherName:data["also_known_as"],
                    gender:gender[data["gender"]],
                    biography:data["biography"],
                    popularity:data["popularity"],
                    placeOfBirth:data["place_of_birth"],
                    profile:data["profile_path"],
                    imdbID:data["imdb_id"],
                    homepage:data["homepage"]
                };
                return detail;
            }

        }),
        $.ajax({
            type:"GET",
            url:tageedImageUrl,
            dataType:"text",
            dataFilter:function (data) {
                var data=JSON.parse(data);
                data=data["results"];
                var knowFor=[];
                var id=[];
                data.forEach(function (t) {
                    if (id.indexOf(t.media.id)===-1){
                        knowFor.push({
                            id:t.media.id,
                            type:t["media_type"],
                            bg:t.media["backdrop_path"],
                            poster:t.media["poster_path"],
                            popularity:t.media["popularity"],
                            overview:t.media["overview"],
                            title:t.media["title"]||t.media["name"]
                        });
                        id.push(t.media.id);
                    }

                });

                knowFor.sort(function (item1, item2) {
                    return item1.popularity-item2.popularity>0?-1:1;
                })

                knowFor=knowFor.slice(0,10);
                return knowFor;
            }
        }),
        $.ajax({
            type:"GET",
            url:actingUrl,
            dataType:"text",
            dataFilter:function (data) {
                var data=JSON.parse(data);
               data=data["cast"];
                var acting={};

                data.forEach(function (t) {
                    var type=t["media_type"];
                    var rowDate;
                    var title;
                    if(type==="movie"){
                        rowDate=t["release_date"];
                        title=t["title"];
                    }else if (type==="tv"){
                        rowDate=t["first_air_date"];
                        title=t["name"]
                    }

                    var date;
                   if (rowDate){
                      date=rowDate.substr(0,4) ;

                       if (!acting[date]){
                           acting[date]=[];
                       }

                       var act={
                           title:title,
                           id:t.id,
                           type:t["media_type"],
                           poster:t["poster_path"]
                       };
                       acting[date].push(act);

                   }

                });
                return acting;
            }
        })
    ).then(function (resp1,resp2,resp3) {

        var person={
            detail:resp1[0],
            tagged:resp2[0],
            acting:resp3[0]
        };
        console.log(person);
        callback(person);
    })


};


movieDB.getMovieInfo=function (id,callback,language,page) {
    var language=language||"en-US"||"zh-CN";
    var page=page||1;
    var detailUrl=this.common.base_uri+"movie/"+id+"?api_key="+this.common.api_key+"&language="+language;
    var creditsUrl=this.common.base_uri+"movie/"+id+"/credits?api_key="+this.common.api_key;
    var reviewsUrl=this.common.base_uri+"movie/"+id+"/reviews?api_key="+this.common.api_key+"&language="+language+"&include_image_language="+language+"&page="+page;
    var recommendationsUrl=this.common.base_uri+"movie/"+id+"/recommendations?api_key="+this.common.api_key+"&language="+language+"&page="+page;
    var similarUrl=this.common.base_uri+"movie/"+id+"/similar?api_key="+this.common.api_key+"&language="+language+"&page="+page;


    $.when(
        $.ajax({
                type:"GET",
                url:detailUrl,
                dataType:"text",
                data:{},
                dataFilter:function (data) {
                    var data=JSON.parse(data);
                    var rowType=data["genres"];
                    var rawCompany=data["production_companies"];
                    var rowCountry=data["production_countries"];
                    var rowLanguage=data["spoken_languages"];



                    var  detail={
                        id:data.id,
                        imdbID:data["imdb_id"],
                        title:data["title"],
                        originalTitle:data["original_title"],
                        movieType:getKey(rowType,"name"),
                        backdrop:data["backdrop_path"],
                        poster:data["poster_path"],
                        releaseDate:data["release_date"],
                        score:data["vote_average"],
                        originalLanguage:data["original_language"],
                        overview:data["overview"],
                        popularity:data["popularity"],
                        company:getKey(rawCompany,"name"),
                        productionCountries:getKey(rowCountry,"name"),
                        spoken_languages:getKey(rowLanguage,"name"),
                        type:"movie"

                    };


                    return detail;
                }
        }),
        $.ajax({
            type:"GET",
            url:creditsUrl,
            dataType:"text",
            dataFilter:function (data) {
                var data=JSON.parse(data)["cast"];
                var  credits=[];

                if (!data){
                    return null;
                }
                data.forEach(function (t) {
                    credits.push({
                        character: t["character"],
                        gender:gender[t["gender"]],
                        type:"person",
                        id:t.id,
                        name:t["name"],
                        profile:t["profile_path"]
                    })
                });
                credits=credits.slice(0,6);
                return credits;
            }
        }),
        $.ajax({
            type:"GET",
            url:recommendationsUrl,
            dataType:"text",
            dataFilter:function (data) {
                var Data=JSON.parse(data);
                var data=Data["results"];

                if (!data){
                    return null;
                }

                var  recommendations =[];
                data.forEach(function (t) {
                    recommendations.push({
                        backdrop:t["backdrop_path"],
                        movieType:getType(t["genre_ids"]),
                        id:t.id,
                        type:"movie",
                        title:t["title"],
                        originalTitle:t["original_title"]
                    });
                });
                return recommendations;
            }
        }),
        $.ajax({
        type:"GET",
        url:reviewsUrl,
        dataType:"text",
        dataFilter:function (data) {
            var Data=JSON.parse(data);
            var data=Data["results"];

            if (!data){
                return null;
            }

            var  reviews =[];
            data.forEach(function (t) {
                reviews.push({
                    author:t["author"],
                    content:t["content"]
                })
            });

            return {
                page:Data.page,
                reviews:reviews,
                totalPage:Data["total_pages"]
            };
        }
    }),
        $.ajax({
                type:"GET",
                url:similarUrl,
                dataType:"text",
                dataFilter:function (data) {
                    var Data=JSON.parse(data);
                    var data=Data["results"];

                    if (!data){
                        return null;
                    }

                    var  similarity  =[];
                    data.forEach(function (t) {
                        similarity.push({
                            backdrop:t["backdrop_path"],
                            movieType:getType(t["genre_ids"]),
                            id:t.id,
                            title:t["title"],
                            type:"movie ",
                            overview:t["overview"]
                        })
                    });

                    return {
                        page:Data.page,
                        similarity:similarity,
                        totalPage:Data["total_pages"]
                    };
                }
            })

    ).then(function (resp1,resp2,resp3,resp4,resp5) {
        var movie={
            detail:resp1[0],
            credits:resp2[0],
            recommendations:resp3[0],
            reviews:resp4[0],
            similar:resp5[0]

        };
        console.log(movie);
        callback(movie);
    })


};

movieDB.getTVInfo=function (id,callback,language,page) {
    var language=language||"en-US"||"zh-CN";
    var page=page||1;
    var detailUrl=this.common.base_uri+"tv/"+id+"?api_key="+this.common.api_key+"&language="+language;
    var creditsUrl=this.common.base_uri+"tv/"+id+"/credits?api_key="+this.common.api_key+"&language="+language;
    var reviewsUrl=this.common.base_uri+"tv/"+id+"/reviews?api_key="+this.common.api_key+"&language="+language+"&include_image_language="+language+"&page="+page;
    var recommendationsUrl=this.common.base_uri+"tv/"+id+"/recommendations?api_key="+this.common.api_key+"&language="+language+"&page="+page;
    var similarUrl=this.common.base_uri+"tv/"+id+"/similar?api_key="+this.common.api_key+"&language="+language+"&page="+page;



    $.when(
        $.ajax({
                type:"GET",
                url:detailUrl,
                dataType:"text",
                data:{},
                dataFilter:function (data) {
                    var data=JSON.parse(data);
                    var rowType=data["genres"];
                    var rawCompany=data["production_companies"];
                    var rowCountry=data["production_countries"];

                    var getKey=function (arrary,key) {
                        var results =[];
                        if (!(arrary && key)){
                            return false;
                        }
                        arrary.forEach(function (t) {
                            results.push(t[key]);
                        });
                        return results;
                    };

                    var  detail={
                        id:data.id,
                        title:data["name"],
                        originalTitle:data["original_name"],
                        tvType:getKey(rowType,"name"),
                        backdrop:data["backdrop_path"],
                        poster:data["poster_path"],
                        firstAirDate:data["first_air_date"],
                        score:data["vote_average"],
                        originalLanguage:data["original_language"],
                        overview:data["overview"],
                        popularity:data["popularity"],
                        company:getKey(rawCompany,"name"),
                        productionCountries:getKey(rowCountry,"name"),
                        type:"tv"

                    };


                    return detail;
                }
        }),
        $.ajax({
            type:"GET",
            url:creditsUrl,
            dataType:"text",
            dataFilter:function (data) {
                var data=JSON.parse(data)["cast"];
                var  credits=[];

                if (!data){
                    return null;
                }
                data.forEach(function (t) {
                    credits.push({
                        character: t["character"],
                        gender:gender[t["gender"]],
                        id:t.id,
                        type:"person",
                        name:t["name"],
                        profile:t["profile_path"]
                    })
                });
                credits=credits.slice(0,6);
                return credits;
            }
        }),
        $.ajax({
            type:"GET",
            url:recommendationsUrl,
            dataType:"text",
            dataFilter:function (data) {
                var Data=JSON.parse(data);
                var data=Data["results"];

                if (!data){
                    return null;
                }

                var  recommendations =[];
                data.forEach(function (t) {
                    recommendations.push({
                        backdrop:t["backdrop_path"],
                        tvType:getType(t["genre_ids"]),
                        id:t.id,
                        type:"tv",
                        title:t["name"],
                        originalTitle:t["original_name"]
                    });
                });
                return recommendations;
            }
        }),
        $.ajax({
                type:"GET",
                url:similarUrl,
                dataType:"text",
                dataFilter:function (data) {
                    var Data=JSON.parse(data);
                    var data=Data["results"];

                    if (!data){
                        return null;
                    }

                    var  similarity  =[];
                    data.forEach(function (t) {
                        similarity.push({
                            backdrop:t["backdrop_path"],
                            movieType:getType(t["genre_ids"]),
                            id:t.id,
                            type:"tv",
                            title:t["name"],
                            overview:t["overview"]
                        })
                    });

                    return {
                        page:Data.page,
                        similarity:similarity,
                        totalPage:Data["total_pages"]
                    };
                }
            })

    ).then(function (resp1,resp2,resp3,resp4,resp5) {
        var tv={
            detail:resp1[0],
            credits:resp2[0],
            recommendations:resp3[0],
            similar:resp4[0],
            reviews:null

        };
        console.log(tv);
        callback(tv);
    })


};

movieDB.getDiscover=function (callback,obj,page,language ) {
    var page=page||1;
    var language=language||"en-US"||"zh-CN";
    var obj=obj||{};

    var sortBy=obj.sortBy?+"&sort_by="+obj.sortBy:"";
    var year=obj.year?"&year="+obj.year:"";
    var withGenres=obj.type?"with_genres="+obj.type:"";

    var url=this.common.base_uri+"discover/movie?"+"api_key="+this.common.api_key+"&language="+language+sortBy+"&include_adult=false&include_video=false&page="+withGenres+page+year;

    console.log(url)

    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        dataFilter:function (data) {
            var Data=JSON.parse(data);
            var data=Data["results"];

            if (!data){
                return null;
            }

            var  discovery=[];
            data.forEach(function (t) {
                discovery.push({
                    backdrop:t["backdrop_path"],
                    poster:t["poster_path"],
                    movieType:getType(t["genre_ids"]),
                    id:t.id,
                    type:"movie",
                    title:t["title"],
                    score:t["vote_average"],
                    releaseDate:t["release_date"],
                    overview:t["overview"],
                    popularity:t["popularity"]
            });
            });
            return discovery;
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */
           console.log(data);
           callback(data);

        },
        error:function () {
            alert("failed!")
        }

    });
};


movieDB.getPopularPerson=function(callback,page,language){
    var language=language||"en-US"||"zh-CN";
    var page=page||1;
    var url=movieDB.common.base_uri+"person/popular?api_key="+movieDB.common.api_key+"&language="+language+"&page="+page;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        data:{},

        dataFilter:function (data) {
            var Data=JSON.parse(data);
            var data=Data["results"];

            var popularPerson=[];

            data.forEach(function (item) {
                var know=item["known_for"];
                var knowFor=[];

                if (know){
                    know.forEach(function (index) {
                        knowFor.push({
                            title:index["title"],
                            id:index.id,
                            type:index["media_type"]
                        });
                    });
                }
                popularPerson.push({
                    name:item["name"],
                    id:item.id,
                    type:"person",
                    popularity:item["popularity"],
                    profile:item["profile_path"],
                    knowFor:knowFor
                });
            });

            return{
                page:Data.page,
                totalPage:Data["total_pages"],
                results :{
                    popularPerson:popularPerson
                }
            };
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */

            console.log(data);
            callback(data);

        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })

};
movieDB.getPopularMovie=function(callback,page,language){
    var language=language||"en-US"||"zh-CN";
    var page=page||1;
    var url=movieDB.common.base_uri+"movie/popular?api_key="+movieDB.common.api_key+"&language="+language+"&page="+page;
    console.log(url)
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        data:{},

        dataFilter:function (data) {
            var Data=JSON.parse(data);
            var data=Data["results"];

            var popularMovie=[];

            data.forEach(function (item) {
                popularMovie.push({
                    id:item.id,
                    title:item["title"],
                    type:"movie",
                    movieType:getType(item["genre_ids"]),
                    backdrop:item["backdrop_path"],
                    poster:item["poster_path"],
                    releaseDate:item["release_date"],
                    score:item["vote_average"],
                    overview:item["overview"]
                });
            });

            return{
                page:Data.page,
                totalPage:Data["total_pages"],
                results :{
                    popularMovie:popularMovie

                }
            };
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */

            console.log(data);
            callback(data);

        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })

};
movieDB.getPopularTV=function(callback,page,language){
    var language=language||"en-US"||"zh-CN";
    var page=page||1;
    var url=movieDB.common.base_uri+"tv/popular?api_key="+movieDB.common.api_key+"&language="+language+"&page="+page;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        data:{},

        dataFilter:function (data) {

            var Data=JSON.parse(data);
            var data=Data["results"];

            var popularTV =[];

            data.forEach(function (item) {
                popularTV.push({
                    id:item.id,
                    title:item["name"],
                    type:"tv",
                    tvType:getType(item["genre_ids"]),
                    backdrop:item["backdrop_path"],
                    poster:item["poster_path"],
                    firstAirDate:item["first_air_date"],
                    score:item["vote_average"],
                    originalCountry:item["origin_country"],
                    popularity:item["popularity"],
                    overview:item["overview"]
                });
            });
            return{
                page:Data.page,
                totalPage:Data["total_pages"],
                results :{
                    popularTV:popularTV

                }
            };
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */

            console.log(data);
            callback(data);

        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })

};

movieDB.login=function (username,password,callback) {
    var requestUrl="https://api.themoviedb.org/3/authentication/token/new?api_key=dcc18672beb28dd5960858c5c3e3b174";

    $.ajax({
        type:"GET",
        url:requestUrl,
        dataType:"text",
        dataFilter:function (data) {

            var data=JSON.parse(data);

            return data["request_token"]
        },
        success:function (data) {

            var sessionUrl="https://api.themoviedb.org/3/authentication/session/new?api_key=dcc18672beb28dd5960858c5c3e3b174&request_token="+data;

            var loginUrl="https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=dcc18672beb28dd5960858c5c3e3b174&username="+username+"" +
                "&password="+password+"&request_token="+data;

           $.ajax({
               type:"GET",
               url:loginUrl,
               dataType:"text",
               success:function () {
                   $.ajax({
                       type:"GET",
                       url:sessionUrl,
                       dataType:"text",
                       dataFilter:function (data) {
                           var data=JSON.parse(data);
                           return data["session_id"]
                       },
                       success:function (data) {
                           console.log(data);

                          callback(data)
                       },
                       error:function() {
                           Materialize.toast($("<span>Login failed </span>"), 2000);
                       }
                   });
               },
               error:function(XMLHttpRequest, textStatus, errorThrown) {
                   Materialize.toast($("<span>Login failed </span>"), 2000);
               }
           });
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })
};

movieDB.getMyFavoriteMovie=function (id,callback) {
    var url="https://api.themoviedb.org/3/account/{account_id}/favorite/movies?api_key=dcc18672beb28dd5960858c5c3e3b174&session_id="+id+"" +
        "&language=en-US&sort_by=created_at.asc&page=1";

    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        dataFilter:function (data) {

            var data=JSON.parse(data);
            var page=data.page;
            var totalPage=data["total_pages"];
            var results =data["results"];

            var movie=[];

            results.forEach(function (item) {
                movie.push({
                    id:item.id,
                    type:"movie",
                    title:item["title"],
                    originalTitle:item["original_title"],
                    movieType:getType(item["genre_ids"]),
                    backdrop:item["backdrop_path"],
                    poster:item["poster_path"],
                    releaseDate:item["release_date"],
                    score:item["vote_average"],
                    originalLanguage:item["original_language"],
                    overview:item["overview"]
                });
            });

            return{
                page:page,
                totalPage:totalPage,
                results :{
                    movie:movie

                }
            };
        },
        success:function (data) {
            callback(data);
        }
    }) ;
};
movieDB.getMyFavoriteTV=function (id,callback) {
    var url="https://api.themoviedb.org/3/account/{account_id}/favorite/tv?api_key=dcc18672beb28dd5960858c5c3e3b174&session_id="+id+"" +
        "&language=en-US&sort_by=created_at.asc&page=1";
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        dataFilter:function (data) {

            var data=JSON.parse(data);
            var page=data.page;
            var totalPage=data["total_pages"];
            var results =data["results"];

            var tv=[];

            results.forEach(function (item) {
                tv.push({
                    id:item.id,
                    type:"tv",
                    title:item["name"],
                    originalTitle:item["original_name"],
                    tvType:getType(item["genre_ids"]),
                    backdrop:item["backdrop_path"],
                    poster:item["poster_path"],
                    firstAirDate:item["first_air_date"],
                    score:item["vote_average"],
                    originalCountry:item["origin_country"],
                    popularity:item["popularity"],
                    overview:item["overview"]
                });
            });

            return{
                page:page,
                totalPage:totalPage,
                results :{
                    tv:tv

                }
            };
        },
        success:function (data) {
            callback(data);
            console.log(data)

        }
    }) ;
}

