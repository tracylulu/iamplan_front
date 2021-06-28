import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'
import Login from './moudle/login';
import RDAssetPlanningManagement from './moudle/RDAssetPlanningManagement';

import assetApplyIndex from './moudle/assetApplyIndex';
import assetApplyDetail from './moudle/assetApplyDetail';
import assetPlanReview from './moudle/assetPlanReview';
import assetPlanDept3Review from './moudle/assetPlanDept3Review';
import assetPlanDept2Review from './moudle/assetPlanDept2Review';
import assetPlanApprovalQuery from './moudle/assetPlanApprovalQuery';
import KeepAliveMag from './moudle/keepAliveMag'


Vue.use(Vuex)

const store = new Vuex.Store({
    modules:{
        Login,
        RDAssetPlanningManagement,
        KeepAliveMag,
        assetApplyIndex,
        assetApplyDetail,
        assetPlanReview,
        assetPlanDept3Review,
        assetPlanDept2Review,
        assetPlanApprovalQuery,
    },
    plugins:[
        createPersistedState({
            reducer(store){
                return {
                    Login: store.Login,
                    KeepAliveMag: store.KeepAliveMag,
                    assetPlanReview: store.assetPlanReview,
                    assetPlanApprovalQuery: store.assetPlanApprovalQuery,
                }
            }
        }),
        
    ]
})

export default store