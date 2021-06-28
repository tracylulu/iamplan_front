<template>
  <div class="index-html">
    <el-container>
      <el-header class="index-header">
        <el-row class="title-container navContent">
          <el-col class="title-left navLogo" :span='9'>
            <span class="logoFlag">
              <router-link class="logoLink" to="/RDAssetPlanningManagement">
                <img class="logoImg" src="../assets/img/logo.png" />
                <strong class="logoTxt">研发资源计划管理平台</strong>
              </router-link>
            </span>
          </el-col>
          <el-col class="title-left title-middle" :span='6'>
            <div class="remind-block" v-if="browserTip">
              <div class="marquee-block">
                <div class="marquee">为了更好的兼容效果，建议使用chrome浏览器&nbsp;&nbsp;&nbsp;</div>
                <div class="marqueeT">为了更好的兼容效果，建议使用chrome浏览器&nbsp;&nbsp;&nbsp;</div>
              </div>
            </div>
          </el-col>
          <el-col class="title-right" :span='9'>
            <div class="userInfo">
              <span>{{ userInfo.realName }}&nbsp;{{ userInfo.domainAccount }}</span>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;<span class="loginOutSpan" @click="loginOut">注销</span>
              <!-- &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;<span class="loginOutSpan" @click="helpMe">帮助</span> -->
            </div>
          </el-col>
        </el-row>
      </el-header>
      <keep-alive :include="includeList">
        <router-view></router-view>
      </keep-alive>
    </el-container>
  </div>

</template>
<script>
  import {urlHttp} from '@/util/constant'
  import urlConfig from '../http/urlConfig'
  export default {
    name: "app-container",
    data() {
      return {
        activeIndex: '/',
        showHeader: true,
        mainResArr: [],
        urlHttp: urlHttp,
        includeList: this.$store.state.KeepAliveMag.includeList, 
        browserTip: true
      }
    },
    created() {
      //主模块路由样式
      this.init()
      if(this.$store.state.Login.token == '') {
        this.$router.push({
          path: "/ssoLogin"
        })
      }
      else {
        //获取用户权限资源
        // this.getUserResources()
      }
    },
    mounted() {

    },
    watch:{
      '$route':function(){
        let that = this;
        if(that.$route.name == 'RDAssetPlanningManagement' || !that.$route.name){
          that.browserTip = true
        }else{
          that.browserTip = false
        }
      }
    },
    computed: {
      userInfo(){
        return this.$store.state.Login.userInfo
      },
      zMenuList(){
        return this.$store.state.Login.mainResArr
      }
    },
    methods: {
      init() {
        let that = this;
        if(that.$route.name == 'RDAssetPlanningManagement' || !that.$route.name){
          that.browserTip = true
        }else{
          that.browserTip = false
        }
        console.log(this.$route.path)
      },
      getUserResources () {
        let that = this
        that.$store.dispatch('userResourceGet', {}).then(function (res) {
          console.log(res)
          if (res[0].children != undefined) {
            that.mainResArr = res[0].children
            console.log(that.mainResArr)
            that.mainResArr.forEach(item => {
              if (item.hresName == '基础数据管理' && item.children != undefined) {
                that.$store.state.RDAssetPlanningManagement.moduleResArr = item.children
                that.$store.state.RDAssetPlanningManagement.moduleResArr.forEach(m => {
                  if (m.hresName == '厂商信息' && m.children != undefined) {
                    that.$store.state.RDAssetPlanningManagement.manufacturerResArr = m.children
                  }
                  if (m.hresName == '秘钥管理' && m.children != undefined) {
                    that.$store.state.RDAssetPlanningManagement.secretkeyResArr = m.children
                  }
                  if (m.hresName == 'bom与秘钥配置' && m.children != undefined) {
                    that.$store.state.RDAssetPlanningManagement.bomSecretkeyConfigResArr = m.children
                  }
                  if (m.hresName == '签名账号' && m.children != undefined) {
                    that.$store.state.RDAssetPlanningManagement.signatureAccountResArr = m.children
                  }
                  if (m.hresName == '配置信息' && m.children != undefined) {
                    that.$store.state.RDAssetPlanningManagement.configInfoResArr = m.children
                  }
                })
              }
              if (item.hresName == '业务数据管理' && item.children != undefined) {
                that.$store.state.businessData.moduleResArr = item.children
                that.$store.state.businessData.moduleResArr.forEach(m => {
                  if (m.hresName == '签名信息' && m.children != undefined) {
                    that.$store.state.businessData.signatureInfoResArr = m.children
                  }
                  if (m.hresName == '离线签名' && m.children != undefined) {
                    that.$store.state.businessData.offLineSignResArr = m.children
                  }
                  if (m.hresName == '异常信息' && m.children != undefined) {
                    that.$store.state.businessData.errorMessageResArr = m.children
                  }
                })
              }
              if (item.hresName == '用户授权管理' && item.children != undefined) {
                that.$store.state.userPermission.moduleResArr = item.children
                that.$store.state.userPermission.moduleResArr.forEach(m => {
                  if (m.hresName == '用户管理' && m.children != undefined) {
                    that.$store.state.userPermission.userResArr = m.children
                  }
                  if (m.hresName == '角色管理' && m.children != undefined) {
                    that.$store.state.userPermission.roleResArr = m.children
                  }
                  if (m.hresName == '资源管理' && m.children != undefined) {
                    that.$store.state.userPermission.resourceResArr = m.children
                  }
                })
              }
            })
          }
        }, function (err) {
          that.$message({
            message: err.msg,
            type: "warning"
          })
        })
      },
      //用户注销
      loginOut() {
        let that = this
        that.$store.dispatch('ssoLoginOut', {'url': that.urlHttp}).then(function (res) {
          console.log(res, '注销返回的地址')
          window.localStorage.setItem('beforeLogoutUrl', '')
          that.$store.commit('getToken', '')
          that.$store.commit('getToken401', false)
          that.$store.commit('getSsoPath', '');

          that.$store.commit('getTokenFlag', false)
          that.$store.commit('getLoginFlag', false)
          that.$store.commit('getUserInfo', '')
          that.$store.commit('getHrssToken', '')
          window.location.href = res.message       
        }, function () {
        })
      },
      helpMe() {
        this.$axios.post(urlConfig.HELPURL + '?fileUrl=OperateGuide.docx').then(res => {
        }, err => {

        })
      },
    }
  }

