<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="渠道">
        <el-select v-model="queryForm.channelCode" placeholder="渠道" clearable>
          <el-option v-for="item in $store.getters.channelArr" :value="item.value" :label="item.label" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运单编号">
        <el-input v-model="queryForm.num" placeholder="运单编号"></el-input>
      </el-form-item>
      <el-form-item label="运单抬头名称">
        <el-input v-model="queryForm.titleName" placeholder="运单抬头名称"></el-input>
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input v-model="queryForm.plateNum" placeholder="车牌号"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryForm.status" clearable>
          <el-option value="-1" label="禁用" key="-1"></el-option>
          <el-option value="0" label="初始化" key="0"></el-option>
          <el-option value="1" label="待开票" key="1"></el-option>
          <el-option value="2" label="开票中" key="2"></el-option>
          <el-option value="3" label="开票完成" key="3"></el-option>
          <el-option value="4" label="开票失败" key="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建日期">
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
      <el-button  @click="addeditHandler('add')" size="medium">新建</el-button>
    </el-form>
    <Tables
      :data="queryList"
      :config="queryListConfig"
      :page-config="config_page"
      :page-change="handleCurrentChange"
    >
    </Tables>
    <Dialog title="详情" :visible.sync="modalDialogVis" save :confirm="modalConfirm" :open="modalOpen" :sureText="mode==='detail'?'确认':'保存'">
      <Forms formName="modalForm" :config="businessForm" ref="modalForm" labelWidth="135"></Forms>
    </Dialog>
  </div>
