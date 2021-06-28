<template>
  <div class="ssoLogin">

  </div>
</template>
<script>
  import {urlHttp} from '@/util/constant'
  import store from '../store/index'
  export default {
    name: "ssoLogin",
    data() {
      return {
        urlHttp: urlHttp,
      };
    },
    mounted() {
      if (store.state.Login.loginFlag == false) {
        //先到sso页面
        //this.getUserTokenHeaders()  // 微服务的地址
        this.ssoLogin()      
      } else {
        // console.log('后获取token')
        // console.log(store.state)
        this.getToken()
      }
    }, 
    methods: {
      ssoLogin() {
        let that = this
        this.$store.dispatch('ssoLogin', {
          'responseTicket': '',
          'url': that.urlHttp
        }).then(function (res) {
          // console.log(res)
          // console.log('url',res.data)
          store.commit('getLoginFlag', true)
          window.location.href = res.message       
        }, function () {
        })
      },
      //微服务 userToken
      getUserTokenHeaders() {
        let that = this
        let _data = {
          "account":"eos_roi",
          "password":"eos_roi"
        }
        this.$store.dispatch('userTokenHeader',_data).then(function (res) {
          that.$store.commit('getTokenHeader', res.data.token)
          that.ssoLogin()                   
          }, function () {
        })
      },
      getToken() {
        // console.log('获取token')
        let urlToken = window.location.search
        // console.log('urlToken',urlToken)
        var oGetVars = {};
        var resToken
        let that = this
        if (urlToken.length > 1) {
          for (var aItKey, nKeyId = 0, aCouples = urlToken.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
            aItKey = aCouples[nKeyId].split("=");
            oGetVars[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
          }
        }
        // console.log(oGetVars, 'ticket')
        if (oGetVars.ResponseTicket == '' || oGetVars.ResponseTicket == undefined) {
          // console.log('ticket为空')
          this.$store.commit('getToken', '')
          store.commit('getLoginFlag', false)
          store.commit('getTokenFlag', true) 
          window.location.reload()
        } else {
          // console.log('不是401')         
          //如果ssoPath 是ssoLogin 的话就跳到首页
          that.$store.commit('getToken', oGetVars.ResponseTicket)
          that.$store.commit('getResponseTicket', oGetVars.ResponseTicket)
          if (that.$store.state.Login.ssoPath == "" || that.$store.state.Login.ssoPath == undefined) {
            store.commit('getLoginFlag', false)
            store.commit('getTokenFlag', true) //直接输入sso地址 用到 
            that.getLoginInfo()                        
          } else {
            // console.log(that.$store.state.Login.ssoPath)
            if (that.$store.state.Login.token401 == true) {
              that.$store.commit('getToken401', false)                 
                store.commit('getLoginFlag', false)
                store.commit('getTokenFlag', true) //直接输入sso地址 用到
                that.$router.push({
                  path: that.$store.state.Login.ssoPath
                  
              })
            } else {
              that.$store.commit('getToken401', false)            
              store.commit('getLoginFlag', false)
              store.commit('getTokenFlag', true) //直接输入sso地址 用到                                              
              that.$router.push({
                path: that.$store.state.Login.ssoPath
              })
            }
          }
        }
      },
      getLoginInfo(){
        let that = this
        let domain = window.location.host
        let redirectUrl = window.localStorage.getItem('beforeLogoutUrl') ? window.localStorage.getItem('beforeLogoutUrl') : window.location.host
        that.$store.dispatch('ssoLogin', {
          'responseTicket': that.$store.state.Login.token,
          'url': that.urlHttp
        }).then(function (res) {
          if (res.status == '0') {
            that.$store.commit('getToken', res.data.token)
            // that.getUserInfo()
            let _resUserInfo = {
              "domainAccount": res.data.domainAccount,
              "realName": res.data.name,
              "workNum": res.data.code
            }
            that.$store.commit('getUserInfo', _resUserInfo)
            that.getResMenuList()
            that.checkIsAdmin()
            if(redirectUrl.indexOf('/assetPlanToDoList') >= 0
            || redirectUrl.indexOf('/assetPlanDept1Review') >= 0
            || redirectUrl.indexOf('/assetPlanDept2Review') >= 0
            || redirectUrl.indexOf('/expertGroupReview') >= 0
            || redirectUrl.indexOf('/plannerReview') >= 0
            || redirectUrl.indexOf('/assetPlanApprovalQuery') >= 0
            || redirectUrl.indexOf('/assetApplyIndex') >= 0
            || redirectUrl.indexOf('/assetPlanReview') >= 0
            || redirectUrl.indexOf('/settingIndex') >= 0
            || redirectUrl.indexOf('/assetPlanDept3Review') >= 0) {
              that.$router.push({
                path: redirectUrl
              })
            } else {
              that.$router.push({
                path: '/RDAssetPlanningManagement'
              })
            }
          } else {
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
      // getUserInfo() {
      //   let that = this
      //   that.$store.dispatch('loginUserInfoGet', {}).then(function (res) {
      //     let _resUserInfo = {
      //       "domainAccount": res.domainAccount,
      //       "realName": res.realName
      //     }
      //     that.$store.commit('getUserInfo', _resUserInfo)                 
      //   }, function (err) {
      //     console.log('err',err.message)
      //   })
      // },
      //权限资源列表获取
      getResMenuList(){
        // let that = this
        // this.$store.dispatch('loginUserResourceGet', {}).then(function (res) {
        //   console.log(res)
        //   if (res[0].children != undefined) {
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
</style>