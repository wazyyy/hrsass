<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog=true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table
              border=""
              :data="list"
            >
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="120"
              />
              <el-table-column
                align="center"
                prop="name"
                label="角色名称"
                width="240"
              />
              <el-table-column
                align="center"
                prop="description"
                label="描述"
              />
              <el-table-column
                align="center"
                label="操作"
              >
                <template slot-scope="{row}">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                  >删除</el-button>
                </template>

              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form
              label-width="120px"
              style="margin-top:50px"
            >
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
    <!-- 编辑弹层 -->
    <el-dialog
      :title="showTitle"
      :visible="showDialog"
      @close="btnCancel"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          label="角色名称"
          prop="name"
        >
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row
        slot="footer"
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            size="small"
            @click="btnCancel"
          >取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="btnOK"
          >确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 放置分配权限的弹层 -->
    <el-dialog
      title="分配权限"
      :visible="showPermDialog"
      @close="btnPermCancel"
    >
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- :show-checkbox="true" 是否显示复选框 -->
      <!-- check-strictly 如果为true，表示父子之间不互相关联;默认为false互相关联-->
      <!-- :default-checked-keys="selectCheck" 默认选中的节点 -->
      <!-- node-key="id" id作为唯一标识,注意前面不需要加冒号":" -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <el-row
        slot="footer"
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            size="small"
            type="primary"
            @click="btnPermOK"
          >确定</el-button>
          <el-button
            size="small"
            @click="btnPermCancel"
          >取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data () {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1, // 当前页
        pagesize: 10, // 每页显示的条数
        total: 0// 记录总数
      },
      // 保存公司信息数据
      formData: {},
      showDialog: false,
      showPermDialog: false,
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接受数据，权限数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null, // 用来记录分配角色的id
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    // 角色修改添加
    showTitle () {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  created () {
    this.getRoleList()// 获取角色列表
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList () {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage (newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage// 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },
    async getCompanyInfo () {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async deleteRole (id) {
      // 提示
      try {
        await this.$confirm('确认删除该角色吗')
        // 只有点击了确定 才能进入到下方
        await deleteRole(id)// 调用删除接口
        this.getRoleList()// 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole (id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true// // 为了不出现闪烁的问题 先获取数据 再弹出层
    },
    async btnOK () {
      try {
        // 手动校验
        await this.$refs.roleForm.validate()
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          // 执行修改业务
          await updateRole(this.roleForm)
        } else {
          // 新增业务
          await addRole(this.roleForm)
        }
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false// 关闭弹层  =>  触发el-dialog的事件close事件
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel () {
      // 重置数据的目的 是在修改的时候依然能够把数据完全重置
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    // 获取权限点数据 在点击的时候调用 获取权限点数据
    async assignPerm (id) {
      // 获取全部权限列表，并转化为树形数据
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      this.roleId = id// 当前点击的角色id
      // 应该去获取 这个id的 权限点
      // 有id 就可以 id应该先记录下来
      const { permIds } = await getRoleDetail(id) // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds// 将当前角色所拥有的权限id赋值
      this.showPermDialog = true
    },
    async btnPermOK () {
      // 调用el-tree的方法
      // console.log(this.$refs.permTree.getCheckedKeys())
      // getCheckedKeys() 若节点可被选择，则返回目前被选中的节点的 key 所组成的数组
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel () {
      this.selectCheck = []// 重置数据
      this.showPermDialog = false
    }
  }
}
</script>

<style>
</style>
