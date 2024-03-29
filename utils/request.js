// const baseUrl = 'http://106.14.46.131:4000';
const baseUrl = 'https://api.coder.wang/music'
const http = ({ url = '', param = {}, ...other } = {}) => {
  let timeStart = Date.now()
  const cookie = wx.getStorageSync('login_token')
  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: param,
      header: {
        'content-type': 'application/json',
        cookie
      },
      ...other,
      complete: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res)
          wx.showToast({
            title: res.data.message || '登录失败',
            icon: 'error'
          })
        }
      }
    })
  })
}

const getUrl = (url) => {
  if (url.indexOf('://') == -1) {
    url = baseUrl + url
  }
  return url
}

// get方法
const get = (url, param = {}) => {
  return http({
    url,
    param
  })
}

const post = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'post'
  })
}

module.exports = {
  baseUrl,
  get,
  post
}
