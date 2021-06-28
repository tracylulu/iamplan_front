<template>
  <div class="assetPlanApprovalQuery">
    <el-row class="title">
      <el-col :span="24">
        <div class="navBar">
          <div class="navItem navItemHome"><router-link to="/RDAssetPlanningManagement">首页</router-link></div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemCol">资产计划审批查询</div>
        </div>
      </el-col>
    </el-row>
    <div class="formBox">
      <h3 class="titleHeaderText">资产计划审批电子流</h3>
      <table border="1" cellspacing="0">
        <tr>
          <td class="bgTd" width="12%">申购人姓名/工号</td>
          <td width="21.3%">
            <el-autocomplete
              v-model="formData.requiredUser"
              :fetch-suggestions="associateRequireUser"
              :trigger-on-focus="false"
              :hide-loading="true"
              :debounce="300"
              @select="selectRequireUser">
            </el-autocomplete>
          </td>
          <td class="bgTd" width="12%">填报人</td>
          <td width="21.3%">
            <el-autocomplete
              v-model="formData.applyUser"
              :fetch-suggestions="associateApplyUser"
              :trigger-on-focus="false"
              :hide-loading="true"
              :debounce="300"
              @select="selectApplyUser">
            </el-autocomplete>
          </td>
          <td class="bgTd">申请部门</td>
          <td class="boderTdRight">
            <treeselect v-model="formData.deptCode" :options="deptArr" :normalizer="normalizer" :multiple="false" placeholder='请选择' @select="selectDept" />
          </td>
        </tr>
        <tr>
          <td class="bgTd">物品名称</td>
          <td>
            <el-input v-model="formData.assetName"></el-input>
          </td>
          <td class="bgTd">厂家</td>
          <td>
            <el-autocomplete
              v-model="formData.assetManufacturer"
              :fetch-suggestions="assetManuFacturerQuerySearch"
              :trigger-on-focus="true"
              :hide-loading="false"
              :debounce="300"
              @select="assetManuFacturerSelect"
              @change="assetManuFacturerChange">
            </el-autocomplete>
          </td>
          <td class="bgTd">申请部门编码</td>
          <td class="boderTdRight">{{formData.deptCode}}</td>
        </tr>
        <tr>
          <td class="bgTd">申请状态</td>
          <td>
            <el-select v-model="formData.apStage" clearable class="placeholderText_666">
              <el-option label="规范性审核" value="2"></el-option>
              <el-option label="三级部门主管审核" value="3"></el-option>
              <el-option label="二级部门主管审核" value="4"></el-option>
              <el-option label="计划员审核" value="5"></el-option>
              <el-option label="专家审核" value="6"></el-option>
              <el-option label="一级部门主管审核" value="7"></el-option>
              <el-option label="已结束" value="0"></el-option>
            </el-select>
          </td>
          <td class="bgTd">申请日期</td>
          <td>
            <el-date-picker v-model="formData.applyTime" type="monthrange" format="yyyy-MM" value-format="yyyy-MM" placeholder="选择月份">
            </el-date-picker>  
          </td>
          <td class="bgTd">物品类别</td>
          <td class="boderTdRight">
            <el-select v-model="formData.assetcategory" default-first-option clearable class="placeholderText_666">
              <el-option v-for="item in assetCategoryAndGoodstimeList" :key="item.id" :label="item.assetcategory" :value="item.id"></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="bgTd">物品型号</td>
          <td>
            <el-autocomplete
              v-model="formData.assetModel"
              :fetch-suggestions="assetModelQuerySearch"
              :trigger-on-focus="true"
              :hide-loading="false">
            </el-autocomplete>
          </td>
          <td class="bgTd">到货地点</td>
          <td>
            <el-select v-model="formData.receiverPlace" clearable class="placeholderText_666">
              <el-option v-for="item in receivePlaceList" :key="item.id" :value="item.id" :label="item.receiverplace">
              </el-option>
            </el-select>
          </td>
          <td class="bgTd">项目编码</td>
          <td class="boderTdRight itemcode-container">
            <el-input 
              v-model="formData.itemCode" 
              @blur="getItemCodeAndName" 
              class="item-select-input"
            ></el-input><el-button 
              type="primary" 
              class="item-select-btn"
              @click="openItemTree"
            >选择</el-button>
          </td>
        </tr>
        <tr>
          <td class="bgTd">是否含有申请报告</td>
          <td>
            <i class="no_selected_icon radio-icon" v-if="formData.isReqPurchaseReport === 0 || formData.isReqPurchaseReport === ''"  @click="selectReqPurchaseReport(1)"></i>
            <i class="selected_icon radio-icon" v-else @click="selectReqPurchaseReport(1)"></i>
            <span :class="[ formData.isReqPurchaseReport === 1 ? 'selected_text marginRight20': 'marginRight20']">是</span>
            <i class="selected_icon radio-icon" v-if="formData.isReqPurchaseReport === 0" @click="selectReqPurchaseReport(0)"></i>
            <i class="no_selected_icon radio-icon" v-if="formData.isReqPurchaseReport === 1 || formData.isReqPurchaseReport === ''" @click="selectReqPurchaseReport(0)"></i>
            <span :class="[ formData.isReqPurchaseReport === 0 ? 'selected_text marginRight20': 'marginRight20']">否</span>
          </td>
          <td class="bgTd">是否指定供应商</td>
          <td>
            <i class="no_selected_icon radio-icon" v-if="formData.isSpecifyManufacturer === 0 || formData.isSpecifyManufacturer === ''"  @click="selectSpecifyManufacturer(1)"></i>
            <i class="selected_icon radio-icon" v-else @click="selectSpecifyManufacturer(1)"></i>
            <span :class="[ formData.isSpecifyManufacturer === 1 ? 'selected_text marginRight20': 'marginRight20']">是</span>
            <i class="selected_icon radio-icon" v-if="formData.isSpecifyManufacturer === 0" @click="selectSpecifyManufacturer(0)"></i>
            <i class="no_selected_icon radio-icon" v-else @click="selectSpecifyManufacturer(0)"></i>
            <span :class="[ formData.isSpecifyManufacturer === 0 ? 'selected_text marginRight20': 'marginRight20']">否</span>
          </td>
          <td class="bgTd">审批结果</td>
          <td class="boderTdRight placeholderText_666">
            <el-select v-model="formData.applyResult" clearable>
              <el-option label="全部通过" value="1"></el-option>
              <el-option label="部分通过" value="2"></el-option>
              <el-option label="未通过" value="3"></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="bgTd">审批超时</td>
          <td>
            <el-select v-model="formData.outTimePlanEnum" clearable class="placeholderText_666">
              <el-option label="三级主管审批超时" value="3"></el-option>
              <el-option label="二级主管审批超时" value="4"></el-option>
            </el-select>
          </td>
          <td class="bgTd">申请类别</td>
          <td>
            <el-select v-model="formData.abnormalPlanEnum" clearable class="placeholderText_666">
              <el-option label="正常计划" value="0"></el-option>
              <el-option label="计划员激活" value="1"></el-option>
              <el-option label="管理员激活" value="2"></el-option>
            </el-select>
          </td>
          <td class="bgTd">是否已新建非生产物料申购电子流</td>
          <td class="boderTdRight">
            <i class="no_selected_icon radio-icon" v-if="formData.isBpm === 0 || formData.isBpm === ''"  @click="selectIsBpm(1)"></i>
            <i class="selected_icon radio-icon" v-else @click="selectIsBpm(1)"></i>
            <span :class="[ formData.isBpm === 1 ? 'selected_text marginRight20': 'marginRight20']">是</span>
            <i class="selected_icon radio-icon" v-if="formData.isBpm === 0" @click="selectIsBpm(0)"></i>
            <i class="no_selected_icon radio-icon" v-if="formData.isBpm === 1 || formData.isBpm === ''" @click="selectIsBpm(0)"></i>
            <span :class="[ formData.isBpm === 0 ? 'selected_text marginRight20': 'marginRight20']">否</span>
          </td>
        </tr>
        <tr>
          <td class="bgTd">非生产物料申购电子流单号</td>
          <td>
            <el-input v-model="formData.bpmCode"></el-input>
          </td>          
          <td colspan="4" class="boderTdRight"></td>
        </tr>
        <tr>
          <td colspan="6" class="btnTd">
            <el-button type="primary" @click="getTableDataList('1')" :disabled="prQuery">搜索</el-button>
            <el-button type="primary dangerBtn_666" @click="clearParams">重置</el-button>
          </td>
        </tr>
      </table>
    </div>
    <div class="dataBox">
      <el-row class="btnRow" type="flex" justify="space-between">
        <h3 class="titleHeaderText">资产计划审批电子流</h3>
        <div>
          <el-button type="primary" @click="exportExList" :disabled='prExport'>导出</el-button>
          <el-button type="primary" @click="activateAssetPlanInfo" v-if="isAdmin">激活</el-button>
          <el-button type="primary" @click="requiredFn" v-if="isAdmin" class="longBtn">新建非生产物料申购电子流</el-button>
        </div>
      </el-row>
      <el-table 
        class="table-fixed"
        highlight-current-row stripe 
        v-loading="loading" 
        element-loading-text="数据加载中" 
        border 
        :data="tableData" 
        ref="table" 
        @selection-change="changeFun" 
        @row-dblclick="gotoApprovalRecord"
        :cell-style="cellStyleFn"
        :header-cell-style="headerCellStyleFn"
      >
        <el-table-column label="" type="selection" prop="assetplanid"></el-table-column>
        <template v-for="(col, index) in tableHead">
          <el-table-column :prop="col.prop" :label="col.label" :key="index" :data-edit="col.isEdit" show-overflow-tooltip :width="flexColumnWidth(col)"></el-table-column>                
        </template>  
        <el-table-column label="操作" fixed="right" prop="opration">
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
        :current-page="formData.pageNum"
        :total="total"
        :page-size="formData.pageSize">
      </el-pagination>
      <!-- 选择项目弹窗 -->
      <el-dialog title="选择项目" :visible.sync="itemTreeFlag" width="50%" class="item-tree-dialog">
        <div class="item-tree-container placeholderText_666">
          <el-input class="item-tree-input" placeholder="请输入" @input="getPlAndItemList" v-model="itemTreeText"></el-input>
          <treeselect 
            class="item-tree"
            :options="itemOptions" 
            :multiple="false" 
            :alwaysOpen="true"
            :searchable="false"
            :disableBranchNodes="true"
            @select="selectItem"
            noResultsText="没有匹配项"
            placeholder='请选择' 
            noOptionsText="没有匹配项"
          >
            <div slot="value-label" slot-scope="{ node }">
              <span style="margin-left: 8px">{{ node.raw.customLabel }}</span>
            </div>
          </treeselect>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import urlConfig from '@/http/urlConfig/index' //引入接口地址
  import util from '@/util/utils'
  import { mapState } from 'vuex';
  export default {
    name: 'assetPlanApprovalQuery',
    data() {
      return {
        formData: this.$store.state.assetPlanApprovalQuery.formData,
        assetMaunFacturerList: [],
        assetModelList: [],
        deptArr: [],
        receivePlaceList: [],
        tableHead: [],
        tableData: [],
        total: 0,
        currentPage: 1,
        checkedData: [],
        loading: false,
        prQuery: false,
        prExport: false,
        assetStage: '8',
        isAdmin: this.$store.state.Login.isAdmin,
        CB: null,
        assetCategoryAndGoodstimeList: [],
        itemOptions: [],
        itemOptionsTemp: [],
        itemTreeFlag: false,
        itemTreeText: ''
      }
    },

    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.$store.commit('addIncludeItem', 'assetPlanApprovalQuery')
      })
    },

    beforeRouteLeave(to, from, next) {
      if(to.path != '/assetApplyDetail' && to.path != '/assetPlanApprovalQuery/approvalRecord') {
        this.$store.commit('removeIncludeItem', 'assetPlanApprovalQuery')
        this.$store.commit('clearSearchForm')
      }
      next()
    },

    created() {
      if(this.$route.query.applymonth) {
        this.formData.applyTime = [this.$route.query.applymonth, this.$route.query.applymonth]
      }
      this.getAssetManuFacturerList()
      this.getAssetCategoryAndGoodstime()
      this.getDeptTree()
      this.getReceivePlace()
      // this.getTableDataList()
      this.getTableTitleInfo()
      this.getPlAndItemList()
      let that = this
      this.$store.dispatch('getAssociatedToken').then(res => {
        if(res.flag) {
          that.$store.commit('getAssociatedToken', res.data.token)
        }
      }, err => {
      });
    },
    watch: {
      associatedToken() {
        if(this.CB) {
          this.associateRequireUser(this.formData.requireduser, this.CB, 1)
          this.associateApplyUser(this.formData.applyUser, this.CB, 0)
        }
      },
    },

    computed: mapState({
      associatedToken: (state) => {
        return state.assetApplyDetail.associatedToken
      },
    }),

    components: {
      Treeselect
    },

    methods: {
      flexColumnWidth(col) {// 单元格宽度配置
        let labelLen = col.label.length
        let labelWid = labelLen * 16 // 每个字大约20个宽度        
        if(col.prop == 'pprice' || col.prop == 'totalmoney' || col.prop == 'actualmoney') {
          return '118px'
        } else if(col.prop == 'requireds') {// 申购数量
          return '100px'
        } else if(labelLen <= 4) {
          return '90px' // 文字长度 + 左右的padding
        } else {
          return labelWid + 30 + 'px'
        }
      },
      cellStyleFn(param) {// 单元格样式配置
        if(param.column.property == 'totalmoney' || param.column.property == 'pprice' || param.column.property == 'actualmoney' || param.column.property == 'requireds' || param.column.property == 'requiredsaudit') {
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
        if(param.columnIndex == 0 || param.column.property == 'opration' ) {
          return 'text-align: center;background-color: #F1F3F9;'
        }
        return 'background-color: #F1F3F9;'
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
      // 厂家 start
      getAssetManuFacturerList(query, fun) {// 获取厂家型号信息
        let that = this
        that.$axios.get(`${urlConfig.GETASSETMANUFACTURERLISTFORSEARCH}?name=${query}`).then(function (res) {
          res.data.data.forEach(item => {
            item.value = item.assetmanufacturer;
          })
          that.assetMaunFacturerList = res.data.data;
          if(fun) {
            fun(res.data)
          }
        }, err => { })
      },
      assetManuFacturerQuerySearch(queryString, cb) {
        this.getAssetManuFacturerList(queryString, (data) => {
          let results = [];
          results = this.assetMaunFacturerList;
          results.forEach((item, index) => {
            item.value = item.assetmanufacturer;
          })
          cb(results);
        });
      },
      
      assetManuFacturerSelect() {// 选择厂家
        let that = this;
        let assetMaunFacturer = this.formData.assetManufacturer;
        this.assetModelList = []
        this.assetMaunFacturerList.forEach(item => {
          if(item.assetmanufacturer == assetMaunFacturer) {
            item.assetmodel.forEach(model => {
              let obj = {};
              obj.value = model;
              that.assetModelList.push(obj);
            })
          }
        })
      },

      assetManuFacturerChange() {// 厂家输入事件
        let that = this;
        let assetMaunFacturer = this.formData.assetManufacturer;
        let flag = false
        let assetModelList = [];
        this.assetMaunFacturerList.forEach(item => {
          if(item.assetmanufacturer.toLowerCase() == (assetMaunFacturer.toLowerCase())) {
            item.assetmodel.forEach(model => {
              let obj = {};
              obj.value = model;
              assetModelList.push(obj);
            })
            that.assetModelList = assetModelList;
            flag = true
          }
        })
        if(!flag) {
          this.assetModelList = []
        }
      },

      manuFacturerFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },

      assetModelQuerySearch(queryString, cb) {
        let data = this.assetModelList;
        let results = [];
        results = queryString ? data.filter(this.manuFacturerFilter(queryString)) : this.assetModelList;
        cb(results);
      },
      // 厂家 end

      // 人员联想 start
      getEmployeesByUserType(query, fun, userType) {// 根据输入的内容获取结果
        let that = this
        that.$axios.post(`${urlConfig.associatedUserMag.GETEMPLOYEESBYUSERTYPE}?param=${query}&userType=${userType}`).then(function (res) {
          if(res.data.flag) {
            fun(res.data.data);
          } else {
            fun([])
          }
        }, err => { })
      },

      associateRequireUser(queryString, cb) {
        this.CB = cb;
        this.getEmployeesByUserType(queryString, data => {
          data.forEach(item => {
            item.value = item.real_name + '/' + item.empcode + ' | ' + item.deptname
          })
          cb(data);
        }, 1)
      },
      
      associateApplyUser(queryString, cb) {
        this.CB = cb;
        this.getEmployeesByUserType(queryString, data => {
          data.forEach(item => {
            item.value = item.real_name + '/' + item.empcode + ' | ' + item.deptname
          })
          cb(data);
        }, 0)
      },

      selectRequireUser(item) {
        this.formData.requiredUser = item.real_name + '/' + item.empcode
      },
      selectApplyUser(item) {
        this.formData.applyUser = item.real_name + '/' + item.empcode
      },
      // 人员联想 end

      // 获取申请部门树
      getDeptTree() {
        let that = this
        that.$axios.get(urlConfig.assetPlanApprovalQuery.DEPTINFOTREEGET).then(function (res) {
          that.deptArr = res.data.data;
        }, err => {

        })
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
      selectDept(node) {
        this.formData.deptLevel = node.deptLevel
      },
      // 获取到货地点
      getReceivePlace() {
        let that = this
        that.$axios.get(urlConfig.GETRECEIVERPLACELISTFORSEARCH).then(function (res) {
          that.receivePlaceList = res.data.data;
        }, err => { })
      },
      selectReqPurchaseReport(val) {
        if(this.formData.isReqPurchaseReport === val) {
          this.formData.isReqPurchaseReport = ''
        } else {
          this.formData.isReqPurchaseReport = val;
        }
      },
      selectSpecifyManufacturer(val) {
        if(this.formData.isSpecifyManufacturer === val) {
          this.formData.isSpecifyManufacturer = ''
        } else {
          this.formData.isSpecifyManufacturer = val;
        }
      },
      selectIsBpm(val) {
        if(this.formData.isBpm === val) {
          this.formData.isBpm = ''
        } else {
          this.formData.isBpm = val;
        }
      },
      getTableTitleInfo() {
        let that = this
        that.$axios.post(`${urlConfig.assetPlanApprovalQuery.GETTABLETITLEINFO}?viewName=AssetPlanInfoSearchView`).then(function (res) {
          if (res.data.status == 0) {
            that.tableHead = res.data.data
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
      getTableDataList(page) {
        let that = this
        that.loading = true
        that.prQuery = true
        if(page == '1'){
          that.formData.pageNum = 1
        }
        let params = Object.assign({}, that.formData);
        let reg = /\/(\w+)$/g;
        let regResult = reg.exec(params.requiredUser)
        let applyUserRegResult = /\/(\w+)$/g.exec(params.applyUser)
        params.requiredUser = regResult ? regResult[1] : '';
        params.applyUser = applyUserRegResult ? applyUserRegResult[1] : '';

        that.$axios.post(urlConfig.assetPlanApprovalQuery.ASSETPLANINFOLISTGET, params).then(function (res) {
          that.loading = false
          that.prQuery = false
          if (res.data.status == 0) {
            // that.tableHead = res.data.tableHeadData
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
      //置空查询条件
      clearParams() {
        this.$store.commit('clearSearchForm')
        this.formData = this.$store.state.assetPlanApprovalQuery.formData
      },
      //分页
      handleCurrentChange (val) {
        this.formData.pageNum = val 
        this.getTableDataList()
      },
      handleSizeChange (val) {
        this.formData.pageSize = val
        this.getTableDataList()
      },
      //列表勾选
      changeFun(val) {
        let that = this
        that.checkedData = []
        val.map((item) => { // 循环数组对象对每个数据进行处理 返回需要的数据    
          that.checkedData.push(item.assetplanid)  
        })
      },
      gotoApprovalRecord(row) {
        this.$router.push({
          path: '/assetPlanApprovalQuery/approvalRecord',  
          query: {
            assetplanid: row.assetplanid,
          }
        })
      },
      //激活
      activateAssetPlanInfo() {
        let that = this
        if (that.checkedData.length == 0) {
          that.$message({
            type: "warning",
            message: "请选择需要激活的记录"
          })
          return;
        }
        that.$axios.post(urlConfig.assetPlanApprovalQuery.ASSETPLANINFOACTIVATE, that.checkedData).then(function (res) {
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
        let params = Object.assign({}, that.formData);
        let reg = /\/(\w+)$/g;
        let regResult = reg.exec(params.requiredUser)
        params.requiredUser = regResult ? regResult[1] : '';
        let applyUserRegResult = /\/(\w+)$/g.exec(params.applyUser)
        params.applyUser = applyUserRegResult ? applyUserRegResult[1] : '';
        params.lstexportId = that.checkedData;

        that.$store.dispatch('exportAssetPlanInfo', params).then(function (res) {
          that.prExport = false
          let file = res.data
          let blob = new Blob([file])
          let url = URL.createObjectURL(blob)
          let fileName = decodeURIComponent("资产计划审批信息.xlsx")

          if (navigator.msSaveBlob) {
            util.closeLoadingEx(that, 'success', '导出成功')
            return navigator.msSaveBlob(blob, fileName)
          } 
          else {
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
      handleDetail(index, row) {
        let that = this;
        this.$router.push({
          path: '/assetApplyDetail',  
          query: {
            forQuery: true,
            assetplanid: row.assetplanid,
            eventtype: 'detailclick',
            assetstage: that.assetStage
          }
        })
      },
      requiredFn() {
        let that = this
        let allEndFlag = true // 所选条目中是否全部处于已结束状态
        let requiredsauditIsZeroFlag = false // 所选条目中已结束状态的计划的同意申购数量是否含有为零的情况
        let softwareNum = 0 // 软件类数量
        let lists = this.$refs.table.selection
        if(lists.length == 0) {
          that.$message({
            type: "warning",
            message: "请选择要操作的记录"
          })
          return;
        } else if(lists.length > 8) {
          that.$message({
            type: "warning",
            message: "进行非生产物料申购的记录最多8条，请重新选择"
          })
          return;
        } else {
          lists.forEach((item, index) => {
            if(item.apstage != 0) {// 未结束记录
              allEndFlag = false
            }
            if(item.apstage == 0 && item.requiredsaudit == 0) {// 未结束记录
              requiredsauditIsZeroFlag = true
            }
            if(item.assetcategoryid == '18') {// 研发软件
              softwareNum++
            }
          })
          // 验证是否都为已结束记录
          if(!allEndFlag) {
            that.$message({
              type: "warning",
              message: "所选记录中包含未结束记录，请重新选择"
            })
            return;
          }
          if(requiredsauditIsZeroFlag) {
            that.$message({
              type: "warning",
              message: "存在未审批通过记录，请重新选择"
            })
            return;
          }
          // 非生产物料申购必须全为软件类 或者 全为 非软件类
          if(softwareNum > 0 && softwareNum < lists.length) {
            that.$message({
              type: "warning",
              message: "所选记录中包含软件类和非软件类，请重新选择"
            })
            return;
          }

          // 验证是否为同一coa that.checkedData
          let params = new FormData()
          params.append('lstId', that.checkedData)
          that.$axios.post(urlConfig.assetPlanApprovalQuery.CHECKCOA, params).then(res => {
            if(res.data.success) {
              if(!res.data.data) {
                that.$message({
                  type: "warning",
                  message: "所选记录存在不同部门，请重新选择"
                })
              } else {
                that.checkIsWriteBpmCode(softwareNum)
              }
            }
          }, err => { })
        }
      },

      checkIsWriteBpmCode(softwareNum) {
        let that = this
        let url = ''
        let iamplanId = that.checkedData.join(',')
        if(softwareNum > 0) {// 软件类
          url = window.ibpmHost + '/bpm/linkey_workflow_engine.nsf/workflow_doc?readform&WF_ProcessUNID=FEA868A6656D209F48257C3D002D254E&applyType=IT软件、维保类&iamplanID=' + iamplanId
        } else {// 非软件类
          url = window.ibpmHost + '/bpm/linkey_workflow_engine.nsf/workflow_doc?readform&WF_ProcessUNID=259C11B66480611648257BE9002BB11F&applyType=普通资产&iamplanID=' + iamplanId
        }
        let params = new FormData()
        params.append('lstId', that.checkedData)
        that.$axios.post(urlConfig.assetPlanApprovalQuery.CHECKISWRITEBPMCODE, params).then(res => {
          if(res.data.success) {
            if(!res.data.data) { // true:没有回写，false已回写 
              that.$confirm('所选记录中存在已申购记录，请确认是否继续申请', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: 'btn-custom-cancel',
                type: 'warning'
              }).then(() => { // 确定
                window.open(url, '_blank')
              }).catch(() => { // 取消
                         
              });
            } else {
              window.open(url, '_blank')
            }
          }
        }, err => { })
      }, 
      // 项目编码和项目名称
      getItemCodeAndName(e) {
        let that = this;
        if(!e.target.value) { return }
        this.$store.dispatch('getItemCodeAndName', {
          itemCode: e.target.value
        }).then(res => {
          if(res.data && res.data.length == 1) {
            that.formData.itemCode = res.data[0].itemcode
          } else {
            that.formData.itemCode = ''
          }
        }, err => { })
      },
      getPlAndItemList(val) {
        let that = this
        that.$axios.get(`${urlConfig.GETPLANDITEMLIST}?type=0&param=${val ? val : ''}`).then(function (res) {
          if(res.data.data){
            res.data.data.forEach((pl) => {
              pl.projectName = pl.pl_name
              pl.projectNo = pl.pl_no
              pl.data.forEach(item => {
                item.id = item.projectNo
                item.label = `${item.projectName}（${item.projectNo}）`
                item.projectNo = item.projectNo
                item.projectName = item.projectName
                item.customLabel = item.projectNo
              })
            })
            that.itemOptions = res.data.data.map(item => ({
              id: item.projectNo,
              projectNo: item.projectNo,
              projectName: item.projectName,
              label: item.pl_name ? item.projectName : `${item.projectName}（${item.projectNo}）`,
              customLabel: item.projectNo,
              children: item.data,
            }))
            if(!val) {
              that.itemOptionsTemp = JSON.parse(JSON.stringify(that.itemOptions))
            }
          } else {
            that.itemOptions = []
            that.itemOptionsTemp = []
          }
        }, err => {})
      },
      selectItem(data) {
        this.formData.itemCode = data.projectNo
        this.itemOptions = []
        this.itemTreeFlag = false
      },
      openItemTree() {
        this.itemTreeFlag = !this.itemTreeFlag
        this.itemTreeText = ''
        if(this.itemTreeFlag) {
          this.itemOptions = JSON.parse(JSON.stringify(this.itemOptionsTemp))
        }
      },

    }
  }
</script>
<style lang="scss" scoped>
  .formBox {
    background: #fff;
    // padding: 15px 20px;
    table {
      margin-top: 15px;
      width: 100%;
      border-color: #e1e1e1;
      border: transparent;
      tr td {
        padding: 4px 10px;
        box-sizing: border-box;
        border: 1px solid #c9ddf7;
        border-bottom: transparent;
        border-right: transparent;
      }
      .bgTd {
        background-color: #f2f7fd;
      }
      .top-content-padding td {
        border: transparent;
        border-top: 1px solid #c9ddf7;
      }
      tr .boderTdRight {
        border-right: 1px solid #c9ddf7;
      }
      tr .borderTdNoLeft {
        border-left: transparent;
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
    .el-autocomplete {
      width: 100%;
    }

    .radio-icon {
      display: inline-block;
      margin-right: 8px;
      width: 14px;
      height: 14px;
      vertical-align: -2px;
      border-radius: 50%;
      user-select:none;
    }
    .no_selected_icon {
      border: 1px solid #DCDFE6;
      box-sizing: border-box;
    }
    .selected_icon {
      background-color: #386FD3;
    }

    .marginRight20 {
      margin-right: 20px;
      user-select:none;
    }
    .selected_text {
      color: #386FD3;
    }
    
  }
  .dataBox {
    background: #fff;
    // padding: 15px 20px 20px;
    padding: 0 3% 50px;
    h3 {
      line-height: 32px;
    }
    .btnRow {
      padding-top: 15px;
      border-top: 1px solid #ddd;
      margin-bottom: 15px;
    }
  }

  .item-select-input {
    display: inline-block;
    width: 75%;
  }
  .item-select-btn {
    position: relative;
    top: -1px;
    display: inline-block;
    padding: 0!important;
    width: 25%!important;
    height: 26px!important;
    font-size: 12px;
    border-radius: 0!important;
  }
  .itemcode-container {
    position: relative;
    
  }
  .item-tree-container {
    padding-top: 10px;
    width: calc(100% - 21px);
    z-index: 10;
    background-color: #fff;
    text-align: center;
    .item-tree-input {
      margin: 0 auto 10px;
      width: 100%;
    }
  }
</style>
<style>
  .assetPlanApprovalQuery .el-range-editor.el-input__inner {
    width: 100%;
  }
  .assetPlanApprovalQuery .vue-treeselect .vue-treeselect__control {
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
  .assetPlanApprovalQuery .vue-treeselect .vue-treeselect__control .vue-treeselect__value-container {
    line-height: 20px;
  }
  .el-input__icon, .el-range-separator {
    line-height: 1!important;
  }
  .item-tree .vue-treeselect__control {
    display: none;
  }
  .item-tree {
    margin-top: 4px;
  }
  .item-tree-dialog .el-dialog__body{
    padding: 0 20px;
    height: 400px;
  }
</style>