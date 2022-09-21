Component({
  data: {
    selected: 0,
    color: "#999",
    isPlay:false,
    isPause:false,
    selectedColor: "#00b872",
    gradientColor: {
      '0%': '#5bc2fe',
      '100%': '#388ef5',
    },
    borderStyle: "white",
    routerList: [{
      "selectedIconPath": "../images/nav/music-active.svg",
      "iconPath": "../images/nav/music.svg",
      "pagePath": "/pages/home/home",
      "text": "音乐"
    }, {
      "selectedIconPath": "../images/nav/play.svg",
      "iconPath": "../images/nav/play.svg",
      "pagePath": "/pages/player/player",
      "text": ""
    }, {
      "selectedIconPath": "../images/nav/me-active.svg",
      "iconPath": "../images/nav/me.svg",
      "pagePath": "/pages/me/me",
      "text": "我的"
    }]
  },
  methods: {
    switch (e) {
      const data = e.currentTarget.dataset
      console.log(data)
      const url = data.router.pagePath
      if (url === '/pages/player/player') {
        if (this.data.isPlay||this.data.isPause) {
          wx.navigateTo({
            url
          })
        }
      } else {
        wx.switchTab({
          url
        })
      }
    }
  }
})