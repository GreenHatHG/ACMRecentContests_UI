import request from '@/plugin/axios'

export function resetpwd (data) {
  return request({
    url: '/resetpwd',
    method: 'post',
    params: data
  })
}
