console.log(`location: ${location}`)
console.log(process.env)
console.log(`window.configUrl: ${window.configUrl}`)

var ApiUrl = window.configUrl
var GetUserUrl = window.configGetUserUrl
var isSIT = window.isSIT ? true : false 
//这里存储全局接口
const HTTP = ApiUrl

export default {
  apiUrl: ApiUrl,
  //测试登录
  testLogin: HTTP + '/login',
  //单点登录
  ssoLogin: {
    SSOLOGIN: HTTP + '/ssoLogin',
    SSOLOGINOUT: HTTP + '/ssoLoginOut',
    //获取登录人信息和权限资源树
    // LOGINUSERINFO: HTTP + '/user/getUser',
    LOGINUSERRESOURCEGET: HTTP + '/resource/getCurrentResourceTree',
  },

  // 角色管理
  roleMag: {
    CHECKISADMIN: HTTP + '/role/checkIsAdmin', // 验证是否为管理员
  },

  // 帮助
  HELPURL: HTTP + '/assetplan/homePage/download',

  // 获取物料相关申请，待办，查询的url配置 
  GETMATERIEL: HTTP + '/dic/getMateriel',

  // 人员联想
  associatedUserMag: {
    GETASSOCIATEDTOKEN: GetUserUrl + '/common/getToken',// 获取相关系统的token
    // getRegularEmployee => 在职正式员工   getDevelopmentPerson => 联想部门标识是研发的人员
    GETASSOCIATEDUSER: isSIT ? GetUserUrl + '/api/user/getRegularEmployee' : GetUserUrl + '/api/user/getDevelopmentPerson',// 获取联想数据
    GETREGULAREMPLOYEE: GetUserUrl + '/api/user/getRegularEmployee',// 在职正式员工
    //（包括离职）华三和云数的员工或华三研发正式员工，0表示华三和云数的所有员工，1表示华三的研发员工，默认0
    GETEMPLOYEESBYUSERTYPE: GetUserUrl + '/api/user/getEmployeesByUserType',
  },

  //资源申购计划查询
  assetPlanApprovalQuery: {
    ASSETPLANINFOLISTGET: HTTP + '/assetplan/search/listOfAssetPlanInfo',
    DEPTINFOTREEGET: HTTP + '/assetplan/search/getDeptTreeInfo',
    ASSETPLANINFOACTIVATE: HTTP + '/assetplan/search/activateAssetPlanInfoByIds',
    ASSETPLANINFOEXPORT: HTTP + '/assetplan/search/exportAssetPlanInfoByIds',
    ASSETPLANAPPROVALRECORDGET: HTTP + '/assetplan/search/getApprovalRecordById',
    GETAPPROVALRECORDBYIDFORDETAIL: HTTP + '/assetplan/search/getApprovalRecordByIdForDetail',// 三级以及三级之后审核列表页面详情按钮的审批记录信息
    CHECKCOA: HTTP + '/assetplan/search/checkCoa', //验证勾选流程coa是否同一个
    CHECKISWRITEBPMCODE: HTTP + '/assetplan/search/checkIsWriteBpmCode', //验证勾选流程是否已回写bpm编码
    GETTABLETITLEINFO: HTTP + '/assetplan/search/tableTitle', //获取列表表头信息
  },

  // 根据当前登录人的工号获取待处理信息
  GETTODOINFOBYAPPLYCODE: HTTP + '/assetplan/homePage/getTodoInfoByApplyCode',
  // 根据当前登录人获取不规范信息 
  GETUPDATEINFOBYAPPLYCODE: HTTP + '/assetplan/homePage/getTodoInfoByRequiredUser',

  // 获取厂家型号等信息
  assetManuFacturerMag: {
    MANUFACTURERGET: HTTP + '/assetplan/apply/getAssetManufacturerList'
  },

  // 根据申购人查询123级部门和计划员
  GETDEPTINFOBYCODE: HTTP + '/assetplan/apply/getInfoListByRequiredUser',
  // 获取物品类别和相应的货期 
  GETASSETCATEGORYANDGOODSTIME: HTTP + '/assetplan/apply/getAssetCategoryAndGoodstime',
  // 获取到货地点
  GETRECEIVERPLACE: HTTP + '/assetplan/apply/getReceiverPlaceList',
  // 项目编码联想返回top20项目编码和项目名称
  GETITEMCODEANDNAME: HTTP + '/assetplan/apply/getItemCodeTop20',

  // 搜索时用的常量接口
  GETCATEGORYGOODSTIMEFORSEARCH: HTTP +  '/assetplan/apply/getCategoryGoodstimeForSearch',// 物品类别
  GETRECEIVERPLACELISTFORSEARCH: HTTP +  '/assetplan/apply/getReceiverPlaceListForSearch',// 到货地点
  GETITEMCODETOP20FORSEARCH: HTTP +  '/assetplan/apply/getItemCodeTop20ForSearch',// 项目编码
  GETASSETMANUFACTURERLISTFORSEARCH: HTTP +  '/assetplan/apply/getAssetManufacturerListForSearch',// 厂家型号

  
  GETPLANDITEMLIST: HTTP  + '/assetplan/apply/getPlAndItemList', // 产品线和项目编码信息
  // 资源计划管理
  assetMag: {
    UPDATELIST: HTTP + '/assetplan/apply/getTodoInfoList',// 资源申请计划不规范列表
    RESOURCEGETBYCODE: HTTP + '/assetplan/apply/getDraftInfoList',// 资源申请计划列表
    GETASSETPLANINFOBYIDFORSEARCH: HTTP + '/assetplan/apply/getAssetPlanInfoByIdForSearch',//资源计划查看页面的详情
    GETASSETPLANINFOBYID: HTTP + '/assetplan/apply/getAssetPlanInfoById',// 查看单条资源信息
    ADDASSETPLANINFO: HTTP + '/assetplan/apply/addAssetPlanInfo',// 新增资源计划
    UPDATEASSETPLANINFO: HTTP + '/assetplan/apply/editAssetPlanInfo',// 修改资源信息
    DELETEASSETPLANINFO: HTTP + '/assetplan/apply/delAssetPlanInfo',// 删除资源信息
    SUBMITASSETPLANINFOBYIDS: HTTP + '/assetplan/apply/submitAssetPlanInfoByIds', // 勾选指定资源信息提交至规范审核
    CHECKBUTTONISADD: HTTP + '/authorization/checkButtonIsAdd', // 验证用户是否可添加
    GETTITLEANDFIELD: HTTP + '/assetplan/apply/getTitleAndField',// 获取申购报告和供应商报告
    GETAPPLYFILEDLENGTH: HTTP + '/assetplan/apply/getApplyFiledLength', // 获取必填字段的长度信息
    DEPTINFOTREEGET: HTTP + '/assetplan/search/getDeptTreeInfoForApply',
    SAVEANDSUBMITPLAN: HTTP + '/assetplan/apply/submitAssetPlanInfoByIdsOnAddPage',// 新增页面保存并直接至规范审核
    GETIMAGEPATHTOBASE64: HTTP + '/assetplan/apply/getImagePathToBase64', // 根据图片路径返回base64字符串
    GETINFOBYIDFORDEPT3ANDOTHER: HTTP + '/assetplan/apply/getInfoByIdForDept3AndOther', //查看单条资源信息（查询记录，三级页面以后的详情专用）
  },

  // 规范审核管理
  assetPlanReviewMag: {
    GETASSETPLANREVIEWLIST: HTTP + '/assetplan/review/getReviewInfoList', // 获取规范审核列表
    GETASSETPLANREVIEWBYFILTER: HTTP + '/assetplan/review/getReviewResult',// 规范审核状态筛选
    EMAILFORNOTREVIEW: HTTP + '/assetplan/review/emailForNotReview',//手工不规范邮件提醒
    SUBMITINFOFROMREVIEWTODEPT3: HTTP + '/assetplan/review/submitInfoFromReviewToDept3',// 规范审核页面提交至三级部门主管审核
    UPDATEREVIEWINFOLIST: HTTP + '/assetplan/review/updateReviewInfoList',// 修改规范审核列表信息字段(厂家/型号/预计单价/类别/规范审核状态/审核意见)
    UPDATEALLREVIEWINFO: HTTP + '/assetplan/review/updateAllReviewInfo',// 修改规范审核列表信息字段(厂家/型号/预计单价/类别/规范审核状态/审核意见)
    UPDATEREVIEWRESULT: HTTP + '/assetplan/review/updateReviewResult',// 批量审核
    reviewSearch: HTTP + '/assetplan/review/getSearchResultForReview',// 规范审核页面查询筛选功能部门（支持1-3级部门），审核状态（全部、规范、不规范、未审核），金额（支持范围筛选）
  },

  // 三级主管审核管理
  assetPlanDept3Mag: {
    GETDEPT3INFOLIST: HTTP + '/assetplan/dept3/getDept3InfoList', // 获取三级主管审核列表信息
    UPDATEDEPT3INFOLIST: HTTP + '/assetplan/dept3/updateDept3InfoList',// 三级部门页面修改同意申购数量和审核意见
    SUBMITINFOFROMDEPT3TODEPT2: HTTP + '/assetplan/dept3/submitInfoFromDept3ToDept2',// 三级部门审核页面提交至二级部门审核
    GETBUDGETINFOLIST: HTTP + '/assetplan/dept3/getBudgetInfoList',// 预算列表展示（二三级部门页面通用）
  },

  // 二级主管审核管理
  assetPlanDept2Mag: {
    GETDEPT2INFOLIST: HTTP + '/assetplan/dept2/getDept2InfoList', // 获取二级主管审核列表信息
    UPDATEDEPT2INFOLIST: HTTP + '/assetplan/dept2/updateDept2InfoList',// 二级部门页面修改同意申购数量和审核意见
    SUBMITINFOFROMDEPT2TOPLANNER: HTTP + '/assetplan/dept2/submitInfoFromDept2ToPlanner',// 二级部门审核页面提交至计划员审核
  },
  
  // 使用率信息管理
  usageRateMag: {
    GETRATE: HTTP + '/usageRate/getRate',// 获取使用率
    GETRATELIST: HTTP + '/usageRate/getRateList',// 获取使用率
  },
  
  //计划员审核
  plannerReview: {
    GETPLANNERINFOLIST: HTTP + '/assetplan/planner/getPlannerInfoList',
    UPDATEPLANNERINFOLIST: HTTP + '/assetplan/planner/updatePlannerInfoList',
    SUBMITPLANNERINFOLIST: HTTP + '/assetplan/planner/submitInfoFromPlannerToOQDept',
    EXPORTASSETPLANINFOFORPLANNER: HTTP + '/assetplan/planner/exportAssetPlanInfoForPlanner',// 导出到Excel
  },

  //专家团审核
  expertGroupReview: {
    GETPLANNERINFOLIST: HTTP + '/assetplan/OQDept/getOQDeptInfoList',
    UPDATEPLANNERINFOLIST: HTTP + '/assetplan/OQDept/updateOqdeptInfoList',
    SUBMITPLANNERINFOLIST: HTTP + '/assetplan/OQDept/submitInfoFromOQDeptToDept1',
  },

  //一级部门主管审核
  assetPlanDept1Review: {
    GETPLANNERINFOLIST: HTTP + '/assetplan/dept1/getDept1InfoList',
    UPDATEPLANNERINFOLIST: HTTP + '/assetplan/dept1/updateDept1InfoList',
    SUBMITPLANNERINFOLIST: HTTP + '/assetplan/dept1/submitInfoFromDept1ToEnd',
    DEPT1AGREE: HTTP + '/assetplan/dept1/agree',
    DEPT1UNAGREE: HTTP + '/assetplan/dept1/unagree',

  },

  chartMag: {
    BARCHARTBYDEPTCODE: HTTP + '/assetplan/report/barChartByDeptCode', //柱状图按部门和收益统计
    LINECHARTBYAPPLYMONTH: HTTP + '/assetplan/report/lineChartByApplymonth', //折线图按年月和收益统计
    LISTOFASSETPLANINFOREPORT: HTTP + '/assetplan/report/listOfAssetPlanInfoReport', //获取所有资产查询报表数据信息
    PIECHARTBYMODEL: HTTP + '/assetplan/report/pieChartByModel', //饼图按类型和收益统计
    GETBUDGETDEPTLIST: HTTP + '/assetplan/report/getBudgetDeptList', // 返回所有的预算部门列表
  },
  settingMag: {
    // 部门树
    DEPTINFOTREEGET: HTTP + '/assetplan/search/getDeptTreeInfoNormal',
    // 到货地点
    ADDRADD: HTTP + '/addr/add',// 新增
    ADDRDEL: HTTP + '/addr/del',// 删除
    ADDREDIT: HTTP + '/addr/edit',// 修改
    ADDRGETBYID: HTTP + '/addr/getByID',// 根据主键获取数据
    ADDRLIST: HTTP + '/addr/list',// 获取列表
    ADDRMOVEUPORDOWN: HTTP + '/addr/moveUpOrDown', //上移下移功能
    // 部门预算
    BUDGETADD: HTTP + '/budget/add',// 新增
    BUDGETDEL: HTTP + '/budget/del',// 删除
    BUDGETEDIT: HTTP + '/budget/edit',// 修改
    BUDGETGETBYID: HTTP + '/budget/getByID',// 根据主键获取数据
    BUDGETLIST: HTTP + '/budget/list',// 获取列表
    BUDGETIMPORT: HTTP + '/budget/import', //导入预算
    // 物品类别和货期
    CATEGORYADD: HTTP + '/category/add',// 新增
    CATEGORYDEL: HTTP + '/category/del',// 删除
    CATEGORYEDIT: HTTP + '/category/edit',// 修改
    CATEGORYGETBYID: HTTP + '/category/getByID',// 根据主键获取数据
    CATEGORYLIST: HTTP + '/category/list',// 获取列表
    CATEGORYMOVEUPORDOWN: HTTP + '/category/moveUpOrDown', //上移下移功能
    // 厂家型号相关配置
    MANUFACTORYADD: HTTP + '/manufactor/addManufacturer', // 新增厂家
    MODELADD: HTTP + '/manufactor/addModel', // 新增型号
    MANUFACTORYEDIT: HTTP + '/manufactor/editManufacturer', // 修改厂家
    MODELEDIT: HTTP + '/manufactor/editModel', // 修改型号
    MANUFACTORYGETBYID: HTTP + '/manufactor/getByManufacturerID', // 根据主键id获取厂家信息
    MODELGETBYID: HTTP + '/manufactor/getByMOdelID', // 根据主键id获取型号信息
    MANUFACTORYLIST: HTTP + '/manufactor/list', // 获取列表
    // 系统审批角色审批人
    APPROVEREDIT: HTTP + '/approver/edit', // 修改
    APPROVERGETBYID: HTTP + '/approver/getByID', // 获取详情
    APPROVERLIST: HTTP + '/approver/list', // 获取列表
    // 工作委托
    PROCESSLIST: HTTP + '/process/list', //系统管理员工作委托列表
    ADMINCHANGEHANDLER: HTTP + '/process/adminChangeHandler', // 系统管理员工作委托
    CHANGEHANDLER: HTTP + '/process/changeHandler', // 当前处理人工作委托
  }
}