Component({
  data: {
    selected: 0,
    color: "#888d93",
    selectedColor: "#3341d5",
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
        "pagePath": "/pages/play/play",
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
  // ready() {wx.switchTab({url:"/pages/play/play"})},
  methods: {
    switch(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})