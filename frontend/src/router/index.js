import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ProceessDataTable from  '../views/ProceessDataTable.vue'
import Graphs from  '../views/Graphs'
import NodeConfiguration from "@/views/NodeConfiguration";
import AllowList from "@/views/AllowList";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/processdata',
    name: 'ProceessDataTable',
    component: ProceessDataTable
  },

  {
    path: '/graphs',
    name: 'Graphs',
    component: Graphs
  },
  {
    path: '/nodeconfiguration',
    name: 'NodeConfiguration',
    component: NodeConfiguration
  },
  {
    path: '/allowlist',
    name: 'AllowList',
    component: AllowList
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
