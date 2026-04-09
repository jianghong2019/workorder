import request from '@/api/request.js';

//暂停接单查询接口
export const getStopOrderList = (data) => {
  let requestParam = {
    method: 'POST', // 请求方式
    url: '/stopOrder/getStopOrderList', // 微服务方法
    data: data, // 参数
  };
  return request(requestParam);
};
