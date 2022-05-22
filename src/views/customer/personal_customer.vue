<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 5px;">
      <el-button type="success" size="mini" plain @click="addCustomerBu">添加用户</el-button>
      <el-select v-model="listQuery.status" size="mini" clearable style="margin-left: 20px;width: 100px;" placeholder="请选择" @change="fetchData">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
          style="margin-left: 20px;width: 350px;"
          size="mini"
          v-model="listQuery.time"
          type="datetimerange"
          @change="fetchData"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
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
          {{ scope.row.provinceName+' '+scope.row.cityName+' '+ scope.row.districtName+' '+scope.row.detailedAddress }}
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
      <el-table-column label="操作" align="center" min-width="20">
        <template slot-scope="scope" width="100px">
          <el-button size="mini" type="success" @click="addOrderBu(scope.row.customerId)">添加订单</el-button>
          <el-button size="mini" type="danger" @click="updateCustomer(scope.row)">修改</el-button>

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

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" :before-close="handleClose" width="60%">
      <el-form ref="ruleForm"  :rules="rules"  :model="ruleForm">
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="用户名：" prop="username">
              <el-input v-model="ruleForm.username" />
            </el-form-item>
            <el-form-item label="手机号：" prop="phoneNumber">
              <el-input v-model="ruleForm.phoneNumber" />
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="ruleForm.email" />
            </el-form-item>
            <el-form-item label="性别：">
              <el-radio v-model="ruleForm.gender" label="1">男</el-radio>
              <el-radio v-model="ruleForm.gender" label="0">女</el-radio>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              <el-select v-model="ruleForm.status" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="选择省市区：" prop="district">
              <el-row :gutter="20">
                <el-col :span="5">
                  <el-select v-model="ruleForm.province" filterable placeholder="请选择省份" @change="changeProvince">
                    <el-option
                      v-for="item in provinceOption"
                      :key="item.id"
                      :label="item.name"
                      :value="item.provinceCode"
                    />
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-select v-model="ruleForm.city" filterable placeholder="请选择城市" @change="changeCity">
                    <el-option
                      v-for="item in cityOption"
                      :key="item.id"
                      :label="item.name"
                      :value="item.cityCode"
                    />
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-select v-model="ruleForm.district" filterable placeholder="请选择区县">
                    <el-option
                      v-for="item in countyOption"
                      :key="item.id"
                      :label="item.name"
                      :value="item.countyCode"
                    />
                  </el-select>
                </el-col>
                <el-col :span="9" />
              </el-row>
            </el-form-item>
            <el-form-item label="详细地址：" prop="detailedAddress">
              <el-input
                v-model="ruleForm.detailedAddress"
                type="textarea"
                :rows="2"
                placeholder="请输入详细地址"
              />
            </el-form-item>
            <el-form-item label="用户备注：" prop="description">
              <el-input
                v-model="ruleForm.description"
                type="textarea"
                :rows="2"
                placeholder="请输入用户备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false,addUserLoading=false">取 消</el-button>
        <el-button type="primary" :loading="addUserLoading" @click="addCustomer('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加订单" :visible.sync="dialogFormVisibleOrder" :before-close="handleClose" width="60%">
      <el-form ref="orderForm" :rules="orderRule" :model="orderForm">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="选择产品" prop="productId">
              <el-cascader
                ref="cascaderAddr"
                :options="optionsProduct"
                :props="{ checkStrictly: true }"
                clearable
                @change="getCheckedNodes"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品数量" prop="productCount">
              <el-input-number v-model="orderForm.productCount" type="number" style="width: 50%;" @change="changeCount" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总价" prop="productAmountTotal">
              <el-input v-model="orderForm.productAmountTotal" type="number" readonly style="width: 50%;" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="实际付款" prop="orderAmountTotal">
              <el-input v-model="orderForm.orderAmountTotal" type="number" style="width: 50%;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运费金额" prop="logisticsFee">
              <el-input v-model="orderForm.logisticsFee" type="number" style="width: 50%;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" prop="desc">
              <el-input
                v-model="orderForm.desc"
                type="textarea"
                :rows="2"
                placeholder="请输入用户备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleOrder = false,addOrderLoading=false">取 消</el-button>
        <el-button type="primary" :loading="addOrderLoading" @click="addOrder('orderForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { personal, addCustomer } from '@/api/customer'
