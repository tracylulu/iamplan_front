<template>
  <div class="assetPlanReview">
    <el-row class="title">
      <el-col :span="24">
        <div class="navBar">
          <div class="navItem navItemHome"><router-link to="/RDAssetPlanningManagement">首页</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemHome"><router-link to="/assetPlanToDoList">我的待办</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemCol">规范审核</div>
        </div>
      </el-col>
    </el-row>    
    <div class="formBox">
      <table border="1" cellspacing="0" style="width: 100%" class="search-table">
        <tr>
          <td width="10%" class="bgTd boderTdBottom">部门</td>
          <td width="20%" class="boderTdBottom">
            <treeselect v-model="searchForm.deptCode" :options="deptArr" :normalizer="normalizer" :multiple="false" placeholder='请选择' />
          </td>
          <td width="10%" class="bgTd boderTdBottom">审核状态</td>
          <td width="20%" class="boderTdBottom">
            <el-select :gutter="20" v-model="searchForm.reviewResult" clearable>
              <el-option label="全选" :value="0"></el-option>
              <el-option label="规范" :value="1"></el-option>
              <el-option label="不规范" :value="2"></el-option>
              <el-option label="未审核" :value="3"></el-option>
            </el-select>
          </td>
          <td width="10%" class="bgTd boderTdBottom">金额</td>
          <td width="20%" class="boderTdRight boderTdBottom">
            <div>
              <el-input type="number" clearable class="price-input" v-model="searchForm.startPrice"></el-input><span style="width: 4%;display: inline-block;text-align: center">-</span><el-input type="number" clearable class="price-input" v-model="searchForm.endPrice"></el-input>
            </div>
          </td>
        </tr>
      </table>
      <el-row type="flex" justify="center" class="search-btn">
        <el-button type="primary" @click="searchFn">查询</el-button>
        <!-- <el-button type="primary dangerBtn_666" @click="clearParams">置空</el-button> -->
      </el-row>
    </div>
    <div class="formBox" style="padding-top: 0;margin-bottom: 30px">
      <el-row type="flex" justify="space-between" class="title-header">
        <div style="line-height: 34px;">
          <span class="item-label_16">{{searchForm.applymonth}}  规范审核</span>
          <i class="line"></i>
          <span v-if="tableData.length > 0">
            <!-- <img class="money_icon" src="@/assets/img/money_icon.png" alt=""> -->
            <span class="item-label_14">申购总金额：</span><span class="item-label_14 text-blue bold-text">{{ totalMoneySum }}</span>
          </span>
          <span class="item-label_14 text-blue" style="margin-left: 10px;">（*双击物品信息可修改详情）</span>
        </div>
        <div>
          <el-button type="primary" @click="emailForNotReview">不规范邮催</el-button>
          <el-button type="primary" @click="batchReview" >批量审核</el-button>
          <el-button type="primary" @click="changeHandlerDialogVisible = true" >工作委托</el-button>
        </div>
      </el-row>
      <DynamicTable :tableHead="tableHead" :tableData="tableData" ref="tableChild" :tableItemSelectFlag="tableItemSelectFlag" :assetStage="assetStage"></DynamicTable>
      <el-row class="submit-area">
        <el-button type="primary" class="longBtn" @click="submitInfoFromReviewToDept3" v-if="tableData.length > 0">提交三级部门主管审核</el-button>
      </el-row>

      <el-pagination
        v-if="paginationShow"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        prev-text="<上一页"
        next-text="下一页>"
        :page-sizes="[10, 50, 100, 150, 200, 250, 300]"
        :current-page.sync="searchForm.pageNum"
        :total="total"
        :page-size="searchForm.pageSize">
      </el-pagination>
    </div>

    <Modal ref="modal" :dblclickItem="dblclickItem" :rules="rules" :assetStage="assetStage"></Modal>

    <el-dialog title="评审意见" :visible.sync="btachReviewDialogVisible" width="50%" class="dialog-p-top">
      <el-form :model="dblclickItem" label-position="right" label-width="21%" :rules="rules" ref="ruleForm">
        <el-form-item label="规范审核状态" class="form-item">
          <el-select v-model="batchReviewStatus">
            <el-option label="规范" value="1"></el-option>
            <el-option label="不规范" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" class="form-item">
          <el-input v-model="batchReviewNote"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchReviewSure">确 定</el-button>
        <el-button type="primary" @click="btachReviewDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <changeHandlerDialog 
      :applymonth="searchForm.applymonth" 
      :apstage="2"
      @closeChangeHandler="closeChangeHandler"
      :changeHandlerDialogVisible="changeHandlerDialogVisible"
      @refreshList="refreshList"
    ></changeHandlerDialog>
  </div>
