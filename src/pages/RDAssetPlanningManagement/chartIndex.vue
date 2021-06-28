<template>
  <div>
    <el-row class="title">
      <el-col :span="24">
        <div class="navBar">
          <div class="navItem navItemHome"><router-link to="/RDAssetPlanningManagement">首页</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemHome"><router-link to="/assetPlanToDoList">统计</router-link></div>
        </div>
      </el-col>
    </el-row>  
    <el-row class="permission_tip" v-if="!isAdmin">您当前暂无权限查看此页面，可联系系统管理员开通权限!</el-row>
    <div class="searchBox" v-if="isAdmin">
      <table border="1" cellspacing="0" style="width: 100%" class="search-table">
        <tr>
          <td class="bgTd" width="8%">部门</td>
          <td width="16%">
            <el-select v-model="formData.budgetDeptCode" default-first-option clearable :multiple="true" :collapse-tags="true">
              <el-option v-for="item in budgetDetpList" :key="item.deptCode" :label="item.deptName" :value="item.deptCode">
                <span class="check"></span>
                <span style="margin-left: 8px">{{item.deptName}}</span>
              </el-option>
            </el-select>
          </td>
          <td class="bgTd" width="8%">物品类别</td>
          <td width="16%">
            <el-select v-model="formData.assetcategory" default-first-option clearable :multiple="true" :collapse-tags="true">
              <el-option v-for="item in assetCategoryAndGoodstimeList" :key="item.id" :label="item.assetcategory" :value="item.id">
                <span class="check"></span>
                <span style="margin-left: 8px">{{item.assetcategory}}</span>
              </el-option>
            </el-select>
          </td>
          <td class="bgTd" width="8%">厂家</td>
          <td width="16%">
            <el-select v-model="formData.assetmanufacturer" default-first-option clearable :multiple="true" :collapse-tags="true">
              <el-option v-for="(item, index) in assetMaunFacturerList" :key="index" :label="item.assetmanufacturer" :value="item.assetmanufacturer">
                <span class="check"></span>
                <span style="margin-left: 8px">{{item.assetmanufacturer}}</span>
              </el-option>
            </el-select>
          </td>
          <td class="bgTd" width="8%">申请日期</td>
          <td width="16%" class="boderTdRight">
            <el-date-picker 
              v-model="formData.applytime" 
              type="daterange" 
              format="yyyy-MM-dd" 
              value-format="yyyy-MM-dd" 
              placeholder="选择月份">
            </el-date-picker>  
          </td>
        </tr>
        <tr>
          <td colspan="8" class="btnTd">
            <el-button type="primary" @click="init">搜索</el-button>
            <el-button type="primary dangerBtn_666" @click="clear">重置</el-button>
          </td>
        </tr>
      </table>
    </div>
    <div class="formBox" v-if="isAdmin">
      <el-row class="tip" v-if="pieTableData.length == 0 && lineTableData.length == 0 && barTableData.length == 0">暂无收益</el-row>
      <el-row :class="[pieTableData.length == 0 ? '' : 'chart-item']">
        <el-col :span="6" v-show="lineTableData.length > 0">
          <el-table :data="lineTableData" border class="table line-table" :header-cell-style="headerCellStyleFn" show-summary :max-height="400">
            <el-table-column prop="x" label="月份"></el-table-column>
            <el-table-column prop="y" label="收益金额（万元）"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="18">
          <div ref="line" style="width: 100%;height: 400px; box-sizing:border-box; line-height: 400px;"></div>
        </el-col>
      </el-row>
      
      <el-row class="chart-item" v-show="barTableData.length > 0" style="margin-bottom: 50px;">
        <el-col :span="6">
          <el-table :data="barTableData" border class="table" :header-cell-style="headerCellStyleFn" show-summary :max-height="400">
            <el-table-column prop="x" label="部门"></el-table-column>
            <el-table-column prop="y" label="收益金额（万元）"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="18">
          <div ref="bar" style="width: 100%;height: 420px; box-sizing:border-box; line-height: 420px;"></div>
        </el-col>
      </el-row>

      <el-row :class="[pieTableData.length == 0 ? '' : 'chart-item']">
        <el-col :span="6" v-show="pieTableData.length > 0">
          <el-table :data="pieTableData" border class="table" :header-cell-style="headerCellStyleFn" show-summary :max-height="400">
            <el-table-column prop="x" label="物品类别"></el-table-column>
            <el-table-column prop="y" label="收益金额（万元）"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="18">
          <div ref="pie" style="width: 100%;height: 400px; box-sizing:border-box; line-height: 400px;"></div>
        </el-col>
      </el-row>

      <el-table highlight-current-row stripe v-loading="loading" element-loading-text="数据加载中" border :data="tableData" ref="table" :cell-style="cellStyleFn" :header-cell-style="headerCellStyleFn">
        <template v-for="(col, index) in tableHead">
          <el-table-column :prop="col.prop" :label="col.label" :key="index" :data-edit="col.isEdit" show-overflow-tooltip :width="flexColumnWidth(col)"></el-table-column>                
        </template>  
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
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
import urlConfig from '../../http/urlConfig/index'

