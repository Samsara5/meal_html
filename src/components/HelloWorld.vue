<template>
<div id="HelloWorld">
  <div>
    <div class="item" v-for="item in list" :key="item.id">
      <div class="item-title border-bottom">
        -{{item.itemname}}
        <div v-for="citem in item.children" :key="citem.id">
          --{{citem.itemname}}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data(){
    return{
      list:[
          {
            "dirlevel": 1,
            "pid": 0,
            "id": 100,
            "itemname": "店铺首页",
            "children": [
              {
                "id": 101,
                "itemname": "店铺信息",
                "pid": 100,
                "dirlevel": 2,
                "url": "/home/info"
              }
            ],
            "url": "/home"
          },
    {
      "dirlevel": 1,
        "pid": 0,
        "id": 200,
        "itemname": "菜品管理",
        "children": [
      {
        "id": 201,
        "itemname": "特色菜",
        "pid": 200,
        "dirlevel": 2,
        "url": "/menu/special"
      },
      {
        "id": 202,
        "itemname": "快餐类",
        "pid": 200,
        "dirlevel": 2,
        "url": "/menu/fast"
      },
      {
        "id": 203,
        "itemname": "面食类",
        "pid": 200,
        "dirlevel": 2,
        "url": "/menu/noodle"
      },
      {
        "id": 204,
        "itemname": "小吃类",
        "pid": 200,
        "dirlevel": 2,
        "url": "/menu/snack"
      },
      {
        "id": 205,
        "itemname": "饮料类",
        "pid": 200,
        "dirlevel": 2,
        "url": "/menu/drink"
      },
      {
        "id": 206,
        "itemname": "菜品管理",
        "pid": 200,
        "dirlevel": 2,
        "url": "/menu/menumange"
      }
    ],
        "url": "/menu/home"
    },
    {
      "dirlevel": 1,
        "pid": 0,
        "id": 300,
        "itemname": "订单管理",
        "children": [
      {
        "id": 301,
        "itemname": "已下单",
        "pid": 300,
        "dirlevel": 2,
        "url": "/order/ordered"
      },
      {
        "id": 302,
        "itemname": "已完成",
        "pid": 300,
        "dirlevel": 2,
        "url": "/order/done"
      },
      {
        "id": 303,
        "itemname": "总订单",
        "pid": 300,
        "dirlevel": 2,
        "url": "/order/total"
      }
    ],
        "url": "/order/home"
    },
    {
      "dirlevel": 1,
        "pid": 0,
        "id": 400,
        "itemname": "库存管理",
        "children": [
      {
        "id": 401,
        "itemname": "食材列表",
        "pid": 400,
        "dirlevel": 2,
        "url": "/store/materiallist"
      },
      {
        "id": 402,
        "itemname": "饮料列表",
        "pid": 400,
        "dirlevel": 2,
        "url": "/store/drinklist"
      }
    ],
        "url": "/store/home"
    },
    {
      "dirlevel": 1,
        "pid": 0,
        "id": 500,
        "itemname": "店铺管理",
        "children": [
      {
        "id": 501,
        "itemname": "用户管理",
        "pid": 500,
        "dirlevel": 2,
        "url": "/shop/user"
      },
      {
        "id": 502,
        "itemname": "员工列表",
        "pid": 500,
        "dirlevel": 2,
        "url": "/shop/employeelist"
      },
      {
        "id": 503,
        "itemname": "薪资管理",
        "pid": 500,
        "dirlevel": 2,
        "url": "/shop/salary"
      }
    ],
        "url": "/shop/home"
    },
    {
      "dirlevel": 1,
        "pid": 0,
        "id": 600,
        "itemname": "报表分析",
        "children": [
      {
        "id": 601,
        "itemname": "订单报表",
        "pid": 600,
        "dirlevel": 2,
        "url": "/dataanalysis/order"
      },
      {
        "id": 602,
        "itemname": "库存报表",
        "pid": 600,
        "dirlevel": 2,
        "url": "/dataanalysis/store"
      },
      {
        "id": 603,
        "itemname": "销量报表",
        "pid": 600,
        "dirlevel": 2,
        "url": "/dataanalysis/sell"
      }
    ],
        "url": "/dataanalysis/home"
    }
  ]
    }
  },
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>
<style scoped>
</style>
