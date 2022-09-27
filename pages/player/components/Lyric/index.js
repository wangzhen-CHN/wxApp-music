//index.js
const Event = require('../../../../utils/event.js')
Component({
  properties: {
    _currentPlaying: {
      type: Object,
      value: {}
    }
  },
  options: {
    styleIsolation: 'shared'
  },
  data: {
    currentPlaying: {}
  },
  observers: {
    //监听
    _currentPlaying: function (value) {
      this.setData({
        currentPlaying: value
      })
    }
  },
  ready: function () {
    this.setData({
      currentPlaying: this.data._currentPlaying
    })
    // console.log('onLoad----')
    // Event.$on({
    //   name: 'noti',
    //   tg: this,
    //   success: (res) => {
    //     console.log('收到消息了-------', res)
    //   }
    // })
  },
  methods: {}
})
