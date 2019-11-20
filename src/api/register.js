import request from '@/plugin/axios'

export function register(data) {
    return request({
        url: '/register',
        method: 'post',
        params: data
    })
}