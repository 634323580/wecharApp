Page({
    letsgo: function(event) {
        // wx.redirectTo({
        //     url: "../posts/posts"
        // })
        // event.stopPropagation();
        wx.navigateTo({
           url: "../posts/posts"
        })
    },
    subTap: function() {
        console.log('sb')
    }
});
