/* equipment.js —— 仪器设备及耗材台账数据
 *
 * 用途：组内有什么仪器设备/耗材、放在哪里、谁购置登记的、说明书在哪，一目了然。
 * 录入方式：推荐在「仪器耗材」页面用「＋ 添加条目」弹窗录入，
 *          再由管理员把导出的内容整体覆盖 equipment-overrides.js。
 * 也可以在这里直接按格式追加对象（适合一次性批量录入）。
 *
 * 统一字段说明（仪器设备和耗材共用，不需要的可留空）：
 *   id           编号，唯一，如 "E001"
 *   category     类别："仪器设备" 或 "耗材"
 *   name         名称 *（必填）
 *   model        型号 / 规格（耗材填规格，如 "50 mL 尖底"、"0.45 μm 47 mm"）
 *   brand        品牌 / 厂家
 *   qty          数量（仪器多为 1，耗材填余量）
 *   unit         单位（台 / 套 / 支 / 盒 / 瓶 / 包 / 卷 …）
 *   location     存放位置 *（如 "农科楼 311 室 3 号柜"）
 *   keeper       购置 / 登记人
 *   purchaseDate 购置日期（如 2025-09）
 *   price        购置金额（如 2.8 万元）
 *   status       状态：仪器设备建议 在用/闲置/借用中/维修中/已报废；耗材建议 充足/偏少/需采购
 *   url          电子说明书 / 购置材料 / 采购链接（飞书链接）
 *   note         备注（如借用规则、安全须知、低于多少请补货）
 */
window.DATA = window.DATA || {};

window.DATA.equipment = [
  // —— 仪器设备示例（正式录入后可删除注释）——
  // { id:"E001", category:"仪器设备", name:"土壤呼吸测定系统", model:"LI-8100A", brand:"LI-COR",
  //   qty:"1", unit:"台", location:"农科楼 311 室", keeper:"韩娟", purchaseDate:"2021-05",
  //   price:"28.6 万元", status:"在用", url:"https://my.feishu.cn/file/xxx", note:"每周校准一次，外出借用需登记" },

  // —— 耗材示例（正式录入后可删除注释）——
  // { id:"E002", category:"耗材", name:"离心管", model:"50 mL 尖底", brand:"Corning",
  //   qty:"800", unit:"支", location:"农科楼 311 室 3 号柜", keeper:"王芳", purchaseDate:"2025-09",
  //   price:"", status:"充足", url:"", note:"低于 100 支请提醒补货" },
];