export default {
  name: 'chartIndex',
  data() {
    return {
      pieTableData: [],
      pieECharts: null,
      lineTableData: [],
      lineECharts: null,
      barTableData: [],
      barECharts: null,
      tableHead: [],
      tableData: [],
      loading: false,
      prQuery: false,
      pageNum: 1,
      pageSize: 20,
      total: 0,
      budgetDetpList: [],
      assetCategoryAndGoodstimeList: [],
      assetMaunFacturerList: [],
      formData: {
        budgetDeptCode: [],
        assetcategory: [],
        applytime: [],
        assetmanufacturer: []
      },
      isAdmin: this.$store.state.Login.isAdmin
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('addIncludeItem', 'chartIndex')
    })
  },

  beforeRouteLeave(to, from, next) {
    if(to.path != '/assetApplyDetail') {
      this.$store.commit('removeIncludeItem', 'chartIndex')
    }
    next()
  },
  mounted() {
    let that = this
    if(!this.isAdmin) {
      return
    }
    this.getBudgetDept()
    this.getAssetCategoryAndGoodstime()
    this.getAssetManuFacturerList()
    let curYear = new Date().getFullYear()
    this.formData.applytime = [`${curYear}-01-01`, `${curYear}-12-31`]
    this.init()
  },
  methods: {
    headerCellStyleFn(param) {
      return 'background-color: #F1F3F9;'
    },
    flexColumnWidth(col) {
      if(col.prop == 'pprice' || col.prop == 'totalmoney' || col.prop == 'actualmoney') {
        return '118px'
      }
    },
    cellStyleFn(param) {
      if(param.column.property == 'totalmoney' || param.column.property == 'pprice' || param.column.property == 'actualmoney') {
        return 'text-align: right;'
      }
    },
    init() {
      this.barchartByDeptCode()
      this.lineChartByApplymonth()
      this.pieChartByModel()
      this.getTableDataList()
    },
    clear() {
      this.formData.budgetDeptCode = []
      this.formData.assetcategory = []
      this.formData.assetmanufacturer = []
      let curYear = new Date().getFullYear()
      this.formData.applytime = [`${curYear}-01-01`, `${curYear}-12-31`]
      this.init()
    },
    // 获取预算部门
    getBudgetDept() {
      let that = this
      that.$axios.get(urlConfig.chartMag.GETBUDGETDEPTLIST).then(function (res) {
        if (res.data.success) {
          that.budgetDetpList = res.data.data
        } else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, function (err) { })
    },
    // 物品类别和相应的货期
    getAssetCategoryAndGoodstime() {
      let that = this;
      that.$axios.get(urlConfig.GETCATEGORYGOODSTIMEFORSEARCH).then(function (res) {
        if (res.data.success) {
          that.assetCategoryAndGoodstimeList = res.data.data;
        } 
      }, function (err) { })
    },
    getAssetManuFacturerList(query, fun) {// 获取厂家型号信息
      let that = this
      that.$axios.get(`${urlConfig.GETASSETMANUFACTURERLISTFORSEARCH}`).then(function (res) {
        that.assetMaunFacturerList = res.data.data;
      }, err => { })
    },
    // 柱状图
    barchartByDeptCode() {
      let that = this
      let params = {}
      params.assetcategory = that.formData.assetcategory
      params.budgetDeptCode = that.formData.budgetDeptCode
      params.assetmanufacturer = that.formData.assetmanufacturer
      params.startTime = that.formData.applytime.length > 0 ? that.formData.applytime[0] : ''
      params.endTime = that.formData.applytime.length > 0 ? that.formData.applytime[1] : ''

      that.$axios.post(urlConfig.chartMag.BARCHARTBYDEPTCODE, params).then(function (res) {
        if (res.data.success) {
          that.barTableData = res.data.data
          that.$nextTick(() => {
            that.barInit()
          })
        } else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, function (err) { })
    },
    barInit() {
      let that = this
      let barXData = []
      let barYData = []
      that.barTableData.forEach(item => {
        barXData.push(item.x)
        barYData.push(Number(item.y))
      })
      let barContainer = this.$refs.bar
      if(that.barTableData.length == 0) {
        barContainer.style.display = 'none'
      } else {
        barContainer.style.display = 'block'
      }
      this.barECharts = this.$echarts.init(barContainer, 'light')
      this.barECharts.setOption({
        title: {
          text: '收益金额（万元）',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}: {b}<br/>收益金额: {c}'
        },
        xAxis: {
          type: 'category',
          data: barXData,
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 15,
            textStyle: {
              color: '#333'
            },
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          name: '部门',
          type: 'bar',
          data: barYData,
          label: {
            show: true,
            position: 'top',
            textStyle: { // 数值样式
              color: '#333',
              fontSize: 12
            }
          },
          itemStyle: {
            normal: {
              //这里是重点
              color: function(params) {
                //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                var colorList = ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d", "#97b552", "#95706d", "#dc69aa", "#07a2a4",
                  "#9a7fd1", "#588dd5", "#f5994e", "#c05050", "#7eb00a", '#ca8622','#B5C334','#FCCE10','#E87C25',
                  '#27727B', '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD', '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0']
                return colorList[params.dataIndex]
              }
            }
          },
        }]
      });
    },
    // 折线图
    lineChartByApplymonth() {
      let that = this
      let params = {}
      params.assetcategory = that.formData.assetcategory
      params.budgetDeptCode = that.formData.budgetDeptCode
      params.assetmanufacturer = that.formData.assetmanufacturer
      params.startTime = that.formData.applytime.length > 0 ? that.formData.applytime[0] : ''
      params.endTime = that.formData.applytime.length > 0 ? that.formData.applytime[1] : ''

      that.$axios.post(urlConfig.chartMag.LINECHARTBYAPPLYMONTH, params).then(function (res) {
        if (res.data.success) {
          that.lineTableData = res.data.data
          that.lineInit()
        } else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, function (err) {
       
      })
    },
    lineInit() {
      let that = this
      let lineXData = []
      let lineYData = []
      that.lineTableData.forEach(item => {
        lineXData.push(item.x)
        lineYData.push(Number(item.y))
      })
      let lineContainer = this.$refs.line
      if(that.lineTableData.length == 0) {
        lineContainer.style.display = 'none'
      } else {
        lineContainer.style.display = 'block'
      }
      this.lineECharts = this.$echarts.init(lineContainer, 'light')
      this.lineECharts.setOption({
        title: {
          text: '收益金额（万元）',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '月份: {b}<br/>收益金额: {c}'
        },
        xAxis: {
          type: 'category',
          // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          data: lineXData,
          nameTextStyle: {
            width: '100px'
          }
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          type: 'line',
          label: {
            show: true,
            position: 'top',
            textStyle: { // 数值样式
              color: '#333',
              fontSize: 12
            }
          },
          data: lineYData
        }]
      });
    },
    // 饼状图
    pieChartByModel() {
      let that = this
      let params = {}
      params.assetcategory = that.formData.assetcategory
      params.budgetDeptCode = that.formData.budgetDeptCode
      params.assetmanufacturer = that.formData.assetmanufacturer
      params.startTime = that.formData.applytime.length > 0 ? that.formData.applytime[0] : ''
      params.endTime = that.formData.applytime.length > 0 ? that.formData.applytime[1] : ''

      that.$axios.post(urlConfig.chartMag.PIECHARTBYMODEL, params).then(function (res) {
        if (res.data.success) {
          that.pieTableData = res.data.data
          that.pieiInit()
        } else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, function (err) {
       
      })
    },
    pieiInit() {
      let that = this
      let pieData = []
      let legendData = []
      that.pieTableData.forEach(item => {
        legendData.push(item.x)
        pieData.push({
          name: item.x,
          value: item.y
        })
      })
      let pieContainer = this.$refs.pie
      if(that.pieTableData.length == 0) {
        pieContainer.style.display = 'none'
      } else {
        pieContainer.style.display = 'block'
      }
      this.pieECharts = this.$echarts.init(pieContainer,'light')
      this.pieECharts.setOption({
        title: {
          text: '收益金额（万元）',
          left: 'center'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 0,
          top: 20,
          bottom: 20,
          formatter: function (name) {
            return that.$echarts.format.truncateText(name, 180, '14px Microsoft Yahei', '…');
          },
          tooltip: {
            show: true
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '物品类别: {b}<br/>收益金额: {c} ({d}%)'
        },
        series: [{
          name: '型号',
          type: 'pie',
          data: pieData,
          label: {
            show: false,
            formatter: '{b}: {c} ({d}%)'
          },
          itemStyle: {
            normal: {
              //这里是重点
              color: function(params) { //
                //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                var colorList = ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d", "#97b552", "#95706d", "#dc69aa", "#07a2a4",
                  "#9a7fd1",'#FAD860','#60C0DD', '#F3A43B', "#588dd5", "#f5994e", "#c05050", "#7eb00a", '#ca8622','#B5C334','#FCCE10','#E87C25',
                  '#27727B', '#FE8463','#9BCA63','#FAD860','#F3A43B','#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0']
                return colorList[params.dataIndex]
              }
            }
          },
        }]
      });
    },
    // 列表
    getTableDataList(page) {
      let that = this
      that.loading = true
      that.prQuery = true
      if(page == '1'){
        that.pageNum = 1
      }
      let params = {}
      params.assetcategory = that.formData.assetcategory
      params.budgetDeptCode = that.formData.budgetDeptCode
      params.assetmanufacturer = that.formData.assetmanufacturer
      params.startTime = that.formData.applytime.length > 0 ? that.formData.applytime[0] : ''
      params.endTime = that.formData.applytime.length > 0 ? that.formData.applytime[1] : ''
      params.pageNum = that.pageNum
      params.pageSize = that.pageSize
      that.$axios.post(urlConfig.chartMag.LISTOFASSETPLANINFOREPORT, params).then(function (res) {
        that.loading = false
        that.prQuery = false
        if (res.data.status == 0) {
          that.tableHead = res.data.tableHeadData
          that.tableData = res.data.data
          that.total = res.data.total
        }
        else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, function (err) {
        that.loading = false
        that.prQuery = false
      })
    },

    //分页
    handleCurrentChange (val) {
      this.pageNum = val 
      this.getTableDataList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getTableDataList()
    },
    handleDetail(index, row) {
      let that = this;
      this.$router.push({
        path: '/assetApplyDetail',  
        query: {
          forQuery: true,
          assetplanid: row.assetplanid,
          eventtype: 'detailclick',
          assetstage: 9
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .permission_tip {
    margin: 20px 0 30px 0;
    line-height: 40px;
    text-align: center;
    border-radius: 4px;
    color: rgb(250, 80, 80);
  }
  .formBox {
    background: #fff;
    margin-bottom: 30px;
    // padding: 15px 20px 20px;
    .tip {
      margin: 20px 0 30px 0;
      line-height: 40px;
      text-align: center;
      border-radius: 4px;
      box-shadow:0px 2px 15px 0px rgba(0,0,0,0.2);
      background-color: #ffffff;
    }
    .chart-item {
      margin-bottom: 30px;
    }
    .table {
      width: 100%;
      height: 400px;
      overflow-y: auto;
    }
    .line-table {
      height: 300px;
    }
  }
  .searchBox {
    background: #fff;
    margin-bottom: 20px;
    padding: 15px 3%;
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
    tr .btnTd {
      padding-top: 15px;
      text-align: center;
      border-left: transparent;
    }
  }

  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
    content: "";
  }

  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected .check{
    background-color: #409eff;
    border-color: #409eff;
  }

  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected .check:after{
    transform: rotate(45deg) scaleY(1);
  }

  .el-select-dropdown.is-multiple .el-select-dropdown__item .check::after{
    box-sizing: content-box;
    content: "";
    border: 1px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    transform: rotate(45deg) scaleY(0);
    width: 3px;
    transition: transform .15s ease-in .05s;
    transform-origin: center;
  }

  .el-select-dropdown.is-multiple .el-select-dropdown__item .check{
    display: inline-block;
    position: relative;
    top:2px;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    z-index: 1;
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
  }
</style>
<style>
  .searchBox .el-range-editor.el-input__inner {
    width: 100%!important;
  }
  .el-input__icon, .el-range-separator {
    line-height: 1!important;
  }
</style>