<template>
  <div class="manu-facturer-content setting-container">
    <el-table 
      class="manu-facturer-table"
      border 
      :data="tableData" 
      ref="table" 
      @row-dblclick="rowDblclick"
      :row-class-name="tableRowClassName"
      :cell-style="cellStyleFn"
      :header-cell-style="headerCellStyleFn"
      row-key="manufacturerid"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <template v-for="(col,index) in tableHead">
        <el-table-column :prop="col.prop" :label="col.label" :key="index+1" show-overflow-tooltip></el-table-column>
      </template> 
      <el-table-column class="plus-col" prop="icon" width="30">
        <template slot="header">
          <i class="el-icon-circle-plus plus-icon" @click="addEvent"></i>
        </template>

        <template slot-scope="scope">
          <i class="el-icon-circle-plus plus-icon" v-if="scope.row.plusIconShow && scope.row.deleteFlag == 1" @click="addEvent(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="manuFacturerShow" :title="manuFacturerTitle" class="my-dialog" @opened="dialogOpen('manuFacturerForm')">
      <el-form :model="manuFacturerForm" :rules="manuFacturerRules" label-position="left" class="my-form" ref="manuFacturerForm">
        <el-row class="margint_10">
          <el-form-item label="厂家" :label-width="formLabelWidth" prop="manufacturerName">
            <el-input v-model="manuFacturerForm.manufacturerName" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="margint_10">
          <el-form-item label="厂家别名" :label-width="formLabelWidth" prop="manufacturerCn">
            <el-input v-model="manuFacturerForm.manufacturerCn" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="margint_10">
          <el-form-item label="是否有效" :label-width="formLabelWidth">
            <el-select v-model="manuFacturerForm.deleteFlag" placeholder="请选择">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEvent('manuFacturer')">确 定</el-button>
        <el-button type="primary" @click="manuFacturerShow = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="modelShow" :title="modelTitle" class="my-dialog" @opened="dialogOpen('modelForm')">
      <el-form :model="modelForm" :rules="modelRules" label-position="left" class="my-form" ref="modelForm">
        <el-row class="margint_10">
          <el-form-item label="型号" :label-width="formLabelWidth" prop="name">
            <el-input v-model="modelForm.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="margint_10">
          <el-form-item label="厂家" :label-width="formLabelWidth" prop="manufacturerName">
            <el-input v-model="modelForm.manufacturerName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="margint_10">
          <el-form-item label="是否有效" :label-width="formLabelWidth">
            <el-select v-model="modelForm.deleteFlag" placeholder="请选择">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEvent('model')">确 定</el-button>
        <el-button type="primary" @click="modelShow = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import urlConfig from '../../http/urlConfig/index'
