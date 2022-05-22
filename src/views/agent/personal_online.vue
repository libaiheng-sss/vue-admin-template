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
      <el-table-column label="订单ID" align="center"  width="260">
        <template slot-scope="scope">
          {{ scope.row.orderId }}
        </template>
      </el-table-column>
      <el-table-column label="客户名" align="center"  width="120">
        <template slot-scope="scope">
          {{ scope.row.customerName }}
        </template>
      </el-table-column>
      <el-table-column label="对接人" align="center"  width="120">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center"  width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品单价" align="center"  width="120">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="订购数量" align="center"  width="120">
        <template slot-scope="scope">
          {{ scope.row.productCount }}
        </template>
      </el-table-column>
      <el-table-column label="产品总价" align="center"  width="120">
        <template slot-scope="scope">
          {{ scope.row.productAmountTotal }}
        </template>
      </el-table-column>
      <el-table-column label="运费" align="center"  width="120">
        <template slot-scope="scope">
          {{ scope.row.logisticsFee }}
        </template>
      </el-table-column>
      <el-table-column label="订单总价" align="center"  width="120">
        <template slot-scope="scope">
          {{ scope.row.orderAmountTotal }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center"  width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus === '1'">未付款</span>
          <span v-if="scope.row.orderStatus === '2'">已付款</span>
          <span v-if="scope.row.orderStatus === '3'">已发货</span>
          <span v-if="scope.row.orderStatus === '4'">已退货</span>
          <span v-if="scope.row.orderStatus === '5'">完结</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center"  width="160">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center"  width="160">
        <template slot-scope="scope">
          {{ scope.row.payTime }}
        </template>
      </el-table-column>
      <el-table-column label="发货时间" align="center"  width="160">
        <template slot-scope="scope">
          {{ scope.row.sendTime }}
        </template>
      </el-table-column>
      <el-table-column label="订单完结时间" align="center"  width="160">
        <template slot-scope="scope">
          {{ scope.row.orderSettlementTime }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center"  width="160">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center"  width="160">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="400" fixed="right">
        <template slot-scope="scope" width="100px">
          <el-button size="mini" type="danger" @click="updateCustomer(scope.row)">付款</el-button>
          <el-button size="mini" type="danger" @click="updateCustomer(scope.row)">发货</el-button>
          <el-button size="mini" type="danger" @click="updateCustomer(scope.row)">完结</el-button>

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
import { personal } from '@/api/order'

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
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.listQuery.page = val
      this.fetchData()
    }

  }
}
</script>
