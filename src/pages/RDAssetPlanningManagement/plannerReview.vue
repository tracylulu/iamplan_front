<template>
  <div>
    <el-row class="title">
      <el-col :span="24">
        <div class="navBar">
          <div class="navItem navItemHome"><router-link to="/RDAssetPlanningManagement">首页</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemHome"><router-link to="/assetPlanToDoList">我的待办</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemCol">计划员审核</div>
        </div>
      </el-col>
    </el-row>
    <div class="formBox">
      <el-row type="flex" justify="space-between">
        <h3 class="titleHeaderText">{{applymonth}}  计划员组织专家评审</h3>
        <div v-if="tableData.length > 0">
          <el-button type="primary" @click="exportExList" :disabled='prExport'>导出</el-button>
        </div>
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
    name: 'plannerReview',
    data() {
      return {
        tableHead: [],
        tableData: [],
        loginUser: this.$store.state.Login.userInfo.workNum,
        apstage: '5',
        editForm: {},
        applymonth: '',
        prExport: false,
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
        "planner": that.loginUser,
        "apstage": that.apstage
      }
      that.$axios.post(urlConfig.plannerReview.GETPLANNERINFOLIST, that.$qs.stringify(_data)).then(function (res) {
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
              if(!item.plannernote) {
                item.plannernote = '同意'
              }
            })
          })
          that.calcActualMoney()
        }
        else {
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
    //     "plannernote": row.plannernote,
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
        plannernote: [],
      }  
      that.tableData.forEach((groupItem, groupIndex) => {
        groupItem.DataSet.forEach((item, index) => {
          params.assetplanid.push(item.assetplanid)
          params.requiredsaudit.push(item.requiredsaudit)
          params.actualmoney.push(item.actualmoney)
          params.plannernote.push(item.plannernote)
        })
      })
      that.$axios.put(urlConfig.plannerReview.UPDATEPLANNERINFOLIST, params).then(function (res) {
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
      that.$axios.post(urlConfig.plannerReview.SUBMITPLANNERINFOLIST, _data).then(function (res) {
        if (res.data.status == 0) {
          that.$message({
            type: 'success',
            message: res.data.message
          })
          that.getTableDataList()
        }
        else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, function (err) {
      })
    },
    //导出
    exportExList() {
      let that = this
      that.prExport = true
      util.loadingEx(that, '导出文件中...')
      let params = Object.assign({}, {
        applymonth: that.applymonth,
        planner: that.loginUser
      });
      that.$store.dispatch('exportAssetPlanInfoForPlanner', params).then(function (res) {
        that.prExport = false
        let file = res.data
        let blob = new Blob([file])
        let url = URL.createObjectURL(blob)
        let fileName = decodeURIComponent("资产计划审批信息.xlsx")

        if (navigator.msSaveBlob) {
          util.closeLoadingEx(that, 'success', '导出成功')
          return navigator.msSaveBlob(blob, fileName)
        } else {
          let link = document.createElement('a')
          link.download = fileName
          link.href = url
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          util.closeLoadingEx(that, 'success', '导出成功')
        }
      }, function (err) {
        that.prExport = false
        util.closeLoadingEx(that, 'error', '导出失败，' + err.data.message)
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
    .titleHeaderText {
      line-height: 32px;
    }
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