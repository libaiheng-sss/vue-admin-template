<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 5px;">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible = true">添加产品</el-button>
    </div>
<!--    <el-table-->
<!--      v-loading="listLoading"-->
<!--      :data="list"-->
<!--      element-loading-text="Loading"-->
<!--      border-->
<!--      fit-->
<!--      style="width: 100%;"-->
<!--      highlight-current-row-->
<!--    >-->
<!--      <el-table-column align="center" label="ID" width="95">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.id }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="产品名称" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.productName }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="产品编码" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.productCode }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="描述" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.description }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="创建时间" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.createTime }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="操作" align="center" width="150px">-->
<!--        <template slot-scope="scope" >-->
<!--          <el-button size="mini" type="danger" @click="deleteProduct(scope.row.id)" :loading="deleteProductLoading">删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
    <el-table
      :data="list"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="parentId" label="父级ID" width="180"></el-table-column>
      <el-table-column prop="productName" label="产品名称" width="180"></el-table-column>
      <el-table-column prop="productCode" label="产品编码"></el-table-column>
      <el-table-column prop="price" label="产品价格"></el-table-column>
      <el-table-column prop="description" label="产品描述"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" align="center" width="250px">
        <template slot-scope="scope" >
          <el-button size="mini" type="success" @click="addProduct(scope.row.id)" :loading="deleteProductLoading">新增</el-button>
          <el-button size="mini" type="primary" @click="updateProduct(scope.row.id)" :loading="deleteProductLoading">修改</el-button>
          <el-button size="mini" type="danger" @click="deleteProduct(scope.row.id)" :loading="deleteProductLoading">删除</el-button>
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

    <el-dialog title="新产品" :visible.sync="dialogFormVisible" width="30%"  >
      <el-form :model="form">
        <el-form-item label="产品名" :label-width="formLabelWidth">
          <el-input v-model="form.productName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false,addProductLoading=false">取 消</el-button>
        <el-button type="primary" :loading="addProductLoading" @click="addProduct">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addProduct, getList, deleteProduct,getChildrenList } from '@/api/product'

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
        limit: 10,
        phoneNumber: '',
        status: ''
      },
      currentPage: '',
      dialogFormVisible: false,
      addProductLoading: false,
      deleteUserLoading: false,
      form: {
        productName: '',
        description: ''
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
      getList(this.listQuery).then(response => {
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
    addProduct() {
      this.addProductLoading = true
      addProduct(this.form).then(response => {
        if (response.code === '200') {
          this.$message('添加用户成功')
          this.fetchData()
        }
        this.addProductLoading = false
        this.dialogFormVisible = false
      }).catch(() => {
        this.addProductLoading = false
        this.dialogFormVisible = false
      })
    },
    deleteProduct(id) {
      this.deleteUserLoading = true
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct({ 'id': id }).then(response => {
          if (response.code === '200') {
            this.$message('删除成功')
            this.fetchData()
          }
          this.deleteUserLoading = false
        }).catch(() => {
          this.deleteUserLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除成功'
        })
      })
    },
    load(tree, treeNode, resolve) {
      getChildrenList({ 'id': tree.id }).then(response => {
        debugger
        resolve(response.data)
      })
    }

  }
}
</script>
