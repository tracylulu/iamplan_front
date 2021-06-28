<template>
  <div>
    <el-row class="title">
      <el-col :span="24">
        <div class="navBar">
          <div class="navItem navItemHome"><router-link to="/RDAssetPlanningManagement">首页</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemCol">信息配置</div>
        </div>
      </el-col>
    </el-row>
    <el-row class="permission_tip" v-if="!isAdmin">您当前暂无权限查看此页面，可联系系统管理员开通权限!</el-row>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick"  class="settingContent" v-if="isAdmin">
      <el-tab-pane label="工作委托" name="changeHandler">
        <changeHandler ref="changeHandler"></changeHandler>
      </el-tab-pane>
      <el-tab-pane label="到货地点信息配置" name="receiverPlace">
        <receiverPlace ref="receiverPlace"></receiverPlace>
      </el-tab-pane>
      <el-tab-pane label="部门预算配置" name="budget">
        <budget ref="budget"></budget>
      </el-tab-pane>
      <el-tab-pane label="物品类别货期" name="category">
        <category ref="category"></category>
      </el-tab-pane>
      <el-tab-pane label="厂家型号" name="manuFacturer">
        <manuFacturer ref="manuFacturer"></manuFacturer>
      </el-tab-pane>
      <el-tab-pane label="各审批节点时间配置" name="R_ApproveDate"></el-tab-pane>
      <el-tab-pane label="计划开始时间配置" name="R_StartDate"></el-tab-pane>
      <el-tab-pane label="系统审批角色审批人" name="approver">
        <approver ref="approver"></approver>
      </el-tab-pane>
      <el-tab-pane label="指定供应商报告" name="SpecifyMaufacturer"></el-tab-pane>
      <el-tab-pane label="申购报告" name="ReqPurchoaseReport"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import receiverPlace from './receiverPlace'
import budget from './budget'
import category from './category'
import manuFacturer from './manuFacturer'
import approver from './approver'
import changeHandler from './changeHandler'
export default {
  name: 'settingIndex',
  data() {
    return {
      activeName: 'changeHandler',
      applicationId: 'apa',
      applicationName: '研发资产计划管理',
      dicTypeCode: '',
      dicTypeName: '',
      applicationToken: '',
      responseTicket: this.$store.state.Login.responseTicket,
      isAdmin: this.$store.state.Login.isAdmin
    }
  },
  components: {
    receiverPlace,
    budget,
    category,
    manuFacturer,
    approver,
    changeHandler,
  },
  mounted() {
    if(this.isAdmin) {
      this.activeName = this.$route.query.activeName ? this.$route.query.activeName : 'changeHandler'
      this.$refs[this.activeName].init();
    }
  },
  methods: {
    handleClick(tab, event) {
      let that = this
      if(tab.name == 'ReqPurchoaseReport' || tab.name == 'SpecifyMaufacturer' || tab.name == 'R_StartDate' || tab.name == 'R_ApproveDate') {
        this.$store.dispatch('getAssociatedToken').then(res => {
          if(res.flag) {
            that.$store.commit('getAssociatedToken', res.data.token)
            that.associatedToken = res.data.token
            that.goToSetting(tab.name)
          }
        }, err => { });
      } else {
        this.$refs[tab.name].init();
      }
    },
    goToSetting(type) {
      if(type == 'ReqPurchoaseReport') {
        this.dicTypeName = '申购报告'
        this.dicTypeCode = 'ReqPurchoaseReport'
      } else if (type == 'SpecifyMaufacturer') {
        this.dicTypeName = '指定供应商报告内容'
        this.dicTypeCode = 'SpecifyMaufacturer'
      } else if (type == 'R_StartDate') {
        this.dicTypeName = '启动时间'
        this.dicTypeCode = 'R_StartDate'
      } else if (type == 'R_ApproveDate') {
        this.dicTypeName = '审批时间'
        this.dicTypeCode = 'R_ApproveDate'
      }
      window.open(`${window.settingUrl}/dictionaryData?application_id=${this.applicationId}&application_name=${this.applicationName}&dicTypeCode=${this.dicTypeCode}&dicTypeName=${this.dicTypeName}&applicationToken=${this.associatedToken}&responseTicket=${this.responseTicket}`, '_blank')
    },
  }
}
</script>

<style lang="scss">
  .permission_tip {
    margin: 20px 0 30px 0;
    line-height: 40px;
    text-align: center;
    border-radius: 4px;
    color: rgb(250, 80, 80);
  }
  .settingContent {
    padding: 15px 3%;
  }
  .setting-container {
    padding: 15px 0 20px;
    background-color: #fff;
    .btn-row {
      margin-bottom: 15px;
    }
  }
</style>