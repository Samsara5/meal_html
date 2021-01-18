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
</div>
</template>
<script>
export default {
  data(){
    return{

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
