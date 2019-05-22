<template>
  <div class="layout">
    <Menu :height="MENU_HEIGHT" :color="MENU_COLOR"></Menu>
    <div class="layout-content" :style="{height:'calc(100% - '+MENU_HEIGHT+'px)'}">
      <div class="el-menu-wrapper" :style="{backgroundColor:NAV_COLOR}">
        <el-menu :background-color="NAV_COLOR" :default-active="$route.path" active-text-color="#20a0ff" text-color="#000" router unique-opened>
          <NavMenu :router.sync="menuList"></NavMenu>
        </el-menu>
      </div>
      <div class="main">
        <div class="breadcrumb-nav">
          <strong>{{$route.name}}</strong>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="router-view">
          <router-view v-if="!isReload" :key="$route.path">

          </router-view>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NavMenu from '@/components/NavMenu'
import Menu from '@/components/Menu'
export default {
  components: {
    NavMenu,
    Menu
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      MENU_HEIGHT: 60, // default
      MENU_COLOR: '#468FF9', // default
      NAV_COLOR: '#eef1f6', // 左边栏颜色
      isReload: false,
      businessForm: {},
      modalDialogVis: true
    }
  },
  computed: {
    ...mapGetters({
      menuList: 'userMap'
    })
  },
  methods: {
    reload () {
      this.isReload = true
      this.$nextTick(() => {
        this.isReload = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f8f8f8;
  .layout-content{
    display: flex;
    overflow: hidden;
  }
  .el-menu-wrapper{
    height: 100%;
    width: 240px;

  }
  .el-menu{
    border: 0
  }
  .main {
    width: 100%;
    padding: 15px;
    overflow-x: hidden;
    & .breadcrumb-nav{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    & .router-view {
      background-color: #fff;
      padding: 10px 20px;
    }
  }
}
</style>
