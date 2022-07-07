// 权限拦截 导航守卫 路由守卫  router
import router from '@/router'
import store from '@/store'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
const whiteList = ['/login', '/404']
// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  nProgress.start()// 开启进度条
  // 首先判断有无token
  if (store.getters.token) {
    //   如果有token 继续判断是不是去登录页
    if (to.path === '/login') {
      // 表示去的是登录页
      next('/')// 跳到主页
    } else {
      if (!store.getters.userId) {
        // dispatch 触发action
        await store.dispatch('user/getUserInfo')
      }
      next()// 直接放行
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果找到了，表示在名单里面
      next()
    } else {
      next('/login')// 跳到登录页
    }
  }
  nProgress.done()// 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(function () {
  nProgress.done()// 关闭进度条
})
