import postsData from "../../../data/posts-data.js"

Page({
  data: {
    postId: '',
    postData: {},
    collected: false,
    isPlatIngMusic: false
  },
  onLoad: function (options) {
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
    if (postsCollected) {
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
  onCollectionTap: function (event) {
    // 点击改变缓存状态
    // 获取本地收藏状态这条缓存
    let postsCollected = wx.getStorageSync('postsCollected');
    // 找出当前文章收藏的状态
    let postCollId = postsCollected[this.data.postId]
    // 取反，收藏变成未收藏，未收藏变成收藏
    postCollId = !postCollId;
    this.showModal(postsCollected, postCollId);

  },
  showToast: function (postCollId) {
    // 使用showToast方法提示用户
    let toastTitle = postCollId ? '收藏成功' : '取消成功';
    wx.showToast({
      title: toastTitle,
      icon: 'success',
      duration: 1000 //设置showToast消失的时间
    })
  },
  showModal: function (postsCollected, postCollId) {
    let content = postCollId ? '是否确定收藏这篇文章' : '是否取消收藏这篇文章';
    let title = postCollId ? '收藏' : '取消收藏';
    wx.showModal({
      title: title,
      content: content,
      success: (res) => {
        if (res.confirm) {
          // 设置当前文章的收藏状态
          postsCollected[this.data.postId] = postCollId;
          // 把设置好的状态再次存进本地缓存里面
          wx.setStorageSync('postsCollected', postsCollected);
          this.setData({
            collected: postCollId
          });
          this.showToast(postCollId);
        }
      }
    })
  },
  onshareTap: function (event) {
    let itemList = [
        '分享给微信好友',
        '分享到朋友圈',
        '分享到QQ'
      ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function(res) {
        // res.cancel 用户是不是点击了取消按钮;
        // res.tapIndex 数组元素的序号，从0开始;
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '现在还不能实现分享功能,什么时候能支持呢',
        });
      }
    })
  },
  onMusicTap: function(event) {
    let isPlatIngMusic = this.data.isPlatIngMusic;
    let pageMusicId = postsData[this.data.postId].music
    if(isPlatIngMusic) {
     wx.stopBackgroundAudio()
      this.setData({
        isPlatIngMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: pageMusicId.url,
        title: pageMusicId.title,
        coverImgUrl: pageMusicId.coverImg
        // callback functions, success & fail & complete
      });
      this.setData({
        isPlatIngMusic: true
      })
    }
  }
})