<template>
  <div class="setting-container">
    <el-row class="btn-row">
      <el-col>
        <el-button type="primary" @click="addEvent">新增</el-button>
        <el-button type="primary" @click="invalidItem">失效</el-button>
      </el-col>
    </el-row>
    <el-table 
      border 
      :data="tableData" 
      ref="table" 
      @row-dblclick="rowDblclick"
      :row-class-name="tableRowClassName"
      :cell-style="{background: '#fff'}"
      :header-cell-style="headerCellStyleFn"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <template v-for="(col,index) in tableHead">
        <el-table-column :prop="col.prop" :label="col.label" :key="index+1" show-overflow-tooltip></el-table-column>
      </template> 
      <el-table-column label="操作" fixed="right" width="120">
        <template slot-scope="scope" v-if="scope.row.is_able == 1">
          <el-button type="text" @click="upDownFn(scope.row.id, '1')">上移</el-button>
          <el-button type="text" @click="upDownFn(scope.row.id, '2')">下移</el-button>
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
    <el-dialog :visible.sync="dialogFormVisible" :title="dialogTitle" class="my-dialog" @opened="dialogOpen">
      <el-form :model="form" :rules="rules" label-position="left" ref="formTable" class="my-form">
        <el-row class="margint_10" :gutter="20">
            <el-form-item label="物品类别" :label-width="formLabelWidth" prop="category">
              <el-input v-model="form.category" autocomplete="off"></el-input>
            </el-form-item>
        </el-row>
        <el-row class="margint_10" :gutter="20">
          <el-form-item label="货期" :label-width="formLabelWidth" prop="deliveryTime">
            <el-input type="number" v-model="form.deliveryTime" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="margint_10" :gutter="20">
          <el-form-item label="预算类型" :label-width="formLabelWidth" prop="expenseType">
            <el-select v-model="form.expenseType" placeholder="请选择">
              <el-option label="费用类" value="1"></el-option>
              <el-option label="资产类" value="2"></el-option>
              <el-option label="其他" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row class="margint_10" :gutter="20">
            <el-form-item label="认证员ID" :label-width="formLabelWidth" prop="certifier">
              <el-autocomplete
                class="my-autocomplete"
                v-model="form.certifier"
                :fetch-suggestions="associateRegularEmployee"
                :trigger-on-focus="false"
                :hide-loading="true"
                :debounce="300"
                @select="selectUser"
                @change="associateChange">
              </el-autocomplete>
            </el-form-item>
        </el-row>
        <el-row class="margint_10" :gutter="20">
          <el-form-item label="是否有效" :label-width="formLabelWidth">
            <el-select v-model="form.isAble" placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEvent">确 定</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import urlConfig from '../../http/urlConfig/index'
