const api = require('../../utils/request.js')

Page({
  data: {
    searchWord:'',
  },
  onLoad: function () {
    Promise.all([
      api.get('/search/default'), //推荐搜索
    ]).then(res => {
      this.setData({
        searchWord:res[0].data.showKeyword
      })
    }).catch(e => {
      console.log(e)
    })
  },
})