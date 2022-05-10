<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 5px;">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible = true">添加用户</el-button>
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
    </el-table>

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
import { userList, createUser } from '@/api/user'

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
      dialogFormVisible: false,
      addUserLoading: false,
      form: {
        username: '',
        phoneNumber: '',
        email: ''
      },
      formLabelWidth: '80px'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      userList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    addUser() {
      this.addUserLoading = true
      createUser(this.form).then(response => {
        if (response.code === '200') {
          this.$message('添加用户成功')
        }
        this.addUserLoading = false
        this.dialogFormVisible = false
      }).catch(() => {
        this.addUserLoading = false
        this.dialogFormVisible = false
      })
    }

  }
}
</script>
