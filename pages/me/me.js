const api=require('../../utils/request')
Page({
  data: {
    tel:'',
    password:'',
    loginPopup:false
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      })
    }
  },
  formSubmit(){
    const {
      tel,
      password,
    } = this.data
    console.log(tel,password)
    api.get(`/login/cellphone?phone=${tel}&password=${password}`).then(res => {
      console.log('登录：',res)
      // this.setData({
      //   'searchMusicList': res.result.songs
      // })
    })
  }
})