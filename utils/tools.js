// 格式化时间
export function formatSecond (second) {
  var secondType = typeof second
  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)
    var minute = Math.floor(second / 60)
    second = second - minute * 60
    return ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2)
  } else {
    return '00:00'
  }
}
//去除空白行
export function sliceNull(lrc) {
  var result = []
  for (var i = 0; i < lrc.length; i++) {
    if (lrc[i][1] !== '') {
      result.push(lrc[i])
    }
  }
  return result
}
//格式化歌词
export function parseLyric(text) {
  let result = []
  let lines = text.split('\n'), //切割每一行
    pattern = /\[\d{2}:\d{2}.\d+\]/g //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
  // console.log(lines);
  //去掉不含时间的行
  while (!pattern.test(lines[0])) {
    lines = lines.slice(1)
  }
  //上面用'\n'生成数组时，结果中最后一个为空元素，这里将去掉
  lines[lines.length - 1].length === 0 && lines.pop()
  lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {
    //提取出时间[xx:xx.xx]
    var time = v.match(pattern),
      //提取歌词
      value = v.replace(pattern, '')
    // 因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
    time.forEach(function (v1, i1, a1) {
      //去掉时间里的中括号得到xx:xx.xx
      var t = v1.slice(1, -1).split(':')
      //将结果压入最终数组
      result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value])
    })
  })
  // 最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
  result.sort(function (a, b) {
    return a[0] - b[0]
  })
  return sliceNull(result)
}
