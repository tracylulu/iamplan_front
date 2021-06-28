<template>
  <div class="modal">
    <el-dialog title="评审意见" :visible.sync="dialogFormVisible" width="50%" class="dialog-p-top">
      <el-form :model="dblclickItem" label-position="right" label-width="21%" :rules="rules" ref="ruleForm">
        <el-form-item label="厂家" prop="assetmanufacturer" class="form-item" v-if="assetStage == 2">
          <el-autocomplete
            v-model="dblclickItem.assetmanufacturer"
            :fetch-suggestions="assetManuFacturerQuerySearch"
            :trigger-on-focus="true"
            :hide-loading="false"
            :debounce="300"
            @select="assetManuFacturerSelect"
            @change="assetManuFacturerChange">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="型号" prop="assetmodel" class="form-item" v-if="assetStage == 2">
          <el-autocomplete
            v-model="dblclickItem.assetmodel"
            :fetch-suggestions="assetModelQuerySearch"
            :trigger-on-focus="true"
            :hide-loading="false">
          </el-autocomplete>

        </el-form-item>
        <el-form-item label="预计单价" prop="pprice" class="form-item" v-if="assetStage == 2">
          <el-input type="number" v-model="dblclickItem.pprice" autocomplete="off" @blur="priceAndRequiredsBlur"></el-input>
        </el-form-item>

        <el-form-item label="同意申购数量" prop="requiredsaudit" class="form-item">
          <el-input type="number" v-model="dblclickItem.requiredsaudit" autocomplete="off" @blur="priceAndRequiredsBlur" ></el-input>
        </el-form-item>

        <el-form-item label="类别" prop="assetcategory" class="form-item" v-if="assetStage == 2">
          <el-select v-model="dblclickItem.assetcategory" default-first-option>
            <el-option v-for="item in assetCategoryAndGoodstimeList" :key="item.id" :label="item.assetcategory" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="预算类型" prop="expensetype" class="form-item" v-if="assetStage == 2">
          <el-select v-model="dblclickItem.expensetype" default-first-option>
            <el-option label="费用类" value="1"></el-option>
            <el-option label="资产类" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核意见" class="form-item">
          <el-input v-model="dblclickItem.reviewnote" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规范审核状态" class="form-item" v-if="assetStage == 2">
          <el-select v-model="dblclickItem.reviewresult" >
            <el-option label="规范" value="1"></el-option>
            <el-option label="不规范" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'modal',
  props: {
    dblclickItem: {
      type: Object,
      // default: {}
    },
    rules: {
      type: Object,
      default: {}
    },
    assetStage: {
      type: String,
      default: '2'
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      assetCategoryAndGoodstimeList: [],
      assetMaunFacturerList: [],
      assetModelList: [],
    }
  },

  watch: {
    'dblclickItem.assetcategory': {
      handler: function () {
        let that = this;
        that.assetCategoryAndGoodstimeList.forEach(item => {
          if(that.dblclickItem.assetcategory == item.assetcategory) {
            that.dblclickItem.goodstime = item.goodstime
          }
        })
      },
      deep: true
    },

  },

  mounted() {
    if(this.assetStage == 2) {
      this.getAssetCategoryAndGoodstime();
    } 
  },

  methods: {
    // 厂家 start
    getAssetManuFacturerList(query, fun) {// 获取厂家型号信息
      let that = this
      this.$store.dispatch('getAssetManufacturerList', {name: query}).then(function (res) {
        res.data.forEach(item => {
          item.value = item.assetmanufacturer;
        })
        that.assetMaunFacturerList = res.data;
        if(fun) {
          fun(res.data)
        }
      }, function () {

      })
    },
    assetManuFacturerQuerySearch(queryString, cb) {
      this.getAssetManuFacturerList(queryString, (data) => {
        let results = [];
        results = this.assetMaunFacturerList;
        results.forEach((item, index) => {
          item.value = item.assetmanufacturer;
        })
        cb(results);
      });
    },
    
    assetManuFacturerSelect() {// 选择厂家
      let that = this;
      let assetMaunFacturer = this.dblclickItem.assetmanufacturer;
      this.assetModelList = []
      this.assetMaunFacturerList.forEach(item => {
        if(item.assetmanufacturer == assetMaunFacturer) {
          item.assetmodel.forEach(model => {
            let obj = {};
            obj.value = model;
            that.assetModelList.push(obj);
          })
        }
      })
    },

    assetManuFacturerChange() {// 厂家输入事件
      let that = this;
      let assetMaunFacturer = this.dblclickItem.assetmanufacturer;
      let flag = false
      let assetModelList = [];
      this.assetMaunFacturerList.forEach(item => {
        if(item.assetmanufacturer.toLowerCase() == (assetMaunFacturer.toLowerCase())) {
          item.assetmodel.forEach(model => {
            let obj = {};
            obj.value = model;
            assetModelList.push(obj);
          })
          that.assetModelList = assetModelList;
          flag = true
        }
      })
      if(!flag) {
        this.assetModelList = []
      }
    },

    manuFacturerFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    assetModelQuerySearch(queryString, cb) {
      let data = this.assetModelList;
      let results = [];
      results = queryString ? data.filter(this.manuFacturerFilter(queryString)) : this.assetModelList;
      cb(results);
    },
    // 厂家 end
    // 物品类别和相应的货期
    getAssetCategoryAndGoodstime() {
      let that = this;
      this.$store.dispatch('getAssetCategoryAndGoodstime').then(res => {
        that.assetCategoryAndGoodstimeList = res.data;
      }, err => {

      })
    },

    // 预计单价和数量输入框只能输入数字处理
    numberHandleClick(inputType){
      let key;
      if(inputType == 'price') {
        key = 'pprice'
      } else {
        key = 'requireds'
      }
      this.dblclickItem[key] = this.dblclickItem[key].replace(/[^\d.]/g, '');
      if(this.dblclickItem[key] > 0 || this.dblclickItem[key]) {
        this.dblclickItem[key] = parseInt(this.dblclickItem[key]);
      } else if(this.dblclickItem[key] === 0 && key == 'requireds'){//申购数量可以输入零
        this.dblclickItem[key] = 0;
      } 
      if (this.dblclickItem[key] == '0' && key == 'pprice'){
        this.dblclickItem[key] = '';
      }
    },

    priceAndRequiredsBlur() {
      this.dblclickItem.pprice = this.dblclickItem.pprice ? (Math.floor(Math.abs(this.dblclickItem.pprice) * 100) /100).toFixed(2) : '';
      if(this.dblclickItem.requiredsaudit && (typeof this.dblclickItem.requiredsaudit == 'number' || typeof this.dblclickItem.requiredsaudit == 'string')) {
        this.dblclickItem.requiredsaudit = Math.floor(Math.abs(this.dblclickItem.requiredsaudit));
      }
    },

    submit () {                                                  
      let that = this;   
      if((that.dblclickItem.pprice * that.dblclickItem.requiredsaudit >= 10000 || that.dblclickItem.pprice >= 5000) && that.dblclickItem.isreqpurchasereport == 0 && that.dblclickItem.isspecifymanufacturer == 0) {
        this.$refs['ruleForm'].validate((valid, obj) => {
          if (valid) {
            this.$alert('申购单价≥5000或申购总价≥10000，需填写申购报告', '提示', {
              confirmButtonText: '确定',
              callback: action => { }
            });
            that.dblclickItem.isComplete = 0
            that.$parent.updateReviewInfo(that.dblclickItem);
          } else {
            console.log('validate false')
            return false
          }
        })
      } else {
        this.$refs['ruleForm'].validate((valid, obj) => {
          if (valid) {
            that.dblclickItem.isComplete = 1
            that.$parent.updateReviewInfo(that.dblclickItem);
          } else {
            return false
          }
        })
      }
     
    },
  }
}
</script>

<style scoped>
  .dialog-p-top /deep/ .el-dialog__body {
    padding-top: 0;
  }

  .form-item {
    margin-top: 20px;
  }
</style>