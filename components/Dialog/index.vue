<!--
传save时 确定按钮为保存
传commit时 确定按钮为提交
默认是确认
  -->
<template>
  <div class="dialog">
    <el-dialog :title="title" :visible="visible" @close="closeDialog" @open="openHandler" :width="width">
      <slot>
      </slot>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelHandler">
          {{ cancelText||'取消' }}
        </el-button>
        <async-btn :click="confirm">{{ sureText||sureInfo }}</async-btn>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import AsyncBtn from '@/components/AsyncBtn'

export default {
  components: {
    AsyncBtn
  },
  props: {
    title: [String, Number],
    visible: {
      type: [Boolean],
      default: false
    },
    width: [String, Number],
    cancelText: String,
    sureText: String,
    save: String,
    commit: String,
    confirm: Function,
    open: Function
  },
  data () {
    return {
      show: this.visible,
      btnLoading: false
    }
  },
  computed: {
    sureInfo () {
      if (this.commit !== undefined) {
        return '提交'
      } else if (this.save !== undefined) {
        return '保存'
      } else {
        return '确认'
      }
    }
  },
  methods: {
    async cancelHandler () {
      this.$emit('update:visible', false)
    },
    async sureHandler () {
    },
    async closeDialog () {
      this.$emit('update:visible', false)
    },
    async openHandler (val) {
      this.btnLoading = false
      this.open() || null
    }
  }
}
</script>
<style lang='scss' scoped>
.dialog /deep/ .el-dialog__header{
    text-align: left
}
.dialog /deep/ .el-dialog{
    min-width: 660px!important;
}

</style>
