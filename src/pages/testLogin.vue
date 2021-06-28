<template>
  <div class="login mainContent">
    <div class="loginBox">
      <el-form :model="form" ref="form" label-width="100px" class="formLogin" @submit.native.prevent>
        <el-form-item label="域账号" prop="userCode" class="itemForm">
          <el-input v-model="form.userCode" @keyup.enter.native="login"></el-input>
        </el-form-item>
        <el-form-item class="loginBtnItem">
          <el-row>
            <el-col>
              <el-button class="loginBtn" type="primary" @click="login" :disabled="prRepeat">登录</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    name: "testLogin",
    data() {
      return {
        form: {
          userCode: ''
        },
        prRepeat:false,
      };
    },
    mounted() {

    },
    watch: {
    },
    computed: {
    },
    methods: {
      login() {
        let that = this
        if (that.form.userCode == '') {
          that.$message({
            type: 'warning',
            message: '请输入域账号'
          })
          return;
        }

        that.prRepeat = true
        that.$store.dispatch('testLogin', {
          'userCode': that.form.userCode
        }).then(function (res) {
          if (res.status == '0') {
            that.$store.commit('getToken', res.data.token)
            that.$store.commit('getLoginFlag', false)
            that.$store.commit('getTokenFlag', true)
            
            let _resUserInfo = {
              "domainAccount": res.data.domainAccount,
              "realName": res.data.name,
              "workNum": res.data.code
            }
            that.$store.commit('getUserInfo', _resUserInfo)
            that.getResMenuList()
            that.checkIsAdmin()
            that.$router.push({
              path: '/RDAssetPlanningManagement'
            })
          }
          else {
            that.$message({
              message: res.message,
              type: "warning"
            })
          }                  
        }, function (err) {
          that.$message({
            message: err.message,
            type: "warning"
          })
        })
      },
      //权限资源列表获取
      getResMenuList(){
        // let that = this
        // this.$store.dispatch('loginUserResourceGet', {}).then(function (res) {
        //   console.log(res)
        //   if (res.data[0].children != undefined) {
        //     that.$store.commit('getMainResArr', res[0].children)  
        //   }                
        // }, function (err) {
        //   console.log('err',err.message)
        // })
      },
      //验证是否为管理员
      checkIsAdmin(){
        let that = this
        this.$store.dispatch('checkIsAdmin', {}).then(function (res) {
          that.$store.commit('getIsAdmin', res.data);
        }, function (err) {
          console.log('err',err.message)
        })
      },
    }
  }

</script>
<style lang="scss" scoped>
  .login {
    .loginBox {
      width: 700px;
      height: 270px;
      border: 1px solid #ddd;
      box-shadow: 0 0 5px #ddd;
      border-radius: 5px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .formLogin {
        padding-top: 65px;

        .itemForm {
          width: 400px;
          margin-left: 135px;
        }
      }
    }
  }
  .loginBtnItem {
    margin-top: 50px;
    margin-left: 190px;
  }
</style>