<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 5px;">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible = true">添加用户</el-button>
      <el-select style="margin-left: 15px;" size="mini" v-model="listQuery.status" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.phoneNumber" size="mini" style="width: 150px; margin-left: 15px;" placeholder="请输入手机号"></el-input>

      <el-button style="margin-left: 15px;" type="primary" size="mini" @click="fetchData" plain>搜索</el-button>
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === 0">启用</el-tag>
          <el-tag type="warning" v-else-if="scope.row.status === 1">冻结</el-tag>
          <el-tag type="danger"  v-else-if="scope.row.status === 2">删除</el-tag>
          <el-tag type="danger"  v-else>无状态</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" width="100px">
          <el-button size="mini" type="danger" @click="deleteUser(scope.row.id,2)" v-if="scope.row.status === 0 || scope.row.status === 1" :loading="deleteUserLoading">删除</el-button>
          <el-button size="mini" type="warning" @click="deleteUser(scope.row.id,1)" v-if="scope.row.status === 0 " :loading="deleteUserLoading">冻结</el-button>
          <el-button size="mini" type="success" @click="deleteUser(scope.row.id,0)" v-if="scope.row.status === 1 || scope.row.status === 2">启用</el-button>
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

    <el-dialog title="新用户" :visible.sync="dialogFormVisible" width="30%"  >
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phoneNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-link type="primary">默认密码为手机后六位，请通知用户及时修改</el-link>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false,addUserLoading=false">取 消</el-button>
        <el-button type="primary" :loading="addUserLoading" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userList, createUser, deleteUser } from '@/api/user'

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
        phoneNumber: '',
        status: ''
      },
      currentPage: 1,
      dialogFormVisible: false,
      addUserLoading: false,
      deleteUserLoading: false,
      form: {
        username: '',
        phoneNumber: '',
        email: ''
      },
      formLabelWidth: '80px',
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '启用'
      }, {
        value: '1',
        label: '冻结'
      }, {
        value: '2',
        label: '删除'
      }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      userList(this.listQuery).then(response => {
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
    addUser() {
      this.addUserLoading = true
      createUser(this.form).then(response => {
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
