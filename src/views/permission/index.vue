<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            @click="addPermission(1,'0')"
          >添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <!-- 指定id为唯一属性 -->
      <el-table
        border
        :data="list"
        row-key="id"
      >
        <el-table-column
          label="名称"
          prop="name"
        />
        <el-table-column
          align="center"
          label="标识"
          prop="code"
        />
        <el-table-column
          align="center"
          label="描述"
          prop="description"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template v-slot="{row}">
            <el-button
              v-if="row.type===1"
              type="text"
              @click="addPermission(1,row.id)"
            >添加</el-button>
            <el-button
              type="text"
              @click="editPermission(row.id)"
            >编辑</el-button>
            <el-button
              type="text"
              @click="delPermission(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!-- 新增编辑弹层 -->
    <el-dialog
      :visible="showDialog"
      :title="showText"
      @close="btnCancel"
    >
      <!-- 表单 -->
      <el-form
        ref="permForm"
        label-width="120px"
        :rules="rules"
        :model="formData"
      >
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            style="width:90%"
          />
        </el-form-item>
        <el-form-item
          label="标识"
          prop="code"
        >
          <el-input
            v-model="formData.code"
            style="width:90%"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="formData.description"
            style="width:90%"
          />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="0"
            inactive-value="1"
          />
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <el-row
        slot="footer"
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            size="small"
            type="primary"
            @click="btnOK"
          >确定</el-button>
          <el-button
            size="small"
            @click="btnCancel"
          >取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, delPermission, updatePermission, addPermission, getPermissionDetail } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data () {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showText () {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created () {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList () {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    delPermission (id) {
      this.$confirm('确认删除该权限节点吗').then(() => {
        return delPermission(id)
      }).then(() => {
        this.$message.success('删除节点成功')
        // 重新获取数据
        this.getPermissionList()
      })
    },
    addPermission (type, pid) {
      // 访问权的type=1 按钮操作权的type=2
      // pid 表示当前数据的父节点标识
      // 记录当前添加的类型和父标识
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    btnOK () {
      // this.$refs.permForm.validate(isOK=>{}
      this.$refs.permForm.validate().then(() => {
        // 校验成功
        if (this.formData.id) {
          // 表示要修改权限
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)// 新增接口
      }).then(() => {
        // 添加成功
        this.$message.success('添加成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancel () {
      // 重置数据
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.permForm.resetFields()
      this.showDialog = false
    },
    async editPermission (id) {
      // 根据id获取详情
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style>
</style>
