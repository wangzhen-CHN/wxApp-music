//index.js
// const api = require('@/utils/request.js')
const APP = getApp()

Component({
  options: {
    styleIsolation: "shared"
  },
  data: {
    currentSearchWord: "",
    showSearchPopup: false,
    focusSearch: false,
    searchHistory:[],
    defaultSearchWord: "",
    hotSearchList: [],
    searchMusicList: []
  },
  ready: function () {
    Promise.all([
      APP.$get("/search/default"), //获取热搜词
      APP.$get("/search/hot/detail") // 推荐搜索
    ])
      .then((res) => {
        this.setData({
          defaultSearchWord: res[0].data.showKeyword,
          hotSearchList: res[1].data.slice(0, 10)
        })
      })
      .catch((e) => {
        console.log(e)
      })
  },
  methods: {
    //打开搜索弹窗
    onShowSearch() {
      this.triggerEvent("onSearchPopupShow", true)
      const searchHistory = wx.getStorageSync('searchHistory')||[]
      this.setData({
        searchHistory,
        showSearchPopup: true,
        focusSearch: true
      })
    },
    //关闭搜索弹窗
    onCloseSearch() {
      const searchHistory = wx.getStorageSync('searchHistory')||[]
      if (this.data.searchMusicList.length) {
        this.setData({
          searchHistory,
          currentSearchWord: "",
          searchMusicList: []
        })
      } else {
        this.triggerEvent("onSearchPopupShow", false)
        this.setData({
          showSearchPopup: false,
          currentSearchWord: [],
          searchMusicList: []
        })
      }
    },
    //清空搜索框
    onClearSearch() {
      this.setData({
        searchMusicList: []
      })
    },
    //添加历史记录
    addHistory(current){
      const searchHistory = wx.getStorageSync('searchHistory')||[]
      const arr = [...new Set([current,...searchHistory])].slice(0,5)
      wx.setStorageSync('searchHistory',arr)
    },    
    //删除历史记录
    onDeleteHistory(){
      wx.setStorageSync('searchHistory',[])
      this.setData({ searchHistory:[]  })
    },
    //搜索
    onSearch(val) {
      wx.showLoading({
        title: "正在搜索.."
      })
      const currentSearchWord = val.detail ? val.detail : this.data.defaultSearchWord
     this.addHistory(currentSearchWord)
      APP.$get("/cloudsearch?limit=20&keywords=" + currentSearchWord).then((res) => {
        console.log(res.result.songs)
        if (res.result.songs.length > 0) {
          this.setData({
            currentSearchWord,
            searchMusicList: res.result.songs
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: "搜索有点问题~~",
            icon: "none"
          })
        }
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
