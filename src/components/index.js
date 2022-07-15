// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
export default {
  install (Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)// 注册工具栏组件
    Vue.component('UploadExcel', UploadExcel)// 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload)
    Vue.use(Print)
  }
}
