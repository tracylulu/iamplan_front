const axios = require('axios')
import Vue from 'vue'

//const store = require('store') 可直接获取到store commonJs
import store from '../store/index' //编译顺序不能直接获取到store
import router from '../router/index'
import {
  Message,
  Loading
} from 'element-ui'

// 详细文档请参照 https://github.com/axios/axios

// `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
// 如果请求花费了超过 `timeout` 的时间，请求将被中断
axios.defaults.timeout = 300000;

// `responseType` 表示服务器响应的数据类型，
//  可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
axios.defaults.responseType = 'json';
//允许请求时携带cookie
axios.defaults.withCredentials = false;
// `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。
// 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve;
// 否则，promise 将被 rejecte
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 300; // 默认的
};
//请求拦截
axios.interceptors.request.use(
  config => { 
    // 请求人员联想系统的token或者联想数据，此接口不做headers处理
    if(config.url.indexOf('/common/getToken') != -1) {
      // console.log('人员联想接口获取结果')
    }
    else if(config.url.indexOf('/api/user/getDevelopmentPerson') != -1 
      || config.url.indexOf('/api/user/getRegularEmployee') != -1 
      || config.url.indexOf('/api/user/getEmployeesByUserType') != -1
    ) {
      config.headers.token = store.state.assetApplyDetail.associatedToken
    }
    //请求hrss获取token值不传token值
    else if(config.url.indexOf('GetHrssToken')!=-1 || config.url.indexOf('GetCqmsToken')!=-1){
      config.headers.Authorization = ''
    }  
    //hrss 接口传值token值需要单独给出token值 
    else if(config.url.indexOf('Cqms')!=-1){
      if(store.state.Login.tokenHrss != ""){
        config.headers.Authorization = store.state.Login.tokenHrss
      }
    }
    else {
      config.headers['Cache-Control'] = 'no-cache' // 是http 1.1提供的
      config.headers['Pragma'] = 'no-cache' // 兼容http 1.0 
      if (store.state.Login.token != "") {
        //console.log('请求头加token')
        //console.log(store.state.Login.token,'请求头的添加')
        config.headers.Authorization = store.state.Login.token
        //config.headers['Access-Control-Expose-Headers']='filename'
        //console.log(config.headers.Authorization)
      }
    }
    
    // console.log('config',config)
    return config
  },
  err => {
    // console.log(err)
  }
)
//响应拦截器
axios.interceptors.response.use(
  response => {
    if (isIE9()) {
      //特殊处理response
      if (response.status == 200 && response.request) {
        if (
          response.request.responseType === "json" && response.request.responseText
        ) {
          response.data = JSON.parse(response.request.responseText);

        }
      }
    }

    // console.log('response data', response.data)
    //token过期
    // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsMjAwOTUiLCJuYmYiOjE1OTI4MTYzMjQsImV4cCI6MTU5MjgzNDMyNCwiaWF0IjoxNTkyODE2MzI0fQ.YFR-tKSy0gT9i8Vx8xhu27HdnYD3oBDZYDdtgKImSqI
    if (response.data.status == 2) {
      store.commit('getToken', '')
      store.commit('getToken401', false)
      store.commit('getSsoPath', '');

      store.commit('getTokenFlag', false)
      store.commit('getLoginFlag', false)
      store.commit('getUserInfo', '')
      store.commit('getHrssToken', '')
      router.push({
        path: "/ssoLogin"
      })
    }

    //response.headers['filename'] = filename
    // console.log(response)
    // console.log(process)
    //console.log(process.env.NODE_ENV,'123trttt')
    //console.log(process.env)
    return response
  },
  error => {
    // console.log('error.response', error)
    //console.log(process.env.NODE_ENV,'123trttt')
    try {
      if (error.response) {
        // if (process.env.NODE_ENV == 'formal') {
          //console.log(error.response,'productEEEEEE')
          switch (error.response.status) {
            case 401: //token过期，清除它,清除token信息并跳转到登录页面
              store.commit('delToken');
              store.commit('getToken401', true)
              router.replace({
                path: '/ssoLogin',
                // query: {
                //   redirect: router.currentRoute.fullPath//登录之后跳转到对应页面
                // }
              });
              return;
            case 402:
              if (store.state.Login.lf == true) {
                store.commit('getLf', false)
                Message({
                  type: 'error',
                  message: error.response.data.msg == undefined || error.response.data.msg == '' || error.response.data.msg == null ? '此账号被登出' : error.response.data.msg
                })
                store.commit('delToken');
                router.replace({
                  path: '/ssoLogin',
                  // query: {
                  //   redirect: router.currentRoute.fullPath//登录之后跳转到对应页面
                  // }
                });
                window.location.reload() //用户被踢出后能够重新加载资源文件
              }
              return;
            case 403: //权限 没有权限跳到403页面 清除ssoPath
              Message({
                type: 'error',
                message: error.response.data.msg == undefined || error.response.data.msg == '' || error.response.data.msg == null ? '您没有权限' : error.response.data.msg
              })
              store.commit('delToken');
              store.commit('getSsoPath','');
              if(store.state.Login.token==""||store.state.Login.token==undefined){
                router.push({
                  path:'/ssoLogin',
                  // query: {
                  //   redirect: router.currentRoute.fullPath//登录之后跳转到对应页面
                  // }
                })
              }else{
                router.push({
                  path: '/',
                  // query: {
                  //   redirect: router.currentRoute.fullPath//登录之后跳转到对应页面
                  // }
                });
              }
              return;
            case 500: // 人员联想token失效后，状态码为500，此时重新获取token
              if(error.response.data.path == '/api/user/getUserByAssociated' && error.response.data.message == 'token失效，请重新获取tooken') {
                store.dispatch('getAssociatedToken').then(res => {
                  if(res.flag) {
                    store.commit('getAssociatedToken', res.data.token)
                  }
                }, err => { })
                // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJwYXNzd29yZFwiOlwia1piSHgxc1RcIixcImFjY291bnRcIjpcImFwYVwifSIsImlhdCI6MTU5NjQxOTA1NSwiZXhwIjoxNTk2NDI2MjU1fQ.iyNNhIxocbP3Ag0gPJDGQuD_cR93jxLSgSlO1owADJRj5PIvk5thjci6mnm1DeZkARDzyH4Ard_vAa_ucpHveA
              } else if (error.response.data.status == 2) {
                store.commit('getToken', '')
                store.commit('getToken401', false)
                store.commit('getSsoPath', '');
                store.commit('getTokenFlag', false)
                store.commit('getLoginFlag', false)
                store.commit('getUserInfo', '')
                store.commit('getHrssToken', '')
                router.push({
                  path: "/ssoLogin"
                })
              } else {
                let errorObj = {
                  data: null,
                  message: '操作失败，请联系系统管理员',
                  pageNum: 0,
                  status: 1,
                  success: false,
                  tableHeadData: null,
                  total: 0,
                }
                return Promise.reject(errorObj)
              }
            return;
          }
        // }
      }
      return Promise.reject(error.response.data)
    } catch (e) {

    }
  })

