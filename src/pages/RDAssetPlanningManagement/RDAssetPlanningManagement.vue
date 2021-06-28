<template>
  <div class="outlayer RDAssetPlanningManagement">
    <el-row class="banner">
      <el-image class="banner-bg" :src="require('@/assets/img/banner_bg.png')"></el-image>
      <div class="banner-inner">
        <h1 class="banner-title">研发资源计划管理平台</h1>
        <div class="banner-desc">
          <img :src="require('@/assets/img/sure_icon.png')" alt="" srcset="">
          <span>管理计划</span>
          <img :src="require('@/assets/img/sure_icon.png')" alt="" srcset="">
          <span>优化配置</span>
          <img :src="require('@/assets/img/sure_icon.png')" alt="" srcset="">
          <span>打造高效合理利用资源新高度</span>
        </div>
      </div>
    </el-row>

    <div class="mainContent">
      <el-row :gutter="30">
        <el-col :span="12">
          <div class="tab">
            <h1 class="tab-title">研发资产计划</h1>
            <el-row>
              <el-col :span="3" class="tab-item-line" v-if="!isAdmin"></el-col>
              <el-col :span="isAdmin ? 5 : 6" class="tab-item">
                <router-link :to="{path: '/assetApplyIndex'}">
                  <img :src="require('@/assets/img/asset_apply_icon.png')" alt="" srcset="">
                  <div class="tab-text">申请</div>
                </router-link>
              </el-col>
              <el-col :span="isAdmin ? 5 : 6" class="tab-item">
                <router-link :to="{path: '/assetPlanToDoList'}">
                  <img :src="require('@/assets/img/asset_todo_icon.png')" alt="" srcset="">
                  <div class="tab-text">我的待办<el-badge v-if="markNum > 0" class="mark" :value="markNum" type="danger"></el-badge></div>
                </router-link>
              </el-col>
              <el-col :span="isAdmin ? 4 : 6" class="tab-item">
                <router-link :to="{path: '/assetPlanApprovalQuery'}">
                  <img :src="require('@/assets/img/asset_search_icon.png')" alt="" srcset="">
                  <div class="tab-text">查询</div>
                </router-link>
              </el-col>

              <el-col :span="5" class="tab-item" v-if="isAdmin">
                <router-link :to="{path: '/chartIndex'}">
                  <img :src="require('@/assets/img/todo_icon.png')" alt="" srcset="">
                  <div class="tab-text">统计</div>
                </router-link>
              </el-col>
              <el-col :span="5" class="tab-item" v-if="isAdmin">
                <router-link :to="{path: '/settingIndex'}">
                  <img :src="require('@/assets/img/todo_icon.png')" alt="" srcset="">
                  <div class="tab-text">信息配置</div>
                </router-link>
              </el-col>
              <el-col :span="3" class="tab-item-line" v-if="!isAdmin"></el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="tab">
            <h1 class="tab-title">研发物料计划</h1>
            <el-row>
              <el-col :span="3" class="tab-item-line"></el-col>
              <el-col :span="6" class="tab-item">
                <a target="_blank" :href="createUrl">
                  <img :src="require('@/assets/img/apply_icon.png')" alt="" srcset="">
                  <div class="tab-text">申请</div>
                </a>
              </el-col>
              <el-col :span="6" class="tab-item">
                <a target="_blank" :href="toDoUrl">
                  <img :src="require('@/assets/img/todo_icon.png')" alt="" srcset="">
                  <div class="tab-text">我的待办</div>
                </a>
              </el-col>
              <el-col :span="6" class="tab-item">
                <a target="_blank" :href="queryUrl">
                  <img :src="require('@/assets/img/search_icon.png')" alt="" srcset="">
                  <div class="tab-text">查询</div>
                </a>
              </el-col>
              <el-col :span="3" class="tab-item-line"></el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <h2 class="link-title">友情链接</h2>
      <el-row :gutter="20">
        <el-col :span="6">
          <a href="http://iam.h3c.com" target="_blank">
            <div class="link-item">
              <img :src="require('@/assets/img/link_ico01.png')" alt="" srcset="">i-AM-研发资产智能管理平台
            </div>
          </a>
        </el-col>
        <el-col :span="6">
          <a href="http://ibpm.h3c.com/bpm/r?wf_num=h3c31N008" target="_blank">
            <div class="link-item">
              <img :src="require('@/assets/img/link_ico02.png')" alt="" srcset="">小金额物品自行采购申请电子流 
            </div>
          </a>
        </el-col>
        <el-col :span="6">
          <a href="http://bpm01.h3c.com:800/bpm/app.nsf/app?readform&AppId=h3c10009"  target="_blank">
            <div class="link-item">
              <img :src="require('@/assets/img/link_ico03.png')" alt="" srcset="">ibpm-非生产物料申购电子流
            </div>
          </a>
        </el-col>
        <el-col :span="6">
          <a href="http://ibpm.h3c.com/bpm/r?wf_num=P_h3c08N010_005"  target="_blank">
            <div class="link-item">
              <img :src="require('@/assets/img/link_ico04.png')" alt="" srcset="">研发合同要货处理电子流
            </div>
          </a>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import urlConfig from '../../http/urlConfig'
  import store from '../../store/index'
  import { post } from '../../http/index'
  import { mapState } from 'vuex';
  export default {
    name: "RDAssetPlanningManagement",
    data() {
      return {
        toDoList: [],
        markNum: 0,
        createUrl: '',
        toDoUrl: '',
        queryUrl: '',
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.$store.commit('clearSearchForm')
        vm.$store.commit('clearForm');
        vm.$store.commit('clearIncludeList')
      })
    },
    computed: mapState({
      isAdmin: (state) => {
        return state.Login.isAdmin
      },
    }),
    mounted() {
      this.getUpdateInfo()
      this.getToDoInfoByApplyCode()
      this.getMateriel()
    },

    methods: {
      getUpdateInfo() {
        let that = this
        this.$axios.get(`${urlConfig.GETUPDATEINFOBYAPPLYCODE}?applyuser=${that.$store.state.Login.userInfo.workNum}`).then(res => {
          if(res.data.success) {
            let result = res.data.data ? res.data.data : []
            result.forEach(item => {
              that.toDoList.push(item)
            });
            that.toDoList.sort((a, b) => {
              return a.apstage - b.apstage
            })
            that.$store.commit('getToDoList', that.toDoList)
            that.$store.commit('getToDoPageTip', that.toDoList.length > 0 ? false : true)
            that.markNum = that.toDoList.length
          } else {
            that.$message({
              type: 'warning',
              message: res.data.message
            })
          }
        }, err => {
        })
      },
      getToDoInfoByApplyCode() {
        let that = this
        this.$store.dispatch('getToDoInfoByApplyCode', {
          applyuser: that.$store.state.Login.userInfo.workNum
        }).then(res => {
          if(res.success) {
            let result = res.data ? res.data : []
            result.forEach(item => {
              that.toDoList.push(item)
            });
            that.toDoList.sort((a, b) => {
              return a.apstage - b.apstage
            })
            that.$store.commit('getToDoList', that.toDoList)
            that.$store.commit('getToDoPageTip', that.toDoList.length > 0 ? false : true)
            that.markNum = that.toDoList.length
          } else {
            that.$message({
              type: 'warning',
              message: res.data.message
            })
          }
        }, err => {

        })
      },
      getMateriel() {
        let that = this
        this.$axios.get(urlConfig.GETMATERIEL).then(res => {
          if(res.data.success) {
            res.data.data.forEach(item => {
              if(item.dic_code == 'create') {
                that.createUrl = item.dic_value
              } else if (item.dic_code == 'todo') {
                that.toDoUrl = item.dic_value
              } else if (item.dic_code == 'query') {
                that.queryUrl = item.dic_value
              }
            })
          } else {
            that.$message({
              type: 'warning',
              message: res.data.message
            })
          }
        }, err => {
        })
      },
    },
  }

