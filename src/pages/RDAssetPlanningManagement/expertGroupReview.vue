<template>
  <div>
    <el-row class="title">
      <el-col :span="24">
        <div class="navBar">
          <div class="navItem navItemHome"><router-link to="/RDAssetPlanningManagement">首页</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemHome"><router-link to="/assetPlanToDoList">我的待办</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemCol">专家团审核</div>
        </div>
      </el-col>
    </el-row>
    <div class="formBox">
      <el-row type="flex" justify="space-between">
        <h3 class="titleHeaderText">{{applymonth}}  专家团审核</h3>
      </el-row>
      <reviewTable :tableHead="tableHead" :tableData="tableData" :assetStage="apstage" :calcActualMoney="calcActualMoney"></reviewTable>
      <el-row class="btnRow" type="flex" justify="end" v-if="tableData.length > 0">
        <span>合计:</span>
        <span>申购总金额：{{ totalMoneySum }}</span>
        <span>同意申购总金额：{{ actualMoneySum }}</span>
        <el-button type="primary" @click="dialogEditSave('save')">保存</el-button>
        <el-button type="primary" @click="dialogEditSave('submit')">审批完成</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
  import urlConfig from '@/http/urlConfig/index' //引入接口地址
  import reviewTable from '../../components/reviewTable'
  import util from '@/util/utils'
  export default {
    name: 'expertGroupReview',
    data() {
      return {
        tableHead: [],
        tableData: [],
        loginUser: this.$store.state.Login.userInfo.workNum,
        apstage: '6',
        editForm: {},
        applymonth: '',
        totalMoneySum: 0,
        actualMoneySum: 0
      }
    },

  mounted() {
    this.applymonth = this.$route.query.applymonth;
    this.getTableDataList()
  },
  
  components: {
    reviewTable,
  },

  methods: {
    getTableDataList() {
      let that = this
      let _data = {
        "applymonth": that.applymonth,
        "oqDeptReviewer": that.loginUser,
        "apstage": that.apstage
      }
      that.$axios.post(urlConfig.expertGroupReview.GETPLANNERINFOLIST, that.$qs.stringify(_data)).then(function (res) {
        if (res.data.status == 0) {
          let addIndex = null
          res.data.tableHeadData.forEach((item, index) => {
            if(item.prop == 'usagerate') {
              addIndex = index
            }
          })
          res.data.tableHeadData.splice(addIndex, 0, {isEdit: "0", prop: "opration", label: "计划详情", maxlen: "-1"})
          that.tableHead = res.data.tableHeadData
          that.tableData = res.data.data
          that.tableData.forEach((groupItem, groupIndex) => {
            groupItem.DataSet.forEach((item, index) => {
              if(!item.oqdeptreviewnote) {
                item.oqdeptreviewnote = '同意'
              }
            })
          })
          that.calcActualMoney()
        } else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, function (err) {
      })
    },
    autoCountActualmoney(val) {
      this.editForm.actualmoney = this.editForm.pprice * val
    },
    // itemDblclick(row) {
    //   this.editForm = {
    //     "pprice": row.pprice,
    //     "actualmoney": row.actualmoney,
    //     "assetplanid": row.assetplanid,
    //     "oqdeptreviewnote": row.oqdeptreviewnote,
    //     "requiredsaudit": row.requiredsaudit
    //   }
    //   this.dialogEditFormVisible = true
    // },
    dialogEditSave(type) {
      let that = this;   
      let params = {
        requiredsaudit: [],
        assetplanid: [],
        actualmoney: [],
        oqdeptreviewnote: [],
      }  
      that.tableData.forEach((groupItem, groupIndex) => {
        groupItem.DataSet.forEach((item, index) => {
          params.assetplanid.push(item.assetplanid)
          params.requiredsaudit.push(item.requiredsaudit)
          params.actualmoney.push(item.actualmoney)
          params.oqdeptreviewnote.push(item.oqdeptreviewnote)
        })
      })
      that.$axios.put(urlConfig.expertGroupReview.UPDATEPLANNERINFOLIST, params).then(function (res) {
        if (res.data.status == 0) {
          if(type == 'save') {
            that.$message({
              type: 'success',
              message: res.data.message,
              duration: 500,              
              onClose: function(){
                that.getTableDataList()
              }
            })
          } else if(type == 'submit') {
            that.submitToNext()
          }
        } else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, function (err) {
      })
    },
    calcActualMoney() {
      let that = this
      let tms = 0
      let ams = 0
      that.tableData.forEach((groupItem, groupIndex) => {
        let actualMoneySum = 0
        groupItem.DataSet.forEach((item, index) => {
          actualMoneySum += Number(item.actualmoney)
        })
        groupItem.ActualmoneySum = Number(actualMoneySum).toFixed(2)
        tms += Number(groupItem.TotalmoneySum)
        ams += Number(groupItem.ActualmoneySum)
      })
      that.totalMoneySum = tms.toFixed(2)
      that.actualMoneySum = ams.toFixed(2)
    },

    submitToNext() {
      let that = this
      let _data = {
        "applymonth": that.applymonth,
        "applyuser": that.loginUser,
        "apstage": that.apstage
      }
      that.$axios.post(urlConfig.expertGroupReview.SUBMITPLANNERINFOLIST, _data).then(function (res) {
        if (res.data.status == 0) {
          that.$message({
            type: 'success',
            message: res.data.message
          })
          that.getTableDataList()
        } else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, function (err) {
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/pageheader.scss';
  .formBox {
    background: #fff;
    // padding: 15px 20px 20px;
    margin-bottom: 30px;
  }
  .btnRow {
    margin-top: 15px;
    line-height: 32px;
    color: #333;
    span {
      margin-right: 30px;
      font-weight: 700;
    }
  }
</style>