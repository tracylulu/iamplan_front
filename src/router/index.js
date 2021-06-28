import Vue from 'vue'
import Router from 'vue-router'
import Index from '../pages/index'
import store from '../store/index'

import AssetPlanReview from '../pages/AssetPlanReview/AssetPlanReview'



Vue.use(Router)

const router = new Router({
  mode: 'history', //去除地址栏'localhost:8080/#/'中的/#/
  routes: [
    //测试登录
    {
      path: '/testLogin',
      name: 'testLogin',
      component: () => import('@/pages/testLogin'),
    },
    //ssoLogin
    //单点登录
    {
      path: '/ssoLogin',
      name: 'ssoLogin',
      component: () => import('@/pages/ssoLogin'),
    },
    //首页
    {
      path: '/',
      name: 'index',
      component: Index,
      redirect: '/RDAssetPlanningManagement',
      meta: {
        title: '',
        requireAuthor: true
      },
      children: [
        {
          path: '/RDAssetPlanningManagement',
          name: 'RDAssetPlanningManagement',
          component: () => import('@/pages/RDAssetPlanningManagement/RDAssetPlanningManagement')
        },
        {
          path: '/assetPlanToDoList',
          name: 'assetPlanToDoList',
          component: () => import('@/pages/RDAssetPlanningManagement/assetPlanToDoList'),
          meta: {
            title: '我的待办',
            requireAuthor: true
          }
        },
        {
          path: '/assetPlanApprovalQuery',
          name: 'assetPlanApprovalQuery',
          component: () => import('@/pages/assetPlanApprovalQuery/assetPlanApprovalQuery'),
          meta: {
            title: '资源计划查询',
            requireAuthor: true
          }
        },
        {
          path: '/assetPlanApprovalQuery/approvalRecord',
          name: 'approvalRecord',
          component: () => import('@/pages/assetPlanApprovalQuery/approvalRecord'),
          meta: {
            title: '查询详情页面',
            requireAuthor: true
          }
        },
        {
          path: '/plannerReview',
          name: 'plannerReview',
          component: () => import('@/pages/RDAssetPlanningManagement/plannerReview'),
          meta: {
            title: '计划员审核',
            requireAuthor: true
          }
        },
        {
          path: '/expertGroupReview',
          name: 'expertGroupReview',
          component: () => import('@/pages/RDAssetPlanningManagement/expertGroupReview'),
          meta: {
            title: '专家团审核',
            requireAuthor: true
          }
        },
        {
          path: '/assetPlanDept1Review',
          name: 'assetPlanDept1Review',
          component: () => import('@/pages/RDAssetPlanningManagement/assetPlanDept1Review'),
          meta: {
            title: '一级部门主管审核',
            requireAuthor: true
          }
        },
        {
          path: '/assetApplyIndex',// 资源计划申请列表页
          name: 'assetApplyIndex',
          component: () => import('@/pages/assetApply/assetApplyIndex'),
          meta: {
            title: '',
            requireAuthor: true,
          }
        },
        {
          path: '/assetApplyDetail',// 资源计划新增或详情页面
          name: 'assetApplyDetail',
          component: () => import('@/pages/assetApply/assetApplyDetail'),
          meta: {
            title: '',
            requireAuthor: true,
          }
        },
        {
          path: '/assetPlanReview',// 规范审核首页
          name: 'assetPlanReview',
          component: AssetPlanReview
        },
        {
          path: '/assetPlanDept3Review',// 三级主管审核
          name: 'assetPlanDept3Review',
          component: () => import('@/pages/assetPlanDept3Review/assetPlanDept3Review')
        },
        {
          path: '/assetPlanDept2Review',// 二级主管审核
          name: 'assetPlanDept2Review',
          component: () => import('@/pages/assetPlanDept2Review/assetPlanDept2Review')
        },
        {
          path: '/usageRate',// 使用率
          name: 'usageRate',
          component: () => import('@/pages/usageRate/usageRate')
        },
        {
          path: '/chartIndex',// 统计
          name: 'chartIndex',
          component: () => import('@/pages/RDAssetPlanningManagement/chartIndex')
        },
        {
          path: '/settingIndex',
          name: 'settingIndex',
          component: () => import('@/pages/setting/settingIndex'),
        },

      ]
    },
  ]
})
let that = this
router.beforeEach((to, from, next) => {
  // console.log(process.env, 'process')
  // console.log(from)
  // console.log(to)
  // console.log(store.state.Login.token401)
  if(to.name == 'ssoLogin' && from.fullPath.indexOf('ssoLigin') < 0 && from.fullPath.indexOf('ssoLogout') < 0 && from.fullPath != '/') {
    let beforeLogoutUrl = from.fullPath
    window.localStorage.setItem('beforeLogoutUrl', beforeLogoutUrl)
    next()
  } else {
    next()
  }

  // if (to.meta.requireAuthor) {
  //   if (store.state.Login.token != "" && store.state.Login.token != undefined) {
  //     next('/')
  //   }
  //   else {
  //     store.commit('getSsoPath', to.fullPath)
  //     store.commit('getTokenFlag', true)
  //     next('/ssoLogin')
  //   }
  // }
})
export default router