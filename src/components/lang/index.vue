<template>
  <el-dropdown
    trigger="click"
    @command="changeLanguage"
  >
    <div>
      <svg-icon
        style="color:#fff;font-size:20px"
        icon-class="language"
      />

    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        command="zh"
        :disabled="'zh'=== $i18n.locale"
      >
        中文
      </el-dropdown-item>
      <el-dropdown-item
        command="en"
        :disabled="'en'=== $i18n.locale "
      >
        en
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  methods: {
    changeLanguage (type) {
      Cookie.set('language', type)
      this.$i18n.locale = type
      this.$message.success('切换多语言成功')
    }
  }
}
</script>

<style>
</style>
