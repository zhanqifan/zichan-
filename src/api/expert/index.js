import request from '@/utils/request'

// 获取专家类别列表
export function getExpertList(queryParams) {
  return request({
    url: '/system/judge_category/list',
    method: 'get',
    params: queryParams
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
// 补录评委
export function recordExpert(data) {
  return request({
    url: '/system/project_info/supplemental',
    method: 'post',
    data
  })
}
// 打印确认单
export function printConfirm(id) {

  return request({
    url: `/system/project_info/download`,
    method: 'get',
    params: { id },
    responseType: 'blob',

  })
}
// 新增专家类别
export function addExpertType(data) {
  return request({
    url: '/system/judge_category',
    method: 'post',
    data
  })
}
// 删除专家类别
export function deleteExpertType(ids) {
  return request({
    url: `/system/judge_category/${ids}`,
    method: 'delete',
  })
}
// 获取项目列表
export function getProjectList(queryParams) {
  return request({
    url: '/system/project_info/list',
    method: 'get',
    params: queryParams
  })
}