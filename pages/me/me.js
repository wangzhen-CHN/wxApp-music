const api = require('../../utils/request')
const app = getApp();
Page({
  data: {
    tel: '',
    password: '',
    likeList: [],
    userInfo: {},
    userDetail: {},
    loginPopup: false,
    defaultAvatarUrl: '../../images/nav/user.svg',
    isLogin: false,
    userList: [],
    addList: []
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },
  onLoad() {
    console.log(app.globalData)
    if (app.globalData.isLogin) {
      this.setData({
        isLogin: app.globalData.isLogin,
        userInfo: app.globalData.userInfo
      })
      this.getSubcount()
    }
  },
  handleLogin() {
    const {tel,  password, } = this.data
    console.log(tel, password)
    api.get(`/login/cellphone?phone=${tel}&password=${password}`).then(res => {
      console.log('登录：', res)
        if (res.code !== 200) {
          return wx.showToast({
          title: res.msg||'登录失败',
          icon: 'error',
        })
      }
      this.setData({
        'userInfo': res,
        'isLogin': true,
        'loginPopup': false
      })
      app.globalData.isLogin = true
      app.globalData.userInfo = res;
      app.globalData.login_token = 'MUSIC_U=' + res.token;
      app.globalData.uid = res.account.id;
      wx.setStorageSync("userInfo", res);
      wx.setStorageSync("login_token", 'MUSIC_U=' + res.token);
      wx.setStorageSync("uid", res.account.id);
      wx.showToast("登录成功")
      this.getSubcount()
    })
  },
  //获取用户信息
  getSubcount() {
    const cookie = wx.getStorageSync('login_token')
    const uid = wx.getStorageSync('uid')
    api.get(`/user/playlist?uid=${uid}&cookie=${cookie}`).then(res => {
      let userList = res.playlist.filter(item => !item.subscribed)
      let addList = res.playlist.filter(item => item.subscribed)
      this.setData({
        userList,
        addList
      })
    })
    api.get(`/user/detail?uid=${uid}&cookie=${cookie}`).then(res => {
      this.setData({
        userDetail: res
      })
    })
    api.get(`/likelist?uid=${uid}&cookie=${cookie}`).then(res => {
      this.setData({
        likeList: res
      })
    })
  },
  handleCancel() {
    this.setData({
      "loginPopup": false
    })
  },
  handleLoginOut() {
    app.globalData.isLogin = false
    app.globalData.userInfo = {};
    app.globalData.login_token = '';
    app.globalData.uid = '';
    wx.setStorageSync("userInfo", {});
    wx.setStorageSync("login_token", '');
    wx.setStorageSync("uid", '');
    this.setData({
      likeList: [],
      userDetail: {},
      userList:[],
      addList:[]
    })
  },
  goSangList(e){
    const listId= e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/songList/songList?listId=${listId}`,
    })
  },
  showLogin() {
    this.setData({
      "loginPopup": true
    })
  }
})