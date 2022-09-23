const APP = getApp();
Component({
  data: {
    recommendSongs:[],
    isAnimation: false,
    animationPicUrl: '/images/nav/play.svg',
    animationLeft: 0,
    animationTop: 0,
    animationOpacity: 0,
    animationTransition: 'left 0s, top 0s',
  },
  ready: function () {
    const recommendSongsApi = APP.globalData.isLogin ? '/recommend/songs' : '/playlist/detail?id=2478853012' //个人推荐音乐||精品音乐
    APP.$get(recommendSongsApi).then(res => {
        this.setData({
          recommendSongs: APP.globalData.isLogin?res.data.dailySongs.slice(0,10):res.playlist.tracks.slice(0,10)
        })
    })
  },
  methods: {

  playMusic: function (e) {
    const id = e.currentTarget.dataset["id"]
    //调用全局播放方法
    APP.play(id).then((res) => {
      const music = e.currentTarget.dataset.music
      const query = wx.createSelectorQuery()
      query.select("#img-num-" + id).boundingClientRect()
      console.log("aaaaaaaaaa")
      console.log(query.select("#img-num-" + id))
      console.log(query.select("#img-num-" + id).boundingClientRect())
      query.exec((res) => {
      console.log(res)
        this.setData({
          isAnimation: true,
          animationPicUrl: music.al.picUrl,
          animationLeft: res[0].left + "px",
          animationTop: res[0].top + "px",
          animationOpacity: 1,
          animationTransition: "left 0s, top 0s"
        })
        this.setData({
          animationLeft: APP.globalData.ww / 2 - 30 + "px",
          animationTop: APP.globalData.hh - 56 + "px",
          animationOpacity: 0.5,
          animationTransition: "left 0.8s linear, top 0.8s ease-in,opacity 0.8s"
        })
        this.getTabBar().setData({
          isPlay: false
        })
        this.getTabBar().setData({
          isPlay: true,
          "routerList[1]": {
            iconPath: music.al.picUrl + "?param=200y200",
            selectedIconPath: music.al.picUrl + "?param=200y200",
            pagePath: "/pages/player/player",
            text: ""
          }
        })
      })
    })
  }
  }
})