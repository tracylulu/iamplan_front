<template>
  <div class="assetApplyDetail">
    <el-row class="title">
      <el-col :span="24">
        <div class="navBar">
          <div class="navItem navItemHome"><router-link to="/RDAssetPlanningManagement">首页</router-link></div>

          <div class="navItem navItemSplit" v-if="assetStage <= 1 && itemType == ''">&gt;</div>
          <div class="navItem navItemCol" v-if="assetStage <= 1 && itemType == ''" @click="close">资产计划申购</div>

          <div class="navItem navItemSplit" v-if="assetStage >= 2 && assetStage < 8 || itemType == 'update'">&gt;</div>
          <div class="navItem navItemCol" v-if="assetStage >= 2 && assetStage < 8 || itemType == 'update'" @click="goBackToDoList">我的待办</div>

          <div class="navItem navItemSplit" v-if="assetStage >= 2 && assetStage < 8">&gt;</div>
          <div class="navItem navItemCol" v-if="assetStage == 2" @click="close">规范审核</div>
          <div class="navItem navItemCol" v-if="assetStage == 3" @click="close">三级部门主管审核</div>
          <div class="navItem navItemCol" v-if="assetStage == 4" @click="close">二级部门主管审核</div>
          <div class="navItem navItemCol" v-if="assetStage == 5" @click="close">计划员审核</div>
          <div class="navItem navItemCol" v-if="assetStage == 6" @click="close">专家团审核</div>
          <div class="navItem navItemCol" v-if="assetStage == 7" @click="close">一级部门主管审核</div>
          <div class="navItem navItemSplit" v-if="assetStage == 8">&gt;</div>
          <div class="navItem navItemCol" v-if="assetStage == 8" @click="close">资产计划审批查询</div>

          <div class="navItem navItemSplit" v-if="assetStage == 1 && itemType == 'update'">&gt;</div>
          <div class="navItem navItemCol" v-if="assetStage == 1 && itemType == 'update'" @click="close">申请环节</div>

          <div class="navItem navItemSplit">&gt;</div>
          <div class="navItem navItemCol" v-if="assetStage > 0">资产计划详情</div>
          <div class="navItem navItemCol" v-else>资产计划新增</div>
        </div>
      </el-col>
    </el-row>
    <div class="formBox">
      <el-form 
        ref="ruleForm" 
        :model="assetPlanGlobalInfo" 
        :rules="rules" 
        :validate-on-rule-change="false" 
        label-position="left" 
        :show-message="false"
        @validate="validateFn"
      >
        <h3 class="titleHeaderText">
          <span v-if="assetStage == ''">{{applyMonth}}</span> 添加申购资产明细
          <i class="line" v-if="assetStage <= '2'"></i>
          <span v-if="assetStage <= '2'">
            <span class="item-label_14">申购总金额：</span><span class="item-label_14 text-blue">{{ totalMoneySum }}</span>
          </span>  
        </h3>
        <table cellspacing="0" class="table-container" border="1">
          <tr>
            <td width="8%" class="bgTd"><span class="redMark">*</span><span>申购人姓名/工号</span></td>
            <td width="12%">
              <el-form-item prop="requireduser" class="noTip"
                :rules="[{ required: true, message: '申购人姓名/工号必填', trigger: 'blur'}, { max: applyFiledLength.requireduser, message: `长度最长为${applyFiledLength.requireduser}个字符`, trigger: 'change'}]"
              >
                <el-autocomplete
                  ref="requiredUser"
                  v-model="assetPlanGlobalInfo.requireduser"
                  :fetch-suggestions="associateFn"
                  :trigger-on-focus="false"
                  :hide-loading="true"
                  :debounce="300"
                  :disabled="assetStage > 2"
                  :validate-event="false"
                  @select="getDeptInfoByCode"
                  @blur="inputblur(1, 'requireduser')"
                  @change="requiredUserChange">
                </el-autocomplete>
              </el-form-item>
            </td>
            <td width="80%" :colspan="assetStage == 2 ? 9 : 7" style="line-height: 34px;" class="boderTdRight select-dept-td">
              <div class="select-btn">
                <el-button size="mini" type="primary" class="select-dept-tree-btn" @click="showDeptTree = true" v-if="assetStage < 2" ref="deptTree">选择部门</el-button>
                <treeselect 
                  class="dept-tree"
                  v-show="showDeptTree"
                  :options="deptArr" 
                  :normalizer="normalizer" 
                  :multiple="false" 
                  :alwaysOpen="true"
                  :disableBranchNodes="true"
                  @select="selectDept"
                  noResultsText="没有匹配项"
                  placeholder='请选择' 
                />
              </div>
              一级部门：
              {{ assetPlanGlobalInfo.dept1name }}<span class="dept-line">|</span>
              二级部门：
              {{ assetPlanGlobalInfo.dept2name }}<span class="dept-line">|</span>
              三级部门：
              {{ assetPlanGlobalInfo.dept3name }}<span class="dept-line">|</span>
              计划员ID：
              <span v-if="!assetPlanGlobalInfo.assetplanid">{{assetPlanGlobalInfo.dept3plannername}}<span v-if="assetPlanGlobalInfo.dept3plannername && assetPlanGlobalInfo.dept3plannercode">/</span>{{ assetPlanGlobalInfo.dept3plannercode }}</span>
              <span v-else>{{assetPlanGlobalInfo.reviewername}}</span>
              
            </td>
          </tr>
          <tr>
            <td class="bgTd"><span class="redMark">*</span>项目编码</td>
            <td>
              <el-form-item prop="itemcode">
                <el-input 
                  v-model="assetPlanGlobalInfo.itemcode" 
                  @blur="getItemCodeAndName" 
                  class="item-select-input"
                  v-if="assetStage <= 2"
                  :validate-event="false"
                ></el-input><el-button 
                  type="primary" 
                  class="item-select-btn"
                  @click="openItemTree"
                  v-if="assetStage <= 2"
                >选择</el-button>
                <el-autocomplete
                  v-model="assetPlanGlobalInfo.itemcode"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  :hide-loading="true"
                  :debounce="300"
                  :disabled="assetStage > 2"
                  v-if="assetStage > 2"
                  :validate-event="false"
                  @select="itemCodeSelect"
                  @change="itemCodeChange">
                </el-autocomplete> 
              </el-form-item>
            </td>
            <td width="8%" class="bgTd">项目名称</td>
            <td width="62%" :colspan="assetStage == 2 ? 8 : 6" class="boderTdRight">{{ assetPlanGlobalInfo.itemname }}</td>
          </tr>
          <tr>
            <td class="bgTd"><span class="redMark">*</span>物品类别</td>
            <td>
              <el-form-item prop="assetcategory" class="placeholderText_666">
                <el-select v-model="assetPlanGlobalInfo.assetcategory" default-first-option :disabled="assetStage > 2" clearable>
                  <el-option v-for="item in assetCategoryAndGoodstimeList" :key="item.id" :label="item.assetcategory" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="8%" class="bgTd"><span class="redMark">*</span>到货地点</td>
            <td width="12%">
              <el-form-item prop="receiverplace" class="placeholderText_666">
                <el-select v-model="assetPlanGlobalInfo.receiverplace" clearable default-first-option :disabled="assetStage > 2" @change="receiverPalceFn">
                  <el-option v-for="item in receivePlaceList" :key="item.id" :label="item.receiverplace" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="8%" class="bgTd"><span class="redMark">*</span>到货时间</td>
            <td width="12%">
              <el-form-item prop="reqarrivaldate" class="placeholderText_666">
                <el-date-picker 
                  v-model="assetPlanGlobalInfo.reqarrivaldate" 
                  type="date" 
                  placeholder="选择日期" 
                  format="yyyy-MM-dd" 
                  value-format="yyyy-MM-dd" 
                  :picker-options="pickerOptions"
                  :disabled="assetStage > 2">
                </el-date-picker>
              </el-form-item>
            </td>
            <td width="8%" class="bgTd">货期</td>
            <td width="12%" :colspan="assetStage == 2 ? 4 : 2" class="boderTdRight">{{ assetPlanGlobalInfo.goodstime }}</td>
          </tr>
          <tr>
            <td class="bgTd"><span class="redMark">*</span>用途</td>
            <td>
              <el-form-item prop="purpose"
                :rules="[{ required: true, message: '用途必填', trigger: 'blur' }, { max: applyFiledLength.purpose, message: `长度最长为${applyFiledLength.purpose}个字符`, trigger: 'change'}]"
              >
                <el-input v-model="assetPlanGlobalInfo.purpose" :disabled="assetStage > 2" :validate-event="false" @blur="inputblur(1, 'purpose')"></el-input>
              </el-form-item>
            </td>
            <td class="bgTd">备注内容</td>
            <td :colspan="assetStage == 2 ? 8 : 6" class="boderTdRight">
              <el-form-item prop="assetnote" :rules="[{ required: assetNoteRequiredFlag, message: '备注必填', trigger: 'blur' }, { max: applyFiledLength.assetnote, message: `长度最长为${applyFiledLength.assetnote}个字符`, trigger: 'change'}]">
                <el-input v-model="assetPlanGlobalInfo.assetnote" :disabled="assetStage > 2" :validate-event="false" @blur="inputblur(1, 'assetnote')"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="bgTd"><span class="redMark">*</span>厂家</td>
            <td>
              <el-form-item prop="assetmanufacturer"
                :rules="[{ required: true, message: '厂家必填', trigger: 'change' }, { max: applyFiledLength.assetmanufacturer, message: `长度最长为${applyFiledLength.assetmanufacturer}个字符`, trigger: 'change'}]"
              >
                <el-autocomplete
                  v-model="assetPlanGlobalInfo.assetmanufacturer"
                  :fetch-suggestions="assetManuFacturerQuerySearch"
                  :trigger-on-focus="true"
                  :hide-loading="false"
                  :debounce="300"
                  :validate-event="false"
                  @select="assetManuFacturerSelect"
                  @change="assetManuFacturerChange"
                  :disabled="assetStage > 2" 
                  @blur="inputblur(1, 'assetmanufacturer')">
                </el-autocomplete>
              </el-form-item>
            </td>
            <td :colspan="assetStage == 2 ? 9 : 7" class="boderTdRight">
              <span v-if="assetStage == ''" style="font-size: 12px;color: red;">“厂家、型号”栏下拉选择仅限SPIRENT、IXIA，其他厂家型号请手动输入。</span>
            </td>
          </tr>
          <tr v-for="(item, index) in assetPlanGlobalInfo.assetInfoList" :key="index">
            <td class="bgTd" width="8%"><span class="redMark">*</span>物品名称</td>
            <td width="12%">
              <el-form-item :prop="`assetInfoList[${index}].assetname`" :rules="[{ required: true, message: '物品名称必填', trigger: 'blur' }, { max: applyFiledLength.assetname, message: `长度最长为${applyFiledLength.assetname}个字符`, trigger: 'change'}]">
                <el-input v-model="item.assetname" :disabled="assetStage > 2" :validate-event="false" @blur="inputblur(2, 'assetInfoList', index, 'assetname')"></el-input>
              </el-form-item>
            </td>
            <td class="bgTd" width="8%"><span class="redMark">*</span>型号</td>
            <td width="12%">
              <el-form-item :prop="`assetInfoList[${index}].assetmodel`" :rules="[{ required: true, message: '型号必填', trigger: 'change' }, { max: applyFiledLength.assetmodel, message: `长度最长为${applyFiledLength.assetmodel}个字符`, trigger: 'change'}]">
                <el-autocomplete
                  v-model="item.assetmodel"
                  :fetch-suggestions="assetModelQuerySearch"
                  :trigger-on-focus="true"
                  :hide-loading="false"
                  :disabled="assetStage > 2"
                  :validate-event="false"
                  @blur="inputblur(2, 'assetInfoList', index, 'assetmodel')"
                >
                </el-autocomplete>
              </el-form-item>
            </td>
            <td class="bgTd" width="8%"><span class="redMark">*</span>预计单价（￥）</td>
            <td width="12%" style="position: relative;">
              <el-form-item :prop="`assetInfoList[${index}].pprice`" :rules="[{ required: true, message: '预计单价必填', trigger: 'change' }, { max: applyFiledLength.pprice, message: `长度最长为${applyFiledLength.pprice}个字符`, trigger: 'change'}]">
                <el-input @input="ppriceInput(index)" v-model="item.pprice" :validate-event="false" @blur="priceAndRequiredsBlur(index, 'pprice')" :disabled="assetStage > 2"></el-input>
              </el-form-item>
              <div class="uintText"><span v-if="assetStage <= 1 && item.unitText">{{item.unitText}}</span></div>
            </td>
            <td v-if="assetStage == 2" class="bgTd" width="8%"><span class="redMark">*</span>同意申购数量</td>
            <td v-else class="bgTd"><span class="redMark" width="8%">*</span>数量（pcs）</td>

            <td v-if="assetStage == 2" width="12%">
              <el-form-item :prop="`assetInfoList[${index}].requiredsaudit`" :rules="[{required: true, message: '同意申购数量必填', trigger: 'change'}, { max: applyFiledLength.requireds, message: `长度最长为${applyFiledLength.requireds}个字符`, trigger: 'change'}]">
                <el-input type="number" v-model="item.requiredsaudit" :validate-event="false" @blur="priceAndRequiredsBlur(index, 'requiredsaudit')" @input="numInput(index, 'requiredsaudit')"></el-input>
              </el-form-item>
            </td>
            <td v-else :class="[assetStage == 8 ? 'boderTdRight' : '']">
              <el-form-item :prop="`assetInfoList[${index}].requireds`" :rules="[{ required: true, message: '数量必填', trigger: 'change' },  { max: applyFiledLength.requireds, message: `长度最长为${applyFiledLength.requireds}个字符`, trigger: 'change'}]">
                <el-input 
                  type="text" 
                  v-model="item.requireds" 
                  :validate-event="false"
                  :disabled="assetStage > 1 && eventType == 'detailclick'"
                  @blur="priceAndRequiredsBlur(index, 'requireds')" 
                  @input="numInput(index, 'requireds')"
                ></el-input>
              </el-form-item>
            </td>

            <td class="bgTd add-btn-container boderTdRight" v-if="assetStage <= 1">
              <div class="add-btn">
                <i class="el-icon-circle-plus" @click="addAssetItem(index)"></i><i class="el-icon-remove remove-icon" @click="deleteAssetItem(index)" v-if="assetPlanGlobalInfo.assetInfoList.length > 1"></i>
              </div>
            </td>
            <!-- <td class="boderTdRight borderTdNoLeft" v-else></td> -->

            <td class="bgTd" width="8%" v-if="assetStage == 2"><span class="redMark">*</span>预算类型</td>
            <td class="boderTdRight borderTdNoLeft" width="12%" v-if="assetStage == 2">
              <el-form-item :prop="`assetInfoList[${index}].expensetype`" class="placeholderText_666" :rules="[{required: true, message: '预算类型必填', trigger: 'change'}]">
                <el-select v-model="item.expensetype" default-first-option :disabled="assetStage > 2">
                  <el-option label="费用类" value="1"></el-option>
                  <el-option label="资产类" value="2"></el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr height="1" class="top-content-padding" v-if="assetStage != 2">
            <td colspan="9"></td>
          </tr>
          <tr v-if="assetStage == 2">
            <td class="bgTd">规范审核状态</td>
            <td>
              <el-select v-model="assetPlanGlobalInfo.reviewresult" default-first-option>
                <el-option label="规范" value="1"></el-option>
                <el-option label="不规范" value="2"></el-option>
              </el-select>
            </td>
            <td class="bgTd">审核意见</td>
            <td :colspan="assetStage == 2 ? 8 : 6" class="boderTdRight">
              <el-form-item  prop="reviewnote" :rules="[{ max: applyFiledLength.reviewnote, message: `长度最长为${applyFiledLength.reviewnote}个字符`, trigger: 'change'}]">
                <el-input v-model="assetPlanGlobalInfo.reviewnote" @blur="inputblur(1, 'reviewnote')"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr height="1" class="top-content-padding" v-if="assetStage == 2">
            <td :colspan="assetStage == 2 ? 11 : 9"></td>
          </tr>
          <tr height="12" v-if="needReportFlag"></tr>
          <tr class="boldTR noBorderTop" v-if="needReportFlag">
            <td :colspan="assetStage == 2 ? 11 : 9">申购报告<span style="font-weight: normal; font-size: 12px;">（预计申购单价≥5000元或预计申购总价≥1万元时填写）</span></td>
          </tr>
          <tr class="boldTR" v-if="needReportFlag">
            <td :colspan="assetStage == 2 ? 11 : 9">
              是否指定供应商：
              <el-radio-group v-model="assetPlanGlobalInfo.isspecifymanufacturer" size="mini" @change="reportChange" :disabled="assetStage > 2">
                <el-radio-button :label="1">是</el-radio-button>
                <el-radio-button :label="0">否</el-radio-button>
              </el-radio-group>
            </td>
          </tr>
          <tr class="specifyTR" v-if="assetPlanGlobalInfo.isspecifymanufacturer === 0 && needReportFlag">
            <td :colspan="assetStage == 2 ? 11 : 9">
              <el-form-item 
                class="boldFormItem placeholderText_666" 
                v-for="(item, index) in assetPlanGlobalInfo.purchaseReportList" 
                :key="index" 
                :label="item.name" 
                :prop="`purchaseReportList[${index}].info`"
                :rules="[{ required: true, message: '必填', trigger: 'blur'}, { max: applyFiledLength[item.titlecode], message: `长度最长为${applyFiledLength[item.titlecode]}个字符`, trigger: 'change'}]"
              >
                <template v-if="assetStage < 2 && (item.titlecode == 'progress' || item.titlecode == 'contrast' || item.titlecode == 'detailedList'|| item.titlecode == 'performance'|| item.titlecode == 'function') || (assetStage >= 2 && item.fileList.length > 0)">
                  <div style="clear: both;"></div>
                  <div :class="[assetStage > 2 ? 'report-container disable-edit' : 'report-container']">
                    <el-input 
                      placeholder="请输入..."
                      v-model="item.info" 
                      type="textarea" 
                      :autosize="{ minRows: 1 }" 
                      class="textarea-min-height" 
                      :disabled="assetStage > 2"
                      :validate-event="false"
                      @blur="inputblur(3, 'purchaseReportList', index, item.titlecode)"
                    ></el-input>
                    <el-upload
                      :class="[item.uploadImgFlag ? 'minHeight_112 upload-container' : 'minHeight_28 upload-container', assetStage >= 2 ? 'upload-container hide disabledUpload minHeight_90' : '']"
                      :action="apiUrl + '/common/file/uploadFileMulti'"
                      accept="image/jpg,image/jpeg,image/gif,image/png,bmp"
                      list-type="picture-card"
                      name="files"
                      :data="{ titlecode: item.titlecode }"
                      :http-request="uploadHttpRequest"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="(file, fileList) => { handleRemove(file, fileList, 'purchaseReportList', item.titlecode) }"
                      :on-change="(file, fileList) => { handleChange(file, fileList, 'purchaseReportList', item.titlecode) }"
                      :on-exceed="(file, fileList) => { handleExceed(file, fileList, 'purchaseReportList', item.titlecode) }"
                      :limit="2"
                      :file-list="item.fileList"
                      :multiple="false"
                      :disabled="assetStage >= 2"
                    >
                      <el-button class="uploadBtn" v-if="assetStage < 2">图片上传(选填)</el-button>
                    </el-upload>
                  </div>
                </template>
                <template v-else>
                  <el-input 
                    placeholder="请输入..."
                    v-model="item.info" 
                    type="textarea" 
                    :autosize="{ minRows: 1 }" 
                    class="textarea-min-height" 
                    :disabled="assetStage > 2"
                    :validate-event="false"
                    @blur="inputblur(3, 'purchaseReportList', index, item.titlecode)"
                  ></el-input>
                </template>
              </el-form-item>
            </td>
          </tr>
          <tr class="specifyTR" v-if="assetPlanGlobalInfo.isspecifymanufacturer === 1 && needReportFlag">
            <td :colspan="assetStage == 2 ? 11 : 9">
              <el-form-item>
                <el-radio-group v-model="assetPlanGlobalInfo.manufacturertypeenum" :disabled="assetStage > 2">
                  <el-radio :label="2">A 申购部门指定供应商</el-radio>
                  <el-radio :label="1">B 事实上独家供应</el-radio>
                </el-radio-group> 
              </el-form-item>
              <template v-if="assetPlanGlobalInfo.manufacturertypeenum === 1 || assetPlanGlobalInfo.manufacturertypeenum === 2">
                <el-form-item  
                  class="boldFormItem placeholderText_666" 
                  v-for="(item, index) in assetPlanGlobalInfo.specifyManufacturerList" 
                  :key="index" 
                  :label="item.name" 
                  :prop="`specifyManufacturerList[${index}].info`"
                  :rules="[{ required: true, message: '必填', trigger: 'blur'}, { max: applyFiledLength[item.titlecode], message: `长度最长为${applyFiledLength[item.titlecode]}个字符`, trigger: 'change'}]"
                >
                  <template v-if="assetStage < 2 && (item.titlecode == 'detailedList' || item.titlecode == 'alternatives' || item.titlecode == 'reason') || (assetStage >= 2 && item.fileList.length > 0)">
                    <div style="clear: both;"></div>
                    <div :class="[assetStage > 2 ? 'report-container disable-edit' : 'report-container']">
                      <el-input 
                        placeholder="请输入..."
                        v-model="item.info" 
                        type="textarea" 
                        :autosize="{ minRows: 1 }" 
                        class="textarea-min-height" 
                        :disabled="assetStage > 2"
                        :validate-event="false"
                        @blur="inputblur(3, 'specifyManufacturerList', index, item.titlecode)"
                      ></el-input>
                      <el-upload
                        :class="[item.uploadImgFlag ? 'minHeight_112 upload-container' : 'minHeight_28 upload-container', assetStage >= 2 ? 'upload-container hide disabledUpload minHeight_90' : '']"
                        :action="apiUrl + '/common/file/uploadFileMulti'"
                        accept="image/jpg,image/jpeg,image/gif,image/png,bmp"
                        list-type="picture-card"
                        name="files"
                        :data="{ titlecode: item.titlecode }"
                        :http-request="uploadHttpRequest"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="(file, fileList) => { handleRemove(file, fileList, 'specifyManufacturerList', item.titlecode) }"
                        :on-change="(file, fileList) => { handleChange(file, fileList, 'specifyManufacturerList', item.titlecode) }"
                        :on-exceed="(file, fileList) => { handleExceed(file, fileList, 'purchaseReportList', item.titlecode) }"
                        :limit="2"
                        :file-list="item.fileList"
                        :multiple="false"
                        :disabled="assetStage >= 2"
                      >
                        <el-button class="uploadBtn" v-if="assetStage < 2">图片上传(选填)</el-button>
                      </el-upload>
                    </div>
                  </template>
                  <template v-else>
                    <el-input 
                      placeholder="请输入..."
                      v-model="item.info" 
                      type="textarea" 
                      :autosize="{ minRows: 1 }" 
                      class="textarea-min-height" 
                      :disabled="assetStage > 2"
                      :validate-event="false"
                      @blur="inputblur(3, 'specifyManufacturerList', index, item.titlecode)"
                    ></el-input>
                  </template>
                </el-form-item>
              </template>
            </td>
          </tr>

          <!-- <tr height="20" class="top-content-padding" v-if="itemType == 'update' && reviewData">
            <td colspan="9" style="border: none;"></td>
          </tr> -->

          <!-- <tr height="15" v-if="itemType == 'update' && reviewData">
            <td class="gap-container" colspan="9">
              <div class="gap-line-left"></div>
              <div class="gap-line-right"></div>
            </td>
          </tr> -->
          <tr class="review-header" v-if="itemType == 'update' && reviewData"><td colspan="9"><h3 class="titleHeaderText">规范审核（{{ reviewData.reviewer }}）</h3></td></tr>
          <tr height="35" v-if="itemType == 'update' && reviewData">
            <td class="bgTd" colspan="2">规范审核状态</td>
            <td colspan="7" class="boderTdRight">不规范</td>
          </tr>
          <tr height="35" v-if="itemType == 'update' && reviewData">
            <td class="bgTd" colspan="2">审批意见</td>
            <td colspan="7" class="boderTdRight">{{reviewData.reviewnote}}</td>
          </tr>
          <tr height="35" v-if="itemType == 'update' && reviewData">
            <td class="bgTd" colspan="2">审批人</td>
            <td colspan="2">{{reviewData.reviewer}}</td>
            <td class="bgTd" colspan="2">审批时间</td>
            <td colspan="3" class="boderTdRight">{{reviewData.reviewtime}}</td>
          </tr>
          <tr height="1" class="top-content-padding" v-if="itemType == 'update' && reviewData">
            <td colspan="9"></td>
          </tr>
        </table>

        <el-row class="btn-area btn-area-top">
          <el-button type="primary" @click="submitAssetApplyPlan('ruleForm', 'saveDraft')" v-if="assetStage <= 1">保存草稿</el-button>
          <el-button type="primary" @click="submitAssetApplyPlan('ruleForm', 'submitPlan')" v-if="assetStage <= 1">提交计划</el-button>
          <el-button type="primary" @click="submitAssetApplyPlan('ruleForm')" v-if="assetStage == 2">保存</el-button>
          <el-button type="primary" class="dangerBtn_666" @click="close" v-if="assetStage <= 2">取消</el-button>
          <el-button type="primary" @click="close" v-if="assetStage > 2 && eventType == 'detailclick'">关闭</el-button>
        </el-row>
      </el-form>
      <!-- 图片预览 -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <!-- 选择项目弹窗 -->
      <el-dialog title="选择项目" :visible.sync="itemTreeFlag" width="50%" class="item-tree-dialog">
        <div class="item-tree-container placeholderText_666">
          <el-input class="item-tree-input" placeholder="请输入" @input="getPlAndItemList" v-model="itemTreeText"></el-input>
          <treeselect 
            class="item-tree"
            :options="itemOptions" 
            :multiple="false" 
            :alwaysOpen="true"
            :searchable="false"
            :disableBranchNodes="true"
            @select="selectItem"
            noResultsText="没有匹配项"
            placeholder='请选择' 
            noOptionsText="没有匹配项"
          >
            <div slot="value-label" slot-scope="{ node }">
              <span style="margin-left: 8px">{{ node.raw.customLabel }}</span>
            </div>
          </treeselect>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import urlConfig from '@/http/urlConfig/index' //引入接口地址
