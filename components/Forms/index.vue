<template>
  <div class="form-wrapper">
    <el-form :model="form" :label-width="parseInt(labelWidth)+'px'" :ref="formName" v-show="show">
      <template v-for="(groupName,index) in groupArr" >
        <el-row :key="index">
          <el-row v-if="groupName" class="groupName">{{groupName}}</el-row>
          <template v-for="(item,key) in config" >
            <el-form-item v-if="item.group===groupName" :prop="key" :label="item.name" :key="key" :rules="item.rules?item.rules:(item.required?emptyRule:null)">
              <el-select style="width:100%" v-if="item.type==='select'" v-model="form[key]" clearable >
                <template v-if="item.store">
                  <el-option  v-for="option in $store.getters[item.store]" :value="option.value" :label="option.label" :key="option.value"></el-option>
                </template>
                <template v-else>
                  <el-option  v-for="option in item.data" :value="option.value" :label="option.label" :key="option.value"></el-option>
                </template>
              </el-select>
              <el-date-picker
                v-else-if="item.type==='datetime'"
                v-model="form[key]"
                type="datetime"
                style="width:100%"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
              <el-input :placeholder="`请输入${item.name}`" v-else :type="item.inpuType?item.inpuType:'text'" :show-password="item.showPassword?item.showPassword:false" v-model="form[key]" autosize></el-input>
            </el-form-item>
          </template>
        </el-row>
      </template>
    </el-form>
    <div v-show="!show">
      <el-form :model="form" :label-width="parseInt(labelWidth)+'px'">
        <el-row :gutter="10">
          <el-col class="detail-col" v-for="(item,key) in config" :key="key" :span="12">
            <div class="detail-flex">
              <span class="detail-label">{{item.name}}：</span>
              <template v-if="item.type==='select'">
                <template v-if="item.store">
                  <template v-for="(option,index) in $store.getters[item.store]" >
                    <span class="detail-value" v-if="option.value==form[key]" :key="index">
                      {{item.formatter?item.formatter(option.label):option.label}}
                    </span>
                  </template>
                </template>
                <template v-else>
                  <template v-for="(option,index) in item.data" >
                    <span class="detail-value" v-if="option.value==form[key]" :key="index">
                      {{item.formatter?item.formatter(option.label):option.label}}
                    </span>
                  </template>
                </template>
              </template>
              <template v-else>
                <span class="detail-value">
                  {{item.formatter?item.formatter(form[key]):form[key]}}
                </span>
                <div class="copy-wrapper" v-if="item.copy===true&&form[key]!=null">
                  <i class="el-icon-document copy-icon" v-clipboard:copy="form[key]"></i>
                </div>
              </template>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import '@/directive/clipboard'
export default {
  props: {
    formName: [String],
    config: [Object],
    labelWidth: {
      type: [String, Number],
      default: '120px'
    }
  },
  data () {
    return {
      form: this.initForm(),
      show: true,
      listData: [], // 详情数据
      emptyRule: [{ required: true, trigger: 'blur', message: '请先填写信息' }],
      groupArr: []
    }
  },
  mounted () {

  },
  methods: {
    initForm () {
      // 不能给this.form复制 会导致v-model无法绑定
      let form = {}
      let groupArr = []
      for (let key in this.config) {
        if (groupArr.indexOf(this.config[key].group) < 0) {
          groupArr.push(this.config[key].group)
        }
        if (this.config[key].default) {
          form[key] = this.config[key].default
        } else {
          form[key] = ''
        }
      }
      return {
        form: form,
        groupArr: groupArr
      }
    },
    setData (data) {
      let init = this.initForm()
      this.form = init.form// 初始化最新config
      this.groupArr = init.groupArr
      console.log('当前config', this.form)
      if (!data) { return }// 不传data为新增模式 否则为编辑模式
      for (let key in data) {
        if (this.lodash.has(this.config, key)) {
          this.form[key] = data[key]
        }
      }
    },
    showDetail (mode) {
      if (mode === 'list') {
        this.show = false
      } else if (mode === 'form') {
        this.show = true
      }
    },
    getData () {
      return this.form
    },
    async resetFields () {
      await this.$nextTick()
      this.$refs[this.formName].resetFields()
    },
    async validate () {
      let validate = await this.$refs[this.formName].validate().then(() => true).catch(() => false)
      return validate
    }
  }
}
</script>
<style lang='scss' scoped>
.form-wrapper{
  max-height: 500px;
  overflow: scroll;
  overflow-x: hidden;
}
.detail-col{
  font-size: 14px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
}
.detail-flex{
  display: flex;
  align-items: center;
}
.detail-value{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  position: relative;
}
.copy-icon{
  color: rgb(70, 143, 249);
  cursor: pointer;
}
.groupName{
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
