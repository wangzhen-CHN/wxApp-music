const APP = getApp();
Component({
  // properties: {
  //   recommendList: Object,
  // },
  data: {
    isloading: true,
    recommendList:[]
  },
  ready: function () {
    const recommendListUrl = APP.globalData.isLogin ? '/recommend/resource' : '/top/playlist/highquality?limit=13&cat=华语' //个人推荐歌单||精品华语歌单
    const recommendUrl = APP.globalData.isLogin ? '/recommend/songs' : '/playlist/detail?id=2478853012' //个人推荐音乐||精品音乐
    Promise.all([
      APP.$get(recommendListUrl), //推荐歌单
      APP.$get(recommendUrl) // 推荐音乐
    ]).then(res => {
      if (!APP.globalData.isLogin) {
        const recommendList = []
        const recommends = []
        res[0].playlists.map(item => {
          recommendList.push({
            id: item.id,
            name: item.name,
            picUrl: item.coverImgUrl,
            playcount: item.playCount,
          })
        })
        this.setData({
          recommendList,
          recommends: res[1].playlist.tracks
        })
      } else {
        this.setData({
          recommendList: res[0].recommend,
          recommends: res[1].data.dailySongs,
        })
      }
    })
  },
  methods: {
    openSangList(e){
      const listId= e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/songList/songList?listId=${listId}`,
      })
    }
  }
})