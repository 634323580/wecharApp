// pages/posts/posts.js
import localData from "../../data/posts-data.js"
Page({
  data:{
    items: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数1
    //获取文章查看数。
    let linkNumber = wx.getStorageSync('linkNumber');
    if(!linkNumber) {
      linkNumber = {}
      wx.setStorageSync('linkNumber', linkNumber)
    } else {
      localData.forEach((item) => {
        if(linkNumber[item.postId]) {
          item.reading = linkNumber[item.postId];
        } else {
           item.reading = 0;
        }
      })
    }
    this.setData({
      items: localData
    });
  },
  onPostTap: function(event) {
    let posId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: `./post-detail/post-detail?id=${posId}`
    })
  },
  onSwiperTap: function(event) {
    let posId = event.target.dataset.postid;
    wx.navigateTo({
      url: `./post-detail/post-detail?id=${posId}`
    })
  },
  onShow:function(){
    let linkNumber = wx.getStorageSync('linkNumber');
    if(!linkNumber) {
      linkNumber = {}
      wx.setStorageSync('linkNumber', linkNumber)
    } else {
      localData.forEach((item) => {
        if(linkNumber[item.postId]) {
          item.reading = linkNumber[item.postId];
        }
      })
    }
    this.setData({
      items: localData
    });
  }
})