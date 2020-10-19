const api = require('../../utils/request.js')
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    musicId: -1, //音乐id
    hidden: false, //加载动画是否隐藏
    isPlay: true, //歌曲是否播放
    currentPlaySong: {}, //歌曲信息
    hiddenLyric: true, //是否隐藏歌词
    backgroundAudioManager: {}, //背景音频对象
    duration: '', //总音乐时间（00:00格式）
    currentTime: '00:00', //当前音乐时间（00:00格式）
    totalProcessNum: 0, //总音乐时间 （秒）
    currentProcessNum: 0, //当前音乐时间（秒）
    storyContent: [], //歌词文稿数组，转化完成用来在页面中使用
    marginTop: 0, //文稿滚动距离
    currentIndex: 0, //当前正在第几行
    noLyric: false, //是否有歌词
    slide: false //进度条是否在滑动
  },
  //返回上一页
  backPage: function () {
    wx: wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const musicId = app.globalData.musicId
    const backgroundAudioManager = app.globalData.backgroundAudioManager
    const currentPlaySong = app.globalData.currentPlaySong
    // wx.setNavigationBarTitle({
    //   title: song.name
    // })
    this.setData({
      musicId,
      backgroundAudioManager,
      currentPlaySong
    })
    this.listenBackgroundAudioManager()
  },
  //播放音乐方法
  // play(musicId) {
  //   // this.setData({song})
  //   // api.get('/lyric?id='+musicId).then(res => {
  //   //   if (res.data.nolyric || res.data.uncollected) { //该歌无歌词,或者歌词未收集
  //   //     // console.log("无歌词")
  //   //     this.setData({
  //   //       noLyric: true
  //   //     })
  //   //   }
  //   //   else {  //有歌词
  //   //     this.setData({
  //   //       storyContent: this.sliceNull(this.parseLyric(res.lrc.lyric))
  //   //     })
  //   //   }
  //   // })
  //   this.createBackgroundAudioManager()
  // },
  ////////////////////////// 
  // 背景音频播放方法
  listenBackgroundAudioManager() {
    const backgroundAudioManager = this.data.backgroundAudioManager
    //监听背景音乐进度更新事件
    backgroundAudioManager.onTimeUpdate(() => {
      this.setData({
        totalProcessNum: backgroundAudioManager.duration,
        currentTime: this.formatSecond(backgroundAudioManager.currentTime),
        duration: this.formatSecond(backgroundAudioManager.duration)
      })
      if (!this.data.slide) { //如果进度条在滑动，就暂停更新进度条进度，否则会出现进度条进度来回闪动
        this.setData({
          currentProcessNum: backgroundAudioManager.currentTime,
        })
      }
      if (!this.data.noLyric) { //如果没有歌词，就不需要调整歌词位置
        this.lyricsRolling(backgroundAudioManager)
      }
    })

  },

  // 历史歌单去重
  unique(arr, musicId) {
    let index = arr.indexOf(musicId) //使用indexOf方法，判断当前musicId是否已经存在，如果存在，得到其下标
    if (index != -1) { //如果已经存在在历史播放中，则删除老记录，存入新记录
      arr.splice(index, 1)
      arr.push(musicId)
    } else {
      arr.push(musicId) //如果不存在，则直接存入历史歌单
    }
    return arr //返回新的数组
  },

  // 歌词滚动方法
  lyricsRolling(backgroundAudioManager) {
    // 歌词滚动
    this.setData({
      marginTop: (this.data.currentIndex - 3) * 39
    })
    // 当前歌词对应行颜色改变
    if (this.data.currentIndex != this.data.storyContent.length - 1) { //不是最后一行
      // var j = 0;
      for (let j = this.data.currentIndex; j < this.data.storyContent.length; j++) {
        // 当前时间与前一行，后一行时间作比较， j:代表当前行数
        if (this.data.currentIndex == this.data.storyContent.length - 2) { //倒数第二行
          //最后一行只能与前一行时间比较
          if (parseFloat(backgroundAudioManager.currentTime) > parseFloat(this.data.storyContent[this.data.storyContent.length - 1][0])) {
            this.setData({
              currentIndex: this.data.storyContent.length - 1
            })
            return;
          }
        } else {
          if (parseFloat(backgroundAudioManager.currentTime) > parseFloat(this.data.storyContent[j][0]) && parseFloat(backgroundAudioManager.currentTime) < parseFloat(this.data.storyContent[j + 1][0])) {
            this.setData({
              currentIndex: j
            })
            return;
          }
        }
      }
    }
  },

  // 格式化时间
  formatSecond(second) {
    var secondType = typeof second;
    if (secondType === "number" || secondType === "string") {
      second = parseInt(second);
      var minute = Math.floor(second / 60);
      second = second - minute * 60;
      return ("0" + minute).slice(-2) + ":" + ("0" + second).slice(-2);
    } else {
      return "00:00";
    }
  },
  // 播放上一首歌曲
  beforeSong() {
    // if (app.globalData.history_songId.length > 1) {
    //   app.globalData.playList.unshift(app.globalData.history_songId.pop())//将当前播放歌曲从前插入待放列表
    //   this.play(app.globalData.history_songId[app.globalData.history_songId.length - 1])  //播放历史歌单歌曲
    // } else {
    //   this.tips('前面没有歌曲了哦', '去选歌', true)
    // }
  },
  // 下一首歌曲
  nextSong() {
    app.nextSong()
    setTimeout(() => {
      console.log('音乐信息', app.globalData.currentPlaySong)
      this.setData({
        currentPlaySong: app.globalData.currentPlaySong
      })
    }, 500);
    // if (app.globalData.playList.length > 0) {
    //   this.play(app.globalData.playList.shift())//删除待放列表第一个元素并返回播放
    // } else {
    //   this.tips('后面没有歌曲了哦', '去选歌', true)
    // }
  },
  // 播放和暂停
  handleToggleBGAudio() {
    const backgroundAudioManager = this.data.backgroundAudioManager
    //如果当前在播放的话
    if (this.data.isPlay) {
      backgroundAudioManager.pause(); //暂停
    } else { //如果当前处于暂停状态
      backgroundAudioManager.play(); //播放
    }
    this.setData({
      isPlay: !this.data.isPlay
    })
  },
  // 点击切换歌词和封面
  showLyric() {
    this.setData({
      hiddenLyric: !this.data.hiddenLyric
    })
  },
  //去除空白行
  sliceNull: function (lrc) {
    var result = []
    for (var i = 0; i < lrc.length; i++) {
      if (lrc[i][1] !== "") {
        result.push(lrc[i]);
      }
    }
    return result
  },
  //格式化歌词
  parseLyric: function (text) {
    let result = [];
    let lines = text.split('\n'), //切割每一行
      pattern = /\[\d{2}:\d{2}.\d+\]/g; //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
    // console.log(lines);
    //去掉不含时间的行
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
    // 最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function (a, b) {
      return a[0] - b[0];
    });
    return result;
  },

  //进度条开始滑动触发
  start: function (e) {
    // console.log("开始滑动")
    // 控制进度条停，防止出现进度条抖动
    this.setData({
      slide: true
    })
  },
  //结束滑动触发
  end: function (e) {
    const position = e.detail.value
    let backgroundAudioManager = this.data.backgroundAudioManager //获取背景音频实例
    // console.log(position)
    backgroundAudioManager.seek(position) //改变歌曲进度
    console.log("结束")
    this.setData({
      currentProcessNum: position,
    })
    this.setData({
      slide: false
    })
    // 判断当前是多少行
    for (let j = 0; j < this.data.storyContent.length; j++) {
      // console.log('当前行数', this.data.currentIndex)
      // console.log(parseFloat(backgroundAudioManager.currentTime))
      // console.log(parseFloat(this.data.storyContent[j][0]))
      // 当前时间与前一行，后一行时间作比较， j:代表当前行数
      if (position < parseFloat(this.data.storyContent[j][0])) {
        this.setData({
          currentIndex: j - 1
        })
        return;
      }
    }
  }
})