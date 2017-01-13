import util from '../../../../utils/util';
class Movie {
  constructor(url) {
    this.url = url;
  }

  getMovieData(callback) {
    this.cb = callback;
    util.http(this.url)
      .then(res => {
        this.processDoubanData(res.data);
      })
  }

  processDoubanData(res) {
    if (!res) {
      return;
    }
    wx.setNavigationBarTitle({
      title: res.title
    });
    var director = {
      avatar: "",
      name: "",
      id: ""
    };
    if (res.directors[0]) {
      if (res.directors[0].avatars != null) {
        if (res.directors[0].avatars != null) {
          director.avatar = res.directors[0].avatars.large;
        }
      }
      director.name = res.directors[0].name;
      director.id = res.directors[0].id;
    }

    var movie = {
      movieImg: res.images ? res.images.large : "",
      country: res.countries[0],
      title: res.title,
      originalTitle: res.original_title,
      wishCount: res.wish_count,
      commentCount: res.comments_count,
      year: res.year,
      generes: res.genres.join("、"),
      director: director,
      casts: util.convertToCastString(res.casts),
      castsInfo: util.convertToCastInfos(res.casts),
      summary: res.summary
    }
    
    let average = {
      starState: util.computedStart(res.rating.stars),
      number: res.rating.average
    } 
    this.cb(movie, average);
  }

}
export {Movie};