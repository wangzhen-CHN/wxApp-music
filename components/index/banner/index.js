//index.js
const api = require('../../../utils/request.js')
Component({
  data: {
    // 这里是一些组件内部数据
    banners: [],
    isloading: true,
  },
  ready: function () {
    api.get('/banner?type=2').then(res => {
      this.setData({
        isloading: false,
        banners: res.banners,
      })
    })
  },
  methods: {
    // 这里是一个自定义方法
    swiperChange: function (e) {
      this.setData({
        currentSwiper: e.detail.current
      })
    },
  }
})