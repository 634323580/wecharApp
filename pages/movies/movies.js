// pages/movies/movies.js
import util from '../../utils/util';

let app = getApp();
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    movies: [],
    containerShow: true,
    start: 0,
    noneMore: false,
    err400: false
  },
  onLoad: function (options) {
    this.reset();
  },
  // 初始化数据
  reset: function() {
    let inTheatersUrl = `${app.gloabalData.doubanBase}/v2/movie/in_theaters?start=0&count=3`;
    let comingSoonUrl = `${app.gloabalData.doubanBase}/v2/movie/coming_soon?start=0&count=3`;
    let top250Url = `${app.gloabalData.doubanBase}/v2/movie/top250?start=0&count=3`;
    this.setData({
      err400: false
    })
    //  这样请求纯粹为了学习promise
    this.getmovieListData(inTheatersUrl, 'inTheaters')
      .then(res => this.getmovieListData(comingSoonUrl, 'comingSoon'))
      .then(res => this.getmovieListData(top250Url, 'top250'))
      .catch(err => {
        let code = util.handlingError(err);
        if(code === 404 || code === 400 || code === -1) {
          this.setData({
            err400: true
          });
        }
      })
  },
  // 绑定数据
  setMoviesData: function(data) {
      this.data.total = data.total;
      this.setData({
          movies: this.data.movies.concat(data.movies)
      });
      this.data.start += 20;
      if (this.data.start > data.total) {
        this.setData({
          noneMore: true
        });
      }
  },
  // 跳转更多
  onMoreTap: function (event) {
    let category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: `./more-movies/more-movies?category=${category}`
    });
  },
  onMovieTap: function(event) {
    let movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: `./movies-detail/movies-detail?id=${movieId}`
    });
  },
  getmovieListData: function (url, settedKey) {
    wx.showNavigationBarLoading();
    return util.http(url)
      .then((res) => this.processDoubanData(res.data, settedKey))
  },
  processDoubanData: function (moviesDouban, settedKey) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      let subject = moviesDouban.subjects[idx];
      let title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...';
      }
      let startNumber = subject.rating.stars;
      //  星星评分
      let starState = util.computedStart(startNumber);
      let temp = {
        title: title,
        average: {
          starState: starState,
          number: subject.rating.average
        },
        coverageUrl: subject.images.large,
        movieId: subject.id
      }

      movies.push(temp);
      var readyData = {};
      readyData[settedKey] = {
        movieListTitle: moviesDouban.title,
        movies: movies
      };
      this.setData(readyData);
      //  this.setData({
      //    movies: movies
      //  });
    }
    return moviesDouban;
  },


  // getMoreMovie: function (url) {
  //   wx.showNavigationBarLoading();
  //   return util.http(url)
  //     .then(res => {
  //       this.data.total = res.data.total;
  //       var movies = [];
  //       res.data.subjects.forEach(item => {
  //         let temp = {
  //           title: item.title,
  //           average: {
  //             starState: util.computedStart(item.rating.stars),
  //             number: item.rating.average
  //           },
  //           coverageUrl: item.images.large,
  //           movieId: item.id
  //         }
  //         movies.push(temp);
  //       })
  //       this.setData({
  //         searchResult: {
  //           movies: this.data.searchResult['movies'].concat(movies)
  //         }
  //       });
  //       this.data.start += 20;
  //       if (this.data.start > this.data.total) {
  //         this.setData({
  //           noneMore: true
  //         });
  //       }
  //     })
  // },
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true
    })
  },
  onBindFocus: function (event) {
    this.setData({
      containerShow: false
    })
  },
  onBindChange: function (event) {
    this.data.seatchVal = event.detail.value;
    // 重新初始化数据
    this.data.movies = [];
    this.data.start = 0;
    this.setData({
      noneMore: false
    });
    let searchUrl = `${app.gloabalData.doubanBase}/v2/movie/search?start=${this.data.start}&q=${this.data.seatchVal}`;
    util.getMoreMovie(searchUrl)
        .then(res => {
          this.setMoviesData(res);
        })
  },
  searchBindscrolltolower: function () {
    if (this.data.start > this.data.total) {
      return;
    }
    let searchUrl = `${app.gloabalData.doubanBase}/v2/movie/search?start=${this.data.start}&q=${this.data.seatchVal}`;
    util.getMoreMovie(searchUrl)
        .then(res => {
          this.setMoviesData(res);
        })
  }
})