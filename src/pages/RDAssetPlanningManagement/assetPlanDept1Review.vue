<template>
  <div>
    <el-row class="title">
      <el-col :span="24">
        <div class="navBar">
          <div class="navItem navItemHome"><router-link to="/RDAssetPlanningManagement">首页</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemHome"><router-link to="/assetPlanToDoList">我的待办</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemCol">一级部门主管审核</div>
        </div>
      </el-col>
    </el-row>
    <div class="formBox">
      <el-row type="flex" justify="space-between">
        <h3 class="titleHeaderText">{{applymonth}}  一级部门主管审核</h3>
      </el-row>
      <reviewTable :tableHead="tableHead" :tableData="tableData" :assetStage="apstage" :calcActualMoney="calcActualMoney"></reviewTable>
      <el-row class="btnRow" type="flex" justify="end" v-if="tableData.length > 0">
        <span>合计:</span>
        <span>申购总金额：{{ totalMoneySum }}</span>
        <span>同意申购总金额：{{ actualMoneySum }}</span>
        <el-button type="primary" @click="dialogEditSave('save')">保存</el-button>
        <el-button type="primary" @click="dialogEditSave('submit')">审批完成</el-button>
        <!-- <el-button type="primary" @click="agreeEvent('unagree')">不同意</el-button> -->
      </el-row>
    </div>
  </div>
</template>

<script>
  import urlConfig from '@/http/urlConfig/index' //引入接口地址
  import reviewTable from '../../components/reviewTable'
  import util from '@/util/utils'
  export default {
    name: 'assetPlanDept1Review',
    data() {
      return {
        tableHead: [],
        tableData: [],
        loginUser: this.$store.state.Login.userInfo.workNum,
        apstage: '7',
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
        "dept1Reviewer": that.loginUser,
        "apstage": that.apstage
      }
      that.$axios.post(urlConfig.assetPlanDept1Review.GETPLANNERINFOLIST, that.$qs.stringify(_data)).then(function (res) {
        if (res.data.status == 0) {
          let addIndex = null
          res.data.tableHeadData.forEach((item, index) => {
            if(item.prop == 'usagerate') {
              addIndex = index
            }
          })
          res.data.tableHeadData.splice(addIndex, 0, {isEdit: "0", prop: "opration", label: "计划详情", maxlen: "-1"})
          that.tableHead = res.data.tableHeadData
          that.tableData = res.data.data ? res.data.data : [];
          that.tableData.forEach((groupItem, groupIndex) => {
            groupItem.DataSet.forEach((item, index) => {
              if(!item.dept1reviewnote) {
                item.dept1reviewnote = '同意'
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
    //     "dept1reviewnote": row.dept1reviewnote,
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
        dept1reviewnote: [],
      }  
      that.tableData.forEach((groupItem, groupIndex) => {
        groupItem.DataSet.forEach((item, index) => {
          params.assetplanid.push(item.assetplanid)
          params.requiredsaudit.push(item.requiredsaudit)
          params.actualmoney.push(item.actualmoney)
          params.dept1reviewnote.push(item.dept1reviewnote)
        })
      })
      that.$axios.put(urlConfig.assetPlanDept1Review.UPDATEPLANNERINFOLIST, params).then(function (res) {
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
          } else if (type == 'submit') {
            that.submit(urlConfig.assetPlanDept1Review.DEPT1AGREE)
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
    agreeEvent(type) {
      let that = this
      if(type == 'agree') {
        this.submit(urlConfig.assetPlanDept1Review.DEPT1AGREE)
      } else if (type == 'unagree') {
        this.$confirm('请确认是否终止所有申请', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        }).then(() => {
          that.submit(urlConfig.assetPlanDept1Review.DEPT1UNAGREE)
        }).catch(() => {
                  
        });
      }
    },
    submit(url) {
      let that = this
      let _data = {
        "applymonth":  that.applymonth,
        "applyuser": that.loginUser,
        "apstage": that.apstage
      }
      that.$axios.post(url, _data).then(function (res) {
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
    margin-bottom: 30px;
    // padding: 15px 20px 20px;
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