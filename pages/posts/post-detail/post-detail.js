import postsData from "../../../data/posts-data.js"

Page({
  data:{
    postId: '',
    postData: {},
    collected: false
  },
  onLoad:function(options){
    /**
     * this.data.的方式修改数据不会对应的反应到视图
     * this.setDate({}) 这种方式会设置的数据能绑定到视图
    */
    // 页面初始化 options为页面跳转所带来的参数
    this.data.postId = options.id;
    // 获取这篇文章的数据
    let postData = postsData[this.data.postId];
    this.setData({
      postData: postData
    });
    // 从本地缓存里获取是否收藏数据
    let postsCollected = wx.getStorageSync('postsCollected');
    if(postsCollected) {
      // 如果有则取出文章相应是否收藏的值
      let collected = postsCollected[this.data.postId];
      // 如果当前文章没有收藏状态，则默认设置为false 未收藏
      // if(!collected) {
      //   collected = false;
      //   postsCollected[this.data.postId] = collected;
      //   wx.setStorageSync('postsCollected', postsCollected);
      // }
      this.setData({
        collected: collected
      })
    } else {
      // 如果没有这条缓存则创建这条缓存，并且把当前文章的收藏状态设置为false
      let postsCollected = {};
      postsCollected[this.data.postId] = false;
      wx.setStorageSync('postsCollected', postsCollected);
    }
  },
  onCollectionTap: function(event) {
    // 点击改变缓存状态
    // 获取本地收藏状态这条缓存
    let postsCollected = wx.getStorageSync('postsCollected');
    // 找出当前文章收藏的状态
    let postCollId = postsCollected[this.data.postId]
        // 取反，收藏变成未收藏，未收藏变成收藏
        postCollId = !postCollId;
        // 设置当前文章的收藏状态
        postsCollected[this.data.postId] = postCollId;
        // 把设置好的状态再次存进本地缓存里面
        wx.setStorageSync('postsCollected', postsCollected);
        this.setData({
          collected: postCollId
        })

        // 使用showToast方法提示用户
        let toastTitle = postCollId ? '收藏成功' : '取消成功';
        wx.showToast({
          title: toastTitle,
          icon: 'success',
          duration: 1000 //设置showToast消失的时间
        })
  },
  onshareTap: function(event) {
  }
})