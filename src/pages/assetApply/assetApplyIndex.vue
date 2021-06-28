<template>
  <div>
    <el-row class="title">
      <el-col :span="24">
        <div class="navBar">
          <div class="navItem navItemHome"><router-link to="/RDAssetPlanningManagement">首页</router-link></div>
          <div class="navItem navItemSplit" v-if="type == 'update'">&gt;</div>
          <div class="navItem navItemHome" v-if="type == 'update'"><router-link to="/assetPlanToDoList">我的待办</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemCol" v-if="!type">资产计划申购</div>
          <div class="navItem navItemCol" v-if="type == 'update'">申请环节</div>
        </div>
      </el-col>
    </el-row>
    <div class="formBox">
      <el-row type="flex" justify="space-between" class="title-header">
        <div style="line-height: 34px;">
          <span class="item-label_16">{{applymonth}}  填报人填写</span>
          <i class="line"></i>
          <span>
            <!-- <img class="money_icon" src="@/assets/img/money_icon.png" alt=""> -->
            <span class="item-label_14">申购总金额：</span><span class="item-label_14 text-blue">{{ totalmoneySum }}</span>
          </span>
        </div>

        <div>
          <el-button type="primary" @click="addItem" v-if="enableAddButton && !type">新增</el-button>
          <el-button type="primary" class="dangerBtn_666" @click="deleteAssetPlanInfo">删除</el-button>
          <el-button type="primary" @click="submit">提交计划单</el-button>
        </div>
      </el-row>
      <DynamicTable :tableHead="tableHead" :tableData="tableData" ref="tableChild" :assetStage="assetStage" :itemType="type"></DynamicTable>
      <el-row class="red-text">本流程涉及金额币种：人民币，单位：元</el-row>

      <el-pagination
        background
        layout="total,sizes,prev, pager, next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        prev-text="<上一页"
        next-text="下一页>"
        :page-sizes="[10, 20, 50]"
        :current-page="pageNum"
        :total="total"
        :page-size="pageSize">
      </el-pagination>
    </div>
  </div>
  
</template>

