<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-divider>客户信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-form-item label="用户名：" prop="username">
            <el-input v-model="ruleForm.username" style="width: 50%;" />
          </el-form-item>
          <el-form-item label="性别：" prop="username">
            <el-radio v-model="ruleForm.gender" label="1">男</el-radio>
            <el-radio v-model="ruleForm.gender" label="0">女</el-radio>
          </el-form-item>
          <el-form-item label="手机号：" prop="username">
            <el-input v-model="ruleForm.phoneNumber" style="width: 50%;" />
          </el-form-item>
          <el-form-item label="邮箱：" prop="username">
            <el-input v-model="ruleForm.email" style="width: 50%;" />
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="选择省市区：" prop="username">
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
          <el-form-item label="详细地址：" prop="username">
            <el-input
              v-model="ruleForm.detailedAddress"
              type="textarea"
              :rows="2"
              placeholder="请输入详细地址"
            />
          </el-form-item>
          <el-form-item label="用户备注：" prop="username">
            <el-input
              v-model="ruleForm.description"
              type="textarea"
              :rows="2"
              placeholder="请输入用户备注"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider>订单信息</el-divider>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="选择产品" prop="region">
            <el-cascader
              ref="cascaderAddr"
              :options="options"
              :props="{ checkStrictly: true }"
              clearable
              @change="getCheckedNodes"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品数量" prop="region">
            <el-input-number v-model="ruleForm.productCount" type="number" style="width: 50%;" @change="changeCount" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总价" prop="region">
            <el-input v-model="ruleForm.productAmountTotal" type="number" readonly style="width: 50%;" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="实际付款" prop="region">
            <el-input v-model="ruleForm.orderAmountTotal" type="number" style="width: 50%;" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运费金额" prop="region">
            <el-input v-model="ruleForm.logisticsFee" type="number" style="width: 50%;" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注" prop="region">
            <el-input
              v-model="ruleForm.desc"
              type="textarea"
              :rows="2"
              placeholder="请输入用户备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { province, city, county } from '@/api/districts'
import { getOrderProductList, getProductAmountTotal } from '@/api/product'
import { addOrderAndCustomer } from '@/api/order'

export default {
  data() {
    return {
      ruleForm: {
        username: '',
        gender: '0',
        phoneNumber: '',
        email: '',
        province: '',
        city: '',
        district: '',
        detailedAddress: '',
        description: '',
        productCount: 1,
        price: '',
        productAmountTotal: '0.0',
        orderAmountTotal: '0.0',
        logisticsFee: '0.0',
        desc: ''
      },
      provinceOption: [],
      cityOption: [],
      countyOption: [],
      options: [{
        value: 12,
        label: `选项1`,
        leaf: 1
      }],
      value: '',
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
    this.fetchData2()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      province().then(response => {
        if (response.code === '200') {
          this.provinceOption = response.data
        }
        this.listLoading = false
      })
    },
    fetchData2() {
      this.listLoading = true
      getOrderProductList().then(response => {
        if (response.code === '200') {
          this.options = response.data
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
    getCheckedNodes() {
      const labelData = this.$refs.cascaderAddr.getCheckedNodes()[0]
      this.ruleForm.price = labelData.data.price
      this.ruleForm.productId = labelData.data.id
      getProductAmountTotal({ 'price': this.ruleForm.price, 'count': this.ruleForm.productCount }).then(response => {
        if (response.code === '200') {
          this.ruleForm.productAmountTotal = response.data
        }
      }).catch(() => {
        this.$message('计算总价失败')
        this.ruleForm.productAmountTotal = '0.00'
      })
    },
    changeCount() {
      if (this.ruleForm.productCount < 1) {
        this.$message('数量不能小于0')
        return
      } else {
        getProductAmountTotal({ 'price': this.ruleForm.price, 'count': this.ruleForm.productCount }).then(response => {
          if (response.code === '200') {
            this.ruleForm.productAmountTotal = response.data
          }
        }).catch(() => {
          this.$message('计算总价失败')
          this.ruleForm.productAmountTotal = '0.00'
        })
      }
    },
    addOrderAndCustomer() {
      addOrderAndCustomer(this.ruleForm).then(response => {
        if (response.code === '200') {
          this.$message('添加成功')
        }
      })
    },
    submitForm(formName) {
      addOrderAndCustomer(this.ruleForm).then(response => {
        if (response.code === '200') {
          this.$message('添加成功')
        }
      })
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     alert('submit!')
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style>
.el-row {
  margin-bottom: 20px;
&:last-child {
   margin-bottom: 0;
 }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
