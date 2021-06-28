const assetPlanApprovalQuery = {
  state: {
    formData: {
      apStage: '', //申请状态
      planCode: '', //申请单号
      requiredUser: '', //申购人ID
      applyUser: '', // 填报人
      applyTime: [], //申请日期
      assetName: '', //物品名称
      assetModel: '', //物品型号
      assetcategory: '',// 物品型号
      deptCode: null, //申请部门编码
      deptLevel: '',
      assetManufacturer: '', //厂家
      receiverPlace: '', //到货地点
      abnormalPlanEnum: '', //申请类别
      itemCode: '', //项目编码
      isReqPurchaseReport: '', //是否含有申请报告
      isSpecifyManufacturer: '', //是否指定供应商
      applyResult: '', //审批结果
      outTimePlanEnum: '', //审批超时
      isBpm: '', // 是否已发起非生产,是1 否0  其他空
      bpmCode: '', // 非生产的流程编码
      pageNum: 1,
      pageSize: 20
    }
  },
  getter: {},
  mutations: {
    clearSearchForm(state) {
      state.formData = {
        apStage: '', //申请状态
        planCode: '', //申请单号
        requiredUser: '', //申购人ID
        applyUser: '', // 填报人
        applyTime: [], //申请日期
        assetName: '', //物品名称
        assetModel: '', //物品型号
        assetcategory: '',// 物品型号
        deptCode: null, //申请部门编码
        deptLevel: '',
        assetManufacturer: '', //厂家
        receiverPlace: '', //到货地点
        abnormalPlanEnum: '', //申请类别
        itemCode: '', //项目编码
        isReqPurchaseReport: '', //是否含有申请报告
        isSpecifyManufacturer: '', //是否指定供应商
        applyResult: '', //审批结果
        outTimePlanEnum: '', //审批超时
        isBpm: '', // 是否已发起非生产
        bpmCode: '', // 非生产的流程编码
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  
}

export default assetPlanApprovalQuery