import util from '../../util/utils'
import { mapState } from 'vuex';
export default {
  name: 'assetApplyDetail',
  data() {
    return {
      rules: {
        assetmanufacturer: [{ required: true, message: '厂家必填', trigger: 'change'}],
        assetname: [{ required: true, message: '物品名称必填',trigger: 'blur'}],
        assetmodel: [{ required: true, message: '型号必填',trigger: 'change'}],
        requireds: [{ required: true, message: '数量必填', trigger: 'blur'}],
        pprice: [{ required: true, message: '预计单价必填', trigger: 'blur'}],
        requireduser: [{ required: true, message: '申购人姓名/工号必填', trigger: 'blur'}],
        itemcode: [{ required: true, message: '项目编码必填', trigger: 'change'}],
        itemname: [{ required: true, message: '项目名称必填', trigger: 'blur'}],
        assetcategory: [{ required: true, message: '物品品类必填', trigger: 'change'}],
        receiverplace: [{ required: true, message: '到货地点必填', trigger: 'change'}],
        purpose: [{ required: true, message: '用途必填', trigger: 'blur'}],
        assetnote: [{ max: 500, message: '长度最长为500个字符', trigger: 'blur'}],
        reqarrivaldate: [{ required: true, message: '到货时间必填', trigger: 'blur'}],
      },
      
      assetPlanGlobalInfo: {
        assetplanid: '',
        assetmanufacturer: "",// 厂家
        assetInfoList: [{
          assetname: '',// 物品名称
          assetmodel: '',// 型号
          requireds: '',// 数量
          pprice:'',// 物品预计单价
          unitText: '',
        }],
        assetname: "",// 物品名称
        assetmodel: "",// 型号
        pprice: 0,// 物品预计单价
        requireds: 0,// 数量
        applyuser: '', // 当前系统登陆人
        requireduser: "",//申购人ID
        requiredUserType: '0', // 人员等级：1 => 一级部门主管  2 => 二级部门主管  3 => 三级部门主管  0 => 普通用户
        dept1code: "", 
        dept1name: "", 
        dept2code: "",
        dept2name: "",
        dept3name: "",
        dept3plannername: '',
        dept3plannercode: '',
        deptcode: "", // 三级部门Code
        plancode: "",
        planmonth: "",
        planner: "",
        plannernote: "",
        plannertime: "",
        itemcode: "",// 项目编码
        itemname: "",// 项目名称
        assetcategory: "",// 物品品类
        assetcategoryid: '',
        goodstime: '',// 货期
        expenseType: '', // 预算类型
        receiverplace: "",// 到货地点
        receiverpeople: "",// 选择到货地点带出来的计划员信息
        receiverplaceid: "",// 到货地点
        purpose: "",// 用途
        reqarrivaldate: "",// 要求到达时间
        assetnote: "",// 备注
        applytime: "",// 申请时间

        abnormalplanenum: 0,// 正常计划外的状态 => 0正常计划，1计划员激活，2管理员激活
        actualmoney: "",// 实际总金额
        apstage: "",// 物品所处的草稿阶段
        apstatus: "",// 审批状态code
        
        completesetcode: 0,
        deleteflag: "",
        iscompleteset: 0,
        isreqpurchasereport: '',
        isspecifymanufacturer: '',// 是否指定供应商,1是0否
        manufacturertypeenum: 0,// 供应商类别 枚举,1:事实上独家供应，2，申购部门指定 

        outtimeplanenum: 0,// 超时枚举: 0 超时失效，1 申请提交超时，2 规范审核超时,3三级主管超时，4二级主管超时
        requiredsaudit: 0,
        reviewer: "",
        reviewnote: "",
        reviewresult: 0,
        totalmoney: 0,
        purchaseReportList: [], //申购报告列表
        specifyManufacturerList: [], // 供应商报告
      },
      assetMaunFacturerList: [],// 厂家型号列表
      assetModelList: [],// 所选厂家下的型号列表
      assetCategoryAndGoodstimeList: [], // 物品类别和对应的货期列表
      receivePlaceList: [],// 到货地点列表
      itemCodeAndNameList: [],// 项目编码和项目名称列表
      timeout: 0,
      eventType: '', // 进入详情页面的时间方式， dblclick => 列表页面双击进入，detailclick => 列表页面点击详情进入
      assetStage: '1',// 资源申购计划当前所处阶段，1 => 申请阶段；2 => 规范审核阶段；3 => 三级主管审核阶段
      associateList: [],// 人员联想结果
      CB: null,// 保存申购人id输入框的回调函数
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000
        }
      },
      needReportFlag: false, // 是否需要报告，当预计单价总和>5000时，需要 申购报告 或者 指定供应商
      deptArr: [],
      showDeptTree: false,
      tempdept1code: "", 
      tempdept1name: "", 
      tempdept2code: "",
      tempdept2name: "",
      tempdept3name: "",
      tempdeptcode: "",
      tempPurchaseReportList: [],
      tempSpecifyManufacturerList: [],
      applyFiledLength: {}, // 各个字段长度
      firstClickAddBtnFlag: true,// 是否是第一次点击加号添加物品
      apiUrl: urlConfig.apiUrl,
      dialogImageUrl: '',// 图片预览
      dialogVisible: false,
      assetNoteRequiredFlag: false, //备注内容是否必填，当到货地点选择 其他 时，是必填的
      itemType: '', // 用于区分 在申请阶段的该条计划，是不规范条目还是未提交的条目，update => 表示 不规范条目
      reviewData: null,// 规范审核数据
      applyMonth: util.getCurrentMonth(),
      totalMoneySum: 0, // 申购总金额
      itemOptions: [],
      itemOptionsTemp: [],
      itemTreeFlag: false,
      itemTreeText: '',
      enableAddButton: false,
    }
  },

  components: {
    Treeselect
  },
  beforeRouteLeave(to, from, next) {
    this.$notify.closeAll()
    next()
  },

  mounted() {
    let that = this
    this.getAssetManuFacturerList();
    this.getAssetCategoryAndGoodstime();
    this.getReceivePlace();
    this.assetPlanGlobalInfo.applyuser = this.$store.state.Login.userInfo.workNum;
    this.eventType = this.$route.query.eventtype ? this.$route.query.eventtype : '';
    this.assetStage = this.$route.query.assetstage ? this.$route.query.assetstage : '';
    this.itemType = this.$route.query.itemtype ? this.$route.query.itemtype : '';
    if(this.$route.query && this.$route.query.assetplanid) {
      this.assetPlanGlobalInfo.assetplanid = this.$route.query.assetplanid;
      this.getDetail()
    } else {
      let curTime = new Date();
      this.assetPlanGlobalInfo.plancode = `${curTime.getFullYear()}-${curTime.getMonth() + 1 < 10 ? '0' + (curTime.getMonth() + 1) : curTime.getMonth() + 1}-${this.assetPlanGlobalInfo.applyuser}`;
    }
    // if(this.assetStage <= 1) {
    //   this.checkEnableAdd()
    // }
    if(this.assetStage <= 2) {// 申请和规范审核阶段进入详情页面可更改详情，所以读取列表页面表头信息中对字段长度限制的信息
      this.getApplyFiledLength();
      this.getTitleAndField();
      this.getDeptTree()
      this.getPlAndItemList()
      
      this.$store.dispatch('getAssociatedToken').then(res => {
        if(res.flag) {
          that.$store.commit('getAssociatedToken', res.data.token)
        }
      }, err => {
      });
    }
    if(this.itemType == 'update') {
      this.getApprovalRecord()
    }

    $('.vue-treeselect').on('click', function(e) {
      e.stopPropagation()
    })
    $(document).on('click', function (e) {
      e = window.event || e
      let target = e.srcElement || e.target
      if(target 
        && target.className.indexOf('select-dept-tree-btn') >= 0 
        || target.parentElement 
        && target.parentElement.className.indexOf('select-dept-tree-btn') >= 0) {
      } else {
        that.showDeptTree = false
      }
    })
  },

  watch: {
    'assetPlanGlobalInfo.assetcategory': {
      handler: function () {
        let that = this;
        that.assetCategoryAndGoodstimeList.forEach(item => {
          if(that.assetPlanGlobalInfo.assetcategory == item.id) {
            that.assetPlanGlobalInfo.goodstime = item.goodstime
            that.assetPlanGlobalInfo.expenseType = item.expenseType
          }
        })
      },
      deep: true
    },
    
    'assetPlanGlobalInfo.receiverplace': {
      handler: function () {
        let that = this;
        that.receivePlaceList.forEach(item => {
          if(that.assetPlanGlobalInfo.receiverplace == item.id) {
            that.assetPlanGlobalInfo.receiverpeople  = item.receiverpeople 
            if(that.assetPlanGlobalInfo.receiverplace == '7') {
              that.assetNoteRequiredFlag = true
            } else {
              that.assetNoteRequiredFlag = false
            }
          }
        })
      },
      deep: true
    },
    receivePlaceList: {
      handler: function () {
        let that = this;
        that.receivePlaceList.forEach(item => {
          if(that.assetPlanGlobalInfo.receiverplace == item.id) {
            that.assetPlanGlobalInfo.receiverpeople  = item.receiverpeople 
            if(that.assetPlanGlobalInfo.receiverplace == '7') {
              that.assetNoteRequiredFlag = true
            } else {
              that.assetNoteRequiredFlag = false
            }
          }
        })
      },
      deep: true
    },
    // 'assetPlanGlobalInfo.isspecifymanufacturer': {
    //    handler: function() {
    //     this.assetPlanGlobalInfo.manufacturertypeenum = 0;
    //   },
    // },

    associatedToken() {
      if(this.CB) {
        this.associateFn(this.assetPlanGlobalInfo.requireduser, this.CB)
      }
    },

    categoryChange (e) {
      let that = this;
      let assetCategoryAndGoodstimeList = e.assetCategoryAndGoodstimeList
      assetCategoryAndGoodstimeList.forEach(item => {
        if(that.assetPlanGlobalInfo.assetcategory == item.id) {
          that.assetPlanGlobalInfo.goodstime = item.goodstime
          that.assetPlanGlobalInfo.expenseType = item.expenseType
        }
      })
    }
  },

  computed: mapState({
    associatedToken: (state) => {
      return state.assetApplyDetail.associatedToken
    },

    categoryChange () {
      let assetCategoryAndGoodstimeList = this.assetCategoryAndGoodstimeList;
      return { assetCategoryAndGoodstimeList }
    }
  }),

  methods: {
    // 验证该用户是否可以新增
    checkEnableAdd() {
      let that = this
      this.$store.dispatch('checkEnableAdd').then(function (res) {
        that.enableAddButton = res.data
      }, function () { })
    },
    validateFn(prop, bool, msg) {
      // console.log(prop, bool, msg)
    },
    getApplyFiledLength() {
      let that = this
      that.$axios.get(urlConfig.assetMag.GETAPPLYFILEDLENGTH).then(function (res) {
        res.data.data.forEach(item => {
          that.$set(that.applyFiledLength, item.dic_code, Number(item.dic_name))
        })
      }, err => {})
    },
    // 人员联想 start
    getAssociatedUser(query, fun) {// 根据输入的内容获取结果
      let that = this
      that.$store.dispatch('getAssociatedUser', {
        param: query
      }).then(res => {
        if(res.flag) {
          that.associateList = res.data;
        }
        fun(res.data);
      }, err => {
      })
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
    // 人员联想 end

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

    querySearch(queryString, cb) {
      if(queryString.length > 3){
        this.getItemCodeAndName(queryString, (data) => {
          let results = [];
          results = data.filter(this.createFilter(queryString))
          results.forEach((item, index) => {
            item.value = item.itemcode;
          })
          cb(results);
        });
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        // return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase())> -1);
        //后台已做筛选,不需再过滤
        return (restaurant)
      };
    },

    itemCodeSelect() {
      let that = this;
      let flag = false;
      that.itemCodeAndNameList.forEach(item => {
        if(that.assetPlanGlobalInfo.itemcode == item.itemcode) {
          flag = true;
          that.rules.itemname[0].required = false;
          that.assetPlanGlobalInfo.itemname = item.itemname
        }
      })
      if(!flag) {
        that.rules.itemname[0].required = true;
        that.assetPlanGlobalInfo.itemname = '';
      }
    },
    selectItem(data, nodeObj) {
      let that = this
      that.assetPlanGlobalInfo.itemname = data.projectName
      that.assetPlanGlobalInfo.itemcode = data.projectNo
      that.itemOptions = []
      this.itemTreeFlag = false
    },
    openItemTree() {
      this.itemTreeFlag = !this.itemTreeFlag
      this.itemTreeText = ''
      if(this.itemTreeFlag) {
        this.itemOptions = JSON.parse(JSON.stringify(this.itemOptionsTemp))
      }
    },

    itemCodeChange() {
      this.assetPlanGlobalInfo.itemname = ''
      this.assetPlanGlobalInfo.itemcode = ''
    },

    // 项目编码和项目名称
    getItemCodeAndName(e, fun) {
      let that = this;
      if(!e.target.value) { 
        that.assetPlanGlobalInfo.itemcode = ''
        that.assetPlanGlobalInfo.itemname = ''
        return
      }
      this.$store.dispatch('getItemCodeAndName', {
        itemCode: e.target.value
      }).then(res => {
        if(res.data && res.data.length == 1) {
          that.assetPlanGlobalInfo.itemcode = res.data[0].itemcode
          that.assetPlanGlobalInfo.itemname = res.data[0].itemname
        } else {
          that.assetPlanGlobalInfo.itemcode = ''
          that.assetPlanGlobalInfo.itemname = ''
        }
      }, err => { })
    },
    getPlAndItemList(val) {
      let that = this
      that.$axios.get(`${urlConfig.GETPLANDITEMLIST}?type=1&param=${val ? val : ''}`).then(function (res) {
        if(res.data.data) {
          res.data.data.forEach((pl) => {
            pl.projectName = pl.pl_name
            pl.projectNo = pl.pl_no
            pl.data.forEach(item => {
              item.id = item.projectNo
              item.label = `${item.projectName}（${item.projectNo}）`
              item.projectNo = item.projectNo
              item.projectName = item.projectName
              item.customLabel = item.projectNo
            })
          })
          that.itemOptions = res.data.data.map(item => ({
            id: item.projectNo,
            projectNo: item.projectNo,
            projectName: item.projectName,
            label: item.pl_name ? item.projectName : `${item.projectName}（${item.projectNo}）`,
            customLabel: item.projectNo,
            children: item.data,
          }))
          if(!val) {
            that.itemOptionsTemp = JSON.parse(JSON.stringify(that.itemOptions))
          }
        } else {
          that.itemOptions = []
          that.itemOptionsTemp = []
        }
        
      }, err => {})
    },
    // 选择厂家
    assetManuFacturerSelect() {
      let that = this;
      let assetMaunFacturer = this.assetPlanGlobalInfo.assetmanufacturer;
      if(!that.assetPlanGlobalInfo.assetplanid) {
        this.assetPlanGlobalInfo.assetInfoList.forEach(item => {
          item.assetmodel = '';
        })
      }
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
    // 厂家输入事件
    assetManuFacturerChange() {
      let that = this;
      let assetMaunFacturer = this.assetPlanGlobalInfo.assetmanufacturer;
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
    inputblur(type, prop, index, subProp) {
      let that = this
      if(type == 1) {// 申购人等信息
        let maxLen = this.applyFiledLength[prop]
        that.assetPlanGlobalInfo[prop] = that.assetPlanGlobalInfo[prop].slice(0, maxLen);
      } else if (type == 2) {// 物品信息
        let maxLen = this.applyFiledLength[subProp]
        let tempData = that.assetPlanGlobalInfo.assetInfoList
        tempData[index][subProp] = tempData[index][subProp].slice(0, maxLen)
        that.$set(that.assetPlanGlobalInfo, prop, tempData)
      } else if (type == 3) {// 报告
        let maxLen = this.applyFiledLength[subProp]
        let tempData = that.assetPlanGlobalInfo[prop]
        tempData[index].info = tempData[index].info ? tempData[index].info.slice(0, maxLen) : ''
        that.$set(that.assetPlanGlobalInfo, prop, tempData)
      } else if (type == 4) {// 物品数量
        let maxLen = this.applyFiledLength.requireds
        let tempData = that.assetPlanGlobalInfo.assetInfoList
        if(String(tempData[index][subProp]).length > maxLen) {
          tempData[index][subProp] = String(tempData[index][subProp].slice(0, maxLen))
          that.$set(that.assetPlanGlobalInfo, prop, tempData)
        }
      } else if (type == 5) {// 物品价格
        let maxLen = this.applyFiledLength.pprice
        let tempData = that.assetPlanGlobalInfo.assetInfoList
        if(tempData[index].pprice.length > maxLen) {
          tempData[index].pprice = tempData[index].pprice.slice(0, maxLen)
          that.$set(that.assetPlanGlobalInfo, 'assetInfoList', tempData)
        }
      }
    },

    ppriceInput(index) {
      let that = this
      let tempData = that.assetPlanGlobalInfo.assetInfoList
      if(tempData[index].pprice.match(/^\d{1,9}(?:\.\d{0,2})?/)) {
        tempData[index].pprice = tempData[index].pprice.match(/^\d{1,9}(?:\.\d{0,2})?/)[0]
        if(Number(tempData[index].pprice) >= 100000000) {
          tempData[index].unitText = '亿'
        } else if(Number(tempData[index].pprice) >= 10000000) {
          tempData[index].unitText = '千万'
        } else if(Number(tempData[index].pprice) >= 1000000) {
          tempData[index].unitText = '百万'
        } else if(Number(tempData[index].pprice) >= 100000) {
          tempData[index].unitText = '十万'
        } else if(Number(tempData[index].pprice) >= 10000) {
          tempData[index].unitText = '万'
        } else if(Number(tempData[index].pprice) >= 1000) {
          tempData[index].unitText = '千'
        } else if(Number(tempData[index].pprice) >= 100) {
          tempData[index].unitText = '百'
        } else if(Number(tempData[index].pprice) >= 10) {
          tempData[index].unitText = '十'
        } else if(Number(tempData[index].pprice) >= 0) {
          tempData[index].unitText = '个'
        }   else {
          tempData[index].unitText = ''
        }
        that.$set(that.assetPlanGlobalInfo, 'assetInfoList', tempData)
      } else {
        tempData[index].unitText = ''
        tempData[index].pprice = ''
        that.$set(that.assetPlanGlobalInfo, 'assetInfoList', tempData)
      }
    },

    numInput(index, prop) {
      let that = this
      let tempData = that.assetPlanGlobalInfo.assetInfoList
      if(tempData[index][prop].match(/^\d+/)) {
        tempData[index][prop] = tempData[index][prop].match(/^\d+/)[0]
        that.$set(that.assetPlanGlobalInfo, 'assetInfoList', tempData)
      } else {
        tempData[index][prop] = ''
        that.$set(that.assetPlanGlobalInfo, 'assetInfoList', tempData)
      }
      
    },

    priceAndRequiredsBlur(idx, type) {
      let that = this
      if(idx || type) {
        if(type == 'requireds' || type == 'requiredsaudit') {
          that.inputblur(4, 'assetInfoList', idx, type)
        }
        if(type == 'pprice' ){
          that.inputblur(5, 'assetInfoList', idx, type)
        }
      }
      let totalMoney = 0;
      let totalPrice = 0;
      if(this.assetStage > 1) {// 在申请阶段，根据输入的预计单价和数量控制申购报告的显示和隐藏
        return;
      }
      this.assetPlanGlobalInfo.assetInfoList.forEach((item, index) => {
        item.pprice = item.pprice ? (Math.floor(Math.abs(item.pprice) * 100) / 100).toFixed(2) : '';
        item.requireds = item.requireds !== '' ? String(Math.floor(Math.abs(item.requireds))) : '';
        if(that.assetStage == 2) {
          item.requiredsaudit = item.requiredsaudit !== '' ? Math.floor(Math.abs(item.requiredsaudit)) : '';
        }
        totalPrice += Number(item.pprice);
        if(that.assetStage == 2) {
          totalMoney += Number(item.pprice) * item.requiredsaudit;
        } else {
          totalMoney += Number(item.pprice) * item.requireds;
        }
      })
      that.totalMoneySum = totalMoney
      // 预计单价之和 >= 5000 或者 物品总价之和 >= 10000 时，要填写申购报告或者指定供应商信息
      if(totalPrice >= 5000 || totalMoney >= 10000) {
        if(!this.needReportFlag) {
          this.needReportFlag = true
        } 
      } else {
        this.needReportFlag = false
        if(!this.assetStage) {
          this.assetPlanGlobalInfo.isspecifymanufacturer = ''
          this.assetPlanGlobalInfo.isreqpurchasereport = ''
        }
      }
    },
    // 是否指定供应商切换函数
    reportChange(val) {
      this.assetPlanGlobalInfo.manufacturertypeenum = 0;
      if(val == 0) {
        this.assetPlanGlobalInfo.isreqpurchasereport = 1;
      } else {
        this.$alert('只有运营商集采及功能性为唯一的设备才可以填指定申购报告', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });
        this.assetPlanGlobalInfo.isreqpurchasereport = 0;
      }
    },

    // 根据申购人ID获取一二三级部门和计划员信息
    getDeptInfoByCode(item) {
      let that = this;
      that.assetPlanGlobalInfo.requireduser = item.real_name + '/' + item.empcode
      this.$store.dispatch('getDeptInfoByCode', {
        empCode: item.empcode
      }).then(function(res) {
        let data = res.data;
        that.assetPlanGlobalInfo.dept1name = data ? data.dept1name : '';
        that.assetPlanGlobalInfo.dept1code = data ? data.dept1code : '';
        that.assetPlanGlobalInfo.dept2name = data ? data.dept2name : '';
        that.assetPlanGlobalInfo.dept2code = data ? data.dept2code : '';
        that.assetPlanGlobalInfo.dept3name = data ? data.dept3name : '';
        that.assetPlanGlobalInfo.deptcode = data ? data.dept3code : '';
        that.assetPlanGlobalInfo.dept3plannername = data ? data.dept3plannername : '';
        that.assetPlanGlobalInfo.dept3plannercode = data ? data.dept3plannercode : '';
        that.assetPlanGlobalInfo.reviewer = data ? data.dept3plannercode : '';
        that.assetPlanGlobalInfo.reviewername = data ? data.dept3plannername + '/' + data.dept3plannercode : '';
        that.assetPlanGlobalInfo.requiredUserType = data ? data.requiredUserType : '0';
        that.$forceUpdate()
      }, function(err) {

      })
    },
    requiredUserChange() {
      this.assetPlanGlobalInfo.requireduser = ''
    },

    // 获取申请部门树
    getDeptTree() {
      let that = this
      that.$axios.get(urlConfig.assetMag.DEPTINFOTREEGET).then(function (res) {
        that.deptArr = res.data.data;
      }, err => {})
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
    selectDept(data, nodeObj) {
      let that = this
      that.deptArr.forEach((firstItem, deptIndex) => {
        firstItem.children.forEach((secondItem) => {
          if(secondItem.deptCode == data.supDeptDode) {
            that.assetPlanGlobalInfo.dept1name = firstItem.deptName
            that.assetPlanGlobalInfo.dept2name = secondItem.deptName
            that.assetPlanGlobalInfo.dept1code = firstItem.deptCode
            that.assetPlanGlobalInfo.dept2code = secondItem.deptCode
          }
        })
      })
      this.showDeptTree = false
      this.assetPlanGlobalInfo.dept3name = data.deptName
      this.assetPlanGlobalInfo.deptcode = data.deptCode
      this.assetPlanGlobalInfo.dept3plannercode = data.deptPlannerCode ? data.deptPlannerCode : ''
      this.assetPlanGlobalInfo.dept3plannername = data.deptPlannerName ? data.deptPlannerName : ''
      this.assetPlanGlobalInfo.reviewer = data.deptPlannerCode ? data.deptPlannerCode : ''
      this.assetPlanGlobalInfo.reviewername = data ? data.deptPlannerName + '/' + data.deptPlannerCode : ''
    },

    // 物品类别和相应的货期
    getAssetCategoryAndGoodstime() {
      let that = this;
      this.$store.dispatch('getAssetCategoryAndGoodstime').then(res => {
        that.assetCategoryAndGoodstimeList = res.data;
      }, err => { })
    },

    // 获取到货地点
    getReceivePlace() {
      let that = this;
      this.$store.dispatch('getReceivePlace').then(res => {
        that.receivePlaceList = res.data;
      }, err => {})
    },
    receiverPalceFn(val) {
      if(val == '7' ) {
        this.$alert(`请在备注栏中补充具体地址`, '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });
      } else {
        this.$notify.closeAll()
      }
    },

    // 增加物品
    addAssetItem(index) {
      let that = this
      if(that.firstClickAddBtnFlag) {
        this.$confirm('同一厂家，同一用途，可添加', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        }).then(() => {
          that.firstClickAddBtnFlag = false
          that.$set(that.assetPlanGlobalInfo.assetInfoList, that.assetPlanGlobalInfo.assetInfoList.length, {
            assetname: '',// 物品名称
            assetmodel: '',// 型号
            requireds: '',// 数量
            pprice:'',// 物品预计单价
            assetplanid: 0,
          })
        }).catch(() => {
        });
      } else {
        that.$set(that.assetPlanGlobalInfo.assetInfoList, that.assetPlanGlobalInfo.assetInfoList.length, {
          assetname: '',// 物品名称
          assetmodel: '',// 型号
          requireds: '',// 数量
          pprice:'',// 物品预计单价
          assetplanid: 0,
        })
      }
    },
    // 删除物品
    deleteAssetItem(index) {
      this.assetPlanGlobalInfo.assetInfoList.splice(index, 1);
      this.priceAndRequiredsBlur()
    },
    getImagePathToBase64() {
      let that = this
      that.$axios.get(urlConfig.assetMag.GETIMAGEPATHTOBASE64 + '?assetplanid=' + that.assetPlanGlobalInfo.assetplanid).then(res => {
        let data = res.data.data
        if(data) {
          for(let key in data) {
            if(that.assetPlanGlobalInfo.isspecifymanufacturer) {
              that.assetPlanGlobalInfo.specifyManufacturerList.forEach((item, index) => {
                if(key == item.titlecode) {
                  for(let img in data[key]) {
                    item.fileList.push({
                      fileId: img,
                      url: 'data:image/png;base64,' + data[key][img]
                    })
                  }
                  if(item.fileList.length > 0) {
                    item.uploadImgFlag = true
                  }
                }
              })
            } else if(that.assetPlanGlobalInfo.isreqpurchasereport) {
              that.assetPlanGlobalInfo.purchaseReportList.forEach((item, index) => {
                if(key == item.titlecode) {
                  for(let img in data[key]) {
                    item.fileList.push({
                      fileId: img,
                      url: 'data:image/png;base64,' + data[key][img]
                    })
                  }
                  if(item.fileList.length > 0) {
                    item.uploadImgFlag = true
                  }
                }
              })
            }
          }
        }
      }, err => {})
    },
    // 获取详情 getAssetInfoByid
    getDetail() {
      let that = this;
      // let _funName = 'getAssetInfoByid'
      // if (that.$route.query.forQuery != undefined) {
      //   _funName = 'getAssetInfoByidForSearch'
      // }
      let _funName = 'getAssetInfoByidForSearch'
      this.$store.dispatch(_funName, {
        assetplanid: that.assetPlanGlobalInfo.assetplanid
      }).then(res => {
        if(res.success && res.data) {
          that.assetPlanGlobalInfo = Object.assign({}, res.data.lst[0]);
          if(res.data.specifyManufacturerInfo) {
            res.data.specifyManufacturerInfo.forEach(item => {
              item.fileList = []
              item.uploadImgFlag = false
            })
          }
          that.$set(that.assetPlanGlobalInfo, 'specifyManufacturerList', res.data.specifyManufacturerInfo ? res.data.specifyManufacturerInfo : that.tempSpecifyManufacturerList)
          if(res.data.purchaseReportInfo) {
            res.data.purchaseReportInfo.forEach(item => {
              item.fileList = []
              item.uploadImgFlag = false
            })
          }
          that.$set(that.assetPlanGlobalInfo, 'purchaseReportList', res.data.purchaseReportInfo ? res.data.purchaseReportInfo : that.tempPurchaseReportList)
          that.receivePlaceList.forEach(item => {
            if(res.data.lst[0].receiverplace == item.id) {
              that.assetPlanGlobalInfo.receiverpeople = item.receiverpeople 
            }
          })
          let assetList = [];
          res.data.lst.forEach((item, index) => {
            var obj = {};
            obj.assetname = item.assetname;
            obj.assetmodel = item.assetmodel;
            obj.pprice = item.pprice;
            obj.requireds = String(item.requireds);
            obj.requiredsaudit = String(item.requiredsaudit);
            obj.assetplanid = item.assetplanid;
            if(that.assetStage == 2) {
              obj.expensetype = item.expensetype;
            }
            assetList.push(obj);
          })
          this.$set(this.assetPlanGlobalInfo, 'assetInfoList', assetList)
          that.assetPlanGlobalInfo.isspecifymanufacturer = res.data.lst[0].isspecifymanufacturer === '' ? '' : Number(res.data.lst[0].isspecifymanufacturer);
          that.assetPlanGlobalInfo.reviewnote = res.data.lst[0].reviewnote ? res.data.lst[0].reviewnote : '';
          that.assetPlanGlobalInfo.requiredUserType = res.data.lst[0].requiredusertype ? res.data.lst[0].requiredusertype : '';
          that.assetPlanGlobalInfo.manufacturertypeenum = res.data.lst[0].manufacturertypeenum ? Number(res.data.lst[0].manufacturertypeenum) : 0;
          if(res.data.lst[0].isspecifymanufacturer == 1 || res.data.lst[0].isreqpurchasereport == 1) {
            that.needReportFlag = true
          }
          
          if(res.data.lst[0].reviewresult && res.data.lst[0].reviewresult == 2) {
            that.assetPlanGlobalInfo.reviewresult = '2';
          } else {
            that.assetPlanGlobalInfo.reviewresult = '1';
          } 

          that.assetManuFacturerSelect();
          if(that.assetStage == 1 && that.assetPlanGlobalInfo.assetplanid) {
            that.priceAndRequiredsBlur()
          }
          if(that.assetStage <= 2) {// 计算申购总金额
            let totalMoney = 0;
            that.assetPlanGlobalInfo.assetInfoList.forEach((item, index) => {
              item.pprice = item.pprice ? (Math.floor(Math.abs(item.pprice) * 100) / 100).toFixed(2) : '';
              // item.requireds = item.requireds !== '' ? String(Math.floor(Math.abs(item.requireds))) : '';
              item.requireds = item.requireds && item.requireds >= 0 ? String(Math.floor(Math.abs(item.requireds))) : '';
              if(that.assetStage == 2) {
                totalMoney += Number(item.pprice) * item.requiredsaudit;
              } else {
                totalMoney += Number(item.pprice) * (item.requireds ? item.requireds : 0);
              }
            })
            that.totalMoneySum = totalMoney
          }
          that.getImagePathToBase64()
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error'
          });
        }
      }, err => {
        
      })
    },
    /**
     * @btnType saveDraft:保存草稿  submitPlan:提交计划
     */
    submitAssetApplyPlan(formName, btnType) {
      let that = this;
      if(this.needReportFlag && this.assetPlanGlobalInfo.isspecifymanufacturer === '' && btnType != 'saveDraft') {
        this.$alert('申购单价≥5000或申购总价≥10000，需填写申购报告', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });
        return
      } else if(!this.needReportFlag) {
        that.assetPlanGlobalInfo.isreqpurchasereport = ''
        that.assetPlanGlobalInfo.isspecifymanufacturer = ''
      }
      if(this.needReportFlag && this.assetPlanGlobalInfo.isspecifymanufacturer === 1 && !this.assetPlanGlobalInfo.manufacturertypeenum && btnType != 'saveDraft') {
        this.$alert('请选择指定供应商类别', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });
        return
      }
      this.$refs[formName].validate((valid, obj) => {
        if (valid) {
          that.formatData(btnType)
        } else {// 校验失败  
          if(btnType == 'saveDraft') {
            that.formatData(btnType, obj)
            that.$refs[formName].clearValidate('')
          } else {
            if(obj.assetnote) {
              this.$alert(`请在备注栏中补充具体地址`, '提示', {
                confirmButtonText: '确定',
                callback: action => {}
              });
            } else if(obj.reviewnote) {
              this.$alert(`审核意见最长为${that.applyFiledLength.reviewnote}字`, '提示', {
                confirmButtonText: '确定',
                callback: action => {}
              });
            }else {
              this.$alert('请完善必填信息', '提示', {
                confirmButtonText: '确定',
                callback: action => {}
              });
            }
            return false;
          }
        }
      });
    },
    formatData(btnType, obj) {
      let that = this
      let data = {};
      data.lst = [];
      let assetInfo = {};
      let allInfo = that.assetPlanGlobalInfo;
      assetInfo.applyuser = allInfo.applyuser;// 当前系统登录人
      assetInfo.assetmanufacturer = allInfo.assetmanufacturer;
      let reg = /\/(\w+)$/g;
      let regResult = reg.exec(allInfo.requireduser)
      assetInfo.requireduser = regResult ? regResult[1] : '';
      if(allInfo.requiredUserType == 1) {
        if(allInfo.dept1code) {
          assetInfo.deptcode = allInfo.dept1code
        }
        if(allInfo.dept2code) {
          assetInfo.deptcode = allInfo.dept2code
        }
        if(allInfo.deptcode) {
          assetInfo.deptcode = allInfo.deptcode
        }
      }
      if(allInfo.requiredUserType == 2) {
        if(allInfo.dept2code) {
          assetInfo.deptcode = allInfo.dept2code
        }
        if(allInfo.deptcode) {
          assetInfo.deptcode = allInfo.deptcode
        }
      }
      if(allInfo.requiredUserType == 3 || allInfo.requiredUserType == 0) {
        assetInfo.deptcode = allInfo.deptcode
      }
      if(allInfo.requiredUserType == 1 && !allInfo.dept1code && btnType != 'saveDraft') {
        this.$alert('请选择一级部门', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });
        return
      }
      if(allInfo.requiredUserType == 2 && !allInfo.dept2code && btnType != 'saveDraft') {
        this.$alert('请选择二级部门', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });
        return
      }
      if((allInfo.requiredUserType == 3 || allInfo.requiredUserType == 0) && !allInfo.deptcode && btnType != 'saveDraft') {
        this.$alert('请选择三级部门', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        });
        return
      }
      if(allInfo.reviewer == allInfo.receiverpeople || !allInfo.receiverpeople) {
        assetInfo.reviewperson = allInfo.reviewer;
      } else {
        assetInfo.reviewperson = allInfo.reviewer + ',' + allInfo.receiverpeople
      }
      assetInfo.reviewer = allInfo.reviewer;
      assetInfo.itemcode = allInfo.itemcode;
      assetInfo.plancode = allInfo.plancode;
      assetInfo.assetcategory = allInfo.assetcategory;
      assetInfo.goodstime = allInfo.assetcategory;
      assetInfo.receiverplace = allInfo.receiverplace;
      assetInfo.purpose = allInfo.purpose;
      assetInfo.assetnote = allInfo.assetnote;
      assetInfo.applytime = util.FormatTime();
      assetInfo.iscompleteset = that.assetPlanGlobalInfo.assetInfoList.length > 1 ? 1 : 0;// 是否成套物品 默认否,1是0否
      assetInfo.completesetcode = allInfo.completesetcode ? allInfo.completesetcode : 0;// 成套编码 没有编码传0
      assetInfo.isreqpurchasereport = that.assetPlanGlobalInfo.isreqpurchasereport;// 是否需要申购报告 1需要0不需要
      assetInfo.isspecifymanufacturer = that.assetPlanGlobalInfo.isspecifymanufacturer;
      assetInfo.modifier = allInfo.applyuser;
      assetInfo.manufacturertypeenum = allInfo.manufacturertypeenum;// 供应商类别 枚举,1:事实上独家供应，2，申购部门指定 
      if(allInfo.assetplanid && that.eventType == 'detailclick' || that.assetStage == 2) {// 申请计划列表页面点击详情进行修改
        assetInfo.abnormalplanenum = allInfo.abnormalplanenum;
        assetInfo.apstage = allInfo.apstage;
        assetInfo.apstatus = allInfo.apstatus;
        assetInfo.applytime = allInfo.applytime;
        assetInfo.completesetcode = allInfo.completesetcode;
        assetInfo.deleteflag = allInfo.deleteflag;
        assetInfo.modifitime = util.FormatTime();
        assetInfo.outtimeplanenum = allInfo.outtimeplanenum;
        assetInfo.planmonth = allInfo.planmonth;
        assetInfo.reqarrivaldate = allInfo.reqarrivaldate;
      } else {// 申请计划列表页面直接点击新增按钮或者选中条目点击新增按钮
        assetInfo.planmonth = util.FormatTime();
        assetInfo.reqarrivaldate = allInfo.reqarrivaldate ? (allInfo.reqarrivaldate.indexOf('00:00:00') > 0 ? allInfo.reqarrivaldate : allInfo.reqarrivaldate + ' 00:00:00') : '';
      }

      if(that.assetStage == 2) {// 规范审核阶段添加 规范状态和审核意见
        assetInfo.reviewnote = that.assetPlanGlobalInfo.reviewnote
        assetInfo.reviewresult = that.assetPlanGlobalInfo.reviewresult
      }
      if( that.itemType == 'update') {
        assetInfo.reviewnote = that.reviewData.reviewnote
        assetInfo.reviewresult = '2'
        assetInfo.reviewtime = that.reviewData.reviewtime
      }
      that.assetPlanGlobalInfo.assetInfoList.forEach((item, index) => {
        let assetInfoTemp = Object.assign({}, assetInfo);
        if(that.assetStage == 2) {// 规范审核阶段的修改
          assetInfoTemp.assetplanid = item.assetplanid
          assetInfoTemp.expensetype = item.expensetype
        } else if(that.eventType == 'detailclick' && that.assetStage <= 1) {// 申请阶段的修改
          assetInfoTemp.assetplanid = that.assetPlanGlobalInfo.assetplanid && index == 0 ? that.assetPlanGlobalInfo.assetplanid : 0;
          assetInfoTemp.expensetype = that.assetPlanGlobalInfo.expenseType
        } else {// 新增
          assetInfoTemp.assetplanid = 0;
          assetInfoTemp.expensetype = that.assetPlanGlobalInfo.expenseType;
        }
        assetInfoTemp.assetname = item.assetname;
        assetInfoTemp.assetmodel = item.assetmodel;
        assetInfoTemp.pprice = item.pprice;
        assetInfoTemp.requireds = item.requireds;
        if(item.pprice && item.requireds) {
          assetInfoTemp.totalmoney = (Math.floor(item.pprice * item.requireds * 100) / 100).toFixed(2);
        } else {// 预计单价或数量其中一项为空时，该字段传空值
          assetInfoTemp.totalmoney = ''
        }
        if(that.assetStage == 2) {
          assetInfoTemp.requiredsaudit = item.requiredsaudit;
          assetInfoTemp.actualmoney = (Math.floor(item.pprice * item.requiredsaudit * 100) / 100).toFixed(2);
        } else {
          assetInfoTemp.requiredsaudit = item.requireds;
          if(item.pprice && item.requireds) {
            assetInfoTemp.actualmoney = (Math.floor(item.pprice * item.requireds * 100) / 100).toFixed(2);
          } else {// 预计单价或数量其中一项为空时，该字段传空值
            assetInfoTemp.actualmoney = ''
          }
        }
        data.lst.push(assetInfoTemp);
      })
      let imgTipFlag = false // 无图片附件
      if(assetInfo.isreqpurchasereport == 1) {
        data.purchaseReportInfo = []
        that.assetPlanGlobalInfo.purchaseReportList.forEach((item, index) => {
          let obj = {
            id: that.eventType == 'detailclick' || that.assetStage == 2 ? item.id : '',
            purchasereportid:  that.eventType == 'detailclick' || that.assetStage == 2 ? item.purchasereportid : '',
            titlecode: item.titlecode,
            info: item.info ? item.info : ''
          }
          if(btnType == 'submitPlan') {
            let picturePath = ''
            if(item.fileList.length == 1) {
              picturePath = item.fileList[0].fileId
            }else if(item.fileList.length == 2) {
              picturePath = item.fileList[0].fileId + ';' + item.fileList[1].fileId
            }
            obj.picturepath = picturePath 
          } 
          if(btnType == 'saveDraft' && item.fileList.length > 0) {
            imgTipFlag = true
          }
          data.purchaseReportInfo.push(obj)
        })

      }

      if(assetInfo.isspecifymanufacturer == 1) {
        data.specifyManufacturerInfo = []
        that.assetPlanGlobalInfo.specifyManufacturerList.forEach((item, index) => {
          let obj = {
            id: that.eventType == 'detailclick' || that.assetStage == 2 ? item.id : '',
            specifymanufacturerid :  that.eventType == 'detailclick' || that.assetStage == 2 ? item.specifymanufacturerid : '',
            titlecode: item.titlecode,
            info: item.info ? item.info : ''
          }
          if(btnType == 'submitPlan') {
            let picturePath = ''
            if(item.fileList.length == 1) {
              picturePath = item.fileList[0].fileId
            }else if(item.fileList.length == 2) {
              picturePath = item.fileList[0].fileId + ';' + item.fileList[1].fileId
            }
            obj.picturepath = picturePath
          } 
          if(btnType == 'saveDraft' && item.fileList.length > 0) {
            imgTipFlag = true
          }
          data.specifyManufacturerInfo.push(obj)
        })
      }
      // console.log(obj)
      if(obj 
      || (!obj && that.needReportFlag 
          && that.assetPlanGlobalInfo.isreqpurchasereport != 1 && that.assetPlanGlobalInfo.isspecifymanufacturer != 1 
          && that.assetPlanGlobalInfo.manufacturertypeenum === 0)
      || (!obj && that.needReportFlag 
          && (that.assetPlanGlobalInfo.isreqpurchasereport == '' || that.assetPlanGlobalInfo.isspecifymanufacturer == 1 )
          && that.assetPlanGlobalInfo.manufacturertypeenum === 0)
      ) { // 后一个条件兼容需要报告，然后选择指定供应商，但是没有选择供应商类别这种情况
        if(btnType == 'saveDraft' && obj) {
          let keysLength = Object.keys(obj).length
          if(that.assetPlanGlobalInfo.assetInfoList.length * 4 + 7 == keysLength && assetInfo.isspecifymanufacturer != 1 && assetInfo.isreqpurchasereport != 1) {
            that.$alert('未填写任何数据，请填写后保存草稿', '提示', {
              confirmButtonText: '确定',
              callback: action => {}
            });
            return
          }
        }
        let isPublicInfoFlag = false
        let assetIndexAry = []
        for(let key in obj) {
          if((key.indexOf('.assetmodel') < 0 && key.indexOf('.assetname') < 0 && key.indexOf('.pprice') < 0 && key.indexOf('.requireds') < 0) // 没通过校验的字段是公用字段
            || (that.needReportFlag && that.assetPlanGlobalInfo.isspecifymanufacturer == 1 && that.assetPlanGlobalInfo.manufacturertypeenum === 0) // 需要报告，但是没有指定供应商类别
            || (that.needReportFlag && that.assetPlanGlobalInfo.isreqpurchasereport == '' && that.assetPlanGlobalInfo.isspecifymanufacturer == '')/*需要报告，但是没有选择是否需要指定供应商*/) {
            isPublicInfoFlag = true
          } else {
            let beforeIndex = key.indexOf('[') + 1
            let afterIndex = key.indexOf(']')
            let assetIndex = key.substring(beforeIndex, afterIndex)
            if(assetIndexAry.indexOf(assetIndex) < 0) {
              assetIndexAry.push(assetIndex)
            }
          }
        }
        if(isPublicInfoFlag 
        || (!obj && that.needReportFlag && that.assetPlanGlobalInfo.isspecifymanufacturer == 1 && that.assetPlanGlobalInfo.manufacturertypeenum === 0)
        || (!obj && that.needReportFlag && that.assetPlanGlobalInfo.isreqpurchasereport == '' && that.assetPlanGlobalInfo.isspecifymanufacturer == '')) {
          data.lst.forEach((item, index) => {
            item.isComplete  = 0
          })
        } else {
          assetIndexAry.forEach(item => {
            data.lst.forEach((lstItem, index) => {
              if(index == item) {
                lstItem.isComplete = 0
              } else {
                lstItem.isComplete = 1
              }
            })
          })
        }
      } else {
        if(that.needReportValid() && (that.assetStage == 2 || that.assetStage == 1)) {
          data.lst.forEach((item, index) => {
            item.isComplete = 0
          })
        } else {
          data.lst.forEach((item, index) => {
            item.isComplete = 1
          })
        }
      }
      // console.log(btnType, data);
      if(imgTipFlag) {
        this.$confirm('当您保存草稿时，因信息管理安全要求，您对附件的操作无效。请知悉', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        }).then(() => {
          that.submitFn(data, btnType)
        }).catch(() => { });
      } else {
        if(btnType == 'submitPlan') {
          this.$confirm('请确认是否提交计划', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            cancelButtonClass: 'btn-custom-cancel',
            type: 'warning'
          }).then(() => {
            that.submitFn(data, btnType)
          }).catch(() => { });
        } else {
          that.submitFn(data, btnType)
        }
      }
    },

    submitFn(data, btnType) {
      let that = this
      let type;
      if(!that.assetStage && btnType == 'saveDraft') {// 新增并且点击保存草稿
        type = 'addAssetPlanInfo';
      } else if(!that.assetStage && btnType == 'submitPlan') {// 新增并且点击提交计划
        type = 'saveAndSubmitPlan';
      } else if (that.assetStage == 1 && that.assetPlanGlobalInfo.assetplanid && btnType == 'saveDraft') {//申请阶段，点击详情进入是修改条目,然后点击保存草稿
        type = 'editAssetPlanInfo';
      }  else if (that.assetStage == 1 && that.assetPlanGlobalInfo.assetplanid && btnType == 'submitPlan') {//申请阶段，点击详情进入是修改条目,然后点击提交计划
        type = 'saveAndSubmitPlan';
      } else if (that.assetStage == 2) {// 规范审核阶段的修改
        type = 'updateAllReviewInfo'
      }
      // console.log('submit data', data);

      that.$store.dispatch(type, data).then(res => {
        if(res.success) {
          if(that.assetStage == 2 && that.needReportValid()) {
            that.$alert('该资源计划申请需要确认是否指定供应商', '提示', {
              confirmButtonText: '确定',
              closeOnClickModal: false,
              callback: action => {
                that.$router.go(-1);
              }
            });
          } else {
            that.$router.go(-1);
          }
        } else {
          that.$message({
            showClose: true,
            message: res.message,
            type: 'error'
          });
        }
      }, err => { })
    },

    needReportValid() {// 在规范审核阶段判断是否需要指定供应商，若需要，仅给出提示
      let that = this
      let totalPrice = 0
      let totalMoney = 0
      this.assetPlanGlobalInfo.assetInfoList.forEach((item, index) => {
        item.pprice = item.pprice ? (Math.floor(Math.abs(item.pprice) * 100) / 100).toFixed(2) : '';
        item.requiredsaudit = item.requiredsaudit !== '' ? Math.floor(Math.abs(item.requiredsaudit)) : '';
        totalPrice += Number(item.pprice);
        totalMoney += Number(item.pprice) * item.requiredsaudit;
      })
      // 预计单价之和 >= 5000 或者 物品总价之和 >= 10000 时，要填写申购报告或者指定供应商信息
      if((totalPrice >= 5000 || totalMoney >= 10000) && this.assetPlanGlobalInfo.isreqpurchasereport == 0 && this.assetPlanGlobalInfo.isspecifymanufacturer == 0) {
        return true
        // this.$alert('该资源计划申请需要确认是否指定供应商', '提示', {
        //   confirmButtonText: '确定',
        //   closeOnClickModal: false,
        //   callback: action => {
        //     that.$router.go(-1);
        //   }
        // });
      } else {
        return false
        // that.$router.go(-1);
      }
    },

    close() {
      this.$router.go(-1);
    },
    goBackToDoList() {
      this.$router.go(-2);
    },

     // 获取申购报告和指定供应商字段
    getTitleAndField() {
      let that = this
      that.$axios.get(urlConfig.assetMag.GETTITLEANDFIELD).then(function (res) {
        if(res.data.success) {
          let data = res.data.data
          // 初始化报告中图片附件需要的数据
          data.purchaseReportInfo.forEach(item => {
            item.fileList = []
            item.uploadImgFlag = false
          })
          data.specifyManufacturerInfo.forEach(item => {
            item.fileList = []
            item.uploadImgFlag = false
          })
          if(that.$route.query.assetplanid) {// 需要通过详情接口获取信息
            if(that.assetPlanGlobalInfo.isspecifymanufacturer != 1) {
              that.$set(that.assetPlanGlobalInfo, 'specifyManufacturerList', data.specifyManufacturerInfo)
            } 
            if(that.assetPlanGlobalInfo.isreqpurchasereport != 1) {
              that.$set(that.assetPlanGlobalInfo, 'purchaseReportList', data.purchaseReportInfo)
            }
            // 该接口比详情接口慢，以防详情获取之后信息覆盖为空，存储初始信息
            that.tempPurchaseReportList = data.purchaseReportInfo
            that.tempSpecifyManufacturerList = data.specifyManufacturerInfo
          } else {
            that.$set(that.assetPlanGlobalInfo, 'purchaseReportList', data.purchaseReportInfo)
            that.$set(that.assetPlanGlobalInfo, 'specifyManufacturerList', data.specifyManufacturerInfo)
          }
        } 
      }, err => { })
    },

    handleRemove(file, fileList, type, prop) {
      let list = this.assetPlanGlobalInfo[type]
      list.forEach(item => {
        item.fileList.forEach((fileItem, fileIndex) => {
          if(fileItem.fileId == file.fileId) {
            item.fileList.splice(fileIndex, 1)
          }
        })
        if(item.titlecode == prop && fileList.length > 0) {
          item.uploadImgFlag = true
        } else if (item.titlecode == prop && fileList.length == 0) {
          item.uploadImgFlag = false
        }
      })
      this.$set(this.assetPlanGlobalInfo, type, list)
    },
    handleChange(file, fileList, type, prop) {
      if(file.size > 3072000) {
        fileList.splice(fileList.length -1 , 1)
        return false
      }
      let list = this.assetPlanGlobalInfo[type]
      list.forEach(item => {
        if(item.titlecode == prop && fileList.length > 0) {
          item.uploadImgFlag = true
          item.fileList.push(file)
        } else if (item.titlecode == prop && fileList.length == 0) {
          item.uploadImgFlag = false
          item.fileList.push(file)
        }
      })
      this.$set(this.assetPlanGlobalInfo, type, list)
    },
    handleExceed(file, fileList, type, prop) {
      this.$message({
        message: '区域中最多上传两张图片',
        type: 'warning'
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadHttpRequest(params) {
      let that = this
      if(params.file.size > 3072000) {
        this.$message({
          message: '上传图片大小不能超过 3MB!',
          type: 'warning'
        });
        return false
      }
      let titlecode = params.data.titlecode
      let fd = new FormData();
      fd.append("files", params.file);
      this.$axios.post(that.apiUrl + '/common/file/uploadFileMulti', fd).then(res => {
        let response = res.data
        if(response.success) {
          if(that.assetPlanGlobalInfo.isspecifymanufacturer === 1) {
            that.assetPlanGlobalInfo.specifyManufacturerList.forEach((item, index) => {
              if (item.titlecode == titlecode) {
                item.fileList[item.fileList.length - 1].fileId = response.data.fileId
              }
            })
          } else {
            that.assetPlanGlobalInfo.purchaseReportList.forEach((item, index) => {
              if (item.titlecode == titlecode) {
                item.fileList[item.fileList.length - 1].fileId = response.data.fileId
              }
            })
          }
        }
      }, err => { })
    },
    getApprovalRecord() {
      let that = this
      that.$axios.get(urlConfig.assetPlanApprovalQuery.ASSETPLANAPPROVALRECORDGET + '?assetplanid=' + that.assetPlanGlobalInfo.assetplanid).then(function (res) {
        if (res.data.status == 0) {
          that.reviewData = res.data.data[1]
        } else {
          that.$message({
            type: 'warning',
            message: res.data.message
          })
        }
      }, function (err) { })
    },

  }
}
</script>

<style lang="scss" scoped>
  .formBox {
    background: #fff;
    // padding: 15px 20px 20px;
    margin-bottom: 30px;
    .line {
      display: inline-block;
      margin: 0 10px;
      width: 1px;
      height: 12px;
      background-color: #e1e1e1;
      vertical-align: -1px;
    }
    .item-label_14 {
      font-size: 14px;
      line-height: 22px;
      font-weight: normal;
      vertical-align: top;
    }
    .text-blue {
      color: #386ed3;
      font-weight: 600;
    }
  }
  #app .formBox .select-dept-tree-btn {
    padding: 0 5px;
    width: 80px;
    height: 28px;
  }
  .table-container {
    margin: 15px auto 0;
    width: 100%;
    background-color: #ffffff;
    border: transparent;
    tr td {
      padding: 0px 10px;
      box-sizing: border-box;
      border: 1px solid #c9ddf7;
      border-bottom: transparent;
      border-right: transparent;
    }
    .top-content-padding td {
      border: transparent;
      border-top: 1px solid #c9ddf7;
    }
    tr .boderTdRight {
      border-right: 1px solid #c9ddf7;
    }
    tr .borderTdNoLeft {
      border-left: transparent;
    }
    tr .boderTdBottom {
      border-bottom: 1px solid #c9ddf7;
    }
    tr .add-btn-container {
      padding: 2px 10px;
      text-align: center;
      .add-btn {
        cursor: pointer;
        width: 50px;
        i {
          color: #386ED3;
          font-size: 16px;
        }
        .remove-icon {
          margin-left: 10px;
        }
      }
    }
    tr .gap-container {
      position: relative;
      border: transparent;
      background-color: #f2f2f2;
      border-top: transparent;
      .gap-line-left {
        position: absolute;
        top: 0;
        left: -22px;
        width: 22px;
        height: 15px;
        background: #f2f2f2;
      }
      .gap-line-right {
        position: absolute;
        top: 0;
        right: -22px;
        width: 22px;
        height: 15px;
        background: #f2f2f2;
      }
    }
    .report-container {
      border: 1px solid #DCDFE6;
      padding: 10px 15px 15px;
      .upload-tip {
        margin-top: 8px;
        line-height: 1;
        font-size: 12px;
        color: #999;
      }
    }
    .disable-edit {
      padding: 5px 15px 0;
    }
    .redMark {
      color: #EB2F3E;
      margin-right: 4px;
    }
    .dept-line {
      color: #ddd;
      margin: 0 10px;
    }
    .review-header {
      height: 50px;
      line-height: 50px;
      td {
        border: none;
        padding: 0;
      }
    }
  }
  
  .assetApplyDetail .boldTR td {
    font-weight: 900;
    font-size: 14px;
    height: 40px;
    padding: 0;
    border: transparent;
  }
  .assetApplyDetail .noBorderTop td {
    border-top: none;
  }
  .tipDiv {
    color: #8F8F8F;
    font-size: 14px;
    font-weight: 400;
    padding-top: 5px;
  }
  .specifyTR td:first-child {
    vertical-align: top;
    border: transparent;
    border-top: none;
    padding: 0;
    height: 39px;
    line-height: 39px;
  }
  .specifyTR .el-form-item {
    margin-bottom: 0;
  }
  .specifyTR .boldFormItem {
    font-weight: 900;
  }
  .select-dept-td {
    position: relative;
  }
  .select-btn {
    display: inline-block;
    // position: absolute;
    // right: 10px;
  }
  .btn-area {
    text-align: center;
  }
  .btn-area-top {
    margin-top: 15px;
  }
  .upload-container {
    margin-top: 10px;
    position: relative;
    .uploadBtn {
      width: 106px!important;
      height: 28px!important;
      font-size: 12px;
      color: #386ED3!important;
      border: 1px solid #386ED3!important;
      background-color: #f2f7fd;
    }
  }
  .minHeight_28 {
    min-height: 28px;
  }
  .minHeight_112 {
    min-height: 112px;
  }
  .minHeight_90 {
    min-height: 90px;
  }
  .uintText {
    position: absolute;
    top: 12px;
    right: 14px;
    font-size: 12px;
    color: #aaa;
    transform: scale(0.9);
  }
  .item-select-input {
    display: inline-block;
    width: 75%;
  }
  .item-select-btn {
    position: relative;
    top: -1px;
    display: inline-block;
    padding: 0!important;
    width: 25%!important;
    height: 26px!important;
    font-size: 12px;
    border-radius: 0!important;
  }
  .item-tree-container {
    padding-top: 10px;
    background-color: #fff;
    text-align: center;
    .item-tree-input {
      margin: 0 auto 10px;
      width: 100%;
    }
  }   
