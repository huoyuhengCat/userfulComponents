<template>
  <div class="menu-bar">
    <template v-for="navMenu in router">
      <!-- 莫得子菜单 -->
      <el-menu-item
        v-if="navMenu.subMenu.length===0"
        :key="parseInt(navMenu.menuId)"
        :index="navMenu.menuUrl"
      >
        {{ navMenu.menuName }}
      </el-menu-item>
      <!-- hidden为true时 -->
      <!-- 有子菜单 -->
      <el-submenu
        v-if="navMenu.subMenu.length!==0"
        :key="parseInt(navMenu.menuId)"
        :index="navMenu.menuId.toString()"
      >
        <template slot="title">
          {{ navMenu.menuName}}
        </template>
        <!-- 递归 -->
        <NavMenu :router="navMenu.subMenu"></NavMenu>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'NavMenu',
  props: {
    router: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-bar {
  width: 100%;
  text-align: left;
}
</style>
