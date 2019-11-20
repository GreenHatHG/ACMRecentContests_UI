import request from '@/plugin/axios'

export function getCode (data) {
    return request({
        url: '/code',
        method: 'post',
        params: data
    })
}