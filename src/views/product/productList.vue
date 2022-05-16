<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 5px;">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible = true">添加产品</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="parentId" label="父级ID" width="180" />
      <el-table-column prop="productName" label="产品名称" width="180" />
      <el-table-column prop="productCode" label="产品编码" />
      <el-table-column prop="price" label="产品价格" />
      <el-table-column prop="description" label="产品描述" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="状态" align="center" >
        <template slot-scope="scope">
          <el-tag type="success" v-show="scope.row.status === 0">上架</el-tag>
          <el-tag type="danger" v-show="scope.row.status === 1">下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250px">
        <template slot-scope="scope">
          <el-button size="mini" type="success"  @click="addChildren(scope.row.id)">新增</el-button>
          <el-button size="mini" type="primary"  @click="updateDialog(scope.row)">修改</el-button>
          <el-button size="mini" type="danger"  @click="deleteProduct(scope.row)">下架</el-button>
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

    <el-dialog title="新产品" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="form" :model="form">
        <el-form-item label="父节点Id" :label-width="formLabelWidth">
          <el-input v-model="form.parentId" readonly autocomplete="off" />
        </el-form-item>
        <el-form-item label="产品名" :label-width="formLabelWidth">
          <el-input v-model="form.productName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input type="number" v-model="form.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="addProductLoading" @click="addProduct">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="updateDialogFormVisible" width="30%">
      <el-form ref="form" :model="form">
        <el-form-item label="父节点Id" :label-width="formLabelWidth">
          <el-input v-model="form.parentId" readonly autocomplete="off" />
        </el-form-item>
        <el-form-item label="产品名" :label-width="formLabelWidth">
          <el-input v-model="form.productName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="form.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="updateProductLoading" @click="updateProduct">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addProduct, getList, deleteProduct, getChildrenList, updateProduct } from '@/api/product'

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
      list: [],
      listLoading: true,
      total: null,
      listQuery: {
        page: 1,
        limit: 10,
        phoneNumber: '',
        status: ''
      },
      currentPage: null,
      dialogFormVisible: false,
      updateDialogFormVisible: false,
      addProductLoading: false,
      updateProductLoading: false,
      form: {
        id: '',
        parentId: '',
        productName: '',
        description: '',
        price: ''
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
    addChildren(parentId) {
      this.clearForm()
      this.form.parentId = parentId
      this.dialogFormVisible = true
    },
    updateDialog(row) {
      this.clearForm()
      this.form.id = row.id
      this.form.parentId = row.parentId
      this.form.productName = row.productName
      this.form.description = row.description
      this.form.price = row.price
      this.updateDialogFormVisible = true
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
    updateProduct() {
      this.updateProductLoading = true
      updateProduct(this.form).then(response => {
        debugger
        if (response.code === '200') {
          this.$message('修改用户成功')
          this.fetchData()
        }
        this.updateProductLoading = false
        this.updateDialogFormVisible = false
      }).catch(() => {
        this.updateProductLoading = false
        this.updateDialogFormVisible = false
      })
    },
    deleteProduct(row) {
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct({ 'id': row.id }).then(response => {
          if (response.code === '200') {
            this.$message('删除成功')
            row.status = 1
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '删除失败'
          })
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
        resolve(response.data)
      })
    },
    clearForm() {
      this.form.id = ''
      this.form.price = ''
      this.form.description = ''
      this.form.parentId = ''
      this.form.productName = ''
    }

  }
}
</script>