</script>

<style lang="scss" scoped>
  @import '@/assets/css/outlayer.scss';
  .RDAssetPlanningManagement {
    height: 100%;
    background-color: #f2f2f2;
  }
  .banner {
    position: relative;
    .banner-bg {
      width: 100%;
      height: 380px;
    }
    .banner-inner {
      position: absolute;
      top: 28%;
      width: 100%;
      color: #fff;
      text-align: center;
    }
    .banner-title {
      margin-bottom: 30px;
      font-size: 50px;
    }
    .banner-desc {
      font-size: 24px;
      img {
        vertical-align: sub;
        margin: 0 10px;
        width: 24px;
        height: 24px;
        border: none;
      }
    }
  }
  .tab {
    margin-top: 20px;
    padding: 20px 0 30px 0;
    background-color: #fff;
    text-align: center;
    font-size: 16px;
    border-radius: 8px;
    h1 {
      margin-bottom: 20px;
      font-size: 24px;
    }
    img {
      margin-bottom: 10px;
      width: 88px;
      height: 88px;
      border: none;
    }
    .tab-item {
      // font-size: 16px;
      color: #000;
      font-weight: 700;
      .tab-text {
        color: #333;
      }
    }
    .tab-item-line {
      height: 1px;
    }
  }
  .link-title {
    margin: 20px 0;
  }
  .link-item {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    font-size: 16px;
    color: #333;
    &:hover{
      box-shadow:0px 2px 15px 0px rgba(0,0,0,0.2);
      color: #386ed3;
    }
    img {
      margin-right: 10px;
      vertical-align: -6px;
      width: 24px;
      height: 24px;
      border: none;
    }
  }
  .mark {
    margin-top: -10px;
  }
  .RDAssetPlanningManagement .mainContent {
    background-color: #f2f2f2;
    padding-bottom: 30px;
    margin-bottom: 0;
  }
  /* 屏幕分辨率<=1440 */
  @media screen and (max-width: 1440px) { 
    #app {
      .banner .banner-title {
        font-size: 40px;
      }
      .banner-desc {
        font-size: 20px;
      }
      .banner-bg {
        height: 300px;
      }
      .tab {
        .tab-title {
          font-size: 20px;
        }
        .tab-text {
          font-size: 14px;
        }
        img {
          width: 80px;
          height: 80px;
        }
      } 

      .link-item {
        font-size: 14px;
      }
    }
    
  } 
</style>