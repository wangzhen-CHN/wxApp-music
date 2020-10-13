//index.js
const api = require('../../utils/request.js')
const app = getApp();
Component({
  data: {
    // 这里是一些组件内部数据
    hotList: [],
    isloading: true,
    isAnimation: '',
    animationLeft: 0,
    animationTop: 0,
    animationTransition: 'left 0s, top 0s',
    playMusicPicUrl: ''
  },
  ready: function () {
    api.get('/playlist/detail?id=19723756').then(res => { //云音乐飙升榜
      this.setData({
        isloading: false,
        hotList: res.playlist.tracks,
      })
    })
  },
  methods: {
    touchOnItem: function (e) {},
  }
})