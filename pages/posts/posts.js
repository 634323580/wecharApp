// pages/posts/posts.js
import localData from "../../posts-data.js"
Page({
  data:{
    items: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数1
    this.setData({
      items: localData
    });
  },
  onReady:function(){
    // 页面渲染完成3
  },
  onShow:function(){
    // 页面显示2
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})