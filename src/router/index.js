import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import searchList from '@/components/searchList'
import productDetail from '@/components/productDetail'
import chat from '@/components/chat'
import productList from '@/components/productList'
import cart from '@/components/cart'
import getUserInfo from '@/components/getUserInfo'
import orderList from '@/components/orderList'
import tel from '@/components/tel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'getUserInfo',
      component: getUserInfo
    },
    {
      path: '/tel',
      name: 'tel',
      component: tel
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/searchList',
      name: 'searchList',
      component: searchList
    },
    {
      path: '/productDetail',
      name: 'productDetail',
      component: productDetail
    },
    {
      path: '/chat',
      name: 'chat',
      component: chat
    },
    {
      path: '/productList',
      name: 'productList',
      component: productList
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: orderList
    },
  ]
})
