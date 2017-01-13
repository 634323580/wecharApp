var app = getApp();
import util from '../../../utils/util';
import {Movie} from './class/Movie';
Page({
  data:{
    containerShow: false,
    movie: {},
    average: {}
  },
  onLoad:function(options){
    let movieId = options.id;
    let url = `${app.gloabalData.doubanBase}/v2/movie/subject/${movieId}`;
    wx.showNavigationBarLoading();
    var movie = new Movie(url);
    movie.getMovieData((movie, average) => {
      this.setData({
        movie: movie,
        average: average,
        containerShow: true
      });
    });
  },
  /*查看图片*/
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src,src,src] // 需要预览的图片http链接列表
    })
  },
})