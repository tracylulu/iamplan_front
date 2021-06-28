<template>
  <div class="setting-container">
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
    <el-dialog :visible.sync="dialogFormVisible" :title="dialogTitle" class="my-dialog">
      <el-form :model="form" :rules="rules" label-position="left" ref="formTable" class="my-form">
        <el-row class="margint_10" :gutter="20">
            <el-form-item label="审批环节" :label-width="formLabelWidth" prop="dicName">
              <el-input v-model="form.dicName" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
        </el-row>
        <el-row class="margint_10" :gutter="20">
            <el-form-item label="审批人" :label-width="formLabelWidth" prop="dicCode">
              <el-autocomplete
                class="my-autocomplete"
                v-model="form.dicCode"
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
  name: 'approver',
  data() {
    return {
      tableHead: [
        { label: '审批环节', prop: 'dic_name' },
        { label: '审批人', prop: 'dic_code' },
        { label: '创建人', prop: 'creater' },
        { label: '创建时间', prop: 'create_time' },
        { label: '修改人', prop: 'last_modifier' },
        { label: '最后修改时间', prop: 'last_modify_time' }
      ],
      tableData: [],
      dialogFormVisible: false,
      form: {
        dicName: '',
        dicCode: '',
        dicTypeId: '',
        id: '',
        isAble: 1,// 1 有效 0无效  
      },
      formLabelWidth: '110px',
      rules: {
        dicCode: [{ required: true, message: '审批人必填', trigger: 'change'}],
      },
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
      this.form.dicCode = ''
    },
    selectUser(item) {
      this.form.dicCode = item.real_name + ' ' + item.empcode
    },
    getList() {
      let that = this
      this.$axios.post(urlConfig.settingMag.APPROVERLIST, {
        num: 1,
        size: 10
      }).then(res => {
        let data = res.data
        if(data.success) {
          that.tableData = data.data
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
      this.dialogFormVisible = true
      this.getDetailById(row.id)
    },
    clearForm() {
      this.form = {
        dicCode: '',
        dicName: '',
        dicTypeId: '',
        id: '',
        isAble: 1,// 1 有效 0无效  
      }
    },
    saveEvent() {
      let that = this
      this.$refs.formTable.validate((valid, obj) => {
        if(valid) {
          that.$axios.put(urlConfig.settingMag.APPROVEREDIT, that.form).then(res => {
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
      this.$axios.post(`${urlConfig.settingMag.APPROVERGETBYID}?id=${id}`).then(res => {
        let data = res.data
        if(data.success) {
          if(data.data) {
            that.form.dicCode = data.data.dicCode
            that.form.dicName = data.data.dicName
            that.form.dicTypeId = data.data.dicTypeId
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