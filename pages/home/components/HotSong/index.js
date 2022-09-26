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
  }
})