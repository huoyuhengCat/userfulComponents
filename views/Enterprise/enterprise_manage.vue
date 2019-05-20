<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="抬头名称" >
        <el-input placeholder="抬头名称" v-model="queryForm.name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="渠道">
        <el-select v-model="queryForm.channelCode" placeholder="渠道" clearable>
          <el-option v-for="item in $store.getters.channelArr" :value="item.value" :label="item.label" :key="item.value"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="税号" >
        <el-input placeholder="税号" v-model="queryForm.taxplayerCode"></el-input>
      </el-form-item>
      <el-form-item label="开票电话" >
        <el-input placeholder="开票电话" v-model="queryForm.sendTel"></el-input>
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
import { getInvoiceTitleDetail, getInvoiceTitlePage } from '@/api/invoiceTitle'
export default {
  components: {
    Tables,
    Dialog,
    Forms
  },
  mixins: [query, business],
  inject: ['reload'],
  // 返回：ID、渠道名称、企业编号、抬头名称、税号、开票电话、状态、创建时间、备注
  data () {
    return {
      queryListConfig: [
        { label: '序号', type: 'index' },
        { label: '抬头名称', prop: 'name' },
        { label: '税号', prop: 'taxplayerCode' },
        { label: '开票电话', prop: 'sendTel' },
        { label: '状态', prop: 'statusDesc' },
        { label: '创建时间', prop: 'createTime' },
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
        channelCode: '',
        startCreateDate: '',
        endCreateDate: '',
        sendTel: '',
        status: '',
        taxplayerCode: '',
        name: ''
      },
      businessForm: {
        'name': { name: '发票抬头名称' },
        'address': { name: '单位地址' },
        'bank': { name: '银行' },
        'bankAccount': { name: '开户行账号 ' },
        'channelCode': { name: '渠道编码' },
        'channelName': { name: '渠道名称' },
        'createBy': { name: '创建人' },
        'createTime': { name: '创建时间' },
        'isDefault': { name: '默认抬头', type: 'select', data: [{ label: '是', value: true }, { label: '否', value: false }] },
        'outCompanyNum': { name: '第三方企业编号' },
        'sendTel': { name: '开票电话' },
        'statusDesc': { name: '状态' },
        'taxplayerCode': { name: '税号' },
        'tel': { name: '电话' },
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
    fetchQuery () {
      // 请求查询项里的select组建
      this.$store.dispatch('channelFetch')
      this.$store.dispatch('companyFetch')
    },
    async businessFetch (queryData) {
      let res = await getInvoiceTitlePage(queryData).then(res => res).catch(() => false)
      return res
    },
    async detailApi (data) {
      // 查
      let res = await getInvoiceTitleDetail(data.id).then(res => res).catch(() => false)
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
