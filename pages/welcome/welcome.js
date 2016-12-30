Page({
    letsgo: function(event) {
        // wx.navigateTo({
        //     url: "../posts/posts"
        // })
        console.log(event);
        // event.stopPropagation();
        wx.navigateTo({
           url: "../posts/posts"
        })
    },
    subTap: function() {
        console.log('sb')
    }
});
