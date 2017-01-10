var app = getApp();
import util from '../../../utils/util';
Page({
  data:{
    movie: {}
  },
  onLoad:function(options){
    let movieId = options.id;
    let url = `${app.gloabalData.doubanBase}/v2/movie/subject/${movieId}`
    util.http(url)
        .then(res => {
          this.processDoubanData(res.data);
        })
  },
  processDoubanData: function(res) {
      var director = {
        avatar: "",
        name: "",
        id: ""
      };
      if(res.directors[0].avatars != null) {
        if(res.directors[0].avatars != null) {
          director.avatar = res.directors[0].avatars.large;
        }
      }
      director.name = res.directors[0].name;
      director.id = res.directors[0].id;
      var movie = {
          movieImg: res.images ? res.images.large : "",
          country: res.countries[0],
          title: res.title,
          originalTitle: res.original_title,
          wishCount: res.wish_count,
          commentCount: res.comments_count,
          year: res.year,
          generes: res.genres.join("、"),
          average: {
            starState: util.computedStart(res.rating.stars),
            number: res.rating.average
          },
          director: director,
          casts: util.convertToCastString(res.casts),
          castsInfo: util.convertToCastInfos(res.casts),
          summary: res.summary
      }
      console.log(movie)
  }
})