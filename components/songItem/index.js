// components/songItem/index.js
const APP = getApp()
Component({
  properties: {
    music: {
      type: Object,
      value: {}
    },
    showImg: {
      type: Boolean,
      value: true
    },
    boder: {
      type: Boolean,
      value: false
    }
  },
  data: {
    recommendSongs: [],
    isAnimation: false,
    animationPicUrl: '/images/nav/play.svg',
    animationLeft: 0,
    animationTop: 0,
    animationOpacity: 0,
    animationTransition: 'left 0s, top 0s'
  },
  methods: {
    playMusic: function (e) {
      const id = e.currentTarget.dataset['id']
      //调用全局播放方法
      APP.play(id)
      const music = e.currentTarget.dataset.music
      this.getTabBar().setData({
        isPlaying: true,
        'routerList[1]': {
          iconPath: music.al.picUrl + '?param=200y200',
          selectedIconPath: music.al.picUrl + '?param=200y200',
          pagePath: '/pages/player/player',
          text: ''
        }
      })
      // APP.play(id).then((res) => {
      //   const music = e.currentTarget.dataset.music
      //     this.getTabBar().setData({
      //       isPlaying: true,
      //       "routerList[1]": {
      //         iconPath: music.al.picUrl + "?param=200y200",
      //         selectedIconPath: music.al.picUrl + "?param=200y200",
      //         pagePath: "/pages/player/player",
      //         text: ""
      //       }
      //     })
      //   })
      // })
    }
  }
})
