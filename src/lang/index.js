import Vue from 'vue'// 引入Vue
import VueI18n from 'vue-i18n'// 引入国际化的包
import Cookie from 'js-cookie'// 引入cookie包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import customZH from './zh'// 自定义英文包
import customEN from './en'// 自定义中文包
Vue.use(VueI18n)// 全局注册国际化包
export default new VueI18n({
  locale: Cookie.get('language') || 'zh',
  messages: {
    en: {
      ...elementEN, // 导入element的英文包
      ...customEN// 导入自定义的英文包
    },
    zh: {
      ...elementZH, // 导入element的中文包
      ...customZH// 导入自定义的中文包
    }
  }

})
