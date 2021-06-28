import { get, post } from '../../http/index'  //引入异步方法
import urlConfig from '../../http/urlConfig/index'  //引入接口地址

const Login = {
    state: {
        token: '',
        tokenHrss: '',
        ssoPath: '',
        tokenFlag: false,
        loginFlag: false,
        userInfo: '',
        mainResArr: [],
        token401: false,
        lf: '',
        isAdmin: false,//是否为管理员角色
        responseTicket: '',
    },
    getters: {
    },
    mutations: {
        getResponseTicket: (state, data) => {
            state.responseTicket = data
        },
        getToken: (state, data) => {
            //  if(data == ''){
            state.token = data
            //  }else{
            //       state.token = 'Bearer'+' '+data
            //  }
        },
        //获取hrss token值
        getHrssToken: (state, data) => {
            // if(data == ''){
            state.tokenHrss = data
            // }else{
            //     state.tokenHrss = 'Bearer'+' '+data
            // }

        },

        //用于401过期标志
        getToken401: (state, data) => {
            state.token401 == data
        },
        //用于402标志
        getLf: (state, data) => {
            state.lf = data
        },
        getSsoPath: (state, data) => {
            state.ssoPath = data
        },
        getTokenFlag: (state, data) => {
            state.tokenFlag = data
        },
        getLoginFlag: (state, data) => {
            state.loginFlag = data
        },
        getUserInfo: (state, data) => {
            state.userInfo = data
        },
        getMainResArr: (state, data) => {
            state.mainResArr = data
        },
        delToken: (state, data) => {
            state.token = ''
        },
        getIsAdmin: (state, data) => {
            state.isAdmin = data
        }
    },
    //异步方法
    actions: {
        //测试登录
        testLogin({ commit, state }, data) {
            return new Promise((resolve, reject) => {
                get({
                    url: urlConfig.testLogin,
                    data: data
                }, function (res) {
                    resolve(res)
                }, function (err, message) {
                    reject(err)
                })
            })
        },
        //单点登录
        ssoLogin({ commit, state }, data) {
            return new Promise((resolve, reject) => {
                post({
                    url: urlConfig.ssoLogin.SSOLOGIN,
                    data: data
                }, function (res) {
                    resolve(res)
                }, function (err, message) {
                    reject(err)
                })
            })
        },
        //单点注销登录
        ssoLoginOut({ commit, state }, data) {
            return new Promise((resolve, reject) => {
                post({
                    url: urlConfig.ssoLogin.SSOLOGINOUT,
                    data: data
                }, function (res) {
                    resolve(res)
                }, function (err, message) {
                    reject(err)
                })
            })
        },
        //获取登录人信息和权限资源树
        // loginUserInfoGet({commit,state},data){
        //     return new Promise((resolve, reject) => {
        //       post({
        //         url: urlConfig.ssoLogin.LOGINUSERINFO,
        //         data: data,
        //         headers: {
        //           Authorization: this.state.Login.token
        //         }
        //       }, function (res) {
        //         resolve(res)
        //       }, function (err) {
        //         reject(err)
        //       })
        //     })
        // },
        loginUserResourceGet({ commit, state }, data) {
            return new Promise((resolve, reject) => {
                post({
                    url: urlConfig.ssoLogin.LOGINUSERRESOURCEGET,
                    data: data,
                    headers: {
                        Authorization: this.state.Login.token
                    }
                }, function (res) {
                    resolve(res)
                }, function (err) {
                    reject(err)
                })
            })
        },

        // 验证是否为管理员
        checkIsAdmin({ commit, state }, data) {
            return new Promise((resolve, reject) => {
                get({
                    url: urlConfig.roleMag.CHECKISADMIN,
                    data: data,
                    headers: {
                        Authorization: this.state.Login.token
                    }
                }, function (res) {
                    resolve(res)
                }, function (err) {
                    reject(err)
                })
            })
        },
    }
}

export default Login