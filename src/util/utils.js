export default {
  GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    let r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    let context = ""; 
    if (r != null) {
      context = r[2]; 
    }
    reg = null; 
    r = null; 
    return context == null || context == "" || context == "undefined" ? "" : context;
  },
   
  FormatTime(date) {
    let curTime = new Date();
    let year = curTime.getFullYear();
    let month = curTime.getMonth() + 1;
    let day = curTime.getDate();

    let hour = curTime.getHours();
    let min = curTime.getMinutes();
    let seconds = curTime.getSeconds();

    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}:${seconds < 10 ? '0' + seconds : seconds}`
  },

  getCurrentMonth() {
    let nowDate = new Date()
    let month = (nowDate.getMonth() + 1) < 10 ? '0' + (nowDate.getMonth() + 1) : (nowDate.getMonth() + 1)
    return nowDate.getFullYear() + '-' + month
  },

  //导出loading
  loadingEx(that, text) {
    that.$loading({
      lock: true,
      text: text,
    })
  },
  closeLoadingEx(that, type,msg) {
    let loadingInstance = that.$loading()
    setTimeout(() => {
      loadingInstance.close()
      that.$message({
        type: type,
        message: msg
      })
    }, 500)
  }
}