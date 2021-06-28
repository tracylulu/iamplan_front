<template>
  <div>
    <div class="formBox">
      <h3 class="titleHeaderText">使用率总计<div class="tip" v-if="showTip"><i class="arrow"></i> 使用率信息为近两个月平均使用率<i class="el-icon-close" @click="showTip = false"></i></div></h3> 
      <el-table class="rate-table rate-table-top" :data="rateData" border :header-cell-style="headerCellStyleFn">
        <el-table-column label="申购部门" prop="deptName"></el-table-column>
        <el-table-column label="型号" prop="model"></el-table-column>
        <el-table-column label="部门数量" prop="number"></el-table-column>
        <el-table-column label="部门设备分布" prop="distribution" class="br-style" width="200px"></el-table-column>
        <el-table-column label="部门使用率" prop="rate"></el-table-column>
        <el-table-column label="部门使用率明细" prop="detail" class="br-style" width="210px"></el-table-column>
        <el-table-column label="研发总体使用率" prop="rdRate"></el-table-column>
        <el-table-column label="研发总体数量" prop="rdNumber"></el-table-column>
      </el-table>
      <h3 class="titleHeaderText">近两个月使用率信息</h3>
      <el-table class="rate-table" :data="detailData" border :header-cell-style="headerCellStyleFn">
        <el-table-column label="资产编号" prop="assertNumber" show-overflow-tooltip width="120"></el-table-column>
        <el-table-column label="部门" prop="deptName" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备大类" prop="assertClass" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备小类" prop="assetCategory" show-overflow-tooltip></el-table-column>
        <el-table-column label="地区" prop="area" show-overflow-tooltip width="74"></el-table-column>
        <el-table-column label="供应商" prop="provider" show-overflow-tooltip width="80"></el-table-column>
        <el-table-column label="功能速率" prop="runFunction" show-overflow-tooltip width="88"></el-table-column>
        <el-table-column label="端口数" prop="portNum" show-overflow-tooltip width="74"></el-table-column>
        <el-table-column label="挂账人姓名" prop="ownerName" show-overflow-tooltip width="105"></el-table-column>
        <el-table-column label="挂账人工号" prop="ownerCode" show-overflow-tooltip width="105"></el-table-column>
        <el-table-column label="描述" prop="assetDesc" show-overflow-tooltip></el-table-column>
        <el-table-column label="使用率" prop="usageRate" show-overflow-tooltip width="80"></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total,sizes,prev, pager, next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        prev-text="<上一页"
        next-text="下一页>"
        :page-sizes="[10, 20, 50]"
        :current-page="pageNum"
        :total="total"
        :page-size="pageSize">
      </el-pagination>
      <el-row class="btn-area">
        <el-button type="primary" @click="goBack">退出</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import urlConfig from '../../http/urlConfig';

export default {
  name: 'usageRate',
  props: {},
  data() {
    return {
      collectTime: '',
      deptCode: '',
      assetCategory: '',
      rateData: [],
      detailData: [],
      id: '',
      pageNum: 0,
      pageSize: 20,
      total: 0,
      showTip: true,
    }
  },

  mounted() {
    this.id = this.$route.query.id
    this.collectTime = this.$route.query.collectTime;
    this.deptCode = this.$route.query.deptCode;
    this.assetCategory = this.$route.query.assetCategory;
    this.getRate()
    this.getRateList()
  },

  methods: {
    headerCellStyleFn(param) {
      return 'background-color: #F1F3F9;'
    },
    sortFn(a, b) {
      let aVal = a.usageRate.replace(/%/, '')
      let bVal = b.usageRate.replace(/%/, '')
      aVal = Number(aVal) ? Number(aVal) : 0
      bVal = Number(bVal) ? Number(bVal) : 0
      return aVal - bVal
    },
    getRate() {
      let that = this;
      this.$axios.get(`${urlConfig.usageRateMag.GETRATE}?id=${that.id}&collectTime=${that.collectTime}&deptCode=${that.deptCode}&assetCategory=${that.assetCategory}`).then(res => {
      // this.$axios.get(`${urlConfig.usageRateMag.GETRATE}?id=17219&collectTime=2020-07-20 16:27:58&deptCode=50041351&assetCategory=SPT-N4U`).then(res => {
        let data = res.data
        if(data.success) {
          if(data.data) {
            data.data.number = data.data.number && data.data.number > 0 ? data.data.number + 'pcs' : ''
            data.data.rdNumber = data.data.rdNumber && data.data.rdNumber > 0 ? data.data.rdNumber + 'pcs' : ''
            data.data.detail = data.data.detail ? data.data.detail.replace(/;/g, '\n') : ''
            data.data.distribution = data.data.distribution ? data.data.distribution.replace(/;/g, '\n') : ''
            that.rateData.push(data.data);
          }
        } else {
          that.$message({
            message: data.message,
            type: 'warning'
          })
        }
      }, err => {})
    },

    getRateList() {
      let that = this
       this.$axios.post(urlConfig.usageRateMag.GETRATELIST, {
        // collectTime: '2020-07-20 16:27:58',
        // deptCode: '50041351',
        // assetCategory: 'SPT-N4U',
        collectTime: that.collectTime,
        deptCode: that.deptCode,
        assetCategory: that.assetCategory,
        pageNum: that.pageNum,
        pageSize: that.pageSize,
      }).then(res => {
        let data = res.data
        if(data.success) {
          that.detailData = data.data
          that.total = data.total
        } else {
          that.$message({
            message: data.message,
            type: 'warning'
          })
        }
      }, err => {

      })
    },
    //分页
    handleCurrentChange (val) {
      this.pageNum = val 
      this.getRateList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getRateList()
    },

    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
  .titleHeaderText {
    position: relative;
    .tip {
      position: absolute;
      top: -2px;
      left: 90px;
      padding: 0 8px 0 12px;
      height: 24px;
      line-height: 24px;
      font-size: 11px;
      color: #fff;
      border-radius: 4px;
      background-color: #FF9502;
      letter-spacing: 1px;
      .arrow {
        position: absolute;
        top: 8px;
        left: -4px;
        width: 0;
        height: 0;
        border: 4px solid #FF9502;
        border-top: 4px solid transparent;
        border-right: 4px solid transparent;
        transform: rotate(45deg);
      }
      .el-icon-close {
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
  .formBox {
    background: #fff;
    padding-top: 0;
    h3 {
      margin: 15px 0 10px;
    }
    table {
      width: 100%;
      border-color: #e1e1e1!important;
      tr {
        height: 30px;
        background-color: #ffffff!important;
        td {
          padding: 0 10px;
        }
        .btnTd {
          text-align: center;
        }
      }
    }
  }
  .rate-table{
    margin-top: 5px;
    background-color: #ffffff;
  }
   
  .btn-area {
    margin: 15px auto 0;
    text-align: center;
  }
</style>
<style scope>
  .rate-table-top /deep/ .cell {
    white-space: pre!important;
  }
  #app .rate-table-top .cell {
    white-space: pre!important;
  }
</style>