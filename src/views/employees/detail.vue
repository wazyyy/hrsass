<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 表单 -->
            <el-form
              ref="userForm"
              :model="formData"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top:30px"
            >
              <el-form-item
                label="姓名:"
                prop="username"
              >
                <el-input
                  v-model="formData.username"
                  style="width:300px"
                />
              </el-form-item>
              <el-form-item
                label="密码:"
                prop="password2"
              >
                <el-input
                  v-model="formData.password2"
                  style="width:300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="saveUser"
                >更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 放置个人详情 -->
            <component :is="UserComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 放置个人详情 -->
            <component :is="JobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  components: {
    UserInfo, JobInfo
  },
  data () {
    return {
      UserComponent: 'user-info',
      JobComponent: 'job-info',
      userId: this.$route.params.id, // 这样可以后面直接通过 this.userId进行获取数据
      userInfo: '',
      formData: {
        // 存放基本信息
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }, { min: 1, max: 6, message: '姓名长度为1-4位', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' }, { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById () {
      this.formData = await getUserDetailById(this.userId)
    },
    saveUser () {
      this.$refs.userForm.validate(async isOK => {
        if (isOK) {
          await saveUserDetailById({ ...this.formData, password: this.formData.password2 })
          this.$message.success('修改账户信息成功')
        }
      })
    }
  }
}
</script>

<style>
</style>
