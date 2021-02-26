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
          <a href="http://localhost:8081/system/getOrderImportTemplate" target="_blank"
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
        <el-button type="danger" @click="changeDeleteState(true)" v-if="!this.isDeleteAbel">确认删除</el-button>
        <el-button type="danger" @click="changeDeleteState" v-else>批量删除订单</el-button>
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
            <el-tag v-for="item in scope.row.content" :key="item.contentid">{{item.storename}}/{{item.ordernum}}份</el-tag>
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
                @click="showEditDialog(scope.row.oid)"
            ></el-button>
            <el-button
                circle
                icon="el-icon-delete"
                size="mini"
                type="danger"
                @click="removeOrderById(scope.row.oid)"
            ></el-button>
            <el-button
                :disabled="isDeleteAbel"
                circle
                icon="el-icon-circle-close"
                size="mini"
                type="danger"
                @click="AddRemoveOrders(scope.row.oid)"
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
    <!-- 修改菜单的对话框 -->
    <el-dialog
        :visible.sync="editDialogVisible"
        title="修改订单信息"
        width="50%"
        @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form
          ref="editMenuFormRef"
          :model="menuObject"
          label-width="70px">
        <el-form-item label="订单编号">
          <el-input v-model="orderObject.oid"></el-input>
        </el-form-item>
        <el-form-item label="下单用户">
          <el-input v-model="orderObject.uid"></el-input>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-input v-model="orderObject.createtime"></el-input>
        </el-form-item>
        <el-form-item label="完成时间">
          <el-input v-model="orderObject.finshtime"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="orderObject.mpirce"></el-input>
        </el-form-item>
        <el-form-item label="下单内容"></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMenu">确 定</el-button>
      </span>
    </el-dialog>
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
      //修改订单的对象
      orderObject: {
        content:[],
        createtime:'',
        finshtime:'',
        oid:'',
        price:'',
        state:'',
        uid:''
      },
      //批量删除开关
      isDeleteAbel: true,
      //批量删除上传结果,
      removeIdList: [],
      //编辑模态框开关
      editDialogVisible: false,
      // 订单类别
      OrderType: {},
      //选中的菜单类型id 修改，新增时使用
      selectOrderTypeId: "",
      //导入excel
      fileObj:{},
      excelFileUrl:'http://localhost:8081/order/importOrdersByExcel',
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
    //展示修改模态框
    async showEditDialog() {
      this.editDialogVisible = true
    },
    // 监听修改菜单对话框的关闭事件
    editDialogClosed() {
      this.$refs.editOrderFormRef.resetFields()
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
    //获取订单信息
    async getAllOrders() {
      const {data: res} = await this.$http.get('order/getallorders', {
        params: this.queryCondition
      })
      if (res.code !== 200) return this.$message.error("获取订单失败")
      this.queryInfo = res.extend.orderInfo
      this.queryCondition.pn = this.queryInfo.pageNum
      this.queryCondition.size = this.queryInfo.pageSize
    },
    // 删除订单
    async removeOrderById(id) {
      const confirmResult = await this.$confirm(
          '此操作将永久删除该菜单, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).catch(err => err)
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const {data: res} = await this.$http.post('order/delorder', {id: id})
      if (res.code !== 200) return this.$message.error('删除菜单失败！')
      this.$message.success('删除菜单成功！')
      this.getOrderList()
    },
    // 识别批量删除
    async changeDeleteState(condition) {
      if (condition == true) {
        //若操作失误则刷新
        if (this.removeIdList.length <= 0) return this.refresh();
        const {data: res} = await this.$http.post('order/delorderByIds', this.removeIdList)
        if (res.code !== 200) return this.$message.error("删除失败！")
        this.$message.success("删除成功！")
        await this.getOrderList()
      }
      this.isDeleteAbel = !this.isDeleteAbel
      this.removeIdList = [];
    },
    //加入删除id到list
    AddRemoveOrders(id) {
      this.removeIdList.unshift(id)
      console.log(this.removeIdList)
    },
    //上传文件 批量导入
    async checkType(file,fileList) {
      let data = new FormData()
      this.fileObj = file
      data.append("file",this.fileObj.raw)
      // this.$refs.upload.submit();
      const {data: res} = await this.$http.post('order/importOrdersByExcel', data)
      if (res !== '导入成功'){
        return this.$message.error(res)
      }
      this.$message.success(res)
      this.refresh()
    }
  }
}
</script>

<style scoped>

</style>
