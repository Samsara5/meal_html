<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>全部订单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="14"><h2>全部订单信息：</h2></el-col>
      <el-col :span="10">
        <el-button type="primary" icon="el-icon-refresh-right" @click="refresh"></el-button>
        <el-button type="info">
          <a href="http://localhost:8081/system/getmenuimporttemplate" target="_blank"
             style="color: white;text-decoration: none;">下载模板</a>
        </el-button>
        <el-upload
            action="none"
            :auto-upload="false"
            :on-change="checkType"
            :show-file-list="false"
            multiple
            style="display: inline-block;margin-left: 10px;margin-right: 10px">
          <el-button type="primary">使用Excel导入订单数据</el-button>
        </el-upload>
        <el-button type="success" @click="showAddDialog">新增数据</el-button>
        <el-button type="danger" @click="changeDeleteState(true)" v-if="!this.isDeleteAbel">确认删除</el-button>
        <el-button type="danger" @click="changeDeleteState" v-else>批量删除菜单</el-button>
      </el-col>
    </el-row>
    <el-card>
      <el-input placeholder="请输入内容" v-model="selectedCondition.condition" style="width: 500px;">
        <el-select v-model="selectedCondition.byWhat" slot="prepend" placeholder="请选择" style="width: 130px;">
          <el-option v-for="item in byWhat" :label="item.lable" :key="item.key" :value="item.value"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-table :data="queryInfo.list" border stripe style="font-size: 16px;align-content:center;">
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="下单用户" prop="uid"></el-table-column>
        <el-table-column label="下单内容">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.content">{{item.storename}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单价格" prop="price"></el-table-column>
        <el-table-column label="是否完成">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state == 1">完成</el-tag>
            <el-tag type="danger" v-else>未完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createtime"></el-table-column>
        <el-table-column label="完成时间" prop="finshtime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                circle
                icon="el-icon-edit"
                size="mini"
                type="primary"
                @click="showEditDialog(scope.row.mid)"
            ></el-button>
            <el-button
                circle
                icon="el-icon-delete"
                size="mini"
                type="danger"
                @click="removeMenuById(scope.row.mid)"
            ></el-button>
            <el-button
                :disabled="isDeleteAbel"
                circle
                icon="el-icon-circle-close"
                size="mini"
                type="danger"
                @click="AddRemoveMenus(scope.row.mid)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
        :current-page="queryCondition.pn"
        :page-size="queryCondition.size"
        :page-sizes="[2, 5, 10, 15]"
        :total="queryInfo.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //获取的订单数据
      queryInfo: {},
      //获取的材料名称数据
      storeNames: {},
      //获取菜单的条件绑定
      queryCondition: {
        pn: '',
        size: ''
      },
      //通过时间、用户、状态查询的下拉框
      byWhat: [
        {index: 1, value: 'time', lable: '时间'},
        {index: 2, value: 'user', lable: '用户'},
        {index: 3, value: 'state', lable: '订单状态'}],
      selectedCondition: {
        byWhat: '',
        condition: '',
        pn:'',
        size:''
      },
      formatData: {
        objectList:'',
        size:'1'
      }
    }
  },
  created() {
    this.getAllOrders()
  },
  methods: {
    // 刷新页面
    refresh() {
      this.$router.go(0);
    },
    //获取菜单信息
    async getAllOrders() {
      const {data: res} = await this.$http.get('order/getallorders', {
        params: this.queryCondition
      })
      if (res.code !== 200) return this.$message.error("获取订单失败")
      this.queryInfo = res.extend.orderInfo
      this.queryCondition.pn = this.queryInfo.pageNum
      this.queryCondition.size = this.queryInfo.pageSize
      this.formatData.objectList = res.extend.orderInfo.list
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryCondition.size = newSize
      this.getAllOrders()
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newSize) {
      this.queryCondition.pn = newSize
      this.getAllOrders()
    },
  }
}
</script>

<style scoped>

</style>
