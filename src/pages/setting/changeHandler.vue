<template>
  <div class="setting-container">
    <el-row type="flex" justify="end" class="search-container">
      <div>
        <el-autocomplete
          class="my-autocomplete"
          v-model="userCode"
          :fetch-suggestions="associateFn"
          :trigger-on-focus="false"
          :hide-loading="true"
          :debounce="300"
          @select="searchSelectUser"
          @change="associateChange"
          placeholder="审批人">
        </el-autocomplete>
        <el-button class="search-btn" type="primary" @click="getList">查询</el-button>
      </div>
    </el-row>
    <el-table border :data="tableData" ref="table" :cell-style="{ background: '#fff' }" :header-cell-style="headerCellStyleFn">
      <el-table-column type="selection" width="55"></el-table-column>
      <template v-for="(col,index) in tableHead">
        <el-table-column :prop="col.prop" :label="col.label" :key="index+1" show-overflow-tooltip></el-table-column>
      </template> 
      <el-table-column label="操作" prop="opration">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="openDialog(scope.row)">工作委托</el-button>
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
      :page-sizes="[5, 10, 20, 50]"
      :current-page="pageNum"
      :total="total"
      :page-size="pageSize">
    </el-pagination>

    <el-dialog :visible.sync="dialogFormVisible" :title="dialogTitle" class="my-dialog" @opened="dialogOpen" >
      <el-form :model="form" :rules="rules" label-position="left" ref="formTable" class="my-form">
        <el-row class="margint_10" :gutter="20">
            <el-form-item label="审批人" :label-width="formLabelWidth" prop="newHandler">
              <el-autocomplete
                class="my-autocomplete"
                v-model="form.newHandler"
                :fetch-suggestions="associateFn"
                :trigger-on-focus="false"
                :hide-loading="true"
                :debounce="300"
                @select="selectUser"
                @change="associateChange">
              </el-autocomplete>
            </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeHandler">确 定</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import urlConfig from '../../http/urlConfig/index'
import associateUsermixin from '../../components/mixins/associateUserMixin'
export default {
  name: 'changeHandler',
  data() {
    return {
      tableHead: [
        { label: '审批环节', prop: 'apstatus' },
        { label: '审批人', prop: 'reviewer' },
      ],
      tableData: [],
      dialogFormVisible: false,
      form: {
        apstage: '',
        handler: '',
        newHandler: '',
        newHandlerWorkNum: '',
      },
      formLabelWidth: '110px',
      rules: {
        newHandler: [{ required: true, message: '审批人必填', trigger: 'change'}],
      },
      dialogTitle: '工作委托',
      // userCode: this.$store.state.Login.userInfo.workNum,
      userCode: '',
      userCodeWorkNum: '',
      pageSize: 20,
      pageNum: 1,
      total: 0,
    }
  },
  mixins: [associateUsermixin],
  mounted() { },
  methods: {
    init() {
      this.getToken()
      this.getList()
    },
    headerCellStyleFn(param) {
      return 'background-color: #F1F3F9;'
    },

    dialogOpen() {
      this.$refs.formTable.clearValidate()
    },
    associateChange() {
      this.userCode = ''
      this.userCodeWorkNum = ''
    },
    selectUser(item) {
      this.form.newHandler = item.real_name + ' ' + item.empcode
      this.form.newHandlerWorkNum = item.empcode
    },
    searchSelectUser(item) {
      this.userCode = item.real_name + ' ' + item.empcode
      this.userCodeWorkNum = item.empcode
    },
    getList() {
      let that = this
      let params = new FormData()
      params.append('pageNum', that.pageNum)
      params.append('pageSize', that.pageSize)
      params.append('userCode', that.userCodeWorkNum)
      this.$axios.post(urlConfig.settingMag.PROCESSLIST, params).then(res => {
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
    openDialog(row) {
      this.form.handler = row.reviewer.slice(row.reviewer.indexOf(' ') + 1)
      this.form.apstage = row.apstage
      this.dialogFormVisible = true
    },
    
    changeHandler() {
      let that = this
      this.$refs.formTable.validate((valid, obj) => {
        if(valid) {
          let params = new FormData()
          params.append('apstage', that.form.apstage)
          params.append('handler', that.form.handler)
          params.append('newHandler', that.form.newHandlerWorkNum)
          that.$axios.post(urlConfig.settingMag.ADMINCHANGEHANDLER, params).then(res => {
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
  .search-container {
    margin-bottom: 15px;
    .search-btn {
      margin-left: 30px;
    }
  }
  
  .el-table .gray-row td{
    background-color: #f2f2f2!important;
  }

</style>