const api = require('../../utils/request')
const app = getApp()
Page({
  data: {
    phone: '',
    sms: '',
    likeList: [],
    userInfo: {},
    userDetail: {},
    isSms: false,
    defaultAvatarUrl: '../../images/nav/user.svg',
    isLogin: false,
    userList: [],
    addList: []
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
        isShow: false
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
  handleBack() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  async handleSms() {
    const { phone } = this.data
    if (phone.length !== 11) {
      return wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    }
    const res = await api.get(`/captcha/sent?phone=${phone}`)
    if (res.data) {
      wx.showToast({
        title: '验证码已发送',
        icon: 'none'
      })
      this.setData({ isSms: true })
    }
  },
  async handleLogin() {
    const { phone, sms } = this.data
    if (phone.length !== 11) {
      return wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    }
    if (!sms) {
      return wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    }
    const verify = await api.get(`/captcha/verify?phone=${phone}&captcha=${sms}`)
    if (verify.data) {
      const res = await api.get(`/login/cellphone?phone=${phone}&captcha=${sms}`)
      if (res.code !== 200) {
        return wx.showToast({
          title: res.msg || '登录失败',
          icon: 'error'
        })
      }
      this.setData({
        userInfo: res,
        isLogin: true,
        loginPopup: false
      })
      app.globalData.isLogin = true
      app.globalData.userInfo = res
      app.globalData.login_token = 'MUSIC_U=' + res.token
      app.globalData.uid = res.account.id
      wx.setStorageSync('userInfo', res)
      wx.setStorageSync('login_token', 'MUSIC_U=' + res.token)
      wx.setStorageSync('uid', res.account.id)
      wx.showToast('登录成功')
      this.getSubcount()
    } else {
      wx.showToast({
        title: '验证码有误',
        icon: 'none'
      })
    }
  },
  //获取用户信息
  getSubcount() {
    const cookie = wx.getStorageSync('login_token')
    const uid = wx.getStorageSync('uid')
    api.get(`/user/playlist?uid=${uid}&cookie=${cookie}`).then((res) => {
      let userList = res.playlist.filter((item) => !item.subscribed)
      let addList = res.playlist.filter((item) => item.subscribed)
      this.setData({
        userList,
        addList
      })
    })
    api.get(`/user/detail?uid=${uid}&cookie=${cookie}`).then((res) => {
      this.setData({
        userDetail: res
      })
    })
    api.get(`/likelist?uid=${uid}&cookie=${cookie}`).then((res) => {
      this.setData({
        likeList: res
      })
    })
  },
  handleCancel() {
    this.setData({
      loginPopup: false
    })
  },
  handleLoginOut() {
    app.globalData.isLogin = false
    app.globalData.userInfo = {}
    app.globalData.login_token = ''
    app.globalData.uid = ''
    wx.setStorageSync('userInfo', {})
    wx.setStorageSync('login_token', '')
    wx.setStorageSync('uid', '')
    this.setData({
      likeList: [],
      userDetail: {},
      userList: [],
      addList: []
    })
  },
  goSangList(e) {
    const listId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/songList/songList?listId=${listId}`
    })
  },
  showLogin() {
    this.setData({
      loginPopup: true
    })
  }
})
