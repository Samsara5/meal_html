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
      <el-table :data="queryInfo.list" border stripe style="font-size: 16px;align-content:center;">
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="mname" label="菜品名" ></el-table-column>
        <el-table-column prop="mimageurl" label="图片"></el-table-column>
        <el-table-column label="剩余数量">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.mnumber<5" type="danger" effect="dark">{{scope.row.mnumber}}/{{scope.row.mnuit}}</el-tag>
            <el-tag v-else type="success" effect="dark" >{{scope.row.mnumber}}/{{scope.row.mnuit}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column  label="价格">
          <template slot-scope="scope">
           ￥{{scope.row.mpirce}}
          </template>
        </el-table-column>
        <el-table-column prop="mtypename" label="分类"></el-table-column>
        <el-table-column label="特色菜设置">
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryCondition.pn"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryCondition.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryInfo.total"
    ></el-pagination>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //获取的菜单数据
        queryInfo: {},
        //获取菜单的条件绑定
        queryCondition:{
          pn:'',
          size:''
        },
        //修改菜单的对象
        menuObject:{
          mid: '',
          mimageurl: '',
          mischara: '',
          mmateria: '',
          mname: '',
          mnuit: '',
          mnumber: '',
          mpirce: '',
          mtypeid: '',
          mtypename: ''
        }

      }
    },
    created() {
      this.getmenuList()
    },
    methods: {
      //获取菜单信息
      async getmenuList() {
        const {data: res} = await this.$http.get('menu/getallmenus',{
          params: this.queryCondition
        })
        if (res.code != 200) this.$message.error("获取菜单失败")
        this.queryInfo = res.extend.menus
        this.queryCondition.pn = this.queryInfo.pageNum
        this.queryCondition.size = this.queryInfo.pageSize
      },
      //修改菜单信息

      // 监听 pagesize改变的事件
      handleSizeChange (newSize) {
        this.queryCondition.size = newSize
        this.getmenuList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange (newSize) {
        this.queryCondition.pn = newSize
        this.getmenuList()
      },
      // 监听 switch开关 状态改变
      async charaStateChange (menuinfo) {
        this.menuObject = menuinfo
        const { data: res } = await this.$http.post(
            'menu/updatemenu',this.menuObject
        )
        if (res.code !== 200) {
          menuinfo.mischara = !menuinfo.mischara
          return this.$message.error('特色菜设置失败')
        }
        if (menuinfo.mischara != 'true'){
          return  this.$message.success('取消特色菜成功！')
        }
        this.$message.success('设置特色菜成功！')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
