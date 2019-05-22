<template>
  <div class="login">
    <el-form
      ref="loginForm"
      class="login-form"
      :model="loginForm"
      :rules="rules"
    >
      <h1>后台系统</h1>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="用户名/邮箱"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="密码"
        />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" :loading="loading" @click="submitForm('loginForm')">
          登陆
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async submitForm (formName) {
      const valid = await this.$refs[formName].validate().then(valid => valid).catch(() => false)
      if (!valid) {
        return
      }
      this.loading = true
      await this.$store.dispatch('logIn', this.loginForm).then().catch(error => error)
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  .login-form {
    width: 500px;
    border: 1px solid #b5b5b5;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    padding: 15px;
    text-align: center;
    & h1{
        margin-bottom: 3%;
    }
  }
}
</style>