</template>
<script>
import Tables from '@/components/Tables'
import Dialog from '@/components/Dialog'
import Forms from '@/components/Forms'
import query from '@/mixins/query'
import business from '@/mixins/business'
// import
import { addWaybill, deleteWaybill, editWaybill, getWaybillDetail, getWaybillPage } from '@/api/waybill'
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
        { label: '运单编号', prop: 'num' },
        { label: '运单抬头名称', prop: 'titleName' },
        // { label: '车辆颜色', prop: 'colorDesc' },
        { label: '车牌号', prop: 'plateNum' },
        { label: '运单费用（元）',
          prop: 'fee',
          filter: 'divideFormat'
        },
        { label: '开始时间', prop: 'startTime' },
        { label: '开始地点', prop: 'sourceAddr' },
        { label: '结束时间', prop: 'predictEndTime' },
        { label: '结束地点', prop: 'destAddr' },
        { label: '状态',
          prop: 'statusDesc'
        },
        { label: '创建时间', prop: 'createTime' },
        { label: '渠道', prop: 'channelName' },
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
            // {
            //   name: '编辑',
            //   type: 'primary',
            //   click: this.addeditHandler
            // },
            // {
            //   name: '删除',
            //   type: 'danger',
            //   click: this.deleteHandler
            // }
          ]
        }
      ],
      businessForm: {
        'titleName': { name: '运单抬头名称', required: true },
        'titleTax': { name: '运单税号', required: true },
        'titleType': { name: '发票抬头类型', required: true, type: 'select', data: [{ value: '1', label: '默认发票抬头' }, { value: '2', label: '自定义发票抬头' }] },
        'channelCode': { name: '渠道编码', required: true, type: 'select', store: 'channelArr' },
        'fee': {
          name: '运单费用',
          required: true,
          formatter: (col) => {
            return col / 100 + '（元）'
          }
        },
        'num': { name: '运单编号', required: true },
        'plateColor': { name: '车辆颜色', type: 'select', data: [{ value: 0, label: '蓝色' }, { value: 1, label: '黄色' }, { value: 2, label: '黑色' }, { value: 3, label: '白色' }, { value: 4, label: '渐变绿色' }, { value: 5, label: '黄绿渐变色' }, { value: 6, label: '蓝白渐变色' }, { value: 9, label: '未确定' }], required: true },
        'plateNum': { name: '车牌号', required: true },
        'startTime': { name: '运单开始时间', type: 'datetime', required: true },
        'predictEndTime': { name: '运单预计完成时间', type: 'datetime', required: true },
        'remark': { name: '备注', inpuType: 'textarea' }
      },
      queryForm: {
        channelCode: '',
        titleName: '',
        num: '',
        plateNum: '',
        startCreateDate: '',
        endCreateDate: '',
        status: ''
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
      this.$store.dispatch('invoiceFetch')
    },
    timeHandler (res) {
      // 时间控件
      this.queryForm.startCreateDate = res ? res[0] : ''
      this.queryForm.endCreateDate = res ? res[1] : ''
    },
    async businessFetch (queryData) {
      let res = await getWaybillPage(queryData).then(res => res).catch(() => false)
      return res
    },
    async detailApi (data) {
      // 查
      this.businessForm = {
        'titleName': { name: '运单抬头名称', required: true },
        'titleTax': { name: '运单税号', required: true },
        'titleType': { name: '发票抬头类型', required: true, type: 'select', data: [{ value: '1', label: '默认发票抬头' }, { value: '2', label: '自定义发票抬头' }] },
        'channelCode': { name: '渠道编码', required: true, type: 'select', store: 'channelArr' },
        'fee': {
          name: '运单费用',
          required: true,
          formatter: (col) => {
            return col / 100 + '元'
          }
        },
        'num': { name: '运单编号', required: true },
        'plateColor': { name: '车辆颜色', type: 'select', data: [{ value: 0, label: '蓝色' }, { value: 1, label: '黄色' }, { value: 2, label: '黑色' }, { value: 3, label: '白色' }, { value: 4, label: '渐变绿色' }, { value: 5, label: '黄绿渐变色' }, { value: 6, label: '蓝白渐变色' }, { value: 9, label: '未确定' }], required: true },
        'plateNum': { name: '车牌号', required: true },
        'startTime': { name: '运单开始时间', type: 'datetime', required: true },
        'predictEndTime': { name: '运单预计完成时间', type: 'datetime', required: true },
        'transactionCount': { name: '交易数', required: true },
        'invoiceCount': { name: '发票数', required: true },
        'invoiceAmount': { name: '发票总额',
          required: true,
          formatter: (col) => {
            return col / 100 + '元'
          }
        },
        'allowanceAmount': { name: '税额',
          required: true,
          formatter: (col) => {
            return col / 100 + '元'
          }
        },
        'remark': { name: '备注', inpuType: 'textarea' }
      }
      let res = await getWaybillDetail(data.id).then(res => res).catch(() => false)
      return res
    },
    async addApi (data) {
      // 增
      this.businessForm = {
        'titleName': { name: '运单抬头名称', required: true },
        'titleTax': { name: '运单税号', required: true },
        'titleType': { name: '发票抬头类型', required: true, type: 'select', data: [{ value: '1', label: '默认发票抬头' }, { value: '2', label: '自定义发票抬头' }] },
        'channelCode': { name: '渠道编码', required: true, type: 'select', store: 'channelArr' },
        'fee': {
          name: '运单费用',
          required: true,
          formatter: (col) => {
            return col / 100 + '（元）'
          }
        },
        'num': { name: '运单编号', required: true },
        'plateColor': { name: '车辆颜色', type: 'select', data: [{ value: 0, label: '蓝色' }, { value: 1, label: '黄色' }, { value: 2, label: '黑色' }, { value: 3, label: '白色' }, { value: 4, label: '渐变绿色' }, { value: 5, label: '黄绿渐变色' }, { value: 6, label: '蓝白渐变色' }, { value: 9, label: '未确定' }], required: true },
        'plateNum': { name: '车牌号', required: true },
        'startTime': { name: '运单开始时间', type: 'datetime', required: true },
        'predictEndTime': { name: '运单预计完成时间', type: 'datetime', required: true },
        'remark': { name: '备注', inpuType: 'textarea' }
      }
      data.fee = parseInt(data.fee) * 100// 金额乘以100
      let res = await addWaybill(data).then(res => true).catch(() => false)
      return res
    },
    async editApi (data) {
      // 改
      let postData = data
      postData.id = this.selectVal.id
      let res = await editWaybill(postData).then(res => true).catch(() => false)
      return res
    },
    async deleteApi (data) {
      // 删
      let res = await deleteWaybill(data).then(res => true).catch(() => false)
      return res
    }

  }
}
</script>
<style lang='scss' scoped>

</style>
