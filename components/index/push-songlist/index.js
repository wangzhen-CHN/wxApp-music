Component({
  properties: {
    pushSongList: Object,
  },
  data: {
    isloading: true,
  },
  ready: function () {
  },
  methods: {
    goSangList(e){
      const listId= e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/songList/songList?listId=${listId}`,
      })
    }
  }
})