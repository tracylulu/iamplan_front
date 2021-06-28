<template>
  <div class="setting-container">
    <el-row class="btn-row">
      <el-col>
        <el-button type="primary" @click="addEvent">新增</el-button>
        <el-button type="primary" @click="invalidItem">失效</el-button>
        <el-upload
          class="upload-btn"
          :action="apiUrl + '/budget/import'"
          :show-file-list	="false"
          :http-request="uploadHttpRequest"
          accept=".xls,.xlsx">
          <el-button type="primary">批量导入</el-button>
        </el-upload>
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
          <el-form-item label="部门名称" :label-width="formLabelWidth" prop="deptName">
            <treeselect v-model="form.deptCode" :options="deptArr" :normalizer="normalizer" :multiple="false" placeholder='请选择' @select="deptSelect"/>
          </el-form-item> 
        </el-row>
        <el-row class="margint_10" :gutter="20">
          <el-form-item label="部门编码" :label-width="formLabelWidth" prop="deptCode">
            <el-input v-model="form.deptCode" autocomplete="off" :readonly="true"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="margint_10" :gutter="20">
          <el-form-item label="实际到货（万元）" :label-width="formLabelWidth" prop="daoHuo">
            <el-input v-model="form.daoHuo" @input="priceInput('daoHuo')" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="margint_10" :gutter="20">
          <el-form-item label="在途（万元）" :label-width="formLabelWidth" prop="zaiTu">
            <el-input v-model="form.zaiTu" @input="priceInput('zaiTu')" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="margint_10" :gutter="20">
          <el-form-item label="预算（万元）" :label-width="formLabelWidth" prop="budget">
            <el-input v-model="form.budget" @input="priceInput('budget')" autocomplete="off"></el-input>
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
import deptTreeMixin from '../../components/mixins/deptTreeMixin'
export default {
  name: 'budget',
  data() {
    return {
      tableHead: [
        { label: '部门编码', prop: 'deptCode' },
        { label: '部门名称', prop: 'deptName' },
        { label: '实际到货（万元）', prop: 'daoHuo' },
        { label: '在途（万元）', prop: 'zaiTu' },
        { label: '预算（万元）', prop: 'budget' },
        { label: '创建人', prop: 'creater' },
        { label: '创建时间', prop: 'create_time' },
        { label: '修改人', prop: 'last_modifier' },
        { label: '最后修改时间', prop: 'last_modify_time' }
      ],
      tableData: [],
      dialogFormVisible: false,
      form: {
        deptCode: null,
        deptName: '',
        daoHuo: '',
        zaiTu: '',
        budget: '',
        id: '',
        isAble: 1,// 1 有效 0无效  
      },
      dialogTitle: '',
      formLabelWidth: '160px',
      rules: {
        // deptCode: [{ required: true, message: '部门编码必填', trigger: 'blur'}],
        deptName: [{ required: true, message: '部门名称必填', trigger: 'change'}],
        daoHuo: [{ required: true, message: '实际到货金额必填', trigger: 'blur'}],
        zaiTu: [{ required: true, message: '在途金额必填', trigger: 'blur'}],
        budget: [{ required: true, message: '预算必填', trigger: 'blur'}],
      },
      pageSize: 20,
      pageNum: 1,
      total: 0,
      apiUrl: urlConfig.apiUrl,
    }
  },
  mixins: [deptTreeMixin],
  mounted() {
    // this.getList()
  },
  methods: {
    init() {
      this.getList()
      this.getDeptTree()
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
    priceInput(type) {
      let that = this
      let tempData = that.form[type]
      if(tempData.match(/^\d+(?:\.\d{0,2})?/)) {
        tempData = tempData.match(/^\d+(?:\.\d{0,2})?/)[0]
        that.$set(that.form, type, tempData)
      } else {
        tempData = ''
        that.$set(that.form, type, tempData)
      }
    },
    deptSelect(node, instanceId) {
      this.form.deptName = node.deptName
    },
    getList() {
      let that = this
      let params = {
        num: that.pageNum,
        size: that.pageSize
      }
      this.$axios.post(urlConfig.settingMag.BUDGETLIST, params).then(res => {
        let data = res.data
        if(data.success) {
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
      this.dialogTitle = '修改部门预算'
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
      this.$axios.post(`${urlConfig.settingMag.BUDGETDEL}?ids=${ids}`).then(res => {
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
        deptCode: null,
        deptName: '',
        daoHuo: '',
        zaiTu: '',
        budget: '',
        id: '',
        isAble: 1,// 1 有效 0无效  
      }
    },
    addEvent() {
      this.dialogTitle = '新增部门预算'
      this.clearForm()
      this.dialogFormVisible = true
    },
    saveEvent() {
      let that = this
      let url = ''
      let type = ''
      if(this.form.id) {// 编辑
        type = 'put'
        url = urlConfig.settingMag.BUDGETEDIT
      } else {// 新增
        type = 'post'
        url = urlConfig.settingMag.BUDGETADD
      }
      this.$refs.formTable.validate((valid, obj) => {
        if(valid) {
          that.$axios[type](url, that.form).then(res => {
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
      this.$axios.post(`${urlConfig.settingMag.BUDGETGETBYID}?id=${id}`).then(res => {
        let data = res.data
        if(data.success) {
          if(data.data) {
            that.form.deptCode = data.data.deptCode
            that.form.deptName = data.data.deptName
            that.form.daoHuo = data.data.daoHuo
            that.form.zaiTu = data.data.zaiTu
            that.form.budget = data.data.budget
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
    uploadHttpRequest(params) {
      let that = this
      let fd = new FormData();
      fd.append("file", params.file);
      this.$axios.post(that.apiUrl + '/budget/import', fd).then(res => {
        let response = res.data
        if(response.success) {
          that.$message({
            message: response.message,
            type: 'success'
          });
          that.getList()
        } else {
          that.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            callback: action => { }
          });
        }
      }, err => { })
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
    background-color: #fafafa!important;
  }
  .upload-btn {
    display: inline-block;
    margin-left: 10px;
  }

</style>