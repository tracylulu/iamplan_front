import {
  get,
  post,
  delete2,
} from '../../http/index' //引入异步方法
import urlConfig from '../../http/urlConfig/index' //引入接口地址


const assetApplyIndex = {
  state: {
    pageNum: 1,
    pageSize: 10,
  },
  getters: {},
  mutations: {
    resetAssetApplyIndexForm(state) {
      state.pageNum = 1
      state.pageSize = 10
    }
  },
  actions: {
    // 验证当前用户是否可以新增
    checkEnableAdd({commit, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.assetMag.CHECKBUTTONISADD,
          data: data,
        }, function (res) {
          resolve(res)
        }, function (err) {
          reject(err)
        })
      })
    },

    // 根据当前登录人的工号获取申请列表
    getDraftInfoList({commit, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.assetMag.RESOURCEGETBYCODE,
          data: data,
        }, function (res) {
          resolve(res)
        }, function (err) {
          reject(err)
        })
      })
    },

    // 根据当前登录人的工号获取不规范条目列表
    updateList({commit, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.assetMag.UPDATELIST,
          data: data,
        }, function (res) {
          resolve(res)
        }, function (err) {
          reject(err)
        })
      })
    },

    // 删除资源计划
    deleteAssetPlanInfo({commit,state}, data){
      return new Promise((resolve, reject) => {
        delete2({
          url: urlConfig.assetMag.DELETEASSETPLANINFO,
          data: data,
        }, function (res) {
          resolve(res)
        }, function (err) {
          reject(err)
        })
      })
    },

    // 勾选指定资源信息提交至规范审核
    submitAssetPlanInfoByIds({commit, state}, data) {
      return new Promise((resolve, reject) => {
        post({
          url: urlConfig.assetMag.SUBMITASSETPLANINFOBYIDS,
          data: data,
        }, function (res) {
          resolve(res)
        }, function (err) {
          reject(err)
        })
      })
    },

  }
}

export default assetApplyIndex