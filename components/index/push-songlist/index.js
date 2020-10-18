//index.js
const api = require('../../../utils/request.js')
Component({
  data: {
    // 这里是一些组件内部数据
    playlists: [],
    isloading: true,
  },
  ready: function () {
    const cookie = wx.getStorageSync('login_token')
    api.get(`/recommend/resource?cookie=${cookie}`).then(res => {
      this.setData({
        isloading: false,
        playlists: res.recommend,
      })
    })
  },
  methods: {
    goSangList(e){
      const listId= e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/songList/songList?listId=${listId}`,
      })
    }
  }
})