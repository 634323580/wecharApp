// pages/movies/movies.js
let app = getApp();
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
  },
  onLoad: function (options) {
    let inTheatersUrl = `${app.gloabalData.doubanBase}/v2/movie/in_theaters?start=0&count=3`;
    let comingSoonUrl = `${app.gloabalData.doubanBase}/v2/movie/coming_soon?start=0&count=3`;
    let top250Url = `${app.gloabalData.doubanBase}/v2/movie/top250?start=0&count=3`;

    //  这样请求纯粹为了学习promise
    this.getmovieListData(inTheatersUrl, 'inTheaters')
        .then(res => {
          return this.getmovieListData(comingSoonUrl, 'comingSoon');
        })
        .then(res => {
          return this.getmovieListData(top250Url, 'top250');
        })
        .then(res => {
        })
  },
  getmovieListData: function (url, settedKey) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        methods: 'GET',
        header: {
          'Content-Type': 'json'
          // 'Content-Type': 'application/xml'
        },
        success: (res) => {
          resolve(res);
          this.processDoubanData(res.data, settedKey);
        },
        fail: function(err) {
          reject(err);
        }
      })
    })
  },
  computedStart: function(number) {
      let starState = [];

      number = number.split('').join('.')

      // let score = Math.floor(number * 2) / 2;

     let integer = Math.floor(number);
      for(var i = 0; i < integer; i++) {
        starState.push('star');
      }

      let hasDecimal = number % 1 !== 0;
      if(hasDecimal) {
        starState.push('none-star');
      }

      while(starState.length < 5) {
        starState.push('chat');
      }
      console.log(starState)
      return starState;
  },

  processDoubanData: function(moviesDouban, settedKey) {
    console.log(moviesDouban)
    var movies = [];
     for(var idx in moviesDouban.subjects) {
       let subject = moviesDouban.subjects[idx];
       let title = subject.title;
       if(title.length >= 6) {
         title = title.substring(0, 6) + '...';
       }
       let startNumber = subject.rating.stars;
       let starState = this.computedStart(startNumber);
       let temp = {
         title: title,
         average: {
           starState: starState,
           number:subject.rating.average
         },
         coverageUrl: subject.images.large,
         movieId: subject.id
       }

       movies.push(temp);
       var readyData = {};
       readyData[settedKey] = {
         movieListTitle: moviesDouban.title,
         movies: movies
       };
       this.setData(readyData);
      //  this.setData({
      //    movies: movies
      //  });
     }
  }
})