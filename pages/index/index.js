//index.js
//获取应用实例
const api = require('../../utils/request.js')
const app = getApp();
// 初始化播放器
const audioContext = wx.getBackgroundAudioManager();
audioContext.title = "轻享云音"
audioContext.obeyMuteSwitch = false;
audioContext.onEnded(end => {
  console.log('播放结束')
  const list = [1452439191, 1442508316, 1430850573, 1433984099, 1452484607, 1426649237, 1436936781, 1297750680, 1420075778, 1422932470]
  list[parseInt(10 * Math.random())]
  audioContext.src = `https://music.163.com/song/media/outer/url?id=${list[parseInt(10 * Math.random())]}.mp3`;
})
audioContext.onPause(onPause => {
  console.log('播放暂停')
})
app.globalData.PLAYER = audioContext;
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    showSearch: false,
    isloading: true,
    playMusicPicUrl: '',
    searchWord: '',
    searchDefaultWord: '',
    hotSearchList: [],
    searchMusicList: [],
    banners: [],
    playlists: [],
    daySong: {},
    currentSwiper: 0,
    // 小球
    hide_fly_box: true,
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  onLoad: function () {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    })
    // wx.showLoading({
    //   title: '请求中，请耐心等待..'
    // });
    Promise.all([
      api.get('/search/default'), //推荐搜索
      api.get('/playlist/detail?id=19723756')
    ]).then(res => {
      // wx.hideLoading();
      this.setData({
        isloading: false,
        searchDefaultWord: res[0].data.showKeyword,
        searchWord: res[0].data.showKeyword,
        hotList: res[1].playlist.tracks,
      })
      // 获取热搜词
      api.get('/search/hot/detail').then(res => {
        this.setData({
          'hotSearchList': res.data
        })
      })
    }).catch(e => {
      console.log(e)
    })

  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },

  play: function (e) {
    let music = e.currentTarget.dataset.music;
    console.log("播放歌曲：", music)
    console.log("播放歌曲ID：", music.id)
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${music.id}.mp3`;
    audioContext.singer = music.ar[0].name;
    audioContext.title = music.name;
    audioContext.epname = music.ar[0].name;
    app.globalData.PLAYER.music = music;
    app.globalData.PLAYER.isplay = true;
    this.setData({
      "playMusicPicUrl": music.al.picUrl
    })

    // setTimeout(() => {
    //   this.touchOnGoods(e)
    // }, 50);
  },
  touchOnItem: function (e) {
    const id = e.currentTarget.dataset['id']
    const music = e.currentTarget.dataset.music;
    console.log(music)
    const query = wx.createSelectorQuery();
    query.select('.img-num-' + id).boundingClientRect()
    query.exec(res => {
      this.setData({
        "isAnimation": e.currentTarget.dataset['id'],
        animationLeft: res[0].left + 'px',
        animationTop: res[0].top + 'px',
        animationOpacity: 1,
        animationTransition: 'left 0s, top 0s',
      })
      setTimeout(() => {
        this.setData({
          animationLeft: app.globalData.ww / 2 - 30 + 'px',
          animationTop: app.globalData.hh - 56 + 'px',
          animationOpacity: 0.5,
          animationTransition: 'left 0.8s linear, top 0.8s ease-in,opacity 0.8s',
        })
      }, 1);
    })
    setTimeout(() => {
      this.getTabBar().setData({
        'list[2]': {
          "iconPath": music.al.picUrl+'?param=200y200',
          "pagePath": "/pages/pageturn/pageturn",
          "selectedIconPath": music.al.picUrl+'?param=200y200',
          "playTime": '200', //播放时长
          "play": true,
        }
      })
    }, 800);
  },
  goSearchPage() {
    this.setData({
      showSearch: true
    })
  },
  onCloseSearch() {
    this.setData({
      showSearch: false,
      searchWord: this.data.searchDefaultWord,
      searchMusicList: []
    });
  },
  onClearSearch() {
    this.setData({
      searchMusicList: []
    });
  },
  onSearch(val) {
    // api.get('/search/suggest?type=mobile&keywords='+val.detail).then(res => {
    // 获取热搜词
    wx.showLoading({
      title: '正在搜索..'
    });
    this.setData({
      'searchWord': val.detail ? val.detail : this.data.searchDefaultWord
    })
    api.get('/search?limit=10&keywords=' + this.data.searchWord).then(res => {
      console.log(res.result.songs)
      this.setData({
        'searchMusicList': res.result.songs
      })
      wx.hideLoading();
    })
  },
  searchHot(e) {
    this.onSearch({
      detail: e.currentTarget.dataset.word
    })
  },
  playSearch(e) {
    let music = e.currentTarget.dataset.music;
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${music.id}.mp3`;
    audioContext.singer = music.artists[0].name;
    audioContext.title = music.name;
    audioContext.epname = music.artists[0].name;
    app.globalData.PLAYER.music = music;
    app.globalData.PLAYER.isplay = true;
    this.setData({
      "playMusicPicUrl": ''
    })
    e.currentTarget.dataset.music.al = {
      picUrl: 'https://mo36.com/play.png'
    }

    setTimeout(() => {
      this.touchOnGoods(e)
    }, 50);
  }

})