import associateUsermixin from '../../components/mixins/associateUserMixin'
export default {
  name: 'category',
  data() {
    return {
      tableHead: [
        { label: '认证员ID', prop: 'certifier' },
        { label: '姓名', prop: 'name' },
        { label: '物品类别', prop: 'category' },
        { label: '货期', prop: 'deliveryTime' },
        { label: '预算类型', prop: 'expenseType' },
        { label: '创建人', prop: 'creater' },
        { label: '创建时间', prop: 'create_time' },
        { label: '修改人', prop: 'last_modifier' },
        { label: '最后修改时间', prop: 'last_modify_time' }
      ],
      tableData: [],
      dialogFormVisible: false,
      form: {
        certifier: '',
        category: '',
        deliveryTime: '',
        expenseType: '',
        dicCode: '',
        name: '',
        id: '',
        isAble: 1,// 1 有效 0无效  
      },
      formLabelWidth: '160px',
      rules: {
        certifier: [{ required: true, message: '认证员ID必填', trigger: 'change'}],
        category: [{ required: true, message: '物品品类必填', trigger: 'blur'}],
        deliveryTime: [{ required: true, message: '货期必填', trigger: 'blur'}],
        expenseType: [{ required: true, message: '预算类型必填', trigger: 'blur'}],
      },
      pageSize: 20,
      pageNum: 1,
      total: 0,
      dialogTitle: ''
    }
  },
  mixins: [associateUsermixin],
  mounted() {
    // this.getList()
  },
  methods: {
    init() {
      this.getToken()
      this.getList()
    },
    headerCellStyleFn(param) {
      return 'background-color: #F1F3F9;'
    },
    tableRowClassName({row, rowIndex}) {
      if (row.is_able == 0) {// 1 有效 0无效  
        return 'gray-row';
      } 
      return '';
    },
    associateChange() {
      this.form.certifier = ''
    },
    getList() {
      let that = this
      let params = {
        num: that.pageNum,
        size: that.pageSize
      }
      this.$axios.post(urlConfig.settingMag.CATEGORYLIST, params).then(res => {
        let data = res.data
        if(data.success) {
          data.data.forEach(item => {
            if(item.expenseType == 1) {
              item.expenseType = '费用类'
            } else if(item.expenseType == 2) {
              item.expenseType = '资产类'
            } else if(item.expenseType == 3) {
              item.expenseType = '其他'
            }
          })
          that.tableData = data.data
          that.total = data.total
        } else {
          that.$message({
            showClose: true,
            message: data.message,
            type: 'error'
          });
        }
      }, err => { })
    },
    rowDblclick(row, col, event) {
      this.dialogTitle = '修改物品类别货期'
      this.dialogFormVisible = true
      this.clearForm()
      this.getDetailById(row.id)
    },
    dialogOpen() {
      this.$refs.formTable.clearValidate()
    },
    invalidItem() {
      let that = this
      let selectList = this.$refs.table.selection;
      if(selectList.length == 0) {
        that.$message({
          showClose: true,
          message: '请选择要操作的条目',
          type: 'warning'
        });
        return
      } 
      let ids = []
      selectList.forEach((item, index) => {
        ids.push(item.id)
      })
      this.$axios.post(`${urlConfig.settingMag.CATEGORYDEL}?ids=${ids}`).then(res => {
        let data = res.data
        if(data.success) {
          that.dialogFormVisible = false
          that.$message({
            showClose: true,
            message: data.message,
            type: 'success'
          });
          that.getList()
        } else {
          that.$message({
            showClose: true,
            message: data.message,
            type: 'error'
          });
        }
      }, err => {
        that.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        });
      })
    },
    clearForm() {
      this.form = {
        certifier: '',
        category: '',
        deliveryTime: '',
        expenseType: '',
        dicCode: '',
        name: '',
        id: '',
        isAble: 1,// 1 有效 0无效  
      }
    },
    addEvent() {
      this.dialogTitle = '新增物品类别货期'
      this.clearForm()
      this.dialogFormVisible = true
    },
    saveEvent() {
      let that = this
      let url = ''
      let type = ''
      let params = {}
      params = Object.assign({}, that.form)
      if(this.form.id) {// 编辑
        type = 'put'
        url = urlConfig.settingMag.CATEGORYEDIT
      } else {// 新增
        type = 'post'
        url = urlConfig.settingMag.CATEGORYADD
        delete params.dicCode
      }
      this.$refs.formTable.validate((valid, obj) => {
        if(valid) {
          that.$axios[type](url, params).then(res => {
            let data = res.data
            if(data.success) {
              that.dialogFormVisible = false
              that.$message({
                showClose: true,
                message: data.message,
                type: 'success'
              });
              that.getList()
            } else {
              that.$message({
                showClose: true,
                message: data.message,
                type: 'error'
              });
            }
          }, err => {
            that.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            });
          })
        }
      })
    },
    getDetailById(id) {
      let that = this
      this.$axios.post(`${urlConfig.settingMag.CATEGORYGETBYID}?id=${id}`).then(res => {
        let data = res.data
        if(data.success) {
          if(data.data) {
            that.form.certifier = data.data.certifier
            that.form.category = data.data.category
            that.form.expenseType = data.data.expenseType
            that.form.deliveryTime = data.data.deliveryTime
            that.form.dicCode = data.data.dicCode
            that.form.name = data.data.name
            that.form.id = data.data.id
            that.form.isAble = data.data.isAble
          }
        } else {
          that.$message({
            showClose: true,
            message: res.message,
            type: 'error'
          });
        }
      }, err => { })
    },
    selectUser(item) {
      this.form.certifier = item.full_name + ' ' + item.empcode
      this.form.name = item.real_name
    },
    //分页
    handleCurrentChange (val) {
      this.pageNum = val 
      this.getList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    upDownFn(id, type, scope) {
      let that = this
      this.$axios.post(`${urlConfig.settingMag.CATEGORYMOVEUPORDOWN}?id=${id}&moveId=${type}`).then(res => {
        let data = res.data
        if(data.success) {
          if(data.message) {
            that.$message({
              showClose: true,
              message: data.message,
              type: 'warning'
            });
          }
          that.getList()
        } else {
          that.$message({
            showClose: true,
            message: res.message,
            type: 'error'
          });
        }
      }, err => { })
      
    }
  }
}
</script>

<style lang="scss" scope>
  .my-dialog {
    padding: 0 20px;
    .my-form {
      margin-left: 25px;
    }
    .margint_10 {
      margin-top: 10px;
    }
  }
  
  .el-table .gray-row td{
    background-color: #f2f2f2!important;
  }

</style>