export default {
  name: 'manuFacturer',
  data() {
    return {
      tableHead: [
        { label: '厂家', prop: 'manufacturerName' },
        { label: '厂家别名', prop: 'manufacturerCn' },
        { label: '型号', prop: 'name' },
        { label: '创建人', prop: 'creator' },
        { label: '创建时间', prop: 'createTime' },
        { label: '修改人', prop: 'modifier' },
        { label: '最后修改时间', prop: 'modifiTime' },
      ],
      tableData: [],
      manuFacturerShow: false,
      manuFacturerForm: {
        id: '',
        manufacturerName: '',
        manufacturerCn: '',
        deleteFlag: '1',
      },
      formLabelWidth: '100px',
      manuFacturerRules: {
        manufacturerName: [{ required: true, message: '厂家必填', trigger: 'change'}],
      },
      manuFacturerTitle: '新增厂家',
      modelTitle: '新增型号',
      modelShow: false,
      modelForm: {
        id: '',
        name: '',
        manufacturerId: '',
        manufacturerName: '',
        deleteFlag: '1',
      },
       modelRules: {
        name: [{ required: true, message: '型号必填', trigger: 'change'}],
      },
    }
  },
  mounted() {},
  methods: {
    init() {
      this.getList()
    },
    tableRowClassName({row, rowIndex}) {
      if (row.deleteFlag == 0) {// 1 有效 0无效  
        return 'gray-row';
      } 
      return '';
    },
    cellStyleFn({row, column, rowIndex, columnIndex}) {
      if(columnIndex == 8) {
        return {
          backgroundColor: '#fff!important',
          border: 'none!important'
        }
      }
    }, 
    headerCellStyleFn({row, column, rowIndex, columnIndex}) {
      if(columnIndex == 8) {
        return {
          backgroundColor: '#fff!important',
          border: 'none'
        }
      } else {
        return 'background-color: #F1F3F9;'
      }
    },
    rowDblclick(row, column, event) {
      if(row.children && column.property != 'icon') {// 修改厂家
        this.manuFacturerTitle = '修改厂家'
        this.manuFacturerShow = true
        this.clearManuFacturerForm()
        this.getManuFactoryDetailById(row.id)
      } else if (column.property != 'icon') {// 修改型号
        this.modelTitle = '修改型号'
        this.modelShow = true
        this.clearModelForm()
        this.getModelDetailById(row.id)
      }
    },
    dialogOpen(type) {
      this.$refs[type].clearValidate()
    },
    getList() {
      let that = this
      this.$axios.post(urlConfig.settingMag.MANUFACTORYLIST).then(res => {
        let data = res.data
        if(data.success) {
          that.tableData = []
          let key = 1
          data.data.forEach((item, index) => {
            let obj = {}
            item.assetmanufacturer.manufacturerid = key
            item.assetmanufacturer.plusIconShow = true
            item.assetmanufacturer.children = []
            key++
            item.assetmodel.forEach((model, modelIndex) => {
              // model.manufacturerName = item.assetmanufacturer.manufacturerName
              model.plusIconShow = false
              model.manufacturerid = key
              key++
              item.assetmanufacturer.children.push(model)
            })
            that.tableData.push(item.assetmanufacturer)
          })
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
    clearManuFacturerForm() {
      this.manuFacturerForm = {
        id: '',
        manufacturerName: '',
        manufacturerCn: '',
        deleteFlag: '1',// 1 有效 0无效  
      }
    },
    clearModelForm() {
      this.modelForm = {
        id: '',
        name: '',
        manufacturerId: '',
        manufacturerName: '',
        deleteFlag: '1',// 1 有效 0无效  
      }
    },
    addEvent(row) {
      if(row && row.children) {// 新增型号
        this.modelTitle = '新增型号'
        this.modelShow = true
        this.clearModelForm()
        this.modelForm.manufacturerId = row.id
        this.modelForm.manufacturerName = row.manufacturerName
      } else {// 新增厂家
        this.manuFacturerTitle = '新增厂家'
        this.manuFacturerShow = true
        this.clearManuFacturerForm()
      }
    },
    saveEvent(type) {
      let that = this
      let url = ''
      let reqType = ''
      let params;
      let formName = ''

      if(this.modelForm.id && type == 'model') {// 型号编辑
        reqType = 'put'
        url = urlConfig.settingMag.MODELEDIT
        params = that.modelForm
        formName = 'modelForm'
      } else if(this.manuFacturerForm.id && type == 'manuFacturer') {// 厂家编辑
        reqType = 'put'
        url = urlConfig.settingMag.MANUFACTORYEDIT
        params = that.manuFacturerForm
        formName = 'manuFacturerForm'
      } else if(!this.modelForm.id && type == 'model') {// 新增型号
        reqType = 'post'
        url = urlConfig.settingMag.MODELADD
        params = that.modelForm
        formName = 'modelForm'
      } else if(!this.manuFacturerForm.id && type == 'manuFacturer') {// 新增厂家
        reqType = 'post'
        url = urlConfig.settingMag.MANUFACTORYADD
        params = that.manuFacturerForm
        formName = 'manuFacturerForm'
      } 
      this.$refs[formName].validate((valid, obj) => {
        if(valid) {
          that.$axios[reqType](url, params).then(res => {
            let data = res.data
            if(data.success) {
              that.modelShow = false
              that.manuFacturerShow = false
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
    getManuFactoryDetailById(id) {//通过id获取型号信息
      let that = this
      this.$axios.post(`${urlConfig.settingMag.MANUFACTORYGETBYID}?id=${id}`).then(res => {
        let data = res.data
        if(data.success) {
          if(data.data) {
            that.manuFacturerForm.manufacturerName = data.data.manufacturerName
            that.manuFacturerForm.manufacturerCn = data.data.manufacturerCn
            that.manuFacturerForm.deleteFlag = data.data.deleteFlag
            that.manuFacturerForm.id = data.data.id
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
    getModelDetailById(id) {//通过id获取型号信息
      let that = this
      this.$axios.post(`${urlConfig.settingMag.MODELGETBYID}?id=${id}`).then(res => {
        let data = res.data
        if(data.success) {
          if(data.data) {
            that.modelForm.name = data.data.name
            that.modelForm.manufacturerId = data.data.manufacturerId
            that.modelForm.manufacturerName = data.data.manufacturerName
            that.modelForm.deleteFlag = data.data.deleteFlag
            that.modelForm.id = data.data.id
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

<style lang="scss" scoped>
  .plus-icon {
    cursor: pointer;
  }

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

  #app .manu-facturer-table thead tr th {
    background-color: #917070!important;
    border: none!important;
  }
  .manu-facturer-content .el-table--border::after {
    width: 0!important;
  }
  .manu-facturer-content .el-table::before {
    height: 0!important;
  }
  .manu-facturer-content .el-table--border{
    border-top: none;
  }
  // .el-table thead tr th::before {
  //   right: 0;
  //   top: 2px;
  //   width: 30px;
  //   height: 1px;
  //   background-color: #fff;
  //   z-index: 10;
  // }
</style>