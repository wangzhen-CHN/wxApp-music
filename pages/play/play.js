//index.js
//获取应用实例
const api = require('../../utils/request.js')
const audioContext = wx.createInnerAudioContext();
audioContext.src = "https://music.163.com/song/media/outer/url?id=255020.mp3";
Page({
  data: {
    isplay: false,
    lrcDir:"[00:00.000] 作曲 : 周杰伦\n[00:01.000] 作词 : 方文山\n[00:05.680]编曲：林迈可\n[00:26.09]女：明明早上人还在香港\n[00:29.27]还在九龙茶馆喝褒汤\n[00:32.41]怎么场景一下跳西安\n[00:35.61]我在护城河的堤岸\n[00:38.85]站在古老神秘的城墙\n[00:42.06]月光摇又晃\n[00:45.08]我用英语跟小贩交谈\n[00:48.40]突然画面一下就全暗\n[00:51.40]男：我\n[00:51.95]女：还在想\n[00:52.54]到底身在何方\n[00:54.52]男：我\n[00:55.02]女：变模样\n[00:55.81]是个华裔姑娘\n[00:57.79]男：我\n[00:58.27]女：开始想\n[00:58.91]认真细心装扮\n[01:01.00]男：我\n[01:01.46]女：回台上\n[01:02.13]终于轮我上场\n[01:04.19]合：耍花枪\n[01:05.33]一个后空翻\n[01:06.92]腰身跟着转\n[01:08.50]马步扎的稳当\n[01:10.59]耍花枪\n[01:11.70]比谁都漂亮\n[01:13.29]接着唱一段\n[01:14.92]虞姬和霸王\n[01:17.00]耍花枪\n[01:18.11]舞台的戏班\n[01:19.78]二胡拉的响\n[01:21.31]观众用力鼓掌\n[01:23.31]耍花枪\n[01:24.50]比谁都漂亮\n[01:26.09]刀马旦身段\n[01:27.75]演出风靡全场\n[01:52.50]男：一口粮一张床一面墙一扇窗\n[01:54.35]我洒下一地月光一次种下一亩高粱\n[01:56.90]一个人在北大荒\n[01:58.64]一碗热汤\n[02:00.21]温暖了我一个晚上\n[02:01.92]一匹苍狼一身风霜\n[02:03.34]走过丝路回家乡\n[02:05.29]女：站在古老神秘的城墙\n[02:08.43]月光摇又晃\n[02:11.55]我用英语跟小贩交谈\n[02:14.77]突然画面一下就全暗\n[02:18.05]男：我\n[02:18.46]女：还在想\n[02:18.98]到底身在何方\n[02:20.88]男：我\n[02:21.34]女：变模样\n[02:22.08]是个华裔姑娘\n[02:24.04]男：我\n[02:24.52]女：开始想\n[02:25.31]认真细心装扮\n[02:27.31]男：我\n[02:27.67]女：回台上\n[02:28.43]终于轮我上场\n[02:30.49]耍花枪\n[02:31.70]一个后空翻\n[02:33.30]腰身跟着转\n[02:34.90]马步扎的稳当\n[02:36.95]耍花枪\n[02:38.13]比谁都漂亮\n[02:39.71]接着唱一段\n[02:41.35]虞姬和霸王\n[02:43.31]合：耍花枪\n[02:44.49]舞台的戏班\n[02:46.09]二胡拉的响\n[02:47.73]观众用力鼓掌\n[02:49.73]耍花枪\n[02:50.93]比谁都漂亮\n[02:52.50]刀马旦身段\n[02:54.11]演出风靡全场\n[02:56.45]女：耍花枪\n[02:57.24]一个后空翻\n[02:58.84]腰身跟着转\n[03:00.45]马步扎的稳当\n[03:02.53]耍花枪\n[03:03.68]比谁都漂亮\n[03:05.27]接着唱一段\n[03:06.88]虞姬和霸王\n",
    //文稿数组，转化完成用来在wxml中使用
    storyContent:[],
    //文稿滚动距离
    marginTop:0,
    //当前正在第几行
    currentIndex222:0
  },
  back: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  // onReady:function(){
  //   audioContext.play();
  //   console.log(audioContext)
  // },
  onLoad: function () {
    var that = this
    audioContext.onTimeUpdate(function() {
      if (that.data.currentIndex222 >= 2) {//超过2行开始滚动
        that.setData({
          marginTop: (that.data.currentIndex222 - 2) * 30
        })
      }
      // 文稿对应行颜色改变
      if (that.data.currentIndex222!=that.data.storyContent.length - 1){//
        var j = 0;
        for (var j = that.data.currentIndex222; j < that.data.storyContent.length; j++) {
          // 当前时间与前一行，后一行时间作比较， j:代表当前行数
          if (that.data.currentIndex222 == that.data.storyContent.length - 2) {
           //最后一行只能与前一行时间比较
            if (parseFloat(audioContext.currentTime) > parseFloat(that.data.storyContent[that.data.storyContent.length - 1][0])) {
              that.setData({
                currentIndex222: that.data.storyContent.length - 1
              })
              return;
            }
          } else {
            if (parseFloat(audioContext.currentTime) > parseFloat(that.data.storyContent[j][0]) && parseFloat(audioContext.currentTime) < parseFloat(that.data.storyContent[j + 1][0])) {
              that.setData({
                currentIndex222: j
              })
              return;
            }
          }
        }
      }
    });
  },
  onShow: function () {
    // console.log(this.getTabBar())
  },
  play:function(){
    if(this.data.isplay){
      this.setData({isplay:false})
      audioContext.pause();
    }else{
      this.setData({isplay:true})
      audioContext.play();

    }
    this.setData({
      storyContent: this.sliceNull(this.parseLyric(this.data.lrcDir))
    })
  },
  parseLyric: function (text) {
    var result = [];
    var lines = text.split('\n') //切割每一行
    var pattern = /\[\d{2}:\d{2}.\d{2}\]/g //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
    //去掉不含时间的行
    console.log(lines)
    while(!pattern.test(lines[0])) {
      lines = lines.slice(1);
    };
    //上面用'\n'生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {
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
      if (lrc[i][1] == "") {
      } else {
        result.push(lrc[i]);
      }
    }
    return result
  },
})