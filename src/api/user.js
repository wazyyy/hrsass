import request from '@/utils/request'
// 登录接口封装
export function login (data) {
  return request({
    url: '/sys/login', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'post',
    data
  })
}
export function getInfo (token) {

}
export function logout () {

}
// 获取用户的基本资料
export function getUserInfo () {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
// 获取用户基本信息
export function getUserDetailById (id) {
  return request({
    url: `/sys/user/${id}`
  })
}
