<template>
  <!-- 放置一个图标 -->
  <svg-icon
    icon-class="fullscreen"
    style="color:#fff;width:40px;height:20px"
    @click="changeScreen"
  />
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  methods: {
    // 改变全屏
    changeScreen () {
      if (!ScreenFull.isEnabled) {
        this.$message.warning('此时全屏组件不可用')
      }
      // document.documentElement.requestFullscreen()  原生js调用
      //   如果可用 就可以全屏
      ScreenFull.toggle()
    }
  }
}
</script>

<style>
</style>
