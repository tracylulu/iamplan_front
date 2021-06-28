<template>
  <div class="reviewTable">
    <el-table class="tableHeadOnly" border v-if="tableData.length > 0" :header-cell-style="headerCellStyleFn">
      <template v-for="(col, index) in tableHead">
        <el-table-column 
          :prop="col.prop" 
          :label="col.label" 
          :key="index" 
          :data-edit="col.isEdit" 
          :min-width="flexColumnMinWidth(col)"
          :width="flexColumnWidth(col)"
          :resizable="false"
        ></el-table-column>                
      </template>  
      <!-- <el-table-column label="操作" fixed="right" :width="assetStage == 7 ? 140 : 100"></el-table-column> -->
    </el-table>
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(item, i) in tableData" :key="i" :name="i">
        <template slot="title" v-if="assetStage == 3 || assetStage == 4">
          {{item.GroupName}}： 申购金额 {{item.TotalmoneySum}}， 同意申购金额 {{item.ActualmoneySum}}
        </template>
        <template slot="title" v-if="assetStage == 5 || assetStage == 6 || assetStage == 7">
          {{item.GroupName}}： 申报数量 {{item.Requireds}}， 审批数量 {{item.RequiredsAudit}}， 申购金额 {{item.TotalmoneySum}}， 审批金额 {{item.ActualmoneySum}}
        </template>
        <el-table 
          :show-header="false" 
          class="collapseTable table-fixed" 
          highlight-current-row stripe border 
          :data="item.DataSet" 
          :cell-style="cellStyleFn"
          @cell-mouse-enter="cellMouseEnterFn"
          @cell-mouse-leave="cellMouseLeaveFn"
          :row-class-name="tableRowClassName"
          :cell-class-name="tableCellClassName"
          :ref="`tableData_${i}`"
        >
          <template v-for="(col, index) in tableHead">
            <el-table-column 
              :prop="col.prop" 
              :label="col.label" 
              :key="index" 
              :data-edit="col.isEdit" 
              show-overflow-tooltip 
              :min-width="flexColumnMinWidth(col)"
              :width="flexColumnWidth(col)"
            >
              <!-- <el-table-column label="序号" type="index" width="60"></el-table-column> -->
              <template slot-scope="scope">
                <!-- 使用率按钮 -->
                <div class="usagerateBtn" v-if="col.prop == 'usagerate'" @click="usageRateDetail(scope.row)">{{ scope.row.usagerate ? scope.row.usagerate : '点击加载' }}</div>
                <!-- 评审意见 -->
                <div v-else-if="col.prop == 'dept3checknote' || col.prop == 'dept2checknote' || col.prop == 'dept1reviewnote' || col.prop == 'plannernote' || col.prop == 'oqdeptreviewnote'">
                  <el-radio-group v-model="scope.row.dept3checknote" v-if="assetStage == 3" @change="(val) => radioChangeFn(val, scope)" :disabled="scope.row.outtimeplanenum == 3">
                    <el-radio label="同意">同意</el-radio>
                    <el-radio label="不同意">不同意</el-radio>
                  </el-radio-group>
                  <el-radio-group v-model="scope.row.dept2checknote" v-if="assetStage == 4" @change="(val) => radioChangeFn(val, scope)" :disabled="scope.row.outtimeplanenum == 4">
                    <el-radio label="同意">同意</el-radio>
                    <el-radio label="不同意">不同意</el-radio>
                  </el-radio-group>
                  <el-radio-group v-model="scope.row.plannernote" v-if="assetStage == 5" @change="(val) => radioChangeFn(val, scope)">
                    <el-radio label="同意">同意</el-radio>
                    <el-radio label="不同意">不同意</el-radio>
                  </el-radio-group>
                  <el-radio-group v-model="scope.row.oqdeptreviewnote" v-if="assetStage == 6" @change="(val) => radioChangeFn(val, scope)">
                    <el-radio label="同意">同意</el-radio>
                    <el-radio label="不同意">不同意</el-radio>
                  </el-radio-group>
                  <el-radio-group v-model="scope.row.dept1reviewnote" v-if="assetStage == 7" @change="(val) => radioChangeFn(val, scope)">
                    <el-radio label="同意">同意</el-radio>
                    <el-radio label="不同意">不同意</el-radio>
                  </el-radio-group>
                </div>
                <!-- 同意申购数量输入框 -->
                <el-input
                  class="num-input"
                  v-model="scope.row.requiredsaudit"
                  v-else-if="col.prop == 'requiredsaudit'" 
                  maxlength="11"
                  @focus="inputFocus($event, scope)"
                  @change="val => inputChange(val, scope)"
                  @blur="inputBlur($event, scope)"
                  @input="val => inputFn(val, scope)"
                  :disabled="scope.row.outtimeplanenum == 3 || scope.row.outtimeplanenum == 4"
                ></el-input>

                <!-- 计划详情 -->
                <el-button 
                  type="text" 
                  v-else-if="col.prop == 'opration'"  
                  size="mini" 
                  @click="gotoApprovalRecord(scope.row)"
                  class="detail-text"
                >详情</el-button>
                <!-- 其他列数据 -->
                <div v-else>{{ scope.row[col.prop] }}</div>
              </template>
            </el-table-column>                
          </template>  
          <!-- <el-table-column label="操作" fixed="right" :width="assetStage == 7 ? 140 : 100">
            <template slot-scope="scope">
              <el-button type="text" @click="gotoApprovalRecord(scope.row)">详情</el-button>
              <el-button type="text" v-if="assetStage == 7" @click="gotoApprovalRecord(scope.row)">审批记录</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'reviewTable',
  props:{
    tableHead: {
      type: Array,
      default: []
    },

    tableData: {
      type: Array,
      default: []
    },

    assetStage: {// 资源申购计划当前所处阶段
      type: String,
      default: '5'
    }
  },
  data () {
    return {
      activeNames: []
    }
  },

  watch: {
    'tableData': {
      handler() {
        let that = this
        that.activeNames = []
        that.tableData.forEach((item, index) => {
          that.activeNames.push(index)
        })

        setTimeout(() => {
          that.tableData.forEach((item, index) => {
            that.$refs[`tableData_${index}`][0].doLayout()
          })
        }, 100)
      },
      deep: true
    }
  },

  mounted () {
    window.addEventListener('scroll',this.sticky_event,true)
  },

  destroyed(){
    window.removeEventListener('scroll',this.sticky_event,true)
  },

  methods: {
    flexColumnMinWidth(col) {
      let labelLen = col.label.length
      let labelWid = labelLen * 16 // 每个字大约20个宽度        
      if(col.prop == 'pprice' || col.prop == 'totalmoney' || col.prop == 'actualmoney') {
        return '118px'
      } else if(col.prop == 'requireds') {// 申购数量
        return '100px'
      } else if(col.prop == 'usagerate') {// 使用率
        return '192px'
      } else if(col.prop == 'dept3checknote' 
        || col.prop == 'dept2checknote' 
        || col.prop == 'dept1reviewnote' 
        || col.prop == 'plannernote' 
        || col.prop == 'oqdeptreviewnote') 
      {// 评审意见
        return '150px'
      } else if(labelLen <= 4) {
        return '90px' // 文字长度 + 左右的padding
      } else {
        return labelWid + 30 + 'px'
      }
    },
    flexColumnWidth(col) {
      if(col.prop == 'pprice' || col.prop == 'totalmoney' || col.prop == 'actualmoney') {
        return '118px'
      }
      if(col.prop == 'requireds') {
        return '100px'
      }
      if(col.prop == 'usagerate') {
        return '192px'
      }
    },
    cellMouseEnterFn(row, column, cell, event) {
      if(row.outtimeplanenum == 3 || row.outtimeplanenum == 4) {
        this.$parent.mySelfTooltipFn(true, event.clientX + 25, event.clientY)
      }
    },
    cellMouseLeaveFn(row, column, cell, event) {
      if(row.outtimeplanenum == 3 || row.outtimeplanenum == 4) {
        this.$parent.mySelfTooltipFn(false, 0, 0)
      }
    },
    tableRowClassName({row, rowIndex}) {
      if (row.outtimeplanenum == 3 || row.outtimeplanenum == 4) {
        return 'warning-row';
      } 
      return '';
    },
    tableCellClassName({row, column, rowIndex, columnIndex}) {
      if (column.property == 'opration' 
        || column.property == 'requiredsaudit' 
        || column.property == 'actualmoney' 
        || column.property == 'usagerate' 
        || column.property == 'dept3checknote' 
        || column.property == 'dept2checknote' 
        || column.property == 'dept1reviewnote' 
        || column.property == 'plannernote' 
        || column.property == 'oqdeptreviewnote'
      ) {
        return 'light-cell';
      } 
      return '';
    },
    //吸顶
    sticky_event(e){
      // debugger
      if(e.target.className == 'el-input__inner') {
        return
      }
      let scrollLeft = e.target.scrollLeft
      $('.tableHeadOnly').scrollLeft(scrollLeft)
      $('.tableHeadOnly .el-table__fixed-right').css('right', 0 - scrollLeft)
      $('.collapseTable .el-table__body-wrapper').scrollLeft(scrollLeft)
      if (this.tableData.length > 0) {
        let winTop = document.body.scrollTop || document.documentElement.scrollTop
        let stickBoxTop = $('.tableHeadOnly').get(0).offsetHeight
        let stickBoxWidth = $('.reviewTable').width()
        if(winTop>=stickBoxTop){
          $('.tableHeadOnly').css({'position':'fixed','top':0,'width':stickBoxWidth+'px'})
        }else{
          $('.tableHeadOnly').css({'position':'','top':'','width':stickBoxWidth+'px'})
        }
      }
    },
    handleDetail(index, row) {
      let that = this;
      this.$router.push({
        path: '/assetApplyDetail',  
        query: {
          assetplanid: row.assetplanid,
          eventtype: 'detailclick',
          assetstage: that.assetStage
        }
      })
    },
    // itemDblclick(row) {
    //   if(this.assetStage == 5 || this.assetStage == 6 || this.assetStage == 7) {
    //     return 
    //   }
    //   this.$parent.itemDblclick(row);
    // },
    gotoApprovalRecord(row) {
      let that = this
      this.$router.push({
        path: '/assetPlanApprovalQuery/approvalRecord',  
        query: {
          assetplanid: row.assetplanid,
          assetStage: that.assetStage,
          entrytype: 'detailClick'
        }
      })
    },

    // editReviewInfo(row, prop) {
    //   if(prop == 'requiredsaudit') {
    //     this.$parent.itemDblclick(row);
    //   }
    // },

    usageRateDetail(row) {
      this.$router.push({
        path: '/usageRate',
        query: {
          assetCategory: row.assetmodel,
          collectTime: row.reviewtime,
          deptCode: row.deptcode,
          id: row.assetplanid
        }
      })
    },

    cellStyleFn(param) {
      if(param.column.property == 'totalmoney' 
        || param.column.property == 'pprice' 
        || param.column.property == 'requiredsaudit' 
        || param.column.property == 'requireds'
      ) {
        return 'text-align: right;'
      }
      if(param.column.property == 'opration' || param.column.property == 'usagerate') {
        return 'text-align: center;'
      }
      if(param.column.property == 'actualmoney') {
        return 'font-weight: 700;text-align: right;'
      }
    },
    headerCellStyleFn(param) {
      if(param.column.property == 'totalmoney' 
        || param.column.property == 'pprice' 
        || param.column.property == 'actualmoney' 
        || param.column.property == 'requiredsaudit' 
        || param.column.property == 'requireds'
      ) {
        return 'text-align: right;background-color: #F1F3F9;'
      }
      if(param.column.property == 'opration' 
        || param.column.property == 'usagerate' 
        || param.column.property == 'dept1reviewnote' 
        || param.column.property == 'plannernote' 
        || param.column.property == 'oqdeptreviewnote' 
      ) {
        return 'text-align: center;background-color: #F1F3F9;'
      }
      return 'background-color: #F1F3F9;'
    },
    radioChangeFn(val, scope) {
      if(val == '同意') {
        scope.row.requiredsaudit = scope.row.requireds
        scope.row.actualmoney =  (scope.row.pprice * 100 * Number(scope.row.requireds) / 100).toFixed(2)
      } else if(val == '不同意') {
        scope.row.requiredsaudit = '0'
        scope.row.actualmoney = '0.00'
      }
      this.$parent.calcActualMoney()
    },
    inputFocus(e, scope) {
      let target = e.target
      if(scope.row.dept3checknote == '不同意' 
        || scope.row.dept2checknote == '不同意' 
        || scope.row.dept1reviewnote == '不同意'
        || scope.row.plannernote == '不同意' 
        || scope.row.oqdeptreviewnote == '不同意'
      ) {
        target.blur()
        this.$alert('评审意见为不同意时数量只能为0', '提示', {
          confirmButtonText: '确定',
          callback: action => { }
        });
      }
    },
    inputChange(value, scope) {
      scope.row.actualmoney = (scope.row.pprice * 100 * Number(value) / 100).toFixed(2)
      this.$parent.calcActualMoney()
    },
    inputBlur(e, scope) {
      let target = e.target
      // 同意数量为空，不同意的话要将同意数量置为0，同意的话将同意数量置为申购数量
      if((scope.row.dept3checknote == '不同意' 
        || scope.row.dept2checknote == '不同意' 
        || scope.row.dept1reviewnote == '不同意' 
        || scope.row.plannernote == '不同意' 
        || scope.row.oqdeptreviewnote == '不同意')
        && (target.value === '')
      ) {
        scope.row.requiredsaudit = '0'
        scope.row.actualmoney = '0'
      } else if((scope.row.dept3checknote == '同意' 
        || scope.row.dept2checknote == '同意' 
        || scope.row.dept1reviewnote == '同意' 
        || scope.row.plannernote == '同意' 
        || scope.row.oqdeptreviewnote == '同意') 
        && (target.value === '0' || target.value === '')
      ){
        scope.row.requiredsaudit = scope.row.requireds
        scope.row.actualmoney = (scope.row.pprice * 100 * Number(scope.row.requireds) / 100).toFixed(2)
        this.$parent.calcActualMoney()
        if(Number(target.value) == 0) {
          this.$alert('评审意见为同意时数量不能为0', '提示', {
            confirmButtonText: '确定',
            callback: action => { }
          });
        }
      }
    },
    inputFn(value, scope) {
      scope.row.requiredsaudit = value.replace(/\D+/, '')
    },

  }
}
</script>

