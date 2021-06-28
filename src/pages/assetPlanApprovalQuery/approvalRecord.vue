<template>
  <div class="approvalRecord">
    <el-row class="title">
      <el-col :span="24">
        <div class="navBar">
          <div class="navItem navItemHome"><router-link to="/RDAssetPlanningManagement">首页</router-link></div>
          <div class="navItem navItemSplit" v-if="entryType == '' && assetStage == ''">&gt;</div>
          <div class="navItem navItemCol" @click="closeFn" v-if="entryType == '' && assetStage == ''">资产计划审批查询</div>
          <div class="navItem navItemSplit" v-if="assetStage < 8 && assetStage >= 3">&gt;</div>
          <div class="navItem navItemCol" @click="goBackToDoList" v-if="assetStage < 8 && assetStage >= 3">我的待办</div>
          <div class="navItem navItemSplit" v-if="assetStage == 3">&gt;</div>
          <div class="navItem navItemCol" @click="closeFn" v-if="assetStage == 3">三级部门主管审核</div>
          <div class="navItem navItemSplit" v-if="assetStage == 4">&gt;</div>
          <div class="navItem navItemCol" @click="closeFn" v-if="assetStage == 4">二级部门主管审核</div>
          <div class="navItem navItemSplit" v-if="assetStage == 5">&gt;</div>
          <div class="navItem navItemCol" @click="closeFn" v-if="assetStage == 5">计划员审核</div>
          <div class="navItem navItemSplit" v-if="assetStage == 6">&gt;</div>
          <div class="navItem navItemCol" @click="closeFn" v-if="assetStage == 6">专家团审核</div>
          <div class="navItem navItemSplit" v-if="assetStage == 7">&gt;</div>
          <div class="navItem navItemCol" @click="closeFn" v-if="assetStage == 7">一级部门主管审核</div>
          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemCol">资产计划审批记录</div>
        </div>
      </el-col>
    </el-row>
    <div class="formBox" ref="pdf">
      <el-row type="flex" justify="space-between">
        <h3 class="titleHeaderText">资产计划审批电子流</h3>
        <div class="title-item no-print-title">
          <span><i>当前状态：</i> {{recordHead.apstatusdetail}}</span>
          <span><i>填报人：</i>{{recordHead.applyuser}}</span>
          <span><i>电子流编号：</i>{{recordHead.PlanCode}}</span>
          <span><i>申请时间：</i>{{recordHead.applytime}}</span>
        </div>
      </el-row>
      <el-row type="flex" justify="start" class="print-title">
        <div class="title-item">
          <span style="margin-left: 0;"><i>当前状态：</i> {{recordHead.apstatusdetail}}</span>
          <span><i>填报人：</i>{{recordHead.applyuser}}</span>
          <span><i>电子流编号：</i>{{recordHead.PlanCode}}</span>
          <span><i>申请时间：</i>{{recordHead.applytime}}</span>
        </div>
      </el-row>

      <el-collapse v-model="activeName" class="collapse-container">
        <el-collapse-item title="申请表单" :name="1">
          <table border="1" cellspacing="0" v-if="assetPlanInfo.lst != undefined">
            <tr>
              <td class="labelTd">厂家</td>
              <td colspan="7">{{assetPlanInfo.lst[0].assetmanufacturer}}</td>
            </tr>
            <tr v-for="(item, index) in assetPlanInfo.lst" :key="index">
              <td class="labelTd">物品名称</td>
              <td>{{item.assetname}}</td>
              <td class="labelTd">型号</td>
              <td>{{item.assetmodel}}</td>
              <td class="labelTd">预计单价</td>
              <td>{{item.pprice}}</td>
              <td class="labelTd">数量</td>
              <td>{{item.requireds}}</td>
            </tr>
            <tr>
              <td class="labelTd">申购人姓名/工号</td>
              <td>{{assetPlanInfo.lst[0].requireduser}}</td>
              <td class="labelTd">一级部门</td>
              <td>{{assetPlanInfo.lst[0].dept1name}}</td>
              <td class="labelTd">二级部门</td>
              <td>{{assetPlanInfo.lst[0].dept2name}}</td>
              <td class="labelTd">三级部门</td>
              <td>{{assetPlanInfo.lst[0].dept3name}}</td>
            </tr>
            <tr>
              <td class="labelTd">项目编码</td>
              <td>{{assetPlanInfo.lst[0].itemcode}}</td>
              <td class="labelTd">项目名称</td>
              <td>{{assetPlanInfo.lst[0].itemname}}</td>
              <td class="labelTd">物品类别</td>
              <td>{{assetPlanInfo.lst[0].assetcategory}}</td>
              <td class="labelTd">计划员ID</td>
              <td>{{assetPlanInfo.lst[0].reviewername}}</td>
            </tr>
            <tr>
              <td class="labelTd">货期</td>
              <td>{{assetPlanInfo.lst[0].goodstime}}</td>
              <td class="labelTd">到货地点</td>
              <td>{{assetPlanInfo.lst[0].receiverplace}}</td>
              <td class="labelTd">用途</td>
              <td>{{assetPlanInfo.lst[0].purpose}}</td>
              <td class="labelTd">要求到货时间</td>
              <td>{{assetPlanInfo.lst[0].reqarrivaldate ? assetPlanInfo.lst[0].reqarrivaldate.slice(0, 10) : ''}}</td>
            </tr>
            <tr>
              <td class="labelTd">备注</td>
              <td colspan="7" style="word-break: break-word;">{{assetPlanInfo.lst[0].assetnote}}</td>
            </tr>
            <tr v-if="assetPlanInfo.lst[0].isreqpurchasereport == '1'">
              <td colspan="8">
                <el-collapse accordion class="report-collapse" v-model="reportActiveName">
                  <el-collapse-item :name="1">
                    <template slot="title">
                      <div class="report-collapse-header">申购报告</div>
                      <span class="open-detail-text">展开详情</span>
                    </template>
                    <el-row v-for="(item, index) in assetPlanInfo.purchaseReportInfo" :key="index" class="report-item-info info-border">
                      <span class="fontWeight_900">{{ item.name }}</span><span v-if="item.name.indexOf('：') >= 0"></span><span v-else class="fontWeight_900">：</span><br/><span class="pre-enter">{{ item.info }}</span>
                      <el-upload
                        class="hide no-print-img"
                        :action="'www'"
                        list-type="picture-card"
                        name="files"
                        :data="{ titlecode: item.titlecode }"
                        :on-preview="handlePictureCardPreview"
                        :limit="2"
                        :file-list="item.fileList"
                        :multiple="false"
                        :disabled="true"
                        v-if=" (item.titlecode == 'progress' || item.titlecode == 'contrast' || item.titlecode == 'detailedList'|| item.titlecode == 'performance'|| item.titlecode == 'function')"
                        >
                        <i class="el-icon-plus"></i>
                      </el-upload>
                      <br v-if="printFlag" />
                      <img class="print-img" :src="img.url" :width="img.width" :height="img.height" v-for="(img, imgIndex) in item.fileList" :key="imgIndex">
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
              </td>
            </tr>
            <tr v-if="assetPlanInfo.lst[0].isspecifymanufacturer == '1'">
              <td colspan="8">
                <el-collapse accordion class="report-collapse" v-model="reportActiveName">
                  <el-collapse-item :name="1">
                    <template slot="title">
                      <div class="report-collapse-header">指定供应商申购报告</div>
                      <span class="open-detail-text">展开详情</span>
                    </template>
                    <el-row class="report-item-info isspecify-border">
                      <el-radio-group v-model="assetPlanInfo.lst[0].manufacturertypeenum" disabled>
                        <el-radio :label="2" class="fontWeight_900">申购部门指定供应商</el-radio>
                        <el-radio :label="1" class="fontWeight_900">事实上独家供应</el-radio>
                      </el-radio-group> 
                    </el-row>
                    <el-row v-for="(item, index) in assetPlanInfo.specifyManufacturerInfo" :key="index" class="report-item-info isspecify-border">
                      <span class="fontWeight_900">{{ item.name }}</span><span v-if="item.name.indexOf('：') >= 0"></span><span class="fontWeight_900" v-else>：</span><br/><span class="pre-enter">{{ item.info }}</span>
                      <el-upload
                        class="hide no-print-img"
                        :action="'www'"
                        list-type="picture-card"
                        name="files"
                        :data="{ titlecode: item.titlecode }"
                        :on-preview="handlePictureCardPreview"
                        :limit="2"
                        :file-list="item.fileList"
                        :multiple="false"
                        :disabled="true"
                        v-if="item.titlecode == 'detailedList' || item.titlecode == 'alternatives' || item.titlecode == 'reason'"
                        >
                        <i class="el-icon-plus"></i>
                      </el-upload>
                      <br v-if="printFlag"/>
                      <img class="print-img" :src="img.url" :width="img.width" :height="img.height" v-for="(img, imgIndex) in item.fileList" :key="imgIndex">
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
              </td>
            </tr>
          </table>
        </el-collapse-item>
        <el-collapse-item :title="item.apstage == '2' ? ('规范审核（' + item.reviewer + '）') : item.apstage == '3' ? ('三级部门主管审核（' + item.dept3manager + '）') : item.apstage == '4' ? ('二级部门主管审核（' + item.dept2manager + '）') : item.apstage == '5' ? ('计划员审核（' + item.planner + '）') : item.apstage == '6' ? ('专家团审核（' + item.oqdeptreviewer + '）') : ('一级部门主管审核（' + item.dept1reviewer + '）')" v-for="(item, index) in tableData" :key="index" :name="index+2">
          <table border="1" cellspacing="0" v-if="item.apstage == '2'">
            <tr>
              <td class="labelTd">同意申购数量</td>
              <td colspan="3">{{item.reviewercount}}</td>
            </tr>
            <tr>
              <td class="labelTd">审批意见</td>
              <td colspan="3">{{item.reviewnote}}</td>
            </tr>
            <tr>
              <td class="labelTd">审批人</td>
              <td>{{item.reviewer}}</td>
              <td class="labelTd">审批时间</td>
              <td>{{item.reviewtime}}</td>
            </tr>
          </table>
          <!-- 三级主管审核信息 -->
          <table border="1" cellspacing="0" v-if="item.apstage == '3'">
            <tr>
              <td class="labelTd">同意申购数量</td>
              <td colspan="3" v-if="entryType == 'detailClick' && assetStage == 3">
                <el-input 
                  v-model="item.dept3managercount"
                  maxlength="11"
                  @focus="inputFocus($event, index, 'dept3checknote')"
                  @change="val => inputChange(val, index)"
                  @blur="inputBlur($event, index, 'dept3checknote', 'dept3managercount')"
                  @input="val => inputFn(val, index, 'dept3managercount')"
                  :disabled="assetPlanInfo.lst[0].outtimeplanenum == 3"
                ></el-input>
              </td>
              <td colspan="3" v-else>{{item.dept3managercount}}</td>
            </tr>
            <tr>
              <td class="labelTd">审批意见</td>
              <td colspan="3" v-if="entryType == 'detailClick' && assetStage == 3">
                <el-radio-group 
                  v-model="item.dept3checknote" 
                  @change="(val) => radioChangeFn(val, index, 'dept3managercount')"
                  :disabled="assetPlanInfo.lst[0].outtimeplanenum == 3"
                >
                  <el-radio label="同意">同意</el-radio>
                  <el-radio label="不同意">不同意</el-radio>
                </el-radio-group>
              </td>
              <td colspan="3" v-else>{{item.dept3checknote ? item.dept3checknote : '同意'}}</td>
            </tr>
            <tr>
              <td class="labelTd">审批人</td>
              <td>{{item.dept3manager}}</td>
              <td class="labelTd">审批时间</td>
              <td>{{item.dept3checktime}}</td>
            </tr>
          </table>
          <!-- 二级主管审核信息 -->
          <table border="1" cellspacing="0" v-if="item.apstage == '4'">
            <tr>
              <td class="labelTd">同意申购数量</td>
              <td colspan="3" v-if="entryType == 'detailClick' && assetStage == 4">
                <el-input 
                  v-model="item.dept2managercount"
                  maxlength="11"
                  @focus="inputFocus($event, index, 'dept2checknote')"
                  @change="val => inputChange(val, index)"
                  @blur="inputBlur($event, index, 'dept2checknote', 'dept2managercount')"
                  @input="val => inputFn(val, index, 'dept2managercount')"
                  :disabled="assetPlanInfo.lst[0].outtimeplanenum == 4"
                ></el-input>
              </td>
              <td colspan="3" v-else>{{item.dept2managercount}}</td>
            </tr>
            <tr>
              <td class="labelTd">审批意见</td>
              <td colspan="3" v-if="entryType == 'detailClick' && assetStage == 4">
                <el-radio-group
                  v-model="item.dept2checknote"
                  @change="(val) => radioChangeFn(val, index, 'dept2managercount')"
                  :disabled="assetPlanInfo.lst[0].outtimeplanenum == 4"
                >
                  <el-radio label="同意">同意</el-radio>
                  <el-radio label="不同意">不同意</el-radio>
                </el-radio-group>
              </td>
              <td colspan="3" v-else>{{item.dept2checknote ? item.dept2checknote : '同意'}}</td>
            </tr>
            <tr>
              <td class="labelTd">审批人</td>
              <td>{{item.dept2manager}}</td>
              <td class="labelTd">审批时间</td>
              <td>{{item.dept2checktime}}</td>
            </tr>
          </table>
          <!-- 计划员审核 -->
          <table border="1" cellspacing="0" v-if="item.apstage == '5'">
            <tr>
              <td class="labelTd">评审后数量</td>
              <td colspan="3" v-if="entryType == 'detailClick' && assetStage == 5">
                <el-input 
                  v-model="item.plannercount"
                  maxlength="11"
                  @focus="inputFocus($event, index, 'plannernote')"
                  @change="val => inputChange(val, index)"
                  @blur="inputBlur($event, index, 'plannernote', 'plannercount')"
                  @input="val => inputFn(val, index, 'plannercount')"
                ></el-input>
              </td>
              <td colspan="3" v-else>{{item.plannercount}}</td>
            </tr>
            <tr>
              <td class="labelTd">审批意见</td>
              <td colspan="3" v-if="entryType == 'detailClick' && assetStage == 5">
                <el-radio-group v-model="item.plannernote" @change="(val) => radioChangeFn(val, index, 'plannercount')">
                  <el-radio label="同意">同意</el-radio>
                  <el-radio label="不同意">不同意</el-radio>
                </el-radio-group>
              </td>
              <td colspan="3" v-else>{{item.plannernote ? item.plannernote : '同意'}}</td>
            </tr>
            <tr>
              <td class="labelTd">审批人</td>
              <td>{{item.planner}}</td>
              <td class="labelTd">审批时间</td>
              <td>{{item.plannertime}}</td>
            </tr>
          </table>
          <!-- 专家团审核 -->
          <table border="1" cellspacing="0" v-if="item.apstage == '6'">
            <tr>
              <td class="labelTd">评审后数量</td>
              <td colspan="3" v-if="entryType == 'detailClick' && assetStage == 6">
                <el-input 
                  v-model="item.oqdeptreviewercount"
                  maxlength="11"
                  @focus="inputFocus($event, index, 'oqdeptreviewnote')"
                  @change="val => inputChange(val, index)"
                  @blur="inputBlur($event, index, 'oqdeptreviewnote', 'oqdeptreviewercount')"
                  @input="val => inputFn(val, index, 'oqdeptreviewercount')"
                ></el-input>
              </td>
              <td colspan="3" v-else>{{item.oqdeptreviewercount}}</td>
            </tr>
            <tr>
              <td class="labelTd">审批意见</td>
              <td colspan="3" v-if="entryType == 'detailClick' && assetStage == 6">
                <el-radio-group v-model="item.oqdeptreviewnote" @change="(val) => radioChangeFn(val, index, 'oqdeptreviewercount')">
                  <el-radio label="同意">同意</el-radio>
                  <el-radio label="不同意">不同意</el-radio>
                </el-radio-group>
              </td>
              <td colspan="3" v-else>{{item.oqdeptreviewnote ? item.oqdeptreviewnote : '同意'}}</td>
            </tr>
            <tr>
              <td class="labelTd">审批人</td>
              <td>{{item.oqdeptreviewer}}</td>
              <td class="labelTd">审批时间</td>
              <td>{{item.oqdeptreviewtime}}</td>
            </tr>
          </table>
          <!-- 一级主管审核 -->
          <table border="1" cellspacing="0" v-if="item.apstage == '7'">
            <tr>
              <td class="labelTd">评审后数量</td>
              <td colspan="3" v-if="entryType == 'detailClick' && assetStage == 7">
                <el-input 
                  v-model="item.dept1reviewercount"
                  maxlength="11"
                  @focus="inputFocus($event, index, 'dept1reviewnote')"
                  @change="val => inputChange(val, index)"
                  @blur="inputBlur($event, index, 'dept1reviewnote', 'dept1reviewercount')"
                  @input="val => inputFn(val, index, 'dept1reviewercount')"
                ></el-input>
              </td>
              <td colspan="3" v-else>{{item.dept1reviewercount}}</td>
            </tr>
            <tr>
              <td class="labelTd">审批意见</td>
              <td colspan="3" v-if="entryType == 'detailClick' && assetStage == 7">
                <el-radio-group v-model="item.dept1reviewnote" @change="(val) => radioChangeFn(val, index, 'dept1reviewercount')">
                  <el-radio label="同意">同意</el-radio>
                  <el-radio label="不同意">不同意</el-radio>
                </el-radio-group>
              </td>
              <td colspan="3" v-else>{{item.dept1reviewnote ? item.dept1reviewnote : '同意'}}</td>
            </tr>
            <tr>
              <td class="labelTd">审批人</td>
              <td>{{item.dept1reviewer}}</td>
              <td class="labelTd">审批时间</td>
              <td>{{item.dept1reviewtime}}</td>
            </tr>
          </table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-row class="btnRow">
      <el-button type="primary" @click="downloadPdf" v-if="entryType == '' && assetStage == ''">另存为PDF</el-button>
      <el-button type="primary" @click="closeFn" v-if="entryType == ''">关闭</el-button>
      <el-button type="primary" @click="editReviewNote" v-if="assetStage < 8 && assetStage >= 3 && entryType == 'detailClick'" :disabled="assetPlanInfo.lst != undefined && (assetPlanInfo.lst[0].outtimeplanenum == 3 || assetPlanInfo.lst[0].outtimeplanenum == 4)">保存</el-button>
      <el-button type="primary" @click="closeFn" v-if="assetStage < 8 && assetStage >= 3 && entryType == 'detailClick'">取消</el-button>
    </el-row>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import html2Canvas from 'html2canvas'