</script>

<style lang='scss' scoped>
  .navLogo {
    min-width: 415px;

    .logoFlag {
      height: 100%;

      a {
        height: 100%;

        &::after {
          width: 0;
          height: 100%;
          display: inline-block;
          vertical-align: middle;
          content: '';
          overflow: hidden;
        }

        img {
          display: inline-block;
          width: 68px;
        }

        .logoTxt {
          font-size: 22px;
          margin-left: 15px;
          color: #333;
          vertical-align: middle;
        }
      }
    }
  }

  .title-right {
    float: right;
    min-width: 240px;
  }

  .logoImg {
    vertical-align: middle;
    border: none;
  }

  .index-html {
    height: 100%;
    // overflow: hidden;
  }

  .index-html .el-header {
    background-color: #FFF;
    border-bottom: 1px solid #E6E6E6;
  }

  .userInfo {
    height: 60px;
    line-height: 60px;
    text-align: right;
    color: #464646;

    .loginOutSpan {
      cursor: pointer;
    }
  }

  .el-menu-demo .el-menu.el-menu--horizontal {
    border-bottom: none;
  }

  .scroll_text {
    height: 30px;
    background: #FFF;
  }

  .main_text_wrapper {
    width: 600px;
    margin: 0 auto;
    overflow: hidden;
    height: 100%;
    white-space: nowrap;
  }

  .scroll_text .scroll_item {
    height: 100%;
    overflow: hidden;

    .text_item,
    .text_itemB {
      height: 30px;
      line-height: 30px;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .positive {
    position: relative;
    height: 60px;

    .navItem {
      position: absolute;
      left: 33%;
      transform: translateX(-33%);
    }
  }

  .index-html .navItem .nav_only {
    margin-right: 0;
  }

  .nav-left-content {
    position: fixed;
    left: 0;
    top: 60px;
    width: 200px;
    height: 100%;
  }

  .el-container {
    height: 100%;
    .el-aside {
      display: block;
      position: relative;
      overflow-y: hidden;
      border-top: 1px solid #f5f5f5;
      background-color: #ffffff !important;
    }
  }
  .remind-block {
    height: 60px;
    line-height: 60px;
    // background-color: #fce9aa;
    color: #333;
    position: relative;
    overflow: hidden;
    text-align: center;
    width: 100%;
    padding-right: 20px;
    z-index: 100;
  }

  .marquee-block{
    display: inline-block;
    width:100%;
    height: 100%;
    vertical-align: middle;
    overflow: hidden;
    box-sizing: border-box;
    padding-left: 15px;
    position: relative;
  }

  .marquee {
    animation: marquee 12s linear infinite;
    white-space: nowrap;
    position: absolute;
  }

  .marqueeT {
    animation: marqueeT 12s linear infinite;
    white-space: nowrap;
    position: absolute;
  }

  @keyframes marquee {
    0% { left: 0; }
    100% { left: -110%;}
  }

  @keyframes marqueeT {
    0% { left: 110%; }
    100% { left: 0; }
  }

</style>
<style>
  #app {
    width: 100%;
    height: 100%;
  }
  .navContent .navItem .el-menu-item {
    height: 32px !important;
    line-height: 32px !important;
    margin-top: 12px;
    padding: 0 20px !important;
  }

  .index-html .title-middle li:first-child, .index-html .title-middle li:nth-child(2) {
    margin-right: 10px;
  }

</style>