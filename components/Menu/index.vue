<template>
  <div class="menu" :style="{height:height+'px',backgroundColor:'rgb(70, 143, 249)'}">
    <el-row>
      <slot>
        <img src="@/assets/logo.svg" alt="" class="system-logo">
      </slot>
      <div class="user-wrapper flex-xy" :style="{height:height+'px'}">
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="flex-xy">
            <span class="user-name">
              用户：{{ this.$store.state.userInfo.userName }}
            </span>
            <span class="user-head">
              <img src="@/assets/head.png" alt="" style="width:100%">
            </span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="manage">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-row>
    <Dialog
      title="修改密码"
      :visible.sync="modalDialogVis"
      save
      width="200px"
      :confirm="modalConfirm"
      :open="modalOpen"
      :sureText="mode==='detail'?'确认':'保存'"
    >

      <Forms
        formName="modalForm"
        :config="businessForm"
        ref="modalForm"
        labelWidth="70"
      ></Forms>
    </Dialog>
  </div>
</template>

<script>
import Dialog from '@/components/Dialog'
import Forms from '@/components/Forms'
import business from '@/mixins/business'
import { editPassword } from '@/api/user'
import { isPassword } from '@/utils/validate'
export default {
  components: {
    Dialog,
    Forms
  },
  props: {
    color: {
      type: String,
      default: '#000'
    },
    height: {
      type: [String, Number],
      default: 60
    }
  },
  mixins: [business],
  data () {
    return {
      businessForm: {
        oldPassword: { name: '原密码', showPassword: true, required: true, rules: [{ required: true, message: '请先填写信息' }, { validator: isPassword }] },
        newPassword: { name: '新密码', showPassword: true, required: true, rules: [{ required: true, message: '请先填写信息' }, { validator: isPassword }] }
      }
      // modalDialogVis: false
    }
  },
  methods: {
    async addApi (data) {
      let postData = data
      postData.userName = this.$store.state.userInfo.userName
      const [success] = await this.toAsync(editPassword(postData))
      // [success, res]
      if (success) {
        this.$store.dispatch('logOut').then(() => {
          this.$router.push({ path: '/' })
        })
      }
      return success
    },
    handleCommand (cmd) {
      switch (cmd) {
        case 'manage':
          this.addeditHandler('add')
          break
        case 'logout':
          this.$store.dispatch('logOut').then(() => {
            this.$router.push({ path: '/' })
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu{
  width:100%;
  // position: fixed;
  // top: 0;
  // left: 0;
  color:#fff;
  .system-logo{
    margin-top: 10px;
    margin-left: 10px;
    width: 180px;
  }
  & .user-wrapper{
    // background-color: red;
    float: right;
    width: auto;
    margin-right: 40px;
    border: 0;
    cursor: pointer;
    span{
      color: #fff
    }
    & .user-head{
      @include circle(50px);
      // background:url(@)
      // background-color: blue;
      display: inline-block;
      margin: 0 20px;

    }

  }
  // height: 30px;
  // background-color: red;
}
</style>
