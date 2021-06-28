import { get, post, put } from '../../http/index' //引入异步方法
import urlConfig from '../../http/urlConfig/index' //引入接口地址

const assetApplyDetail = {
  state: {
    associatedToken: '',//人员联想系统的token
  },
  getters: {},
  mutations: {
    getAssociatedToken(state, data) {
      state.associatedToken = data;
    },
  },
  actions: {
    // 获取人员联想系统的token
    getAssociatedToken() {
      return new Promise((resolve, reject) => {
        post({
          url: urlConfig.associatedUserMag.GETASSOCIATEDTOKEN,
          data: {
            "account":"apa",
            "password":"kZbHx1sT"
          }
        }, function (res) {
          resolve(res)
        }, function (err) {
          reject(err)
        })
      })
    },

    // 获取人员联想数据
    getAssociatedUser(token, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.associatedUserMag.GETASSOCIATEDUSER,
          data: data,
        }, function (res) {
          resolve(res)
        }, function (err) {
          reject(err)
        })
      })
    },

    // 获取厂家型号等信息
    getAssetManufacturerList({commit, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.assetManuFacturerMag.MANUFACTURERGET,
          data: data,
        }, function (res) {
          resolve(res)
        }, function (err) {
          reject(err)
        })
      })
    },

    // 根据申购人ID获取一二三级部门和计划员信息 GETDEPTINFOBYCODE
    getDeptInfoByCode({commit, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.GETDEPTINFOBYCODE,
          data: data,
        }, function(res) {
          resolve(res);
        }, function(err) {
          reject(err);
        })
      })
    },

    // 获取物品类别和对应的货期
    getAssetCategoryAndGoodstime({commi, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.GETASSETCATEGORYANDGOODSTIME,
          data: data,
        }, function(res) {
          resolve(res);
        }, function(err) {
          reject(err);
        })
      })
    },

    // 获取到货地点
    getReceivePlace({commit, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.GETRECEIVERPLACE,
          data: data,
        }, function(res) {
          resolve(res);
        }, function(err) {
          reject(err);
        })
      })
    },
    // 项目编码联想返回top20项目编码和项目名称
    getItemCodeAndName({commit, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.GETITEMCODEANDNAME,
          data: data,
        }, function(res) {
          resolve(res);
        }, function(err) {
          reject(err);
        })
      })
    },
    
    // 资源计划查看页面的详情
    getAssetInfoByidForSearch({commit, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.assetMag.GETASSETPLANINFOBYIDFORSEARCH,
          data: data,
        }, function(res) {
          resolve(res);
        }, function(err) {
          reject(err);
        })
      })
    },
     // 查看单条资源信息
     getAssetInfoByid({commit, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.assetMag.GETASSETPLANINFOBYID,
          data: data,
        }, function(res) {
          resolve(res);
        }, function(err) {
          reject(err);
        })
      })
    },

    // 新增或修改资源计划
    addAssetPlanInfo({commit,state}, data){
      return new Promise((resolve, reject) => {
        post({
          url: urlConfig.assetMag.ADDASSETPLANINFO,
          data,
        }, function (res) {
          resolve(res)
        }, function (err) {
          reject(err)
        })
      })
    },

    // 新增或修改资源计划
    saveAndSubmitPlan({commit,state}, data){
      return new Promise((resolve, reject) => {
        post({
          url: urlConfig.assetMag.SAVEANDSUBMITPLAN,
          data,
        }, function (res) {
          resolve(res)
        }, function (err) {
          reject(err)
        })
      })
    },

    // 修改资源计划
    editAssetPlanInfo({commit,state}, data){
      return new Promise((resolve, reject) => {
        put({
          url: urlConfig.assetMag.UPDATEASSETPLANINFO,
          data,
        }, function (res) {
          resolve(res)
        }, function (err) {
          reject(err)
        })
      })
    },
  }
}

export default assetApplyDetail