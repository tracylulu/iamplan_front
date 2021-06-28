import {
  get,
  post,
  put,
  delete1,
  getExport,
  postExport
} from '../../http/index' //引入异步方法
import urlConfig from '../../http/urlConfig/index' //引入接口地址

const assetPlanReview = {
  state: {
    searchForm: {
      deptCode: null,
      reviewResult: '',
      endPrice: '',
      startPrice: '',
      pageNum: 1,
      pageSize: 100,
      applymonth: '',
      reviewer: '',
    }
  },
  getter: {},
  mutations: {
    clearForm(state) {
      state.searchForm = {
        deptCode: null,
        reviewResult: '',
        endPrice: '',
        startPrice: '',
        pageNum: 1,
        pageSize: 100,
        applymonth: '',
        reviewer: '',
      }
    }
  },
  actions: {

    // 获取规范审核列表
    getAssetPlanReviewList({commit,state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.assetPlanReviewMag.GETASSETPLANREVIEWLIST,
          data,
        }, res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      })
    },

    // 规范审核状态筛选
    getAssetPlanReviewByFilter({commit, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.assetPlanReviewMag.GETASSETPLANREVIEWBYFILTER,
          data,
        }, res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      })
    },

    // 不规范邮件提醒EMAILFORNOTREVIEW
    emailForNotReview({commit, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.assetPlanReviewMag.EMAILFORNOTREVIEW,
          data
        }, res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      })
    },

    // 规范审核页面提交至三级部门主管审核
    submitInfoFromReviewToDept3({commit, state}, data) {
      return new Promise((resolve, reject) => {
        post({
          url: urlConfig.assetPlanReviewMag.SUBMITINFOFROMREVIEWTODEPT3,
          data
        }, res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      })
    },

    // 修改规范审核列表信息字段(厂家/型号/预计单价/类别/规范审核状态/审核意见)
    updateReviewInfo({commit, state}, data) {
      return new Promise((resolve, reject) => {
        put({
          url: urlConfig.assetPlanReviewMag.UPDATEREVIEWINFOLIST,
          data
        }, res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      })
    },
    
    updateAllReviewInfo({commit, state}, data) {
      return new Promise((resolve, reject) => {
        put({
          url: urlConfig.assetPlanReviewMag.UPDATEALLREVIEWINFO,
          data
        }, res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      })
    }

  }
}

export default assetPlanReview