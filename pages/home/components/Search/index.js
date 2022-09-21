//index.js
// const api = require('@/utils/request.js')
const APP = getApp()

Component({
  data: {
    searchWord: "",
    showSearch: false,
    searchDefaultWord: "",
    hotSearchList: [],
    searchMusicList: [],
  },
  ready: function () {
    Promise.all([
      APP.$get("/search/default"), //获取热搜词
      APP.$get("/search/hot/detail") // 推荐搜索
    ])
      .then((res) => {
        this.setData({
          searchDefaultWord: res[0].data.showKeyword,
          searchWord: res[0].data.showKeyword,
          hotSearchList: res[1].data
        })
      })
      .catch((e) => {
        console.log(e)
      })
  },
  methods: {
    onShowSearch() {
      this.setData({
        showSearch: true,
      })
    },
    onCloseSearch() {
      this.setData({
        showSearch: false,
        searchWord: this.data.searchDefaultWord,
        searchMusicList: []
      })
    },
    onClearSearch() {
      this.setData({
        searchMusicList: []
      })
    },
    onSearch(val) {
      // APP.$get('/search/suggest?type=mobile&keywords='+val.detail).then(res => {
      // 获取热搜词
      wx.showLoading({
        title: "正在搜索.."
      })
      this.setData({
        searchWord: val.detail ? val.detail : this.data.searchDefaultWord
      })
      APP.$get("/search?limit=10&keywords=" + this.data.searchWord).then((res) => {
        console.log(res.result.songs)
        this.setData({
          searchMusicList: res.result.songs
        })
        wx.hideLoading()
      })
    },
    searchHot(e) {
      this.onSearch({
        detail: e.currentTarget.dataset.word
      })
    },
    playSearch(e) {
      let music = e.currentTarget.dataset.music
      APP.play(music.id) //调用全局播放方法
    }
  }
})
