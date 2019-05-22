<template>
  <el-button @click="handleClick" :loading="loading" :size="size" :type="type" :plain="plain" :round="round" :circle="circle" :disabled="disabled" :icon="icon" :autofocus="autofocus" :nativeType="nativeType"><slot></slot></el-button>
</template>
<script>
export default {
  props: {
    click: Function,
    size: {
      type: String,
      // ''为默认尺寸/medium/small/mini
      default: ''
    },
    type: {
      type: String,
      //  primary / success / warning / danger / info / text
      default: 'primary'
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    nativeType: {
      type: String,
      //   button / submit / reset
      default: 'button'
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async handleClick () {
      this.loading = true
      try {
        await this.click()
      } catch (error) {
        console.warn('async-btn组件warning', error)
      }
      this.loading = false
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
