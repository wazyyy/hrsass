<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条数据</span>
        <template #after>
          <el-button
            size="small"
            type="warning"
          >导入</el-button>
          <el-button
            size="small"
            type="danger"
          >导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="showDialog=true"
          >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table
          border
          :data="list"
        >
          <el-table-column
            label="序号"
            sortable=""
            type="index"
          />
          <el-table-column
            label="姓名"
            sortable=""
            prop="username"
          />
          <el-table-column
            label="工号"
            sortable=""
            prop="workNumber"
          />
          <!-- 格式化聘用形式 -->
          <el-table-column
            label="聘用形式"
            sortable
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column
            label="部门"
            sortable=""
            prop="departmentName"
          />
          <el-table-column
            label="入职时间"
            sortable=""
            prop="timeOfEntry"
          >
            <template
              slot-scope="{row}">{{ row.timeOfEntry|formatDate }}</template>
          </el-table-column>
          <el-table-column
            label="账户状态"
            sortable=""
            prop="enableState"
          >
            <template slot-scope="{row}">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState===1" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable=""
            fixed="right"
            width="280"
          >
            <template slot-scope="{row}">
              <el-button
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                type="text"
                size="small"
              >转正</el-button>
              <el-button
                type="text"
                size="small"
              >调岗</el-button>
              <el-button
                type="text"
                size="small"
              >离职</el-button>
              <el-button
                type="text"
                size="small"
              >角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
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
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <!-- 放置新组件 -->
      <add-employee :show-dialog.sync="showDialog" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'// 引入员工枚举对象
import addEmployee from './components/add-employee.vue'
export default {
  components: { addEmployee },
  data () {
    return {
      loading: false, // 控制树的显示或者隐藏进度条

      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0// 总数
      },
      showDialog: false
    }
  },
  created () {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList () {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage (newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    //  <!-- 格式化聘用形式 -->
    formatEmployment (row, column, cellValue, index) {
      // 找1所对应的值
      // return '666'
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async deleteEmployee (id) {
      try {
        await this.$confirm('你确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
</style>
