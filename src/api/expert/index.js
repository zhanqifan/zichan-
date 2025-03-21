import request from '@/utils/request'

// 获取专家列表
export function getExpertList() {
  return request({
    url: 'https://m1.apifoxmock.com/m2/6065032-0-default/274084210?apifoxApiId=274084210',
    method: 'get',
  })
}
// 修改专家到场状态
export function updateExpertStatus(data) {
  return request({
    url: 'https://m1.apifoxmock.com/m2/6065032-0-default/274094577?apifoxApiId=274094577',
    method: 'put',
    data
  })
}


export function postProjectInfo(data) {
  return request({
    url: 'https://m1.apifoxmock.com/m2/6065032-0-default/274090774?apifoxApiId=274090774',
    method: 'post',
    data
  })
}

export function getExpertInfo(id) {
  return request({
    url: `https://m1.apifoxmock.com/m2/6065032-0-default/274095294?apifoxApiId=274095294`,
    method: 'get',
    params: {
      id
    }
  })
}
