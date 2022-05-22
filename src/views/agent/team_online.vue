<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 5px;">
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
          <el-tag type="success" v-if="scope.row.status === '1'">正常</el-tag>
          <el-tag type="warning" v-else-if="scope.row.status === '0'">禁用</el-tag>
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
      <el-table-column label="操作" align="center" min-width="20">
        <template slot-scope="scope" width="100px">
          <el-button size="mini" type="success">添加订单</el-button>
          <el-button size="mini" type="danger" @click="updateCustomer(scope.row)">修改</el-button>

        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 15, 20, 30]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { all, addCustomer } from '@/api/customer'
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
      total: '',
      listQuery: {
        page: 1,
        limit: 10
      },
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
      }]
    }
  },
  created() {
    this.fetchData()
    this.fetchData2()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      all(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        if (response.data.currentPage > 0) {
          this.currentPage = response.data.currentPage
          this.listQuery.page = response.data.currentPage
        }
        this.listLoading = false
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
          done();
        })
        .catch(_ => {});
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
