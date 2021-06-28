<template>
  <div class="todo-container">
    <el-row class="title">
      <el-col :span="24">
        <div class="navBar">
          <div class="navItem navItemHome"><router-link to="/RDAssetPlanningManagement">首页</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemCol">我的待办</div>
        </div>
      </el-col>
    </el-row>  

    <el-row class="todo-content" v-if="!tipFlag">
      <el-col class="todo-title">待办事项</el-col>
      <el-col class="todo-desc">
        <div>待办事项统一汇总,资源计划不遗漏</div>
        <div>随时查看待审批单,帮助您及时处理重要事项</div>
        <div>各环节数据分类统计,待办事项一目了然,计划审批轻松搞定!</div>
      </el-col>

      <el-col>
        <div class="todo-item-container">
          <div class="todo-item" v-for="(item, index) in toDoList" :key="index">
            <div class="item-info">
              <span class="item-info-title">{{ item.apstatusdetail }}</span>
              <br>
              <span class="item-info-time">申请创建时间：{{ item.applymonth }}</span>
            </div>
            <div class="item-btn" @click="jump(item.applymonth, item.apstage)">立即处理</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row v-if="tipFlag">
      <el-col class="nolist-banner">
        <img :src="require('@/assets/img/banner.png')" alt="" srcset="">
        <div>当前无待办事项</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import urlConfig from '@/http/urlConfig/index' //引入接口地址
import utils from '../../util/utils'
export default {
  name: 'assetPlanToDoList',
  data() {
    return {
      toDoList: [],
      tipFlag: false,
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit('clearIncludeList')
      vm.$store.commit('clearForm');
    })
  },

  mounted() {
    this.getUpdateInfo()
    this.getToDoInfoByApplyCode()
  },
  methods: {
    getUpdateInfo() {
      let that = this
      this.$axios.get(`${urlConfig.GETUPDATEINFOBYAPPLYCODE}?applyuser=${that.$store.state.Login.userInfo.workNum}`).then(res => {
        if(res.data.success) {
          let result = res.data.data ? res.data.data : []
          let list = []
          result.forEach(item => {
            that.toDoList.push(item)
          });
          that.toDoList.sort((a, b) => {
            return a.apstage - b.apstage
          })
          that.tipFlag = that.toDoList.length > 0 ? false : true
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
          let list = []
          result.forEach(item => {
            that.toDoList.push(item)
          });
          that.toDoList.sort((a, b) => {
            return a.apstage - b.apstage
          })
          that.tipFlag = that.toDoList.length > 0 ? false : true
        } else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, err => {

      })
    },
    jump(applymonth, apstage) {
      let path = ''
      let query = {
        applymonth: applymonth
      }
      if(apstage == 1) {
        path = '/assetApplyIndex';
        query.type = 'update'
      } else if (apstage == 2) {
        path = '/assetPlanReview';
      } else if (apstage == 3) {
        path = '/assetPlanDept3Review';
      } else if (apstage == 4) {
        path = '/assetPlanDept2Review';
      } else if (apstage == 5) {
        path = '/plannerReview';
      } else if (apstage == 6) {
        path = '/expertGroupReview';
      } else if (apstage == 7) {
        path = '/assetPlanDept1Review';
      }
      this.$router.push({
        path,
        query
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/outlayer.scss';
  .todo-container {
    height: 100%;
    background-color: #fff;
  }
  .title {
    padding: 10px 3%;
    background-color: #f2f2f2;
  }
  .nolist-banner {
    text-align: center;
    img {
      margin-top: 100px;
      width: 360px;
      height: 240px;
    }
  }
  
  .tip {
    line-height: 40px;
    text-align: center;
    border-radius: 4px;
    box-shadow:0px 2px 15px 0px rgba(0,0,0,0.2);
    background-color: #ffffff;
  }
  .todo-content {
    padding: 5% 3% 5% 10%;
    background-color: #fff;
    .todo-title {
      margin-bottom: 30px;
      font-size: 26px;
      font-weight: bold;
    }
    .todo-desc div{
      margin-bottom: 12px;
      color: #666;
    }
    .todo-item-container {
      display: inline-block;
      margin-top: 20px;
      padding-top: 35px;
      border-top: 1px solid #ddd;
    }
    .todo-item {
      display: inline-block;
      position: relative;
      box-sizing: border-box;
      margin-right: 36px;
      margin-bottom: 30px;
      padding: 20px 25px;
      width: 350px;
      height: 96px;
      color: #fff;
      background-color: #386ED3;
      background-image: linear-gradient(to right, #2583FD, #1960F1);
      border-radius: 8px;
      .item-info-title {
        display: inline-block;
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: bold;
      }
      .item-info-time {
        font-size: 12px;
        color: #eee;
      }
      .item-btn {
        position: absolute;
        right: 25px;
        top: 32px;
        width: 86px;
        height: 32px;
        line-height: 32px;
        border-radius: 16px;
        color: #386ED3;
        background-color: #fff;
        text-align: center;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
</style>