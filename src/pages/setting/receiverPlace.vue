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
          <el-form-item label="到货地点" :label-width="formLabelWidth" prop="place">
            <el-input v-model="form.place" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="margint_10" :gutter="20">
          <el-form-item label="收货人" :label-width="formLabelWidth" prop="consignee">
            <el-input v-model="form.consignee" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="margint_10" :gutter="20">
          <el-form-item label="详细地址" :label-width="formLabelWidth" prop="detail">
            <el-input v-model="form.detail" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="margint_10" :gutter="20">
          <el-form-item label="审核人" :label-width="formLabelWidth" prop="approver">
            <el-autocomplete
              class="my-autocomplete"
              v-model="form.approver"
              :fetch-suggestions="associateFn"
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
  name: 'receiverPlace',
  data() {
    return {
      tableHead: [
        { label: '到货地点', prop: 'place' },
        { label: '收货人', prop: 'consignee' },
        { label: '详细地址', prop: 'detail' },
        { label: '审核人', prop: 'approver' },
        { label: '创建人', prop: 'creater' },
        { label: '创建时间', prop: 'create_time' },
        { label: '修改人', prop: 'last_modifier' },
        { label: '最后修改时间', prop: 'last_modify_time' }
      ],
      tableData: [],
      dialogFormVisible: false,
      dialogTitle: '新增到货地点',
      form: {
        dicCode: '',
        consignee: '',
        place: '',
        detail: '',
        approver: '',
        id: '',
        isAble: 1,// 1 有效 0无效  
      },
      formLabelWidth: '100px',
      rules: {
        place: [{ required: true, message: '到货地点必填', trigger: 'blur'}],
        consignee: [{ required: true, message: '收货人必填', trigger: 'blur'}],
        detail: [{ required: true, message: '详细地址必填', trigger: 'blur'}],
        approver: [{ required: true, message: '审核人必填', trigger: 'change'}],
      },
      pageSize: 20,
      pageNum: 1,
      total: 0
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
      this.form.approver = ''
    },
    getList() {
      let that = this
      let params = {
        num: that.pageNum,
        size: that.pageSize
      }
      this.$axios.post(urlConfig.settingMag.ADDRLIST, params).then(res => {
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
      this.dialogTitle = '修改到货地点'
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
      this.$axios.post(`${urlConfig.settingMag.ADDRDEL}?ids=${ids}`).then(res => {
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
        dicCode: '',
        consignee: '',
        place: '',
        detail: '',
        approver: '',
        id: '',
        isAble: 1
      }
    },
    addEvent() {
      this.dialogTitle = '新增到货地点'
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
        url = urlConfig.settingMag.ADDREDIT
      } else {// 新增
        type = 'post'
        url = urlConfig.settingMag.ADDRADD
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
      this.$axios.post(`${urlConfig.settingMag.ADDRGETBYID}?id=${id}`).then(res => {
        let data = res.data
        if(data.success) {
          if(data.data) {
            that.form.dicCode = data.data.dicCode
            that.form.consignee = data.data.consignee
            that.form.place = data.data.place
            that.form.detail = data.data.detail
            that.form.approver = data.data.approver
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
      this.form.approver = item.full_name + ' ' + item.empcode
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
    upDownFn(id, type) {
      let that = this
      this.$axios.post(`${urlConfig.settingMag.ADDRMOVEUPORDOWN}?id=${id}&moveId=${type}`).then(res => {
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
    .my-autocomplete {
      width: 100%;
    }
  }
  
  .el-table .gray-row td{
    background-color: #f2f2f2!important;
  }

</style>