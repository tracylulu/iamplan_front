import { mapState } from 'vuex'
import urlConfig from '../../http/urlConfig'
export default {
  data() {
    return {
      associateList: [],// 人员联想结果
      CB: null,// 保存申购人id输入框的回调函数
      user: ''
    }
  },
  mounted() {
    
  },
  computed: mapState({
    associatedToken: (state) => {
      return state.assetApplyDetail.associatedToken
    }
  }),
  watch: {
    associatedToken() {
      if(this.CB) {
        this.associateFn(this.user, this.CB)
      }
    },
  },
  methods: {
    getToken() {
      let that = this
      this.$store.dispatch('getAssociatedToken').then(res => {
        if(res.flag) {
          that.$store.commit('getAssociatedToken', res.data.token)
        }
      }, err => { });
    },
    associateFn(queryString, cb) {
      this.CB = cb;
      this.getAssociatedUser(queryString, data => {
        if(data) {
          data.forEach(item => {
            item.value = item.real_name + '/' + item.empcode + ' | ' + item.deptname
          })
          cb(data);
        }
      })
    },
    
    associateRegularEmployee(queryString, cb) {
      this.CB = cb;
      this.getRegularEmployee(queryString, data => {
        if(data) {
          data.forEach(item => {
            item.value = item.real_name + '/' + item.empcode + ' | ' + item.deptname
          })
          cb(data);
        }
      })
    },

    getAssociatedUser(query, fun) {// 根据输入的内容获取结果
      let that = this
      that.$store.dispatch('getAssociatedUser', {
        param: query
      }).then(res => {
        if(res.flag) {
          that.associateList = res.data;
        }
        fun(res.data);
      }, err => { })
    },

    // 全部正式员工
    getRegularEmployee(query, fun) {// 根据输入的内容获取结果
      let that = this
      that.$axios.get(`${urlConfig.associatedUserMag.GETREGULAREMPLOYEE}?param=${query}`).then(res => {
        if(res.data.flag) {
          that.associateList = res.data.data;
        }
        fun(res.data.data);
      }, err => { })
    },
  }
}