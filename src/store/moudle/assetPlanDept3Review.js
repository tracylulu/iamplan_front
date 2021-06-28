import {get, post, put} from '../../http/index';
import urlConfig from '../../http/urlConfig/index'

const assetPlanDept3Review = {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // 获取三级主管审核列表信息
    getDept3InfoList({commit, state}, data) {
      return new Promise((resolve, reject) => {
        get({
          url: urlConfig.assetPlanDept3Mag.GETDEPT3INFOLIST,
          data
        }, res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      })
    },
    // 三级部门页面修改同意申购数量和审核意见
    updateDept3InfoList({commit, state}, data) {
      return new Promise((resolve, reject) => {
        put({
          url: urlConfig.assetPlanDept3Mag.UPDATEDEPT3INFOLIST,
          data
        }, res => {
          resolve(res);
        }, err => {
          reject(err);
        })
      })
    },
    // 三级部门审核页面提交至二级部门审核
    submitInfoFromDept3ToDept2({commit, state}, data) {
      return new Promise((resolve, reject) => {
        post({
          url: urlConfig.assetPlanDept3Mag.SUBMITINFOFROMDEPT3TODEPT2,
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

export default assetPlanDept3Review