<script>
  //公共模块
  import DynamicTable from '../../components/DynamicTable'
  import store from '../../store/index'
  import utils from '../../util/utils'
  import urlConfig from '@/http/urlConfig/index' //引入接口地址
  export default {
    name: "assetApplyIndex",
    data() {
      return {
        applyUser: '', //申请人
        totalmoneySum: '', // 申请总金额
        tableHead: [],
        tableData: [],
        total: 0,
        pageNum: this.$store.state.assetApplyIndex.pageNum,
        pageSize: this.$store.state.assetApplyIndex.pageSize,
        applymonth: '',
        assetStage: '1',
        enableAddButton: false, // 新增按钮是否可以使用
        type: '',// update => 审核为不规范的条目
        addItemFlag: false,// 是否是新增
      }
    },
    components: {
      DynamicTable
    },    
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.$store.commit('addIncludeItem', 'assetApplyIndex')
      })
    },

    beforeRouteLeave(to, from, next) {
      if(to.path != '/assetApplyDetail' || this.addItemFlag) {
        this.$store.commit('removeIncludeItem', 'assetApplyIndex')
        this.$store.commit('resetAssetApplyIndexForm');
      }
      next()
    },
    activated() {
      this.getToDoList();
      this.addItemFlag = false
    },
    mounted() {
      // 入口：1.待办列表进入，此时获取url中的applymonth 2.首页申请tab进入，此时获取当前月
      this.applymonth = this.$route.query.applymonth ? this.$route.query.applymonth : utils.getCurrentMonth();
      this.applyUser = this.$store.state.Login.userInfo.workNum;
      this.type = this.$route.query.type
      this.getTableTitleInfo();
      this.checkEnableAdd()
    },
    methods: {
      // 验证该用户是否可以新增
      checkEnableAdd() {
        let that = this
        this.$store.dispatch('checkEnableAdd').then(function (res) {
          that.enableAddButton = res.data
        }, function () { })
      },
      getTableTitleInfo() {
        let that = this
        that.$axios.post(`${urlConfig.assetPlanApprovalQuery.GETTABLETITLEINFO}?viewName=AssetPlanInfoApplyView`).then(function (res) {
          if (res.data.status == 0) {
            that.tableHead = res.data.data
            that.getToDoList()
          } else {
            that.$message({
              type: 'warning',
              message: res.data.message
            })
          }
        }, function (err) {
        })
      },

      // 列表双击事件
      itemDblclick(row, col, event) {
        //console.log('parent', row);
      },
      selectItemFlag() {
        let that = this;      
        let selectList = this.$refs.tableChild.getSelectList();
        let havecompleteset = false;// 是否存在成套设备标识
        let nocompleteset = false;// 是否存在单个设备标识
        selectList.forEach(item => {
          if(item.iscompleteset == 1) {
            havecompleteset = true;
          }

          if(item.iscompleteset == 0) {
            nocompleteset = true;
          }
        })

        if(havecompleteset && nocompleteset) {
          return true;
        }
      },

      addItem () {
        let that = this; 
        let selectList = this.$refs.tableChild.getSelectList();   
        if(selectList.length == 0) {
          this.addItemFlag = true
          this.$router.push({path: '/assetApplyDetail'})
        } else if(selectList.length == 1) {
          this.addItemFlag = true
          this.$router.push({
            path: '/assetApplyDetail',  
            query: {
              assetplanid: selectList[0].assetplanid
            }
          })
        } else {
          let iscompletesetary = []
          let completesetcodeary = []
          selectList.forEach(item => {
            iscompletesetary.push(item.iscompleteset)
            completesetcodeary.push(item.completesetcode)
          })
          let tempary = Array.from(new Set(completesetcodeary))
          if(iscompletesetary.indexOf('0') < 0 && tempary.length == 1) {
            this.$router.push({
              path: '/assetApplyDetail',  
              query: {
                assetplanid: selectList[0].assetplanid
              }
            })
          } else {
            this.$alert('包含多条成套设备或非成套设备，请重新选择', '提示', {
              confirmButtonText: '确定',
              callback: action => { }
            })
          }
        }
      },

      deleteAssetPlanInfo() {
        let that = this; 
        let selectList = this.$refs.tableChild.getSelectList();     
        if(selectList.length == 0) {
          return;
        }
        this.$confirm('是否确定将所选的成套设备或非成套设备删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        }).then(() => {
          
          let ids = [];
          selectList.forEach(item => {
            ids.push(item.assetplanid);
          })
          this.$store.dispatch('deleteAssetPlanInfo', {
            lstDelID: ids.join(',')
          }).then(function (res) {
            if(res.success) {
              that.getToDoList();
            }
          }, function () {

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },

      submit() {
        let that = this;
        if(that.tableData.length == 0) {
          this.$confirm('当前无可提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            cancelButtonClass: 'btn-custom-cancel',
            type: 'warning'
          }).then(() => {}, function () { })
          return
        }
        let selectList = this.$refs.tableChild.getSelectList();
        let ids = [];
        selectList.forEach(item => {
          ids.push(item.assetplanid);
        })

        let tipText = '';
        if(ids.length > 0) {
          tipText = '请确认是否将所选物品及成套设备全部提交'
        } else {
          tipText = '请确认是否全部提交'
        }

        this.$confirm(tipText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        }).then(() => {
          that.$store.dispatch('submitAssetPlanInfoByIds', {
            applymonth: that.applymonth, 
            applyuser: that.applyUser,
            lstsubmitId: ids,
            checkFlag: that.type == 'update' ? '2' : '1'
          }).then(function (res) {
            if(res.success) {
              that.$message({
                message: res.message,
                type: 'success'
              });
              that.getToDoList();
            } else {
              that.$message({
                message: res.message,
                type: 'warning'
              });
            }
          }, function () {

          })
        }).catch(() => {
                    
        });

      },

      getToDoList() {
        let that = this    
        let fnName = '';
        if(this.type == 'update') {
          fnName = 'updateList'
        } else {
          fnName = 'getDraftInfoList'
        }
        this.$store.dispatch(fnName, {
          applyUser: that.applyUser,// 当前登录人的工号
          apstage: '1',// 物品所处的审批阶段
          applymonth: that.applymonth,
          pageNum: that.pageNum,
          pageSize: that.pageSize,
        }).then(function (res) {
          // that.tableHead = res.tableHeadData ? res.tableHeadData : [];
          that.tableData = res.data ? res.data[0].DataSet : [];
          that.tableData.forEach(item => {
            if(item.completesetcode) {
              item.completesetcode = item.plancode + '-' + item.completesetcode;
            } else {
              item.completesetcode = '';
            }
          })
          that.totalmoneySum = res.data ? res.data[0].TotalmoneySum : '';
          that.total = res.total
        }, function () {

        })
      },
      //分页
      handleCurrentChange (val) {
        this.pageNum = val 
        this.getToDoList()
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.getToDoList()
      },

    }
  }

</script>

<style lang="scss" scoped>
  .formBox {
    background: #fff;
    .dynamicTable {
      margin-top: 0;
    }
    .title-header {
      padding-bottom: 10px;
    }
    .item-label_16 {
      font-size: 16px;
      color: #111;
      font-weight: 600;
    }
    .item-label_14 {
      font-size: 14px;
      vertical-align: top;
    }
    .text-blue {
      color: #386ed3;
      font-weight: 600;
    }
    .red-text {
      margin-top: 10px;
      color: #F43636;
      font-size: 12px;
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
  }
</style>