<style lang="scss" scoped>
  .tableHeadOnly{
    z-index:1000;
    transform: translateZ(0);
  }

  #app .reviewTable {
    margin-top: 10px;
  }

  #app .reviewTable .usagerateBtn {
    display: inline-block;
    width: 88px;
    height: 24px;
    line-height: 22px;
    padding: 0 5px;
    border: 1px solid #01BE6E;
    border-radius: 16px;
    color: #01BE6E;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
  }

  #app .el-radio-group .el-radio {
    margin-right: 10px!important;
  }
</style>
<style>
  .el-table.tableHeadOnly{
    width: 100%;
    overflow-x: scroll;
  }
  /* chrome 和Safari */
  .tableHeadOnly::-webkit-scrollbar { 
    width: 0 !important;
    height: 0 !important;
  }
  /* IE 10+ */
  .tableHeadOnly { 
    -ms-overflow-style: none; 
  }
  /* Firefox */
  .tableHeadOnly { 
    overflow: -moz-scrollbars-none; 
  }

  .tableHeadOnly .el-table__header-wrapper {
    overflow: visible; /* 默认值。内容不会被修剪，会呈现在元素框之外。*/
  }
  .tableHeadOnly .el-table--scrollable-x .el-table__body-wrapper {
    overflow: hidden;
  }

  .tableHeadOnly .el-table__empty-block {
    display: none;
  }
  .reviewTable .el-collapse .el-collapse-item>div:first-child {
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
  }
  .reviewTable .el-collapse .el-collapse-item>div:first-child .el-collapse-item__header {
    color: #0066FF;
    padding-left: 10px;
  }
  .reviewTable .el-collapse .el-collapse-item__content {
    padding-bottom: 0;
  }
  #app .num-input /deep/ .el-input__inner{
    padding: 0 5px;
    text-align: right;
  }
  #app .el-table /deep/ .warning-row td {
    background-color: #ddd!important;
  }
  #app .el-table /deep/ .light-cell {
    background-color: #fafafa!important;
  }
  /* 解决在IE中表格内容和表头对不齐的样式 */
  #app .collapseTable .el-table__body-wrapper .el-table__body{
    width: 100%!important;
  }
  #app .reviewTable .el-collapse-item__wrap {
    border-bottom: 1px solid transparent!important;
  }
  #app .detail-text {
    color: #0066FF;
    font-weight: 700;
  }
</style>