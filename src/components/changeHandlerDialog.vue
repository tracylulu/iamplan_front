<template>
  <div class="changeHandlerDialog">
    <el-dialog :visible.sync="changeHandlerDialogVisible" title="工作委托" class="my-dialog" :show-close="false" @opened="dialogOpen" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="form" :rules="rules" label-position="right" ref="formTable" class="my-form">
        <el-row class="margint_10" :gutter="20">
            <el-form-item label="审批人" label-width="110px" prop="newHandler">
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
        <el-button type="primary" @click="cancelFn">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import urlConfig from '../http/urlConfig/index'
import associateUsermixin from '../components/mixins/associateUserMixin'

export default {
  name: 'changeHandlerDialog',
  props: {
    applymonth: {
      type: String,
      default: ''
    },
    apstage: {
      type: Number,
    },
    changeHandlerDialogVisible: {
      type: Boolean,
      default: false
    },

  },
  data() {
    return {
      handler: this.$store.state.Login.userInfo.workNum,
      form: {
        newHandler: '',
        newHandlerWorkNum: ''
      },
      rules: {
        newHandler: [{ required: true, message: '审批人必填', trigger: 'change'}],
      },
    }
  },
  mixins: [associateUsermixin],
  methods: {
    dialogOpen() {
      this.$refs.formTable.clearValidate()
    },
    selectUser(item) {
      this.form.newHandler = item.real_name + ' ' + item.empcode
      this.form.newHandlerWorkNum = item.empcode
    },
    associateChange() {
      this.form.newHandler = ''
    },
    cancelFn() {
      this.form.newHandler = ''
      this.form.newHandlerWorkNum = ''
      this.$emit('closeChangeHandler')
    },
    changeHandler() {
      let that = this
      this.$refs.formTable.validate((valid, obj) => {
        if(valid) {
          let params = new FormData()
          params.append('applymonth ', that.applymonth)
          params.append('apstage', that.apstage)
          params.append('handler', that.handler)
          params.append('newHandler', that.form.newHandlerWorkNum)

          that.$axios.post(urlConfig.settingMag.CHANGEHANDLER, params).then(res => {
            let data = res.data
            if(data.success) {
              that.cancelFn()
              that.$message({
                showClose: true,
                message: data.message,
                type: 'success'
              });
              that.$emit('refreshList')
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
  }

}
</script>
<style lang="scss" scoped>
  .changeHandlerDialog .el-autocomplete {
    width: 100%;
  }
 
</style>