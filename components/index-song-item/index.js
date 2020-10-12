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
    touchOnItem: function (e) {
      const id = e.currentTarget.dataset['id']
      const music = e.currentTarget.dataset.music;
      const query = wx.createSelectorQuery();
       console.log(query)
      query.select('.img-num-' + id).boundingClientRect()
      query.exec(res => {
      })
      // const id = e.currentTarget.dataset['id']
      // console.log(id)
      // const music = e.currentTarget.dataset.music;
      // const query = wx.createSelectorQuery();
      // query.select('.img-num-' + id).boundingClientRect()
      // query.exec(res => {
      //   console.log(res)
        // this.setData({
        //   "isAnimation": e.currentTarget.dataset['id'],
        //   animationLeft: res[0].left + res[0].width / 2 + 'px',
        //   animationTop: res[0].top + res[0].height / 2 + 'px',
        //   animationTransition: 'left 0s, top 0s',
        // })
        // setTimeout(() => {
        //   this.setData({
        //     animationLeft: app.globalData.ww / 2 - 30 + 'px',
        //     animationTop: app.globalData.hh - 56 + 'px',
        //     animationTransition: 'left 1s linear, top 1s ease-in',
        //   })
        // }, 1);
      // })
    },
  }
})