import urlConfig from '@/http/urlConfig/index' //引入接口地址
export default {
  name: 'approvalRecord',
  data() {
    return {
      assetplanid: this.$route.query.assetplanid,
      assetStage: this.$route.query.assetStage ? this.$route.query.assetStage : '',
      entryType: this.$route.query.entrytype ? this.$route.query.entrytype : '',// detailClick => 三级及三级之后审核环节点击详情进入；'' => 查询列表页面双击进入和一级列表点击审批记录进入
      tableHead: [],
      tableData: [],
      recordHead: {},
      assetPlanInfo: {},
      activeName: [1],
      reportActiveName: [],
      assetCategoryAndGoodstimeList: [],
      receivePlaceList: [],
      dialogImageUrl: '',// 图片预览
      dialogVisible: false,
      printFlag: false,
    }
  },

  computed: {
    dataChange() {
      let { assetPlanInfo, assetCategoryAndGoodstimeList, receivePlaceList } = this
      return {
        assetPlanInfo,
        assetCategoryAndGoodstimeList,
        receivePlaceList
      }
    }
  },

  watch: {
    dataChange(e) {
      let that = this
      let { assetPlanInfo, assetCategoryAndGoodstimeList, receivePlaceList } = e
      if(that.assetPlanInfo.lst) {
        assetCategoryAndGoodstimeList.forEach(item => {
          if(item.id == that.assetPlanInfo.lst[0].assetcategory) {
            that.assetPlanInfo.lst[0].assetcategory = item.assetcategory
            that.assetPlanInfo.lst[0].goodstime = item.goodstime
          }
        });

        receivePlaceList.forEach(item => {
          if(item.id == that.assetPlanInfo.lst[0].receiverplace) {
            that.assetPlanInfo.lst[0].receiverplace = item.receiverplace
          }
        })
      }
    }
  },

  created() {
    this.getAssetCategoryAndGoodstime()
    this.getReceivePlace()
    this.getAssetPlanInfo()
    this.getApprovalRecord()
  },

  methods: {
     // 物品类别和相应的货期
    getAssetCategoryAndGoodstime() {
      let that = this;
      this.$store.dispatch('getAssetCategoryAndGoodstime').then(res => {
        that.assetCategoryAndGoodstimeList = res.data;
      }, err => {})
    },

    // 获取到货地点
    getReceivePlace() {
      let that = this;
      this.$store.dispatch('getReceivePlace').then(res => {
        that.receivePlaceList = res.data;
      }, err => {})
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    closeFn() {
      this.$router.go(-1)
    },
    goBackToDoList() {
      this.$router.go(-2);
    },

    getImagePathToBase64() {
      let that = this
      that.$axios.get(urlConfig.assetMag.GETIMAGEPATHTOBASE64 + '?assetplanid=' + that.assetplanid).then(res => {
        let data = res.data.data
        
        // 网页打印中，默认采用的是96dpi, A4纸张的尺寸是210×297mm，按1英寸=25.41mm换算，即8.264×11.688英寸 。所以，A4纸96dpi下的分辨率是794×1123
        // 打印页边距设定为 5mm 时，网页内最大元素的分辨率：756×1086 
        let a4Width = 720
        let a4Height = 980
        if('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) {
          // 打印页边距设定为 19.05mm 时，网页内最大元素的分辨率：649×978 
          a4Width = 625
          a4Height = 970
        }
        
        if(data) {
          for(let key in data) {
            if(that.assetPlanInfo.lst[0].isspecifymanufacturer == 1) {
              that.assetPlanInfo.specifyManufacturerInfo.forEach((item, index) => {
                if(key == item.titlecode) {
                  item.fileList = []
                  for(let img in data[key]) {
                    let tempImg = new Image()
                    let imgUrl = 'data:image/png;base64,' + data[key][img]
                    tempImg.src = imgUrl
                    let tempImgWidth = '', tempImgHeight = ''
                    tempImg.onload = () =>{
                      tempImgWidth = tempImg.width
                      tempImgHeight = tempImg.height
                      if(tempImgWidth > a4Width) {
                        tempImgHeight = tempImgHeight * a4Height / tempImgWidth > a4Height ? a4Height : tempImgHeight * a4Height / tempImgWidth
                        tempImgWidth = a4Width - 5
                      } 
                      item.fileList.push({
                        fileId: img,
                        url: imgUrl,
                        width: tempImgWidth,
                        height: tempImgHeight,
                      })
                    }
                  }
                }
              })
            } else if(that.assetPlanInfo.lst[0].isreqpurchasereport == 1) {
              that.assetPlanInfo.purchaseReportInfo.forEach((item, index) => {
                if(key == item.titlecode) {
                  item.fileList = []
                  for(let img in data[key]) {
                    let tempImg = new Image()
                    let imgUrl = 'data:image/png;base64,' + data[key][img]
                    tempImg.src = imgUrl
                    let tempImgWidth = '', tempImgHeight = ''
                    tempImg.onload = () =>{
                      tempImgWidth = tempImg.width
                      tempImgHeight = tempImg.height
                      if(tempImgWidth > a4Width) {
                        tempImgHeight = tempImgHeight * a4Height / tempImgWidth > a4Height ? a4Height : tempImgHeight * a4Height / tempImgWidth
                        tempImgWidth = a4Width - 5
                      } 
                      item.fileList.push({
                        fileId: img,
                        url: imgUrl,
                        width: tempImgWidth,
                        height: tempImgHeight,
                      })
                    }
                  }
                }
              })
            }
          }
        }
      }, err => {})
    },

    getAssetPlanInfo() {
      let that = this
      that.$axios.get(urlConfig.assetMag.GETINFOBYIDFORDEPT3ANDOTHER + '?assetplanid=' + that.assetplanid).then(function (res) {
        if (res.data.status == 0) {
          that.assetPlanInfo = res.data.data
          that.getImagePathToBase64()
        }
        else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, function (err) {
      })
    },
    getApprovalRecord() {
      let that = this
      let url = ''
      if(that.entryType == 'detailClick') {// 三级以及三级之后审核列表页面详情按钮的审批记录信息
        url = urlConfig.assetPlanApprovalQuery.GETAPPROVALRECORDBYIDFORDETAIL + '?assetplanid=' + that.assetplanid
      } else {// 双击查询列表页面条目进入
        url = urlConfig.assetPlanApprovalQuery.ASSETPLANAPPROVALRECORDGET + '?assetplanid=' + that.assetplanid
      }
      that.$axios.get(url).then(function (res) {
        if (res.data.status == 0) {
          that.tableHead = res.data.tableHeadData
          that.recordHead = res.data.data[0]
          that.tableData = res.data.data.slice(1)
          if(that.entryType == 'detailClick') {
            that.activeName.push(that.tableData.length + 1)
          }
        }
        else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, function (err) {
      })
    },
    downloadPdf() {
      /**
       * 在 html2canvas 这个方法执行时，页面必须在最左上角，才可以截图成功，
       * 否则，就会以滚动条的长宽为起始点，所以在执行这个方法时，记录当前的scroll长度，
       * 同时使页面回到左上角，在回调中再将页面回归原始位置
       */
      let that = this
      this.printFlag = true
      // let ST = document.documentElement.scrollTop;
      // let SL = document.documentElement.scrollLeft;
      // document.documentElement.scrollLeft = 0;
      // document.documentElement.scrollTop = 0;
      // 将所有tab展开，生成pdf之后回调中再恢复
      let oriActiveName = that.activeName;
      let tempActiveName = [1];
      that.tableData.forEach((item, index) => {
        tempActiveName.push(index + 2)
      })
      that.activeName = tempActiveName;

      let oriReportActiveName = that.reportActiveName
      that.reportActiveName = [1]
      setTimeout(() => {
        window.print();
      }, 100)
      window.onafterprint = () => {
        that.activeName = oriActiveName
        that.reportActiveName = oriReportActiveName
        that.printFlag = false
      }

      // setTimeout(function() {
      //   let target = that.$refs.pdf
      //   html2Canvas(target, {
      //     allowTaint: true
      //   }).then(function (canvas) {
      //     document.documentElement.scrollTop = ST;
      //     document.documentElement.scrollLeft = SL;
      //     that.activeName = oriActiveName

      //     let contentWidth = canvas.width
      //     let contentHeight = canvas.height
      //     let pageHeight = contentWidth / 592.28 * 841.89 //一页pdf显示html页面生成的canvas高度
      //     let leftHeight = contentHeight // 未生成pdf的html页面高度
      //     let position = 0 //页面偏移

      //     // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      //     let imgWidth = 595.28 
      //     let imgHeight = 592.28 / contentWidth * contentHeight
      //     let pageData = canvas.toDataURL('image/jpeg', 1.0)
      //     let PDF = new jsPDF('', 'pt', 'a4')

      //     // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      //     // 当内容未超过pdf一页显示的范围，无需分页
      //     if (leftHeight < pageHeight) {
      //       PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
      //     } else {
      //       while (leftHeight > 0) {
      //         PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
      //         leftHeight -= pageHeight
      //         position -= 841.89
      //         if (leftHeight > 0) {
      //           PDF.addPage()
      //         }
      //       }
      //     }
      //     PDF.save('审批记录.pdf')
      //   });
      // }, 500)

    },

    radioChangeFn(val, index, type) {
      let originCount = null
      if(this.assetStage == 3) {
        originCount = this.tableData[index].reviewercount
      } else if(this.assetStage == 4) {
        originCount = this.tableData[index].dept3managercount
      } else if(this.assetStage == 5) {
        originCount = this.tableData[index].dept2managercount
      } else if(this.assetStage == 6) {
        originCount = this.tableData[index].plannercount
      } else if(this.assetStage == 7) {
        originCount = this.tableData[index].oqdeptreviewercount
      }
      if(val == '同意') {
        this.tableData[index][type] = originCount
        this.tableData[index].actualmoney =  (this.tableData[index].pprice * 100 * Number(this.tableData[index][type]) / 100).toFixed(2)
      } else if(val == '不同意') {  
        this.tableData[index][type] = '0'
        this.tableData[index].actualmoney = '0.00'
      }
    },
    inputFocus(e, index, type) {
      let target = e.target
      if(this.tableData[index][type] == '不同意' || this.tableData[index][type] == '不同意') {
        target.blur()
        this.$alert('评审意见为不同意时数量只能为0', '提示', {
          confirmButtonText: '确定',
          callback: action => { }
        });
      }
    },
    inputChange(value, index) {
      this.tableData[index].actualmoney = (this.tableData[index].pprice * 100 * Number(value) / 100).toFixed(2)
    },
    inputBlur(e, index, noteType, countType) {
      let target = e.target
      let originCount = null
      if(this.assetStage == 3) {
        originCount = this.tableData[index].reviewercount
      } else if(this.assetStage == 4) {
        originCount = this.tableData[index].dept3managercount
      } else if(this.assetStage == 5) {
        originCount = this.tableData[index].dept2managercount
      } else if(this.assetStage == 6) {
        originCount = this.tableData[index].plannercount
      } else if(this.assetStage == 7) {
        originCount = this.tableData[index].oqdeptreviewercount
      }
      // 同意数量为空，不同意的话要将同意数量置为0，同意的话将同意数量置为申购数量
      if(this.tableData[index][noteType] == '不同意' && (target.value === '')) {
        this.tableData[index][countType] = '0'
        this.tableData[index].actualmoney = '0.00'
      } else if(this.tableData[index][noteType] == '同意' && (target.value === '0' || target.value === '')){
        this.tableData[index][countType] = originCount
        if(Number(target.value) == 0) {
          this.$alert('评审意见为同意时数量不能为0', '提示', {
            confirmButtonText: '确定',
            callback: action => { }
          });
        }
      }
    },
    inputFn(value, index, type) {
      this.tableData[index][type] = value.replace(/\D+/, '')
    },

    editReviewNote(index, noteType, countType) {
      let that = this
      let url = ''
      let params = {
        requiredsaudit: [],
        assetplanid: [],
        actualmoney: [],
      }
      params.assetplanid.push(that.assetplanid)
      if(this.assetStage == 3) {
        url = urlConfig.assetPlanDept3Mag.UPDATEDEPT3INFOLIST
        params.requiredsaudit.push(that.tableData[1].dept3managercount)
        params.actualmoney.push(that.tableData[1].actualmoney)
        params.dept3checknote = []
        params.dept3checknote.push(that.tableData[1].dept3checknote)
      } else if(this.assetStage == 4) {
        url = urlConfig.assetPlanDept2Mag.UPDATEDEPT2INFOLIST
        params.requiredsaudit.push(that.tableData[2].dept2managercount)
        params.actualmoney.push(that.tableData[2].actualmoney)
        params.dept2checknote = []
        params.dept2checknote.push(that.tableData[2].dept2checknote)
      } else if(this.assetStage == 5) {
        url = urlConfig.plannerReview.UPDATEPLANNERINFOLIST
        params.requiredsaudit.push(that.tableData[3].plannercount)
        params.actualmoney.push(that.tableData[3].actualmoney)
        params.plannernote = []
        params.plannernote.push(that.tableData[3].plannernote)
      } else if(this.assetStage == 6) {
        url = urlConfig.expertGroupReview.UPDATEPLANNERINFOLIST
        params.requiredsaudit.push(that.tableData[4].oqdeptreviewercount)
        params.actualmoney.push(that.tableData[4].actualmoney)
        params.oqdeptreviewnote = []
        params.oqdeptreviewnote.push(that.tableData[4].oqdeptreviewnote)
      } else if(this.assetStage == 7) {
        url = urlConfig.assetPlanDept1Review.UPDATEPLANNERINFOLIST
        params.requiredsaudit.push(that.tableData[5].dept1reviewercount)
        params.actualmoney.push(that.tableData[5].actualmoney)
        params.dept1reviewnote = []
        params.dept1reviewnote.push(that.tableData[5].dept1reviewnote)
      }
      this.$axios.put(url, params).then(res => {
        if(res.data.success) {
          that.$message({
            message: res.data.message,
            type: 'success'
          })
          that.closeFn();
        } else {
          that.$message({
            message: res.data.message,
            type: 'warning'
          })
        }
      }, err => {})
    },

  }
}
</script>

<style lang="scss" scoped>
  .formBox {
    background: #fff;
    // padding: 15px 20px 20px;
    .title-item span{
      margin-left: 20px;
      i {
        font-style: normal;
        font-weight: 900;
      }
    }
    .print-title, .print-img {
      display: none;
    }
    .collapse-container {
      margin-top: 15px;
      .pre-enter {
        white-space: pre-wrap;
      }
      table {
        // margin: 15px auto 0;
        width: 100%;
        background-color: #ffffff;
        border: transparent;
        tr td {
          width: 12.5%;
          height: 35px;
          padding: 0px 10px;
          box-sizing: border-box;
          border: 1px solid #c9ddf7;
          border-bottom: transparent;
          border-right: transparent;
        }
        .labelTd {
          background-color: #f2f7fd;
        }
        tr td:last-child {
          border-right: 1px solid #c9ddf7;
        }
        tr:last-child td {
          border-bottom: 1px solid #c9ddf7;
        }
      }
    }
    
    .fontWeight_900 {
      font-weight: 900;
    }
    .report-collapse {
      margin: 10px 0;
    }
    .report-collapse-header {
      position: relative;
      margin: 0 10px;
      color: #333;
      border-bottom: 2px solid #5e96ff;
      .report_icon {
        margin-right: 5px;
        width: 15px;
        height: 19px;
        vertical-align: text-bottom;
      }
    }
    .open-detail-text{
      position: absolute;
      top: 0;
      right: 28px;
      font-size: 12px;
      color: #5e96ff;
    }
    .report-item-info {
      padding: 5px 10px;
    }
    .info-border:nth-child(3), .info-border:nth-child(4), .info-border:nth-child(5), .info-border:nth-child(6), .info-border:nth-child(11),
    .isspecify-border:nth-child(1), .isspecify-border:nth-child(5), .isspecify-border:nth-child(4) {
      border-bottom: 1px solid #c9ddf7;
    }
  }
  .btnRow {
    margin-top: 20px;
    margin-bottom: 30px;
    text-align: center;
  }
  
  @media print {
    @page{
      size: auto A4 landscape;
      margin: 5mm;
    }

    body {
      -webkit-print-color-adjust: exact;
      -ms-print-color-adjust: exact;
      -moz-print-color-adjust: exact;
      color-adjust: exact;
    }
    #app .approvalRecord {
      padding: 0;
      .title {
        display: none;
      }
      .btnRow {
        display: none;
      }
    }
    .formBox {
      padding: 0;
      .labelTd {
        background-color: rgb(240, 248, 255);
        -webkit-print-color-adjust: exact;
        -ms-print-color-adjust: exact;
        -moz-print-color-adjust: exact;
        color-adjust: exact;
      }
      .no-print-title, .no-print-img {
        display: none;
      }
      .print-title, .print-img {
        display: inline-block;
        font-size: 12px;
      }
      
    }
  }
</style>
<style>
  .approvalRecord .el-collapse-item__header {
    font-weight: 900;
    font-size: 15px;
  }
  .el-collapse-item:last-child  .el-collapse-item__header, .el-collapse-item:last-child  .el-collapse-item__wrap {
    border-bottom: none;
  }
  @media print {
    #app .index-header {
      display: none;
    }
  }
  .hide .el-upload--picture-card {
    display: none;
  }
  .el-collapse-item__content {
    color: #333;
  }
  .approvalRecord .el-upload-list--picture-card .el-upload-list__item {
    width: 74px;
    height: 74px;
    line-height: 80px;
    margin-bottom: 0;
  }
  .approvalRecord .el-upload-list--picture-card .el-upload-list__item.is-success {
    line-height: 1;
  }
  #app .report-collapse .el-collapse-item__header {
    position: relative!important;
    border: 1px solid #c9ddf7;
  }
  #app .report-collapse .el-collapse-item__header.is-active {
    position: relative!important;
    border-bottom: 1px solid #c9ddf7!important;
  }
  #app .report-collapse .el-collapse-item__content {
    padding-bottom: 0!important;
  }
  .approvalRecord .report-collapse .el-collapse-item__wrap {
    border: 1px solid #c9ddf7!important;
  }
</style>