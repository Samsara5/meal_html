import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/welcome.vue')
const MenuMange = () => import('../components/Menu/MenuMange')
const MainType = () => import('../components/Menu/MainType')
const SpecialType = () => import('../components/Menu/SpecialType')
const SnackType = () => import('../components/Menu/SnackType')
const SetType = () => import('../components/Menu/SetType')
const DrinkType = () => import('../components/Menu/DrinkType')
const FinishOrders = () => import('../components/Order/FinishOrders')
const TotalOrders = () => import('../components/Order/TotalOrders')
const UnfinishedOrders = () => import('../components/Order/UnfinishedOrders')
const OrderReport = () => import('../components/Report/OrderReport')
const SellReport = () => import('../components/Report/SellReport')
const StoreReport = () => import('../components/Report/StoreReport')
const DrinkList = () => import('../components/Store/DrinkList')
const MaterialList = () => import('../components/Store/MaterialList')

Vue.use(VueRouter)

const routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login, meta: {hidden: true, title: "欢迎登录店铺管理后台系统"}},
    {
        path: '/home',
        component: Home,
        redirect: '/info',
        meta: {hidden: true, title: "店铺管理"},
        children: [
            {path: '/info', component: Welcome, meta: {hidden: true, title: "欢迎进入店铺管理系统"}},
            {path: '/menu/menumange', component: MenuMange, meta: {hidden: true, title: "全部菜品"}},
            {path: '/menu/special', component: SpecialType, meta: {hidden: true, title: "特色菜类别"}},
            {path: '/menu/maocai', component: MainType, meta: {hidden: true, title: "冒菜类别"}},
            {path: '/menu/setmeal', component: SetType, meta: {hidden: true, title: "套餐类别"}},
            {path: '/menu/drink', component: DrinkType, meta: {hidden: true, title: "酒水类别"}},
            {path: '/menu/snack', component: SnackType, meta: {hidden: true, title: "小吃类别"}},
            {path: '/order/total', component: TotalOrders, meta: {hidden: true, title: "总订单情况"}},
            {path: '/order/ordered', component: UnfinishedOrders, meta: {hidden: true, title: "未完成订单情况"}},
            {path: '/order/done', component: FinishOrders, meta: {hidden: true, title: "已完成订单情况"}},
            {path: '/store/materiallist', component: MaterialList, meta: {hidden: true, title: "食材库存"}},
            {path: '/store/drinklist', component: DrinkList, meta: {hidden: true, title: "酒水库存"}},
            {path: '/shop/user', component: MenuMange, meta: {hidden: true, title: "用户管理"}},
            {path: '/shop/employeelist', component: MenuMange, meta: {hidden: true, title: "员工管理"}},
            {path: '/shop/salary', component: MenuMange, meta: {hidden: true, title: "薪资管理"}},
            {path: '/dataanalysis/order', component: OrderReport, meta: {hidden: true, title: "订单报表"}},
            {path: '/dataanalysis/store', component: StoreReport, meta: {hidden: true, title: "存储报表"}},
            {path: '/dataanalysis/sell', component: SellReport, meta: {hidden: true, title: "销售报表"}}
        ]

    }
]

const router = new VueRouter({
    routes
})

// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作 next('/login')强制跳转login
router.beforeEach((to, from, next) => {
    // 设置标签标题
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
    // 访问登录页，放行
    if (to.path === '/login') return next()
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    // 没有token, 强制跳转到登录页
    if (!tokenStr) return next('/login')
    next()
})

export default router
