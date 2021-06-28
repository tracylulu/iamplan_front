<template>
  <div>
    <el-row class="title">
      <el-col :span="24">
        <div class="navBar">
          <div class="navItem navItemHome"><router-link to="/RDAssetPlanningManagement">首页</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemHome"><router-link to="/assetPlanToDoList">我的待办</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemCol">三级部门主管审核</div>
        </div>
      </el-col>
    </el-row>  
    <div class="formBox">
      <el-row type="flex" justify="space-between">
        <h3 class="titleHeaderText">{{applymonth}}  三级部门主管审核</h3>
      </el-row>
      <table border="1" cellspacing="0" class="self-table-style" v-if="budgeInfoList.length > 0">
        <tr>
          <td class="bgTd line-gap">
            <span class="title-top">CAPEX预算（单位：万元）</span>
            <span class="title-bottom">部门</span>
          </td>
          <td class="bgTd">本月计划申购金额</td>
          <td class="bgTd">本月已同意申购金额</td>
          <td class="bgTd">实际到货金额</td>
          <td class="bgTd">在途金额</td>
          <td class="bgTd minWidth_60">合计（实际到货+在途）</td>
          <td class="bgTd">总年度预算</td>
          <td class="boderTdRight bgTd">年度预算剩余</td>
        </tr>
        <tr v-for="(item, index) in budgeInfoList" :key="index">
          <td :class="[index == budgeInfoList.length - 1 ? 'boderTdBottom bgTd' : 'bgTd']">{{ item.deptName }}</td>
          <td :class="[index == budgeInfoList.length - 1 ? 'boderTdBottom' : '']">{{ item.totalmoneySum }}</td>
          <td :class="[index == budgeInfoList.length - 1 ? 'boderTdBottom' : '']">{{ item.newBudgetSum }}</td>
          <td :class="[index == budgeInfoList.length - 1 ? 'boderTdBottom' : '']">{{ item.daoHuo }}</td>
          <td :class="[index == budgeInfoList.length - 1 ? 'boderTdBottom' : '']">{{ item.zaiTu }}</td>
          <td :class="[index == budgeInfoList.length - 1 ? 'boderTdBottom' : '']">{{ item.total }}</td>
          <td :class="[index == budgeInfoList.length - 1 ? 'boderTdBottom' : '']">{{ item.totalBudget }}</td>
          <td :class="[ item.newTotalBudgetSY < 0 ? 'red-text boderTdRight' : 'boderTdRight', index == budgeInfoList.length - 1 ? 'boderTdBottom' : '' ]">{{ item.newTotalBudgetSY }}</td>
        </tr>
      </table>
      <reviewTable 
        :tableHead="tableHead" 
        :tableData="tableData" 
        :assetStage="assetStage" 
        :calcActualMoney="calcActualMoney" 
        :mySelfTooltipFn="mySelfTooltipFn"
      ></reviewTable>
      <el-row class="total-row" type="flex" justify="end" v-if="tableData.length > 0">
        <span>合计:</span>
        <span>申购总金额：{{ totalMoneySum }}</span>
        <span>同意申购总金额：{{ actualMoneySum }}</span>
        <el-button type="primary" @click="updateReviewInfo('save')" :disabled="onlyOutTimeItem">保存</el-button>
        <el-button type="primary" @click="updateReviewInfo('submit')">审批完成</el-button>
      </el-row>
    </div>
    <div class="myself-tooltip" v-show="mySelfTooptipFlag" :style="{ top: mySelfTooptipTop + 'px', left: mySelfTooptipLeft + 'px'}">
      审批超时，请联系管理员激活
      <!-- <div class="myself-tooltip-arrow"></div> -->
    </div>
  </div>
</template>

<script>
import reviewTable from '../../components/reviewTable'
import urlConfig from '../../http/urlConfig/index'

