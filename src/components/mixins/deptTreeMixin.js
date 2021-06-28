import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import urlConfig from '../../http/urlConfig/index'
export default {
  data() {
    return {
      deptArr: [],
    }
  },
  components: {
    Treeselect
  },
  mounted() {

  },
  methods: {
    // 获取申请部门树
    getDeptTree() {
      let that = this
      that.$axios.get(urlConfig.settingMag.DEPTINFOTREEGET).then(function (res) {
        that.deptArr = res.data.data;
      }, err => {

      })
    },
    normalizer(node){
      //去掉children=null的children属性
      if(node.children == null){
        delete node.children;
      }
      return {
        id: node.deptCode,
        label: node.deptName,
        children: node.children
      }
    },
  }
}