function http(options, success, fail) {
  axios(options).then(function (response) {
    // debugger
    //  console.log(response)
    if (response.data || response.data == '') {
      response.data.status == '0' || 
      response.data.status == undefined || 
      response.data.status == null || 
      response.data.status == '302' || 
      response.data.flag 
      ? success(response.data) 
      : (fail(response.data, response.data.msg || "系统错误"), console.log(response.data || "系统错误"));
    } else {
      fail(null, '未收到返回数据')
    }
  }).catch(function (error) {
    fail({msg: ''}, '未收到返回数据')
  });
}

function get(options, success, fail) {
  var requestOption = Object.assign({
    method: 'get',
    params: options.data
  }, options);
  http(requestOption, success, fail)
}

function post(options, success, fail) {
  var requestOption = Object.assign({
    method: 'post'
  }, options);
  http(requestOption, success, fail)
}

function put(options, success, fail) {
  var requestOption = Object.assign({
    method: 'put'
  }, options);
  http(requestOption, success, fail)
}

function delete1(options, success, fail) {
  var requestOption = Object.assign({
    method: 'delete'
  }, options);
  http(requestOption, success, fail)
}

function delete2(options, success, fail) {
  var requestOption = Object.assign({
    method: 'delete',
    params: options.data
  }, options);
  http(requestOption, success, fail)
}
//导出下载的方法 为了获取response header
function httpExport(options, success, fail) {
  axios(options).then(function (response) {
      if (response.data || response.data == '') {
        response.data.status == '0' || response.data.status == undefined || response.data.status == null || response.data.status == '302' ? success(response) : (fail(response, response.data.message || "系统错误"), console.log(response.data || "系统错误"));
        // response.headers.filename !=undefined?success(response):fail(response)  11.20
      } else {
        fail(null, '未收到返回数据')
      }
    })
    .catch(function (error) {
      fail(error)
    });
}

