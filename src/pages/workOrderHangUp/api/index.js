import request from '@/api/request.js';
import axios from 'axios';

//查询工单类型
export const getWorkTypelList = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/orderPending/getWorkTypelList ', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};

/**
 * 厂商&&计量
 * @param params
 */
// export const queryManOrUnitList = (param) => request.get("/productFactor/config/queryManOrUnitList", param);
export const queryManOrUnitList = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/productFactor/config/queryManOrUnitList', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};

//查询工单子类型
export const getBusinessSub = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/orderPending/getBusinessSub', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
// 编辑和新增
export const addOrUpdateManOrUnit = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/productFactor/config/addOrUpdateManOrUnit', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};

//工单挂起列表
export const getOrderPendingList = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/orderPending/getOrderPendingList', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
// 删除
export const deleteManOrUnit = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/productFactor/config/deleteManOrUnit', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
/**
 * 物资配置
 * @param params
 */
// 列表
export const queryMatMaterialTypeList = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/materialType/queryMatMaterialTypeList', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
// 新增
export const addMaterialType = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/materialType/addMaterialType', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
//编辑shan
export const updateMatMaterialType = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/materialType/updateMatMaterialType', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
// 删除
export const deleteMaterialType = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/materialType/deleteMaterialType', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
// 生产要素字典集查询
// export const queryConfigList = (data) => {
//   let requestParam = {
//     method: "GET", // 请求方式
//     url: "/productFactor/config/queryConfigList", // 微服务方法
//     data: data, // 参数
//   };
//   return request(requestParam);
// }
export const queryConfigList = (data) => {
  // 把data对象转成Query字符串，如{sortNo: "A"} → "sortNo=A"
  const queryStr = Object.keys(data)
    .map((key) => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');
  let requestParam = {
    method: 'GET',
    url: `/productFactor/config/queryConfigList?${queryStr}`, // 手动拼接Query
  };
  return request(requestParam);
};
/**
 * 物资管理
 * @param params
 */
export const queryMatMaterialInventoryList = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/matMaterialInventory/queryMatMaterialInventoryList', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
// 导出
export const exportMatMaterialInventoryList = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/matMaterialInventory/exportMatMaterialInventoryList', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
// 类型模糊搜索
export const queryMatMaterialTypeName = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/materialType/queryMatMaterialTypeName', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
// 入库
export const insertMatMaterialInventory = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/matMaterialInventory/insertMatMaterialInventory', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
// 退还
export const returnMatMaterialInventory = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/matMaterialInventory/returnMatMaterialInventory', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
// 详情出入记录列表
export const queryInventoryRecordList = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/matMaterialInventory/queryInventoryRecordList', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
