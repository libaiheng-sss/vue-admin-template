<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 5px;">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" size="mini" @click="addRoleBut">添加角色</el-button>
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
      <el-table-column label="角色名" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope" width="100px">
          <el-button size="mini" type="danger" @click="showDialog(scope.row.id)">编辑权限</el-button>
          <el-button size="mini" type="warning">删除角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加角色" :visible.sync="dialogAddRole" width="20%"  >
      <el-form :model="roleForm">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="dialogAddRole = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="权限列表" :visible.sync="dialogFormVisible" width="50%"  >
      <el-tree
        :data="permissionList"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[1]"
        :default-checked-keys="[9]">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button >取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getPermissionList, getRoleList, updateRole } from '@/api/role'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      permissionList: null,
      dialogFormVisible: false,
      dialogAddRole: false,
      checkPermission: [],
      roleForm: {
        roleName: '',
        description: ''
      },
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }]
    }
  },
  created() {
    this.fetchData()
    this.getPermissionList()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getRoleList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    getPermissionList() {
      getPermissionList().then(response => {
        this.permissionList = response.data
      })
    },
    showDialog(id) {
      this.dialogFormVisible = true
      console.log()
      // updateRole({ 'id': id }).then(response => {
      //   this.checkPermission = response.data
      // })
    },
    addRoleBut() {
      this.roleForm.roleName = ''
      this.roleForm.description = ''
      this.dialogAddRole = true
    }

  }
}
</script>