function getExport(options, success, fail) {
  var requestOption = Object.assign({
    method: 'get',
    params: options.data
  }, options);
  httpExport(requestOption, success, fail)
}

function postExport(options, success, fail) {
  var requestOption = Object.assign({
    method: 'post'
  }, options);
  httpExport(requestOption, success, fail)
}

function isIE9() {
  if (
    navigator.appName == "Microsoft Internet Explorer" &&
    parseInt(
      navigator.appVersion
      .split(";")[1]
      .replace(/[ ]/g, "")
      .replace("MSIE", "")
    ) <= 9
  ) {
    return true;
  }
  return false;
}

export {
  get,
  post,
  put,
  delete1,
  delete2,
  getExport,
  postExport
}

/**
 * Similar to Promise.all but a concurrency limit
 *
 * @param {Array} iterable Array of functions that returns a promise
 * @param {Object} concurrency max number of parallel promises running
 */
function promiseAllThrottled(iterable, { concurrency = 3 } = {}) {
  const promises = [];

  function enqueue(current = 0, queue = []) {
    // return if done
    if (current === iterable.length) { return Promise.resolve(); }
    // take one promise from collection
    const promise = iterable[current];
    const activatedPromise = promise();
    // add promise to the final result array
    promises.push(activatedPromise);
    // add current activated promise to queue and remove it when done
    const autoRemovePromise = activatedPromise.then(() => {
      // remove promise from the queue when done
      return queue.splice(queue.indexOf(autoRemovePromise), 1);
    });
    // add promise to the queue
    queue.push(autoRemovePromise);

    // if queue length >= concurrency, wait for one promise to finish before adding more.
    const readyForMore = queue.length < concurrency ? Promise.resolve() : Promise.race(queue);
    return readyForMore.then(() => enqueue(current + 1, queue));
  }

  return enqueue()
    .then(() => Promise.all(promises));
}

// simulate 10 async tasks that takes 5 seconds to complete.

// const requests = Array(10)
//   .fill()
//   .map((_, i) => () => new Promise((resolve => setTimeout(() => { console.log(`exec'ing task #${i}`), resolve(`task #${i}`); }, 5000))));
//   console.log(requests)

// fill(value, start, end) 方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引。
// value => 用填充数组元素的值, start => 起始索引,默认为0, end => 终止索引,默认为数组的长度
// 返回值是 修改后的数组
// map() 两个参数,第一个是回调函数,第二个是thisAry,回调函数的三个参数分别是value, index, array
// value => 数组中正在处理的当前的元素, index => 数组中正在处理的当前元素的索引, array => 当前调用map方法的数组


// promiseAllThrottled(requests, { concurrency: 3 })
//   .then(console.log)
//   .catch(error => console.error('Oops something went wrong', error));
