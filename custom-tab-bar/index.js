Component({
  data: {
    selected: 0,
    color: "#888d93",
    selectedColor: "#19a6ff",
    gradientColor: {
      '0%': '#5bc2fe',
      '100%': '#388ef5',
    },
    borderStyle: "white",
    list: [
      {
        "selectedIconPath": "../images/nav-active/music.png",
        "iconPath": "../images/nav/music.png",
        "pagePath": "/pages/index/index",
        "text": "音乐"
      }, {
        "selectedIconPath": "../images/nav-active/video.png",
        "iconPath": "../images/nav/video.png",
        "pagePath": "/pages/video/video",
        "text": "视频"
      }, {
        "selectedIconPath": "../images/nav-active/play.png",
        "iconPath": "../images/nav/play.png",
        "pagePath": "/pages/player/player",
        "play":false,
        "text": ""
      }, {
        "selectedIconPath": "../images/nav-active/me.png",
        "iconPath": "../images/nav/me.png",
        "pagePath": "/pages/logs/logs",
        "text": "日志"
      }, {
        "selectedIconPath": "../images/nav-active/v.png",
        "iconPath": "../images/nav/v.png",
        "pagePath": "/pages/me/me",
        "text": "我的"
      }
    ]
  },
  methods: {
    switch(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log(data.index)
      console.log(url)
      url==='/pages/player/player'?wx.navigateTo({url}):wx.switchTab({url})
      // this.setData({
      //   selected: data.index
      // })
    }
  }
})