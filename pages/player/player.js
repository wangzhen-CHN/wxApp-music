//index.js
//获取应用实例
const api = require('../../utils/request.js')
const app = getApp();
// 初始化播放器

Page({
  data: {
    isplay: false,
    audioContext: {},
    music: {
      name: "暂无歌曲",
      pic: '../../images/nav/play.png'
    },
    lrcDir: "",
    //文稿数组，转化完成用来在wxml中使用
    storyContent: [],
    //文稿滚动距离
    marginTop: 0,
    //当前正在第几行
    currentIndex222: 0
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },

  onLoad: function () {
    this.setData({
      music: app.globalData.currentPlaySong,
      // isplay:this.getTabBar().PLAYER.isplay,
      backgroundAudioManager: app.globalData.backgroundAudioManager
    })
    //歌词
    // var that = this
    // that.data.audioContext.onTimeUpdate(function () {
    //   if (that.data.currentIndex222 >= 2) { //超过2行开始滚动
    //     that.setData({
    //       marginTop: (that.data.currentIndex222 - 2) * 40
    //     })
    //   }
    //   // 文稿对应行颜色改变
    //   if (that.data.currentIndex222 != that.data.storyContent.length - 1) { //
    //     var j = 0;
    //     for (var j = that.data.currentIndex222; j < that.data.storyContent.length; j++) {
    //       // 当前时间与前一行，后一行时间作比较， j:代表当前行数
    //       if (that.data.currentIndex222 == that.data.storyContent.length - 2) {
    //         //最后一行只能与前一行时间比较
    //         if (parseFloat(that.data.audioContext.currentTime) > parseFloat(that.data.storyContent[that.data.storyContent.length - 1][0])) {
    //           that.setData({
    //             currentIndex222: that.data.storyContent.length - 1
    //           })
    //           return;
    //         }
    //       } else {
    //         if (parseFloat(that.data.audioContext.currentTime) > parseFloat(that.data.storyContent[j][0]) && parseFloat(that.data.audioContext.currentTime) < parseFloat(that.data.storyContent[j + 1][0])) {
    //           that.setData({
    //             currentIndex222: j
    //           })
    //           return;
    //         }
    //       }
    //     }
    //   }
    // });
  },
  onShow: function () {
    // console.log(this.getTabBar())
  },
  play: function (e) {
    if (this.data.isplay) {
      console.log(e.currentTarget.dataset)
      this.setData({
        isplay: false,
      })
      app.globalData.PLAYER.isplay = false
      app.globalData.PLAYER.pause();
    } else {
      this.setData({
        isplay: true,
      })
      app.globalData.PLAYER.isplay = true
      app.globalData.PLAYER.play();

    }
    // this.setData({
    //   storyContent: this.sliceNull(this.parseLyric(this.data.lrcDir))
    // })
  },
  parseLyric: function (text) {
    var result = [];
    var lines = text.split('\n') //切割每一行
    var pattern = /\[\d{2}:\d{2}.\d{2}\]/g //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
    //去掉不含时间的行
    console.log(lines)
    while (!pattern.test(lines[0])) {
      lines = lines.slice(1);
    };
    //上面用'\n'生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function (v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {
      //提取出时间[xx:xx.xx]
      var time = v.match(pattern),
        //提取歌词
        value = v.replace(pattern, '');
      // 因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
      time.forEach(function (v1, i1, a1) {
        //去掉时间里的中括号得到xx:xx.xx
        var t = v1.slice(1, -1).split(':');
        //将结果压入最终数组
        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
      });
    });
    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function (a, b) {
      return a[0] - b[0];
    });
    return result;
  },
  //去除空白
  sliceNull: function (lrc) {
    var result = []
    for (var i = 0; i < lrc.length; i++) {
      if (lrc[i][1] == "") {} else {
        result.push(lrc[i]);
      }
    }
    return result
  },
})