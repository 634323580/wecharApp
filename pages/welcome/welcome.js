Page({
    letsgo: function(event) {
        // wx.redirectTo({
        //     url: "../posts/posts"
        // })
        // event.stopPropagation();
        wx.switchTab({
           url: "../posts/posts"
        })
    }
});