</template>

<script>
//公共模块
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import DynamicTable from '../../components/DynamicTable'
import Modal from '../../components/Modal'
import changeHandlerDialog from '../../components/changeHandlerDialog'
import store from '../../store/index'
import urlConfig from '../../http/urlConfig/index'

export default {
  name: 'assetPlanReview',
  data() {
    return {
      rules: {
        assetmanufacturer: [{ required: true, message: '厂家必填', trigger: 'change'}],
        assetmodel: [{ required: true, message: '型号必填',trigger: 'change'}],
        pprice: [{ required: true, message: '预计单价为整数', trigger: 'blur'}],
        requiredsaudit: [{ required: true, message: '同意申购数量为整数', trigger: 'blur'}],
        assetcategory: [{ required: true, message: '物品品类必填', trigger: 'blur'}],
        expensetype: [{ required: true, message: '预算类型必填', trigger: 'change'}],
      },
      tableItemSelectFlag: true,// 列表条目是否可选
      tableHead: [],
      tableData: [],
      totalMoneySum: 0,
      dblclickItem: {},
      assetStage: '2',
      btachReviewDialogVisible: false,
      batchReviewStatus: '1',
      batchReviewNote: '',
      total: 0,
      deptArr: [],
      paginationShow: true, // 在详情页面返回之后，页码显示不正确，属于el-pagination组件的bug，用v-if解决
      searchForm: this.$store.state.assetPlanReview.searchForm,
      changeHandlerDialogVisible: false,
    }
  },
  components: {
    DynamicTable,
    Modal,
    Treeselect,
    changeHandlerDialog,
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('addIncludeItem', 'assetPlanReview')
    })
  },

  beforeRouteLeave(to, from, next) {
    if(to.path != '/assetApplyDetail') {
      this.$store.commit('removeIncludeItem', 'assetPlanReview')
      this.$store.commit('clearForm');
    } 
    next()
  },

  mounted() {
    this.searchForm.reviewer = this.$store.state.Login.userInfo.workNum;
    this.searchForm.applymonth = this.$route.query.applymonth;
    this.getDeptTree()
    this.paginationShow = false
    this.searchFn();
  },
  activated() {
    this.searchFn();
  },

  methods: {
    //置空查询条件
    clearParams() {
      this.$store.commit('clearForm')
      this.formData = this.$store.state.assetPlanReview.searchForm
    },
    closeChangeHandler() {
      this.changeHandlerDialogVisible = false
    },
    refreshList() {
      this.searchFn()
    },
    // 获取申请部门树
    getDeptTree() {
      let that = this
      that.$axios.get(urlConfig.assetPlanApprovalQuery.DEPTINFOTREEGET).then(function (res) {
        that.deptArr = res.data.data;
      }, err => {})
    },
    normalizer(node){
      //去掉children=null的children属性
      if(node.children == null){
        delete node.children;
      }
      return {
        id: node.deptCode,
        label: node.deptName,
        children: node.children
      }
    },

    formatTableData() {
      this.tableData.forEach((item, index) => {
        if(item.reviewresult == 1) {
          item.reviewresult = '规范';
        } else if(item.reviewresult == 2) {
          item.reviewresult = '不规范';
        } else if(item.reviewresult == 3) {
          item.reviewresult = '未审核';
        } else if(item.reviewresult == 4) {
          item.reviewresult = '再审核';
        }
        if(item.completesetcode) {
          item.completesetcode = item.plancode + '-' + item.completesetcode;
        } else {
          item.completesetcode = '';
        }
      })
    },

    // 列表双击事件
    itemDblclick(row, col, event) {
      if(row.iscompleteset == 0) {// 非成套设备
        this.$refs.modal.dialogFormVisible = true;
        let itemTemp = {
          assetcategory: row.assetcategoryId,
          goodstime: row.goodstime,// 修改时，类别和货期要传对应条目的id
          assetmanufacturer: row.assetmanufacturer,
          expensetype: row.expensetype ? row.expensetype : '',
          assetmodel: row.assetmodel,
          assetplanid: row.assetplanid,
          pprice: row.pprice,
          requireds: row.requireds,
          requiredsaudit: row.requiredsaudit,
          reviewnote: row.reviewnote,
          reviewresult: row.reviewresult == '不规范' ? '2' : '1',
          isreqpurchasereport: row.isreqpurchasereport ? row.isreqpurchasereport : '',
          isspecifymanufacturer: row.isspecifymanufacturer ? row.isspecifymanufacturer : '',
          isComplete: row.isComplete ? row.isComplete : 0
        }
        this.dblclickItem = itemTemp;
      } else {// 成套设备
        this.$router.push({
          path: '/assetApplyDetail',
          query: {
            assetplanid: row.assetplanid,
            eventtype: 'dblclick',
            assetstage: '2'
          }
        })
      }
    },

    // 不规范邮件提醒
    emailForNotReview() {
      let that = this;
      this.$store.dispatch('emailForNotReview', {
        reviewer: that.searchForm.reviewer,
        applymonth: that.searchForm.applymonth
      }).then(res => {
        if(res.success) {
          that.$message({
            message: res.message,
            type: 'success'
          })
        } else {
          that.$message({
            message: res.message,
            type: 'warning'
          })
        }

      }, err => {

      })
    },

    // 规范审核页面提交至三级部门主管审核
    submitInfoFromReviewToDept3() {
      let that = this;
      let selectList = this.$refs.tableChild.getSelectList();
      let ids = [];
      selectList.forEach(item => {
        ids.push(item.assetplanid);
      })

      let tipText = '';
      if(ids.length > 0) {
        tipText = '请确认是否将已选中且规范条目提交'
      } else {
        tipText = '请确认是否将全部规范条目提交'
      }
      this.$confirm(tipText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      }).then(() => {
        that.$store.dispatch('submitInfoFromReviewToDept3', {
          applyuser: that.searchForm.reviewer,
          applymonth: that.searchForm.applymonth,
          lstsubmitId: ids
        }).then(res => {
          if(res.success) {
            that.$message({
              message: res.message,
              type: 'success'
            })
            that.searchFn();
          } else {
            that.$message({
              message: res.message,
              type: 'warning'
            })
          }

        }, err => { })
      }).catch(() => { });
    },

    // 修改规范审核列表信息字段(厂家/型号/预计单价/类别/规范审核状态/审核意见)
    updateReviewInfo(item) {
      let that = this;      
      let params = {
        assetcategory: item.assetcategory,
        goodstime: item.assetcategory,// 修改时，类别和货期要传对应条目的id
        assetmanufacturer: item.assetmanufacturer,
        assetmodel: [item.assetmodel],
        assetplanid: [item.assetplanid],
        pprice: [item.pprice],
        expensetype: item.expensetype,
        totalmoney: [(Math.floor(item.pprice * item.requireds * 100) / 100).toFixed(2)],
        requiredsaudit: [item.requiredsaudit],
        actualmoney: [(Math.floor(item.pprice * item.requiredsaudit * 100) / 100).toFixed(2)],
        reviewnote: item.reviewnote,
        reviewresult: item.reviewresult,
        isComplete: item.isComplete
      }
      
      this.$store.dispatch('updateReviewInfo', params).then(res => {
        if(res.success) {
          that.$refs.modal.dialogFormVisible = false;
          that.$message({
            message: res.message,
            type: 'success'
          })
          that.searchFn();
        } else {
          that.$message({
            message: res.message,
            type: 'warning'
          })
        }
      }, err => { })
    },

    batchReview() {
      let selectList = this.$refs.tableChild.getSelectList();
      if(selectList.length == 0) {
        this.$message({
          message: '请选择需要审核的条目',
          type: 'warning'
        });
      } else {
        this.batchReviewNote = ''
        this.btachReviewDialogVisible = true;
      }
    },

    batchReviewSure() {
      let that = this;   
      let ids = [];
      let selectList = this.$refs.tableChild.getSelectList();
      selectList.forEach(item => {
        ids.push(item.assetplanid);
      })
      let data = new FormData();
      data.append('ids', ids);
      data.append('result', Number(that.batchReviewStatus));
      data.append('reviewNote', that.batchReviewNote);
      that.$axios.post(urlConfig.assetPlanReviewMag.UPDATEREVIEWRESULT, data).then(function (res) {
        that.btachReviewDialogVisible = false;
        if (res.data.success) {
          that.$message({
            type: 'success',
            message: '审核成功'
          })
          that.searchFn();
        }
        else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, function (err) {
        that.btachReviewDialogVisible = false;
      })
    },

    //分页
    handleCurrentChange (val) {
      this.searchForm.pageNum = val 
      this.searchFn()
    },
    handleSizeChange (val) {
      this.searchForm.pageSize = val
      this.searchFn()
    },

    searchFn() {
      let that = this
      let params = Object.assign({}, that.searchForm)
      this.$axios.post(urlConfig.assetPlanReviewMag.reviewSearch, params).then(res => {
        res = res.data
        if(res.success) {
          if(res.data && res.data.length > 0) {
            that.tableHead = res.tableHeadData
            that.tableData = res.data[0].DataSet;
            that.totalMoneySum = res.data[0].TotalmoneySum;
            that.formatTableData();
          } else {
            that.tableData = [];
            that.totalMoneySum = '';
          }
        } else {
          that.$message({
            message: res.message,
            type: 'warning'
          })
        }
        that.total = res.total;
        that.paginationShow = true
      }, err => {})
    },

  }
}
</script>

