// pages/movies/more-movies/more-movies.js
import util from '../../../utils/util';
let app = getApp();
Page({
  data: {
    movies: [],
    start: 0,
    noneMore: false
  },
  onLoad: function (options) {
    // ?start=${this.data.start}
    this.data.navigationTitle = options.category;
    let dataUrl = '';
    switch (this.data.navigationTitle) {
      case '正在上映的电影-北京':
        dataUrl = `${app.gloabalData.doubanBase}/v2/movie/in_theaters`;
        break;
      case '即将上映的电影':
        dataUrl = `${app.gloabalData.doubanBase}/v2/movie/coming_soon`;
        break;
      case '豆瓣电影Top250':
        dataUrl = `${app.gloabalData.doubanBase}/v2/movie/top250`;
        break;
    }

    util.getMoreMovie(dataUrl, this)
    this.data.moreUrl = dataUrl;
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigationTitle
    });
  },
  onMovieTap: function(event) {
    let movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: `../movies-detail/movies-detail?id=${movieId}`
    });
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
  //         movies: this.data.movies.concat(movies)
  //       });
  //       this.data.start += 20;
  //       if (this.data.start > this.data.total) {
  //         this.setData({
  //           noneMore: true
  //         });
  //       }
  //     })
  // },
  onPullDownRefresh: function () {
    this.data.movies = [];
    this.data.start = 0;
    let dataUrl = this.data.moreUrl + `?start=${this.data.start}`;
    util.getMoreMovie(dataUrl, this).then(wx.stopPullDownRefresh);
  },
  onReachBottom: function () {
    if (this.data.start > this.data.total) {
      return;
    }
    let dataUrl = this.data.moreUrl + `?start=${this.data.start}`;
    util.getMoreMovie(dataUrl, this);
  },
  /*查看图片*/
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
})