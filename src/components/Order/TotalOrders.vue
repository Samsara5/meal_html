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
        <el-button type="primary" >使用Excel导入订单数据</el-button>
      </el-upload>
      <el-button type="success" @click="showAddDialog">新增数据</el-button>
      <el-button type="danger" @click="changeDeleteState(true)" v-if="!this.isDeleteAbel">确认删除</el-button>
      <el-button type="danger" @click="changeDeleteState" v-else>批量删除菜单</el-button>
    </el-col>
  </el-row>
  <el-card>
    <el-table :data="queryInfo.list" border stripe style="font-size: 16px;align-content:center;">
      <!-- stripe: 斑马条纹
      border：边框-->
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="下单用户"></el-table-column>
      <el-table-column label="下单内容"></el-table-column>
      <el-table-column label="下单价格"></el-table-column>
      <el-table-column label="是否完成"></el-table-column>
      <el-table-column label="创建时间"></el-table-column>
      <el-table-column label="完成时间"></el-table-column>
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
  data(){
    return{
      //获取的订单数据
      queryInfo: {},
      //获取的材料名称数据
      storeNames:{},
      //获取菜单的条件绑定
      queryCondition: {
        pn: '',
        size: ''
      }
    }
  },
  created() {
  },
  methods:{
    // 刷新页面
    refresh() {
      this.$router.go(0);
    },
  }
}
</script>

<style scoped>

</style>
