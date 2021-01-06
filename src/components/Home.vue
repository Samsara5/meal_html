<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>在线点餐后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="togleCollapse">|||</div>
        <el-menu unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath" background-color="#333744" text-color="#fff" active-text-color="#409FFF">
           <!-- :unique-opened="true"->只允许展开一个菜单 -->
           <!-- :collapse-transition="false" -> 关闭动画 -->
           <!-- router -> 导航开启路由模式 -->
          <!-- 一级菜单  -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id" >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.itemname}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.url" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.url)">
              <!-- 导航开启路由模式：
                将index值作为导航路由 -->
              <!-- 二级菜单的模板区域 -->
              <template slot="title">
                <i :class="iconObj[subItem.id]"></i>
                <span>{{ subItem.itemname}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj: {
        '100': 'el-icon-s-shop',
        '101': 'el-icon-s-shop',
        '200': 'iconfont icon-shangpin',
        '201': 'iconfont icon-shangpin',
        '202': 'el-icon-star-on',
        '203': 'el-icon-tableware',
        '204': 'el-icon-dessert',
        '205': 'el-icon-chicken',
        '206': 'el-icon-ice-drink',
        '300': 'el-icon-s-order',
        '301': 'el-icon-s-order',
        '302': 'el-icon-s-release',
        '303': 'el-icon-s-claim',
        '400': 'iconfont icon-tijikongjian',
        '401': 'el-icon-dish',
        '402': 'el-icon-goblet-square-full',
        '500': 'el-icon-s-tools',
        '501': 'iconfont icon-users',
        '502': 'el-icon-s-custom',
        '503': 'el-icon-bank-card',
        '600': 'iconfont icon-baobiao',
        '603': 'el-icon-shopping-cart-full',
        '602': 'el-icon-box',
        '601': 'el-icon-data-analysis'
      },
      // 默认不折叠
      isCollapse: false,
      // 被激活导航地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      // 清空token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取请求菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('system/getNavigation')
      if (res.code !== 200) return this.$message.error(res.msg)
      this.menuList = res.extend.navigation
      // console.log(res)
    },
    // 菜单的折叠与展开
    togleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活地址
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373f41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 40px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;

  .el-menu {
    border: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-left: 4px;
  margin-right: 10px;
  font-size:18px;
  font-style:normal;
}
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}
</style>
