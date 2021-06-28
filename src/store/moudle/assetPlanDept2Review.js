import {get, post, put} from '../../http/index';
import urlConfig from '../../http/urlConfig/index'

const assetPlanDept2Review = {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // 获取二级主管审核列表信息
    getDept2InfoList({commit, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.assetPlanDept2Mag.GETDEPT2INFOLIST,
          data
        }, res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      })
    },
    // 二级部门页面修改同意申购数量和审核意见
    updateDept2InfoList({commit, state}, data) {
      return new Promise((resolve, reject) => {
        put({
          url: urlConfig.assetPlanDept2Mag.UPDATEDEPT2INFOLIST,
          data
        }, res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      })
    },
    // 二级部门审核页面提交至计划员审核
    submitInfoFromDept2ToPlanner({commit, state}, data) {
      return new Promise((resolve, reject) => {
        post({
          url: urlConfig.assetPlanDept2Mag.SUBMITINFOFROMDEPT2TOPLANNER,
          data
        }, res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      })
    },
    // 预算列表展示（二三级部门页面通用）
    getBudgetInfoList({commit, state}, data) {
      return new Promise((resolve, reject) => {
        post({
          url: urlConfig.assetPlanDept3Mag.GETBUDGETINFOLIST,
          data
        }, res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      })
    },
  }
}

export default assetPlanDept2Review