<template>
  <el-form :inline="true" v-model="form" class="query-form">
    <template v-for="(column,index) in config">
      <el-form-item :label="column.label" :key="index" v-if="column.createType!='button'">
        <template v-if="column.createType=='input'">
          <el-input v-model="form[column.prop]" :placeholder="column.label" clearable></el-input>
        </template>
        <template v-if="column.createType=='select'">
          <el-select style="width:100%" v-model="form[column.prop]" clearable >
            <template v-if="column.store">
              <el-option  v-for="option in $store.getters[column.store]" :value="option.value" :label="option.label" :key="option.value"></el-option>
            </template>
            <template v-else>
              <el-option  v-for="option in column.data" :value="option.value" :label="option.label" :key="option.value"></el-option>
            </template>
          </el-select>
        </template>
        <!-- <el-date-picker
                v-else-if="item.type==='datetime'"
                v-model="form[key]"
                type="datetime"
                style="width:100%"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker> -->
        <template v-if="column.createType=='daterange'">
          <el-date-picker
            v-model="form[column.prop]"
            type="daterange"
            placeholder="选择日期范围"
            style="width:220px"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-form-item>
      <el-form-item :key="index" v-else >
        <div class="btn-form-wrapper">
          <el-button :type="column.type" :size="column.size" @click="column.click" :key="index">{{column.label}}</el-button>
        </div>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'QueryForm',
  props: {
    config: {
      type: [Array, Object],
      default: null
    }
  },
  data () {
    return {
      Vue,
      form: {}
    }
  },
  mounted () {
  },
  methods: {
    getQueryData () {
      let dataForm = this.lodash.cloneDeep(this.form)
      for (let key in this.config) {
        let configColumn = this.config[key]
        if (configColumn.createType == 'daterange') {
          if (dataForm[configColumn.prop]) {
            dataForm[configColumn.start] = dataForm[configColumn.prop][0]
            dataForm[configColumn.end] = dataForm[configColumn.prop][1]
          }
          delete dataForm[configColumn.prop]
        }
      }
      console.log('queryForm数据', dataForm)
      return dataForm
    },
    setQueryData (data) {
      this.form = data
    }
  }
}
</script>
<style lang='scss' scoped>
.btn-form-wrapper{
  width: 100%;
  height: 100%;
  // border: 1px solid;
  display: flex;
  justify-content: center
}
</style>
