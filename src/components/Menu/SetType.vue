<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>套餐管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="14"><h2>套餐信息：</h2></el-col>
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
          <el-button type="primary" >使用Excel导入菜单数据</el-button>
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
        <el-table-column label="菜品名" prop="mname"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <el-image :key="scope.row.mimageurl" :src="'http://localhost:8081/system/getMenuImage?menuId='+scope.row.mid" ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="剩余数量">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.mnumber<5" effect="dark" type="danger">
              {{ scope.row.mnumber }}/{{ scope.row.mnuit }}
            </el-tag>
            <el-tag v-else effect="dark" type="warning">{{ scope.row.mnumber }}/{{ scope.row.mnuit }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="价格">
          <template slot-scope="scope">
            ￥{{ scope.row.mpirce }}
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="mtypename"></el-table-column>
        <el-table-column label="材料">
          <template slot-scope="scope">
            {{storeNames[scope.row.mmateria]}}
          </template>
        </el-table-column>
        <el-table-column label="特色菜设置">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mischara"
                       active-value='true'
                       @change="charaStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
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
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加菜单" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体 -->
      <el-form
          ref="addMenuFormRef"
          :model="menuObject"
          label-width="70px">
        <el-form-item label="菜单名">
          <el-input v-model="menuObject.mname"></el-input>
        </el-form-item>
        <el-form-item label="材料">
          <el-input v-model="menuObject.mmateria"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="menuObject.mnuit"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="menuObject.mnumber"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="menuObject.mpirce"></el-input>
        </el-form-item>
        <el-form-item label="所属类别">
          <el-select
              v-model="selectMenuTypeId"
              filterable
              allow-create
              default-first-option
              placeholder="请选择菜单类型"
          >
            <el-option
                v-for="item in menuType"
                :key="item.mtid"
                :label="item.mtname"
                :value="item.mtid"
            ></el-option>
          </el-select>
        </el-form-item>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </span>
      </el-form>
    </el-dialog>
    <!-- 修改菜单的对话框 -->
    <el-dialog
        :visible.sync="editDialogVisible"
        title="修改菜单信息"
        width="50%"
        @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form
          ref="editMenuFormRef"
          :model="menuObject"
          label-width="70px">
        <el-form-item label="菜单名">
          <el-input v-model="menuObject.mname"></el-input>
        </el-form-item>
        <el-form-item label="材料">
          <el-input v-model="menuObject.mmateria"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="menuObject.mnuit"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="menuObject.mnumber"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="menuObject.mpirce"></el-input>
        </el-form-item>
        <el-form-item label="所属类别">
          <el-select
              v-model="selectMenuTypeId"
              filterable
              allow-create
              default-first-option
              placeholder="请选择菜单类型"
          >
            <el-option
                v-for="item in menuType"
                :key="item.mtid"
                :label="item.mtname"
                :value="item.mtid"
            ></el-option>
          </el-select>
        </el-form-item>
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
      //获取的菜单数据
      queryInfo: {},
      //获取的材料名称数据
      storeNames:{},
      //获取菜单的条件绑定
      queryCondition: {
        typeId:'500',
        pn: '1',
        size: '10'
      },
      //修改菜单的对象
      menuObject: {
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
      },
      //批量删除开关
      isDeleteAbel: true,
      //批量删除上传结果,
      removeIdList: [],
      //编辑模态框开关
      editDialogVisible: false,
      //新增模态框开关
      addDialogVisible: false,
      // 菜单类别
      menuType: {},
      //选中的菜单类型id 修改，新增时使用
      selectMenuTypeId: "",
      //导入excel
      fileObj:{},
      excelFileUrl:'http://localhost:8081/menu/importmenusbyexcel',
    }
  },
  created() {
    this.getMenuList()
    this.getMenuTypeList()
    this.getStoreNames()
  },
  methods: {
    //获取菜单信息
    async getMenuList() {
      const {data: res} = await this.$http.get('menu/getMenusByType', {
        params: this.queryCondition
      })
      if (res.code !== 200) return this.$message.error("获取菜单失败")
      this.queryInfo = res.extend.menus
      this.queryCondition.pn = this.queryInfo.pageNum
      this.queryCondition.size = this.queryInfo.pageSize
    },
    //获取材料名称
    async getStoreNames(){
      const {data: res} = await this.$http.get('store/getStoreNames')
      if (res.code!== 200) return this.$message.error("获取材料信息失败")
      this.storeNames = res.extend.stores;
    },
    //获取菜单分类
    async getMenuTypeList() {
      const {data: res} = await this.$http.get('menu/getAllMenuTypes')
      if (res.code !== 200) {
        return this.$message.error('查询菜单类别信息失败！')
      }
      this.menuType = res.extend.MenuTypes
    },
    // 刷新页面
    refresh() {
      this.$router.go(0);
    },
    //展示新增模态框
    async showAddDialog() {
      this.addDialogVisible = true
    },
    //展示修改模态框
    async showEditDialog(id) {
      const {data: res} = await this.$http.get('menu/getMenuById?id=' + id)
      if (res.code !== 200) {
        return this.$message.error('查询菜单信息失败！')
      }
      this.menuObject = res.extend.menu
      this.editDialogVisible = true
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryCondition.size = newSize
      this.getMenuList()
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newSize) {
      this.queryCondition.pn = newSize
      this.getMenuList()
    },
    // 监听 switch开关 状态改变
    async charaStateChange(menuinfo) {
      this.menuObject = menuinfo
      const {data: res} = await this.$http.post(
          'menu/updatemenu', this.menuObject
      )
      if (res.code !== 200) {
        menuinfo.mischara = !menuinfo.mischara
        return this.$message.error('特色菜设置失败')
      }
      if (menuinfo.mischara !== 'true') {
        return this.$message.success('取消特色菜成功！')
      }
      this.$message.success('设置特色菜成功！')
    },
    //新增菜单
    async addMenu() {
      const {data: res} = await this.$http.post(
          'menu/addmenu', this.menuObject
      )
      if (res.code !== 200) {
        return this.$message.error("新增失败")
      }
      this.$message.success("新增" + this.menuObject.mname + "成功！")
      this.getMenuList()
      this.addDialogVisible = false
    },
    //修改方法
    async editMenu() {
      const {data: res} = await this.$http.post(
          'menu/updatemenu', this.menuObject
      )
      if (res.code !== 200) {
        return this.$message.error('修改菜单失败!')
      }
      this.$message.success('修改菜单成功！')
      this.editDialogVisible = false
      this.getMenuList()
    },
    // 监听修改菜单对话框的关闭事件
    editDialogClosed() {
      this.$refs.editMenuFormRef.resetFields()
    },
    // 监听新增菜单对话框的关闭事件
    addDialogClosed() {
      this.$refs.addMenuFormRef.resetFields()
    },
    // 删除菜单
    async removeMenuById(id) {
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
      const {data: res} = await this.$http.post('menu/deletemenu', {id: id})
      if (res.code !== 200) return this.$message.error('删除菜单失败！')
      this.$message.success('删除菜单成功！')
      this.getMenuList()
    },
    // 识别批量删除
    async changeDeleteState(condition) {
      if (condition == true) {
        //若操作失误则刷新
        if (this.removeIdList.length <= 0) return this.refresh();
        const {data: res} = await this.$http.post('/menu/autodelmenus', this.removeIdList)
        if (res.code !== 200) return this.$message.error("删除失败！")
        this.$message.success("删除成功！")
        await this.getMenuList()
      }
      this.isDeleteAbel = !this.isDeleteAbel
      this.removeIdList = [];
    },
    //加入删除id到list
    AddRemoveMenus(id) {
      this.removeIdList.unshift(id)
      console.log(this.removeIdList)
    },
    //上传文件 批量导入
    async checkType(file,fileList) {
      let data = new FormData()
      this.fileObj = file
      data.append("file",this.fileObj.raw)
      // this.$refs.upload.submit();
      const {data: res} = await this.$http.post('/menu/importmenusbyexcel', data)
      if (res !== '导入成功'){
        return this.$message.error(res)
      }
      this.$message.success(res)
      this.refresh()
    },
  }
}
</script>
<style lang="less" scoped>

</style>
