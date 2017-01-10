
class Util {
 computedStart(number) {
      let starState = [];

      number = number.split('').join('.')

      // let score = Math.floor(number * 2) / 2;

     let integer = Math.floor(number);
      for(var i = 0; i < integer; i++) {
        starState.push('star');
      }

      let hasDecimal = number % 1 !== 0;
      if(hasDecimal) {
        starState.push('clson-star');
      }

      while(starState.length < 5) {
        starState.push('none-star');
      }
      return starState;
  }
// 状态码	含义	说明
// 200	OK	请求成功
// 201	CREATED	创建成功
// 202	ACCEPTED	更新成功
// 400	BAD REQUEST	请求的地址不存在或者包含不支持的参数
// 401	UNAUTHORIZED	未授权
// 403	FORBIDDEN	被禁止访问
// 404	NOT FOUND	请求的资源不存在
// 500	INTERNAL SERVER ERROR	内部错误
 handlingError(err) {
   let code;
   switch(parseInt(err.statusCode)) {
     case 404:
     wx.showToast({
       title: '请求地址错误',
       icon: 'loading'
     })
     code = 404;
     break;
     case 400:
     wx.showToast({
       title: '访问频率太快，请稍后访问！',
       icon: 'loading'
     })
     code = 400;
     break;
     default:
     code = -1;
   }
   return code;
 } 

  http(url) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        methods: 'GET',
        header: {
          'Content-Type': 'json'
          // 'Content-Type': 'application/xml'
        },
        success: (res) => {
          if(parseInt(res.statusCode) !== 200) {
            reject(res);
          }
          resolve(res);
        },
        fail: (err) => {
          // 网络错误
          reject(err);
          wx.showToast({
            title: '出错了，请重试',
            icon: 'loading'
          })
        },
        complete: () => {
          wx.hideNavigationBarLoading();
        }
      })
    })
    // .catch(err => {
    //   this.handlingError(err);
    // })
  }
  // 加载更多
  getMoreMovie (url, _this, callback) {
    wx.showNavigationBarLoading();
    return this.http(url)
      .then(res => {
        _this.data.total = res.data.total;
        var movies = [];
        res.data.subjects.forEach(item => {
          let temp = {
            title: item.title,
            average: {
              starState: this.computedStart(item.rating.stars),
              number: item.rating.average
            },
            coverageUrl: item.images.large,
            movieId: item.id
          }
          movies.push(temp);
        })
        _this.setData({
            movies: _this.data.movies.concat(movies)
        });
        _this.data.start += 20;
        if (_this.data.start > _this.data.total) {
          _this.setData({
            noneMore: true
          });
        }
        wx.hideNavigationBarLoading();
      })
  }

  convertToCastString(casts) {
    var castsjoin = "";
    for (var idx in casts) {
      castsjoin = castsjoin + casts[idx].name + " / ";
    }
    return castsjoin.substring(0, castsjoin.length - 2);
  }

  convertToCastInfos(casts) {
    var castsArray = []
    for (var idx in casts) {
      var cast = {
        img: casts[idx].avatars ? casts[idx].avatars.large : "",
        name: casts[idx].name
      }
      castsArray.push(cast);
    }
    return castsArray;
  }

}
let Utils = new Util();
export default Utils;