<template>
  <el-table 
    class="dynamicTable table-fixed" 
    highlight-current-row 
    border 
    :data="tableData" 
    ref="table" 
    @row-dblclick="itemDblclick"
    :cell-style="cellStyleFn"
    :header-cell-style="headerCellStyleFn"
    @cell-mouse-enter="cellMouseEnterFn"
    @cell-mouse-leave="cellMouseLeaveFn"
    :row-class-name="tableRowClassName"
  >
    <el-table-column type="selection" width="55" v-if="tableItemSelectFlag"></el-table-column>
    <el-table-column label="序号" type="index" width="60" v-if="assetStage == 3 || assetStage == 4"></el-table-column>
    <template v-for="(col,index) in tableHead">     
      <el-table-column 
        :prop="col.prop" 
        :label="col.label" 
        :key="index+1" 
        show-overflow-tooltip 
        :min-width="flexColumnMinWidth(col)"
        :width="flexColumnWidth(col)"
      >
        <template slot-scope="scope">
          <!-- 使用率按钮 -->
          <el-button 
            type="success" 
            class="usagerateBtn" 
            size="mini" 
            v-if="col.prop == 'usagerate' && (assetStage == 3 || assetStage == 4)" 
            @click="usageRateDetail(scope.row)"
          >{{ scope.row.usagerate }}</el-button>
          <!-- 评审意见 -->
          <div v-else-if="(col.prop == 'dept3checknote' || col.prop == 'dept2checknote') && (assetStage == 3 || assetStage == 4)">
            <el-radio-group 
              v-model="scope.row.dept3checknote" 
              v-if="assetStage == 3" 
              @change="(val) => radioChangeFn(val, scope)" 
              :disabled="scope.row.outtimeplanenum == 3"
            >
              <el-radio label="同意">同意</el-radio>
              <el-radio label="不同意">不同意</el-radio>
            </el-radio-group>
            <el-radio-group
              v-model="scope.row.dept2checknote" 
              v-if="assetStage == 4" 
              @change="(val) => radioChangeFn(val, scope)"
              :disabled="scope.row.outtimeplanenum == 4"
            >
              <el-radio label="同意">同意</el-radio>
              <el-radio label="不同意">不同意</el-radio>
            </el-radio-group>
          </div>
          <!-- 同意申购数量输入框 -->
          <el-input
            class="num-input"
            v-model="scope.row.requiredsaudit"
            v-else-if="col.prop == 'requiredsaudit' && (assetStage == 3 || assetStage == 4)" 
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
            v-else-if="col.prop == 'opration' && (assetStage == 3 || assetStage == 4)"  
            size="mini" 
            @click="gotoApprovalRecord(scope.row)"
          >详情</el-button>
          <!-- 其他列数据 -->
          <div v-else>{{ scope.row[col.prop] }}</div>
          
        </template>
      </el-table-column>                
    </template>  
    <el-table-column label="操作" prop="opration" width="100px" fixed="right" v-if="assetStage == 1 || assetStage == 2 ">
      <template slot-scope="scope">
        <el-button v-if="scope.row.isComplete == 0" class="is-not-complete-text" type="text" size="mini" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
        <el-button v-else type="text" size="mini" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
      </template>
    </el-table-column>      
  </el-table>
</template>

<script>
export default {
  name: 'dynamicTable',

  props:{
    tableHead: {
      type: Array,
      default: []
    },

    tableData: {
      type: Array,
      default: []
    },

    tableItemSelectFlag: {
      type: Boolean,
      default: true,
    },

    assetStage: {// 资源申购计划当前所处阶段，1 => 申请阶段；2 => 规范审核阶段；3 => 三级主管审核阶段；4 => 二级主管审核阶段
      type: String,
      default: '1'
    },

    itemType: {// 用于区分 在申请阶段的该条计划，是不规范条目还是未提交的条目，update => 表示 不规范条目
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    // let that = this;
    // window.onresize = () => {
    //   return (() => {
    //     console.log(that.$refs.table)
    //     let heightStyle = that.$refs.table.offsetHeight
    //     console.log(heightStyle)
    //     that.Height = heightStyle
    //   })()
    // }
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
        return '200px'
      }else if(col.prop == 'dept3checknote' || col.prop == 'dept2checknote') {// 评审意见
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
    handleDetail(index, row) {
      let that = this;
      this.$router.push({
        path: '/assetApplyDetail',  
        query: {
          assetplanid: row.assetplanid,
          eventtype: 'detailclick',
          assetstage: that.assetStage,
          itemtype: that.itemType
        }
      })
    },

    getSelectList() {
      var selectList = this.$refs.table.selection;
      return selectList;
    },

    itemDblclick(row, col, event) {
      if(this.assetStage == 3 || this.assetStage == 4) {
        return 
      }
      this.$parent.itemDblclick(row, col, event);
    },

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
      if(param.column.property == 'usagerate') {
        return 'color:rgb(29, 158, 68)!important;text-decoration: underline!important;cursor: pointer;'
      }
      if(param.column.property == 'totalmoney' || param.column.property == 'pprice' || param.column.property == 'actualmoney' || param.column.property == 'requiredsaudit' || param.column.property == 'requireds') {
        return 'text-align: right;'
      }
      if(param.column.property == 'opration' || param.columnIndex == 0) {
        return 'text-align: center;'
      }
    },
    headerCellStyleFn(param) {
      if(param.column.property == 'totalmoney' || param.column.property == 'pprice' || param.column.property == 'actualmoney' || param.column.property == 'requireds' || param.column.property == 'requiredsaudit') {
        return 'text-align: right;background-color: #F1F3F9;'
      }
      if(param.columnIndex == 0 || param.column.property == 'opration' || param.column.property == 'dept3checknote' || param.column.property == 'dept2checknote') {
        return 'text-align: center;background-color: #F1F3F9;'
      }
      return 'background-color: #F1F3F9;'
    },
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
      if(scope.row.dept3checknote == '不同意' || scope.row.dept2checknote == '不同意') {
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
      if((scope.row.dept3checknote == '不同意' || scope.row.dept2checknote == '不同意') && (target.value === '')) {
        scope.row.requiredsaudit = '0'
        scope.row.actualmoney = '0'
      } else if((scope.row.dept3checknote == '同意' || scope.row.dept2checknote == '同意') && (target.value === '0' || target.value === '')){
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .dynamicTable {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    margin-top: 20px;
  }

  #app .el-table /deep/ th.red-text{
    color: #ff3333!important;
  }

  #app .dynamicTable tr td:first-child{
    text-align: center!important;
  }

  #app .num-input /deep/ .el-input__inner{
    padding: 0 5px!important;
    text-align: right;
  }
  
  #app .dynamicTable .usagerateBtn {
    width: 76px;
    height: 24px;
    line-height: 24px;
    padding: 0 5px;
    background-color: #5dc66a;
  }
  .el-table /deep/ .el-radio {
    margin-right: 10px!important;
  }
  #app .el-table /deep/ .warning-row {
    background-color: #ddd!important;
  }
  #app .is-not-complete-text {
    color: #ff0000;
  }
</style>