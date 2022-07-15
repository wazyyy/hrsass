<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :class="{disabled:fileComputed}"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress
      v-if="showPercent"
      style="width:180px"
      :percentage="percent"
    />
    <el-dialog
      titl="图片"
      :visible.sync="showDialog"
    >
      <img
        :src="imageUrl"
        alt=""
        style="width:100%"
      >
    </el-dialog>

  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5'
// 实例化COS对象
const cos = new COS({
  // 需要把id和key改成自己的信息 具体查看https://console.cloud.tencent.com/cam/capi
  SecretId: 'AKIDwhBPO6XhaCXbOu97nDNHuGMBj13oHUQ4', // 身份识别 ID
  SecretKey: 'PXOyHI2WmiNmulLelb9QRBeqlPnunPko' // 身份密钥
})
export default {
  data () {
    return {
      fileList: [], // 图片设置为数组
      showDialog: false, // 控制显示弹层
      imageUrl: '',
      currentFileUid: null, // 记录当前正在上传的uid
      percent: 0,
      showPercent: false// 默认不显示进度条
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed () {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview (file) {
      this.imageUrl = file.url
      this.showDialog = true
    },
    // file是要删除的文件
    // fileList是删除之后的文件
    handleRemove (file, fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    changeFile (file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload (file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 当校验通过之后切记一定要return true 放行，允许上传
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    upload (params) {
      // console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'yueqinglixuan-1001-1312924427', /* 填入您自己的存储桶，必须字段 */
          Region: 'ap-beijing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
          Key: params.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          StorageClass: 'STANDARD',
          Body: params.file, // 上传文件对象
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          console.log(err || data)
          // data中有一个statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            //   此时说明文件上传成功  要获取成功的返回地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
            // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
            setTimeout(() => {
              this.showPercent = false// 隐藏进度条
              this.percent = 0
            }, 2000)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
