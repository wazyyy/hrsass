<template>
  <!-- 工作日历 -->
  <div>
    <!-- 年和月 -->
    <el-row
      type="flex"
      justify="end"
    >
      <!-- 年 -->
      <el-select
        v-model="currentYear"
        size="small"
        style="width:120px"
        @change="dateChange"
      >
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        />

      </el-select>
      <el-select
        v-model="currentMonth"
        size="small"
        style="width:120px;margin-left:10px"
        @change="dateChange"
      >
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-row>
    <!-- 放置一个日历组件 -->
    <el-calendar v-model="currentDate">
      <template
        v-slot:dateCell="{date,data}"
        class="content"
      >
        <div class="date-content">
          <span class="text">{{ data.day|getDay }}</span>
          <span
            v-if="isWeek(date)"
            class="rest"
          >休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay (val) {
      const day = val.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      // 回调函数式的返回值
      default: () => new Date()// 如果没有传递startDate 就取当前时间
    }
  },
  data () {
    return {
      yearList: [], // 遍历年的数组
      currentYear: null, // 当前年份
      currentMonth: null, // 当前月份
      currentDate: null// 当前时间
    }
  },
  created () {
    // 获取当前的年份
    this.currentYear = this.startDate.getFullYear()// 得到当前的年份
    // 组件要求起始时间必须是 周一开始 以一个月为开始
    this.currentMonth = this.startDate.getMonth() + 1// 得到当前的月份
    // 根据当前的年 生成可选年份 前后各加5年
    this.yearList = Array.from(Array(11), (val, index) => this.currentYear + index - 5)

    this.dateChange()
  },
  methods: {
    // 休息日
    isWeek (date) {
      return date.getDay() === 6 || date.getDay() === 0
    },
    // 年月改变后
    dateChange () {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`)// 以当前月的1号为起始
    }

  }
}
</script>

<style  lang="scss" scoped>
/* ::v-deep 如果报了语法错误，那么改成::v-deep这种写法就不报错了 */
::v-deep .el-calendar-day {
  height: auto;
}
::v-deep .el-calendar-table__row td,
::v-deep .el-calendar-table tr td:first-child,
::v-deep .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
::v-deep .el-calendar__header {
  display: none;
}
</style>
