<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="卡号" >
        <el-input placeholder="卡号" v-model="queryForm.cardId"></el-input>
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
      <el-form-item label="账期" >
        <el-input placeholder="账期" v-model="queryForm.billDate"></el-input>
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
import { getBillDetail, getBillPage } from '@/api/bill'
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
        { label: '渠道名称', prop: 'channelName' },
        { label: '渠道编号', prop: 'channelCode' },
        { label: '企业名称', prop: 'companyName' },
        { label: '卡账数', prop: 'cardBillNum' },
        { label: '账期', prop: 'billDate' },
        { label: '卡号id', prop: 'cardId' },
        { label: '交易总额', prop: 'invoiceAmount' },
        { label: '状态', prop: 'statusDesc' },
        { label: '发票税额', prop: 'taxRadeAmount' },
        { label: '交易总数', prop: 'tradeCount' },
        { label: '创建时间', prop: 'createTime' },
        { label: '修改时间', prop: 'updateTime' },
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
        billDate: '',
        cardId: '',
        channelCode: '',
        companyNum: ''
      },
      businessForm: {
        'channelName': { name: '渠道名称' },
        'companyNum': { name: '企业编号' },
        'companyName': { name: '企业名称' },
        'billDate': { name: '账期' },
        'billStatus': { name: '账单状态', type: 'select', data: [{ value: 1, label: '待开票' }, { value: 2, label: '开票中' }, { value: 3, label: '已开票' }, { value: 4, label: '已抵扣' }] },
        'cardBillNum': { name: '卡账数' },
        'cardId': { name: '卡号id' },
        'csvStatus': { name: '明细文件生成状态' },
        'csvUrl': { name: '发票明细URL' },
        'downTaskType': { name: '发票打包批次' },
        'invoiceCount': { name: '交易总额' },
        'localCsvUrl': { name: '本地发票明细地址' },
        'localPdfUrl': { name: 'pdf发票明细地址' },
        'localState': { name: '本地下载状态' },
        'packageTime': { name: '发票打包时间' },
        'pdfStatus': { name: 'PDF生成状态' },
        'pdfUrl': { name: '发票PDFURL' },
        'taxRadeAmount': { name: '发票税额' },
        'tradeCount': { name: '交易总数' },
        'createTime': { name: '创建时间' },
        'updateTime': { name: '修改时间' },
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
      let res = await getBillPage(queryData).then(res => res).catch(() => false)
      return res
    },
    async detailApi (data) {
      // 查
      let res = await getBillDetail(data.id).then(res => res).catch(() => false)
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
