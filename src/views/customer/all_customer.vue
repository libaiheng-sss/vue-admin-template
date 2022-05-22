<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 5px;">
      <el-select v-model="listQuery.status" size="mini" clearable style="margin-left: 20px;width: 100px;" placeholder="请选择" @change="fetchData">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="listQuery.teamId" size="mini" clearable style="margin-left: 20px;width: 100px;" placeholder="请选择用户" @change="fetchData">
        <el-option
          v-for="item in userOptions"
          :key="item.id"
          :label="item.teamName"
          :value="item.teamId"
        />
      </el-select>
      <el-input
        v-model="listQuery.phoneNumber"
        size="mini"
        style="margin-left: 20px;width: 200px;"
        placeholder="请输入手机号"
        maxlength="11"
        minlength="11"
        clearable
        @change="fetchData"
      />
      <el-date-picker
        v-model="listQuery.time"
        style="margin-left: 20px;width: 350px;"
        size="mini"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="fetchData"
      />
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      style="width: 100%;"
      highlight-current-row
    >
      <el-table-column label="用户名" align="center" min-width="10">
        <template slot-scope="scope">
          {{ scope.row.customerName }}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" min-width="10">
        <template slot-scope="scope">
          <span v-if="scope.row.gender === '1'">男</span>
          <span v-if="scope.row.gender === '0'">女</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" min-width="17">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" min-width="20">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center" min-width="15">
        <template slot-scope="scope">
          {{ scope.row.province+' '+scope.row.city+' '+ scope.row.district+' '+scope.row.detailedAddress }}
        </template>
      </el-table-column>
      <el-table-column label="对接人" align="center" min-width="15">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="10">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.status === '0'" type="warning">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" min-width="20">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" min-width="20">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 15, 20, 30]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { team, addCustomer, getTeamList } from '@/api/customer'
import { province, city, county } from '@/api/districts'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        status: '',
        phoneNumber: '',
        time: [],
        beginTime: '',
        endTime: '',
        teamId: ''
      },
      currentPage: 1,
      dialogFormVisible: false,
      addUserLoading: false,
      ruleForm: {
        customerId: '',
        username: '',
        gender: '',
        phoneNumber: '',
        email: '',
        province: '',
        city: '',
        district: '',
        detailedAddress: '',
        description: '',
        status: '1',
        userId: ''
      },
      provinceOption: [],
      cityOption: [],
      countyOption: [],
      options: [{
        value: '1',
        label: '正常'
      }, {
        value: '0',
        label: '禁用'
      }],
      userOptions: []
    }
  },
  created() {
    this.fetchData()
    this.fetchData2()
    this.getTeamList()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.listLoading = true
      if (this.listQuery.time != null && this.listQuery.time.length > 0) {
        this.listQuery.beginTime = this.listQuery.time[0].getTime()
        this.listQuery.endTime = this.listQuery.time[1].getTime()
      } else {
        this.listQuery.beginTime = ''
        this.listQuery.endTime = ''
      }
      team(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        if (response.data.currentPage > 0) {
          this.currentPage = response.data.currentPage
          this.listQuery.page = response.data.currentPage
        }
        this.listLoading = false
      })
    },
    getTeamList() {
      getTeamList().then(response => {
        if (response.code === '200') {
          this.userOptions = response.data
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.listQuery.page = val
      this.fetchData()
    },
    fetchData2() {
      this.listLoading = true
      province().then(response => {
        if (response.code === '200') {
          this.provinceOption = response.data
        }
        this.listLoading = false
      })
    },
    changeProvince() {
      city({ 'provinceCode': this.ruleForm.province }).then(response => {
        if (response.code === '200') {
          this.cityOption = response.data
          this.ruleForm.city = ''
          this.ruleForm.district = ''
        }
      })
    },
    changeCity() {
      county({ 'provinceCode': this.ruleForm.province, 'cityCode': this.ruleForm.city }).then(response => {
        if (response.code === '200') {
          this.countyOption = response.data
          this.ruleForm.district = ''
        }
      })
    },
    addCustomerBu() {
      this.clearRuleForm()
      this.dialogFormVisible = true
    },
    addCustomer() {
      this.addUserLoading = true
      addCustomer(this.ruleForm).then(response => {
        if (response.code === '200') {
          this.$message('添加用户成功')
          this.fetchData()
        }
        this.addUserLoading = false
        this.dialogFormVisible = false
      }).catch(() => {
        this.addUserLoading = false
        this.dialogFormVisible = false
      })
    },
    updateCustomer(row) {
      this.clearRuleForm()
      this.ruleForm.customerId = row.customerId
      this.ruleForm.username = row.username
      this.ruleForm.gender = row.gender
      this.ruleForm.phoneNumber = row.phoneNumber
      this.ruleForm.email = row.email
      this.ruleForm.province = row.province
      this.ruleForm.city = row.city
      this.ruleForm.district = row.district
      this.ruleForm.detailedAddress = row.detailedAddress
      this.ruleForm.description = row.description
      this.ruleForm.status = row.status
      this.ruleForm.userId = row.userId

      this.dialogFormVisible = true
    },
    clearRuleForm() {
      this.ruleForm.customerId = ''
      this.ruleForm.username = ''
      this.ruleForm.gender = ''
      this.ruleForm.phoneNumber = ''
      this.ruleForm.email = ''
      this.ruleForm.province = ''
      this.ruleForm.city = ''
      this.ruleForm.district = ''
      this.ruleForm.detailedAddress = ''
      this.ruleForm.description = ''
      this.ruleForm.status = '1'
      this.ruleForm.userId = ''
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    deleteUser(id, status) {
      // eslint-disable-next-line no-unused-vars
      let label = ''
      // eslint-disable-next-line no-unused-vars
      let label2 = ''
      if (status === 0) {
        label = '此操作将启用该用户, 是否继续?'
        label2 = '已启用该用户'
      } else if (status === 1) {
        label = '此操作将冻结该用户, 是否继续?'
        label2 = '已冻结该用户'
      } else {
        label = '此操作将永久删除该用户, 是否继续?'
        label2 = '已删除该用户'
      }
      this.deleteUserLoading = true
      this.$confirm(label, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ 'id': id, 'status': status }).then(response => {
          if (response.code === '200') {
            this.$message(label2)
            this.fetchData()
          }
          this.deleteUserLoading = false
        }).catch(() => {
          this.deleteUserLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: label2
        })
      })
    }

  }
}
</script>
