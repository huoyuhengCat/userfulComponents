<template>
  <div class="errorPage">
    <h1>404</h1>
    <p>Page Not Found</p>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
<style lang='scss' scoped>
.errorPage{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
  h1{
    font-size: 100px;
  }
  p{
    font-size: 50px
  }
}
</style>