</style>
<style>
  .assetApplyDetail .el-form-item {
    width: 100%;
    display: inline-block;
    margin-bottom: 0 !important;
  }
  .assetApplyDetail .el-autocomplete, .assetApplyDetail .el-date-editor.el-input {
    width: 100%;
  }
  .assetApplyDetail .boldTR .el-switch__label * {
    font-weight: 900;
    font-size: 16px;
  }
  .assetApplyDetail .specifyTR .boldFormItem .el-form-item__label {
    color: #333;
  }
  .assetApplyDetail .specifyTR .boldFormItem:first-child .el-form-item__label {
    padding: 0;
  }
  .assetApplyDetail .el-switch__label.is-active {
    color: #333;
  }
  .textarea-min-height /deep/ textarea{
    height: 34px;
  }
  .disable-edit /deep/ textarea {
    padding: 0;
    border: none;
  }
  .assetApplyDetail .el-upload-list--picture-card .el-upload-list__item {
    width: 74px;
    height: 74px;
    line-height: 80px;
    margin-bottom: 0;
  }
  .assetApplyDetail .el-upload-list {
    position: absolute;
    top: 40px;
  }
  .assetApplyDetail .el-upload--picture-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 106px;
    height: 32px;
    border: none;
    line-height: 1;
  }
  .disabledUpload .el-upload-list {
    position: absolute;
    top: 0;
  }
  .assetApplyDetail .el-upload-list--picture-card .el-upload-list__item.is-success {
    line-height: 1;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions {
    font-size: 16px;
  }
  .noTip /deep/ .el-form-item__error {
    display: none!important;
  }
  .hide .el-upload--picture-card {
    display: none;
  }
  .assetApplyDetail .dept-tree {
    position: absolute;
    top: 32px;
    left: 10px;
    width: 300px;
  }
  .assetApplyDetail .dept-tree .vue-treeselect__control {
    border-radius: 0;
    padding-left: 10px;
    width: 100%;
  }
  .vue-treeselect__control .vue-treeselect__placeholder {
    color: #666;
  }
  .assetApplyDetail .dept-tree .vue-treeselect__control .vue-treeselect__value-container {
    line-height: 20px;
  }
  .assetApplyDetail .item-tree .vue-treeselect__control {
    display: none;
  }
  
  .item-tree-dialog .el-dialog__body{
    padding: 0 20px;
    height: 400px;
  }
  .el-input__suffix .el-input__icon, .el-range-separator {
    line-height: 34px!important;
  }
</style>