//mini播放器
Component({
  properties: {
    music: {
      type: Object,
      value: {}
    },
    isPlaying: {
      type: Boolean,
      value: false
    },
  },
  data: {

  },
  ready: function () {

  },
  methods: {
    goPlayer(){
      wx.navigateTo({
        url: '/pages/player/player',
      })
    }
  }
})