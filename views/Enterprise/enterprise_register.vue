<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="企业名称" >
        <el-input placeholder="企业名称" v-model="queryForm.name"></el-input>
      </el-form-item>
      <el-form-item label="渠道">
        <el-select v-model="queryForm.channelCode" placeholder="渠道" clearable>
          <el-option v-for="item in $store.getters.channelArr" :value="item.value" :label="item.label" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业">
        <el-select v-model="queryForm.companyNum" placeholder="企业" clearable>
          <el-option v-for="item in $store.getters.companyArr" :value="item.value" :label="item.label" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryForm.status" clearable>
          <el-option value="-1" label="禁用" key="-1"></el-option>
          <el-option value="0" label="初始化" key="0"></el-option>
          <el-option value="1" label="启用" key="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册日期">
        <el-date-picker
          v-model="selectTime"
          type="daterange"
          placeholder="选择日期范围"
          @change="timeHandler"
          style="width:220px"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-button @click="queryHandler" size="medium" type="primary">查询</el-button>
      <el-button @click="resetHandler" size="medium">重置</el-button>
    </el-form>
    <Tables
      :data="queryList"
      :config="queryListConfig"
      :page-config="config_page"
      :page-change="handleCurrentChange"
    >
    </Tables>
    <Dialog title="详情" :visible.sync="modalDialogVis" save :confirm="modalConfirm" :open="modalOpen" :sureText="mode==='detail'?'确认':'保存'">
      <Forms formName="modalForm" :config="businessForm" ref="modalForm"></Forms>
    </Dialog>
  </div>
</template>
<script>
import Tables from '@/components/Tables'
import Dialog from '@/components/Dialog'
import Forms from '@/components/Forms'
import query from '@/mixins/query'
import business from '@/mixins/business'
import { getCompanyDetail, getCompanyPage } from '@/api/company'
export default {
  components: {
    Tables,
    Dialog,
    Forms
  },
  mixins: [query, business],
  inject: ['reload'],
  data () {
    return {
      queryListConfig: [
        { label: '序号', type: 'index' },
        { label: '企业编号', prop: 'companyNum' },
        { label: '企业名称', prop: 'name' },
        { label: '企业税号', prop: 'taxpayerCode' },
        { label: '联系人', prop: 'contact' },
        { label: '联系电话', prop: 'tel' },
        { label: '紧急联系人', prop: 'emergencyContact' },
        { label: '紧急联系电话', prop: 'emergencyTel' },
        { label: '渠道', prop: 'channelCode' },
        { label: '状态', prop: 'statusDesc' },
        { label: '注册时间', prop: 'createTime' },
        { label: '备注', prop: 'remark' },
        {
          prop: 'btns',
          label: '操作',
          width: 100,
          button: [
            {
              name: '详情',
              type: 'info',
              click: this.detailHandler
            }
          ]
        }
      ],
      queryForm: {
        name: '',
        companyNum: '',
        channelCode: '',
        status: ''
      },
      businessForm: {
        'channelCode': { name: '渠道编码' },
        'channelName': { name: '渠道名称' },
        'companyNum': { name: '企业编号' },
        'contact': { name: '联系人' },
        'createBy': { name: '创建人' },
        'createTime': { name: '创建时间' },
        'emergencyContact': { name: '紧急联系人' },
        'emergencyTel': { name: '紧急联系人电话' },
        'name': { name: '企业名称' },
        'statusDesc': { name: '状态' },
        'taxpayerCode': { name: '企业税号' },
        'tel': { name: '联系方式' },
        'updateBy': { name: '更新人' },
        'updateTime': { name: '更新时间' },
        'remark': { name: '备注信息', inputType: 'textarea' }
      }
    }
  },
  mounted () {
    this.fetchInit()
  },
  methods: {
    async businessFetch (queryData) {
      let res = await getCompanyPage(queryData).then(res => res).catch(() => false)
      return res
    },
    async detailApi (data) {
      // 查
      let res = await getCompanyDetail(data.id).then(res => res).catch(() => false)
      return res
    },
    timeHandler (res) {
      // 时间控件
      this.queryForm.startCreateDate = res ? res[0] : ''
      this.queryForm.endCreateDate = res ? res[1] : ''
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
