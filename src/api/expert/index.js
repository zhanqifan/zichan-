import request from '@/utils/request'

// 获取专家类别
export function getExpertList() {
  return request({
    url: '/system/judge_category/list',
    method: 'get',
  })
}
// 修改专家到场状态
export function updateExpertStatus(data) {
  return request({
    url: '/system/project_judge',
    method: 'put',
    data
  })
}

// 新增项目
export function postProjectInfo(data) {
  return request({
    url: '/system/project_info',
    method: 'post',
    data
  })
}
// 查看项目评委列表
export function getExpertInfo(id) {
  return request({
    url: `/system/project_info/judge/${id}`,
    method: 'get',
  })
}
