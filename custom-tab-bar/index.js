const APP = getApp()
Component({
  data: {
    selected: 0,
    color: '#999',
    isPlaying: false,
    isPause: false,
    isShow: true,
    selectedColor: '#00b872',
    gradientColor: {
      '0%': '#5bc2fe',
      '100%': '#388ef5'
    },
    borderStyle: 'white',
    routerList: [
      {
        selectedIconPath: '../images/nav/music-active.svg',
        iconPath: '../images/nav/music.svg',
        pagePath: '/pages/home/home',
        text: '音乐'
      },
      {
        selectedIconPath: '../images/nav/play.svg',
        iconPath: '../images/nav/play.svg',
        pagePath: '/pages/player/player',
        text: ''
      },
      {
        selectedIconPath: '../images/nav/me-active.svg',
        iconPath: '../images/nav/me.svg',
        pagePath: '/pages/me/me',
        text: '我的'
      }
    ]
  },
  methods: {
    switch(e) {
      this.setData({ isShow: true })
      const url = e.currentTarget.dataset.router.pagePath
      if (url === '/pages/player/player') {
        APP.globalData.isPlaying ? wx.navigateTo({ url }) : wx.showToast({ title: '还没有播放音乐哟~~', icon: 'none' })
      } else if (url === '/pages/me/me') {
        this.setData({ isShow: false })
        wx.switchTab({ url })
      } else {
        wx.switchTab({ url })
      }
    }
  }
})
