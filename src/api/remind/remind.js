import request from '@/plugin/axios'

export function setRemind (data) {
  return request({
    url: '/remind/remind_info',
    method: 'post',
    params: data
  })
}

export function getRemindInfos() {
  return request({
    url: '/remind/remind_infos',
    method: 'get'
  })
}

export function delRemindInfo(data) {
  return request({
    url: '/remind/name',
    method: 'delete',
    params: data
  })
}

export function delRemindInfos(data) {
  return request({
    url: '/remind/names',
    method: 'delete',
    data
  })
}

export function updateRemindInfo(data) {
  return request({
    url: '/remind/info',
    method: 'put',
    params: data
  })
}

export function pauseRemind(data) {
  return request({
    url: '/remind/pause',
    method: 'post',
    params: data
  })
}

export function resumeRemind(data) {
  return request({
    url: '/remind/resume',
    method: 'post',
    params: data
  })
}