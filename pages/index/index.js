//index.js

const api = require('../../utils/request.js')
const app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    showSearch: false,
    isloading: true,
    animationPicUrl:'../../images/logo.png',
    playMusicPicUrl: '',
    searchWord: '',
    playMusicId:'',
    searchDefaultWord: '',
    pushSongs: [],
    pushSongList: [],
    hotSearchList: [],
    searchMusicList: [],
    currentSwiper: 0,
  },
  onShow: function () {
    // console.log('xxxxxxxxxxx',this.getTabBar())
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      app.globalData.getTabBar = this.getTabBar()
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  onLoad: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      app.globalData.getTabBar = this.getTabBar()
      this.getTabBar().setData({
        selected: 0
      })
    }
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    })
    const cookie = wx.getStorageSync('login_token')
    Promise.all([
      api.get('/search/default'), //推荐搜索
      api.get('/search/hot/detail') // 获取热搜词
    ]).then(res => {
      // wx.hideLoading();
      this.setData({
        isloading: false,
        searchDefaultWord: res[0].data.showKeyword,
        searchWord: res[0].data.showKeyword,
        hotSearchList: res[1].data
      })
    }).catch(e => {
      console.log(e)
    })

  },
  onShow() {
    const pushSongListUrl = app.globalData.isLogin ? '/recommend/resource' : '/top/playlist/highquality?limit=13&cat=华语' //个人推荐歌单||精品华语歌单
    const pushSongUrl = app.globalData.isLogin ? '/recommend/songs' : '/playlist/detail?id=2478853012' //个人推荐音乐||精品音乐
    Promise.all([
      api.get(pushSongListUrl), //推荐歌单
      api.get(pushSongUrl) // 推荐音乐
    ]).then(res => {
      if (!app.globalData.isLogin) {
        const pushSongList = []
        const pushSongs = []
        res[0].playlists.map(item => {
          pushSongList.push({
            id: item.id,
            name: item.name,
            picUrl: item.coverImgUrl,
            playcount: item.playCount,
          })
        })
        // res[1].playlist.tracks.map(item=>{
        //   pushSongs.push({
        //     id:item.id,
        //     name:item.name,
        //     picUrl:item.coverImgUrl,
        //     playcount:item.playCount,
        //   })
        // })
        this.setData({
          pushSongList,
          pushSongs: res[1].playlist.tracks
        })
      } else {
        this.setData({
          pushSongList: res[0].recommend,
          pushSongs: res[1].data.dailySongs,
        })
      }
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  playMusic: function (e) {
    const id = e.currentTarget.dataset['id']
    app.play(id).then(res => { //调用全局播放方法
      const music = e.currentTarget.dataset.music;
      const query = wx.createSelectorQuery();
      query.select('.img-num-' + id).boundingClientRect()
      query.exec(res => {
        this.setData({
          isAnimation: true,
          animationPicUrl: music.al.picUrl,
          animationLeft: res[0].left + 'px',
          animationTop: res[0].top + 'px',
          animationOpacity: 1,
          animationTransition: 'left 0s, top 0s',
        })
        this.setData({
          animationLeft: app.globalData.ww / 2 - 30 + 'px',
          animationTop: app.globalData.hh - 56 + 'px',
          animationOpacity: 0.5,
          animationTransition: 'left 0.8s linear, top 0.8s ease-in,opacity 0.8s',
        })
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
      })
    })
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