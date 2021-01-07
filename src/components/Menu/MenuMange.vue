<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>全部菜品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <h2>全部菜品信息：</h2>
    <el-card>
      <el-table :data="menuList" border stripe style="font-size: 16px;align-content:center;">
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="mname" label="菜品名" ></el-table-column>
        <el-table-column prop="mimageurl" label="图片"></el-table-column>
        <el-table-column label="剩余数量">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.mnumber<5" type="danger" effect="dark">{{scope.row.mnumber}}</el-tag>
            <el-tag v-else type="success" effect="dark" >{{scope.row.mnumber}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mpirce" label="价格"></el-table-column>
        <el-table-column prop="mtype" label="分类"></el-table-column>
        <el-table-column label="特色菜">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mischara"
                       active-value = 'true'
                       @change="charaStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                circle
                @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                circle
                @click="removeUserById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="20"
    ></el-pagination>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        menuList: [],
        queryInfo: {
          query: '',
          // 当前页数
          pagenum: 1,
          // 每页显示多少数据
          pagesize: 5,
          // 总记录数
          total:''
        }
      }
    },
    created() {
      this.getmenuList()
    },
    methods: {
      async getmenuList() {
        const {data: res} = await this.$http.get('menu/getallmenus')
        if (res.code != 200) this.$message.error("获取菜单失败")
        this.menuList = res.extend.menus.list
        this.getPageInfo(res.extend.menus)
        console.log(this.menuList)
      },
      async charaStateChange(menuInfo) {
        //  const { data: res } = await this.$http.put(
        //      `users/${menuInfo.mischara}/state/${userInfo.mg_state}`
        //  )
        //  if (res.meta.status !== 200) {
        //    userInfo.mg_state = !userInfo.mg_state
        //    return this.$message.error('更新用户状态失败')
        //  }
        //  this.$message.success('更新用户状态成功！')
        // }
        console.log(menuInfo)
      },
    }
  }
</script>

<style lang="less" scoped>

</style>