import { province, city, county } from '@/api/districts'
import { getOrderProductList, getProductAmountTotal } from '@/api/product'
import { addOrder } from '@/api/order'

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
        endTime: ''
      },
      currentPage: 1,
      dialogFormVisible: false,
      dialogFormVisibleOrder: false,
      addUserLoading: false,
      addOrderLoading: false,
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
      orderForm: {
        customerId: '',
        productCount: 1,
        price: '',
        productId: '',
        productAmountTotal: '0.0',
        orderAmountTotal: '0.0',
        logisticsFee: '0.0',
        desc: ''
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
      optionsProduct: [{
        value: 12,
        label: `选项1`,
        leaf: 1
      }],
      rules: {
        username: [{ required: true, message: '请输入客户名', trigger: 'blur' }],
        phoneNumber: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { min: 11, max: 11, message: '长度11', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        district: [{ required: true, message: '请选择城市', trigger: 'blur' }],
        detailedAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      orderRule: {
        productCount: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
        productId: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
        productAmountTotal: [{ required: true, message: '商品总价不能为空', trigger: 'blur' }],
        orderAmountTotal: [{ required: true, message: '点单总价不能为空', trigger: 'blur' }],
        logisticsFee: [{ required: true, message: '运费不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchData()
    this.fetchData2()
    this.getOrderList()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      if (this.listQuery.time != null && this.listQuery.time.length > 0) {
        this.listQuery.beginTime = this.listQuery.time[0].getTime()
        this.listQuery.endTime = this.listQuery.time[1].getTime()
      } else {
        this.listQuery.beginTime = ''
        this.listQuery.endTime = ''
      }
      personal(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        if (response.data.currentPage > 0) {
          this.currentPage = response.data.currentPage
          this.listQuery.page = response.data.currentPage
        }
        this.listLoading = false
      })
    },
    getOrderList() {
      this.listLoading = true
      getOrderProductList().then(response => {
        if (response.code === '200') {
          this.optionsProduct = response.data
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
    addOrderBu(customerId) {
      this.clearOrderForm()
      this.orderForm.customerId = customerId
      this.dialogFormVisibleOrder = true
    },
    addCustomer(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
        } else {
          this.addUserLoading = false
          console.log('error submit!!')
          return false
        }
      });
    },
    addOrder(orderForm) {
      this.$refs[orderForm].validate((valid) => {
        if (valid) {
          this.addOrderLoading = true
          addOrder(this.orderForm).then(response => {
            if (response.code === '200') {
              this.$message('添加用户成功')
            }
            this.addOrderLoading = false
          })
        } else {
          console.log('error submit!!')
          this.addOrderLoading = false
          return false;
        }
      })
    },
    changeCount() {
      if (this.orderForm.productCount < 1) {
        this.$message('数量不能小于0')
        return
      } else {
        getProductAmountTotal({ 'price': this.orderForm.price, 'count': this.orderForm.productCount }).then(response => {
          if (response.code === '200') {
            this.orderForm.productAmountTotal = response.data
          }
        }).catch(() => {
          this.$message('计算总价失败')
          this.orderForm.productAmountTotal = '0.00'
        })
      }
    },
    updateCustomer(row) {
      this.clearRuleForm()
      city({ 'provinceCode': row.province }).then(response => {
        if (response.code === '200') {
          this.cityOption = response.data
        }
      })
      county({ 'provinceCode': row.province, 'cityCode': row.city }).then(response => {
        if (response.code === '200') {
          this.countyOption = response.data
        }
      })

      this.ruleForm.customerId = row.customerId
      this.ruleForm.username = row.customerName
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
      this.ruleForm.gender = '0'
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
    clearOrderForm() {
      this.orderForm.customerId = ''
      this.orderForm.productCount = 1
      this.orderForm.price = ''
      this.orderForm.productAmountTotal = ''
      this.orderForm.orderAmountTotal = ''
      this.orderForm.logisticsFee = ''
      this.orderForm.desc = ''
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    getCheckedNodes() {
      const labelData = this.$refs.cascaderAddr.getCheckedNodes()[0]
      this.orderForm.price = labelData.data.price
      this.orderForm.productId = labelData.data.id
      getProductAmountTotal({ 'price': this.orderForm.price, 'count': this.orderForm.productCount }).then(response => {
        if (response.code === '200') {
          this.orderForm.productAmountTotal = response.data
        }
      }).catch(() => {
        this.$message('计算总价失败')
        this.orderForm.productAmountTotal = '0.00'
      })
    }

  }
}
</script>