<style lang="scss" scoped>
   .formBox {
    background: #fff;
    // padding: 15px 20px 20px;
    .title-header {
      padding: 10px 0 10px;
      border-top: 1px solid #ddd;
    }
    .item-label_16 {
      font-size: 16px;
      font-weight: 600;
    }
    .item-label_14 {
      font-size: 14px;
      vertical-align: top;
    }
    .text-blue {
      color: #386ed3;
      font-weight: normal;
    }
    .bold-text {
      font-weight: bold;
    }
    .line {
      display: inline-block;
      margin: 0 10px;
      width: 1px;
      height: 12px;
      background-color: #e1e1e1;
      vertical-align: middle;
    }
    .money_icon {
      width: 14px;
      height: 14px;
    }
    h3 {
      margin-bottom: 25px;
      text-align: center;
    }
    .title {
      display: flex;
      align-items: center;
      .text-red {
        color: #ff3333;
      }
    }
    .dynamicTable {
      margin-top: 0;
    }
    .search-btn {
      margin-top: 15px;
      text-align: center;
    }
  }
  .submit-area {
    margin: 15px auto;
    text-align: center;
  }
  .search-table {
    width: 100%;
    border: transparent;
    tr td {
      padding: 2px 10px;
      box-sizing: border-box;
      border: 1px solid #c9ddf7;
      border-bottom: transparent;
      border-right: transparent;
    }
    tr .boderTdRight {
      border-right: 1px solid #c9ddf7;
    }
    tr .boderTdBottom {
      border-bottom: 1px solid #c9ddf7;
    }
  }
  
</style>
<style scoped>
  .price-outer /deep/ .el-form-item__content {
    width: 85%;
  }
  .price-input {
    display: inline-block;
    width: 46%;
  }
  .price-input /deep/ .el-input__inner{
    display: inline-block;
  }
  .price-input /deep/ .el-input__inner::-webkit-outer-spin-button, .price-input /deep/ .el-input__inner::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .price-input /deep/ .el-input__inner[type="number"]{
    -moz-appearance: textfield;
  }
</style>
<style>
  .assetPlanReview .vue-treeselect .vue-treeselect__control {
    border-radius: 0;
    padding-left: 10px;
    width: auto;
    height: 26px;
  }
  .vue-treeselect__control .vue-treeselect__placeholder, .vue-treeselect__single-value {
    line-height: 26px;
  }
  .vue-treeselect__control .vue-treeselect__placeholder {
    color: #666;
  }
  .assetPlanReview .vue-treeselect .vue-treeselect__control .vue-treeselect__value-container {
    line-height: 20px;
  }
  .el-input__icon, .el-range-separator {
    line-height: 1!important;
  }
</style>