export default {
  name: 'assetPlanDept3Review',
  components: {
    reviewTable
  },
  data() {
    return {
      tableHead: [],
      tableData: [],
      applymonth: '',
      assetStage: '3',
      reviewer: '',
      budgeInfoList: [],
      mySelfTooptipFlag: false,
      mySelfTooptipLeft: 0,
      mySelfTooptipTop: 0,
      totalMoneySum: 0,
      actualMoneySum: 0,
      onlyOutTimeItem: true,// 列表中只有超时的条目为true,保存按钮禁用
    }
  },
  
  mounted() {
    this.reviewer = this.$store.state.Login.userInfo.workNum;
    this.applymonth = this.$route.query.applymonth;
    this.getDept3InfoList();
    this.getBudgeInfoList();
  },
  methods: {
    mySelfTooltipFn(bool, left, top) {
      this.mySelfTooptipFlag = bool
      this.mySelfTooptipLeft = left
      this.mySelfTooptipTop = top
    },
    // 获取预算列表
    getBudgeInfoList() {
      let that = this;
      that.$axios.get(`${urlConfig.assetPlanDept3Mag.GETBUDGETINFOLIST}?applymonth=${that.applymonth}&applyuser=${that.reviewer}&apstage=3`).then(function (res) {
        if (res.data.success) {
          if(res.data.data) {
            res.data.data.forEach(item => {
              item.newBudgetSum = item.budgetSum
              item.newTotalBudgetSY = item.totalBudgetSY
            })
            that.budgeInfoList = res.data.data
            that.calcActualMoney()
          } else {
            that.budgeInfoList = [];
          }
        } 
      }, function (err) {})
    },
    // 获取三级主管审核列表信息
    getDept3InfoList() {
      let that = this;
      this.$store.dispatch('getDept3InfoList', {
        apstage: 3,
        dept3Manager: that.reviewer,
        applymonth: that.applymonth,
      }).then(res => {
        if(res.success) {
          let addIndex = null
          res.tableHeadData.forEach((item, index) => {
            if(item.prop == 'usagerate') {
              addIndex = index
            }
          })
          res.tableHeadData.splice(addIndex, 0, {isEdit: "0", prop: "opration", label: "计划详情", maxlen: "-1"})
          that.tableHead = res.tableHeadData;
          if(res.data && res.data.length > 0) {
            that.tableData = res.data
            that.onlyOutTimeItem = true
            that.tableData.forEach((groupItem, groupIndex) => {
              groupItem.DataSet.forEach((item, index) => {
                if(item.outtimeplanenum != 3 && item.outtimeplanenum != 4) {
                  that.onlyOutTimeItem = false
                }
                if(!item.dept3checknote) {
                  item.dept3checknote = '同意'
                }
              })
            })
            that.calcActualMoney()
          } else {
            that.tableData = [];
          }
        } else {
          that.$message({
            message: res.message,
            type: 'warning'
          })
        }
      }, err => {

      })
    },

    // 列表双击事件
    // itemDblclick(row, col, event) {
    //   this.$refs.modal.dialogFormVisible = true;
    //   let itemTemp = {
    //     assetplanid: row.assetplanid,
    //     pprice: row.pprice,
    //     requiredsaudit: row.requiredsaudit,
    //     reviewnote: row.dept2checknote,
    //   }
    //   this.dblclickItem = itemTemp;
    // },

    // 三级部门审核页面提交至二级部门审核
    submitInfoFromDept3ToDept2() {
      let that = this;
      this.$store.dispatch('submitInfoFromDept3ToDept2', {
        applyuser: that.reviewer,
        applymonth: that.applymonth
      }).then(res => {
        if(res.success) {
          that.$message({
            message: res.message,
            type: 'success'
          })
          that.getDept3InfoList();
        } else {
          that.$message({
            message: res.message,
            type: 'warning'
          })
        }
      }, err => {

      })
    },

    // 修改信息字段(申购数量/审核意见)
    updateReviewInfo(type) {
      let that = this;   
      let params = {
        requiredsaudit: [],
        assetplanid: [],
        actualmoney: [],
        dept3checknote: [],
      }  
      that.tableData.forEach((groupItem, groupIndex) => {
        groupItem.DataSet.forEach((item, index) => {
          params.assetplanid.push(item.assetplanid)
          params.requiredsaudit.push(item.requiredsaudit)
          params.actualmoney.push(item.actualmoney)
          params.dept3checknote.push(item.dept3checknote)
        })
      })
      this.$store.dispatch('updateDept3InfoList', params).then(res => {
        if(res.success) {
          if(type == 'save') {// 保存按钮
            that.$message({
              message: res.message,
              type: 'success'
            })
            that.getDept3InfoList();
          } else if (type == 'submit'){// 审批完成按钮
            that.submitInfoFromDept3ToDept2()
          }
        } else {
          that.$message({
            message: res.message,
            type: 'warning'
          })
        }
      }, err => {

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

      this.budgeInfoList.forEach((budgetItem, budgetIndex) => {
        that.tableData.forEach((groupItem, groupIndex) => {
          if(groupItem.groupId == 2) {
            let totalMoney = 0
            groupItem.DataSet.forEach((item, index) => {
              if(budgetItem.deptCode == item.deptcode && item.expensetype == 2) {
                totalMoney += Number(item.actualmoney)
              } 
            })
            budgetItem.newBudgetSum = Math.round((Math.round(totalMoney / 100) / 100 + budgetItem.budgetSum) * 100) / 100
            budgetItem.newTotalBudgetSY = Math.round((budgetItem.totalBudgetSY - Math.round(totalMoney / 100) / 100 ) * 100) / 100
          }
        })
      })
    },

  }
}
</script>

<style lang="scss" scoped>
  .formBox {
    background: #fff;
    margin-bottom: 30px;
    // padding: 15px 20px 20px;
    .dynamicTable {
      margin-top: 20px;
    }
    table {
      margin-top: 10px;
      table-layout: fixed;
      tr {
        height: 30px;
        td {
          position: relative;
          padding: 0 10px;
          width: 12.5%;
          text-align: center;
        }
        .line-gap {
          position: relative;
          width: 221px!important;
          height: 60px;
          .title-top {
            position: absolute;
            top: 5px;
            right: 0px;
            width: 132px;
            text-align: right;
          }
          .title-bottom {
            position: absolute;
            top: 36px;
            left: 80px;
          }
        }
        .line-gap:before {
          content: "";
          position: absolute;
          width: 1px;
          height: 226px;
          top: 0;
          left: 0;
          background-color: #c9ddf7;
          display: block;
          transform: rotate(-75deg);
          transform-origin: top;
        }
        .minWidth_60 {
          min-width: 172px;
        }
      }
      .red-text {
        color: #f43636;
        font-weight: bold;
      }
    }
    .bgTd {
      font-weight: 900;
    }
    .total-row {
      margin-top: 15px;
      line-height: 32px;
      color: #333;
      span {
        margin-right: 30px;
        font-weight: 700;
      }
    }
  }
  .myself-tooltip {
    position: fixed;
    padding: 10px;
    width: 158px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.2;
    background: #303133;
    color: #FFF;
    z-index: 2000;
    .myself-tooltip-arrow {
      position: absolute;
      top: 10px;
      left: -5px;
      display: block;
      width: 0;
      height: 0;
      border: 6px solid #303133;
      border-top-color: transparent;
      border-right-color: transparent;
      transform: rotate(45deg);
    }
  }
  @import '@/assets/css/selfTable.scss';
</style>