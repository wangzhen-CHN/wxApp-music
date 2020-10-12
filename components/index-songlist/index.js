//index.js
const api = require('../../utils/request.js')
Component({
  data: {
    // 这里是一些组件内部数据
    playlists: [],
    isloading: true,
  },
  ready: function () {
    api.get('/top/playlist?limit=13').then(res => {
      this.setData({
        isloading: false,
        playlists: res.playlists,
      })
    })
  },
  methods: { }
})