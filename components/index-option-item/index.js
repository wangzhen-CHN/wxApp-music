//index.js
const api = require('../../utils/request.js')
Component({
  data: {
    // 这里是一些组件内部数据
    daySong: {},
    isloading: true,
  },
  ready: function () {
    api.get('/personalized/newsong').then(res => { // 新歌
      this.setData({
        isloading: false,
        daySong: {
          ...res.result[0],
          picUrl: res.result[0].picUrl + '?param=200y200'
        },
      })
    })
  },
  methods: {}
})