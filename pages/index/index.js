//index.js

const api = require('../../utils/request.js')
const app = getApp();
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
    currentSwiper: 0,
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      app.globalData.getTabBar = this.getTabBar()
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
    const cookie = wx.getStorageSync('login_token')

    Promise.all([
      api.get('/search/default'), //推荐搜索
      api.get(`/recommend/songs?cookie=${cookie}`)
    ]).then(res => {
      // wx.hideLoading();
      this.setData({
        isloading: false,
        searchDefaultWord: res[0].data.showKeyword,
        searchWord: res[0].data.showKeyword,
        hotList: res[1].data.dailySongs,
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
  touchOnItem: function (e) {
    const id = e.currentTarget.dataset['id']
    app.play(id) //调用全局播放方法
    const music = e.currentTarget.dataset.music;
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
        "isPlay": false,
      })
      this.getTabBar().setData({
        "isPlay": true,
        'routerList[2]': {
          "iconPath": music.al.picUrl + '?param=200y200',
          "selectedIconPath": music.al.picUrl + '?param=200y200',
          "pagePath": "/pages/player/player",
          "text": ""
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
    app.play(music.id) //调用全局播放方法
  }

})