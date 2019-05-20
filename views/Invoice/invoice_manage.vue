<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="渠道">
        <el-select v-model="queryForm.channelCode" placeholder="渠道" clearable>
          <el-option v-for="item in $store.getters.channelArr" :value="item.value" :label="item.label" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运单号" >
        <el-input placeholder="运单号" v-model="queryForm.waybillNum"></el-input>
      </el-form-item>
      <el-form-item label="发票号" >
        <el-input placeholder="发票号" v-model="queryForm.invoiceNum"></el-input>
      </el-form-item>
      <el-form-item label="发票抬头名称" >
        <el-input placeholder="发票抬头名称" v-model="queryForm.buyerName"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryForm.status" clearable>
          <el-option value="-1" label="禁用" key="-1"></el-option>
          <el-option value="0" label="初始化" key="0"></el-option>
          <el-option value="1" label="开票中" key="1"></el-option>
          <el-option value="2" label="开票完成" key="2"></el-option>
          <el-option value="3" label="开票失败" key="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开票日期">
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
import { getInvoiceDetail, getInvoicePage } from '@/api/invoice'
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
        { label: '运单号', prop: 'waybillNum' },
        { label: '发票号码', prop: 'invoiceNum' },
        { label: '发票抬头名称', prop: 'buyerName' },
        { label: '发票税号', prop: 'buyerTaxpayerCode' },
        {
          label: '金额（元）',
          prop: 'amount',
          filter: 'divideFormat'
        },
        { label: '税额',
          prop: 'allowance',
          filter: 'divideFormat'
        },
        { label: '税率', prop: 'taxRate' },

        { label: '价税合计',
          prop: 'totalAmount',
          filter: 'divideFormat'
        },
        { label: '状态', prop: 'statusDesc' },
        { label: '开票时间', prop: 'invoiceMakeTime' },
        { label: '渠道名称', prop: 'channelName' },
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
        cardId: '',
        channelCode: '',
        buyerName: '',
        invoiceNum: '',
        plateNum: '',
        waybillNum: '',
        endIMTDate: '',
        startIMTDate: '',
        status: ''
      },
      businessForm: {
        'allowance': { name: '税额' },
        'amount': {
          name: '金额',
          formatter: (col) => {
            return col / 100 + '（元）'
          }
        },
        'billDate': { name: '账期' },
        'cardId': { name: 'ETC卡编号' },
        'channelName': { name: '渠道名称' },
        'chargeTime': { name: '记账时间' },
        'buyerName': { name: '发票抬头名称' },
        'buyerTaxpayerCode': { name: '发票税号' },
        'createTime': { name: '创建时间' },
        'enStationName': { name: '入口收费站 ' },
        'exStationName': { name: '出口收费站' },
        'exTime': { name: '交易时间' },
        'fee': {
          name: '交易金额',
          formatter: (col) => {
            return col / 100 + '（元）'
          }
        },
        'invoiceCode': { name: '发票代码' },
        'invoiceHtmlUrl': { name: '发票板式文件url', copy: true },
        'invoiceMakeTime': { name: '开票时间' },
        'invoiceNum': { name: '发票号码' },
        'invoiceType': { name: '发票种类' },
        'invoiceUrl': { name: '发票url', copy: true },
        'localInvoiceHtmlUrl': { name: '本地发票板式文件url', copy: true },
        'localInvoiceUrl': { name: '本地发票URL', copy: true },
        'localState': { name: '本地是否已经下载远程的' },
        'plateNum': { name: '车牌号' },
        'sellerName': { name: '销方名称' },
        'sellerTaxpayerCode': { name: '销方税号' },
        'status': { name: '状态', type: 'select', data: [{ value: -1, label: '禁用' }, { value: 0, label: '初始化' }, { value: 1, label: '开票中' }, { value: 2, label: '开票完成' }, { value: 3, label: '开票失败' }] },
        'taxRate': { name: '税率' },
        'totalAmount': {
          name: '价税合计',
          formatter: (col) => {
            return col / 100 + '（元）'
          }
        },
        'vehicleType': {
          name: '车型',
          type: 'select',
          data: [{ value: 1, label: '一型客车' }, { value: 2, label: '二型客车' }, { value: 3, label: '三型客车' }, { value: 4, label: '四型客车' },
            { value: 11, label: '一型货车' }, { value: 12, label: '二型货车' }, { value: 13, label: '三型货车' }, { value: 14, label: '四型货车' }, { value: 15, label: '五型货车' },
            { value: 0, label: '未确定' }
          ]
        },
        'waybillStartTime': { name: '运单开始时间' },
        'waybillEndTime': { name: '运单结束时间' },
        'waybillNum': { name: '运单号' },
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
      let res = await getInvoicePage(queryData).then(res => res).catch(() => false)
      console.log(res)
      return res
    },
    async detailApi (data) {
      // 查
      let res = await getInvoiceDetail(data.id).then(res => res).catch(() => false)
      return res
    },
    timeHandler (res) {
      // 时间控件
      this.queryForm.startIMTDate = res ? res[0] : ''
      this.queryForm.endIMTDate = res ? res[1] : ''
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
