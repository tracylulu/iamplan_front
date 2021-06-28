import { get, postExport } from '../../http/index' //引入异步方法
import urlConfig from '../../http/urlConfig/index' //引入接口地址

const RDAssetPlanningManagement = {
  state: {
    menuArr: [],

    moduleResArr: [],
    manufacturerResArr: [],
    secretkeyResArr: [],
    bomSecretkeyConfigResArr: [],
    signatureAccountResArr: [],
    configInfoResArr: [],

    toDoList: [],// 待办列表页面列表
    toDoPageTip: false, // 待办页面中没有待办事项时的提示
    
  }, //初始数据
  getters: {}, //捕获出事数据方法
  mutations: {
    getToDoList(state, data) {
      state.toDoList = data
    },
    getToDoPageTip(state, data) {
      state.toDoPageTip = data
    }
  },
  actions:{
    getToDoInfoByApplyCode({commit,state},data){
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.GETTODOINFOBYAPPLYCODE,
          data: data,
        }, function (res) {
          resolve(res)
        }, function (err) {
          reject(err)
        })
      })
    },
    //导出 
    exportAssetPlanInfo({
      commit,
      state
    }, data) {
      return new Promise((resolve, reject) => {
        postExport({
          url: urlConfig.assetPlanApprovalQuery.ASSETPLANINFOEXPORT,
          data: data,
          responseType: 'blob',
          headers: {
            Authorization: this.state.Login.token
          }
        }, function (res) {
          resolve(res)
        }, function (err, message) {
          console.log(err + '请求拒绝')
          reject(err || message)
        })
      })
    },

    exportAssetPlanInfoForPlanner({
      commit,
      state
    }, data) {
      return new Promise((resolve, reject) => {
        postExport({
          url: urlConfig.plannerReview.EXPORTASSETPLANINFOFORPLANNER,
          data: data,
          responseType: 'blob',
          headers: {
            Authorization: this.state.Login.token
          }
        }, function (res) {
          resolve(res)
        }, function (err, message) {
          console.log(err + '请求拒绝')
          reject(err || message)
        })
      })
    },
  }
}
export default RDAssetPlanningManagement
