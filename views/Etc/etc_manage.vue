<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="ETC卡号">
        <el-input v-model="queryForm.cardId" placeholder="ETC卡号"></el-input>
      </el-form-item>
      <el-form-item label="卡类型">
        <el-select v-model="queryForm.cardType" clearable>
          <el-option value="22" label="储值卡" key="22"></el-option>
          <el-option value="23" label="记账卡" key="23"></el-option>
        </el-select>
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
      <el-form-item label="车牌号">
        <el-input v-model="queryForm.plateNum" placeholder="车牌号"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryForm.status" clearable>
          <el-option value="-1" label="禁用" key="-1"></el-option>
          <el-option value="0" label="初始化" key="0"></el-option>
          <el-option value="1" label="启用" key="1"></el-option>
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
      <Forms formName="modalForm" :config="businessForm" ref="modalForm" :labelWidth="130"></Forms>
    </Dialog>
  </div>
</template>
<script>
import Tables from '@/components/Tables'
import Dialog from '@/components/Dialog'
import Forms from '@/components/Forms'
import query from '@/mixins/query'
import business from '@/mixins/business'

import { addEtc, deleteEtc, editEtc, getEtcDetail, getEtcPage } from '@/api/etc'
import { proArr } from '@/utils/province'
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
        { label: '卡号', prop: 'cardId' },
        { label: '渠道编码', prop: 'channelCode' },
        { label: '卡类型',
          prop: 'cardType',
          formatter: (col, row) => {
            if (parseInt(col) === 22) {
              return '储值卡'
            } else if (parseInt(col) === 23) {
              return '记账卡'
            }
          }
        },
        { label: '车牌颜色',
          prop: 'plateColor',
          formatter: (col, row) => {
            let str = ''
            this.businessForm.plateColor.data.forEach((item) => {
              if (parseInt(item.value) === parseInt(col)) {
                str = item.label
                return false
              }
            })
            return str
          }
        },
        { label: '车牌', prop: 'plateNum' },
        { label: '车类型',
          prop: 'vehicleType',
          formatter: (col, row) => {
            let str = ''
            this.businessForm.vehicleType.data.forEach((item) => {
              if (parseInt(item.value) === parseInt(col)) {
                str = item.label
                return false
              }
            })
            return str
          }
        },
        { label: '创建时间', prop: 'createTime' },
        { label: '状态', prop: 'statusDesc' },
        { label: '备注', prop: 'remark' },
        {
          prop: 'btns',
          label: '操作',
          width: 220,
          button: [
            {
              name: '详情',
              type: 'info',
              click: this.detailHandler
            },
            {
              name: '编辑',
              type: 'primary',
              express: (row) => {
                if (parseInt(row.status) === 0) {
                  return true
                } else {
                  return false
                }
              },
              click: this.addeditHandler
            },
            {
              name: '删除',
              type: 'danger',
              click: this.deleteHandler
            }
          ]
        }
      ],
      businessForm: {
        'channelCode': { name: '渠道编码', required: true, type: 'select', store: 'channelArr' },
        'companyNum': { name: '企业编号', required: true, type: 'select', store: 'companyArr' },
        'plateNum': { name: '车牌', required: true },
        'plateColor': { name: '车牌颜色', type: 'select', data: [{ value: 0, label: '蓝色' }, { value: 1, label: '黄色' }, { value: 2, label: '黑色' }, { value: 3, label: '白色' }, { value: 4, label: '渐变绿色' }, { value: 5, label: '黄绿渐变色' }, { value: 6, label: '蓝白渐变色' }, { value: 9, label: '未确定' }], required: true },
        'vehicleType': {
          name: '车辆类型',
          type: 'select',
          required: true,
          data: [{ value: 1, label: '一型客车' }, { value: 2, label: '二型客车' }, { value: 3, label: '三型客车' }, { value: 4, label: '四型客车' },
            { value: 11, label: '一型货车' }, { value: 12, label: '二型货车' }, { value: 13, label: '三型货车' }, { value: 14, label: '四型货车' }, { value: 15, label: '五型货车' },
            { value: 0, label: '未确定' }
          ]
        },
        'cardId': { name: '卡号', required: true },
        'cardType': { name: '卡类型', required: true, type: 'select', data: [{ value: 22, label: '储值卡' }, { value: 23, label: '记账卡' }] },
        'province': { name: '省份', required: true, data: proArr, type: 'select' },
        'bindTime': { name: '绑卡时间', required: true, type: 'datetime' },
        'unbindTime': { name: '解绑时间', required: true, type: 'datetime' },
        'status': { name: '状态', type: 'select', data: [{ value: 0, label: '停用' }, { value: 1, label: '启用' }], required: true },
        'remark': { name: '备注', required: true, inputType: 'textarea' }
      },
      queryForm: {
        channelCode: '',
        companyNum: '',
        num: '',
        plateNum: '',
        startCreateDate: '',
        endCreateDate: '',
        status: ''
      },
      companyArr: [], // 获取所有企业
      channelArr: []// 渠道数组
    }
  },
  mounted () {
    this.fetchInit()
  },
  methods: {
    async businessFetch (queryData) {
      let res = await getEtcPage(queryData).then(res => res).catch(() => false)
      return res
    },
    fetchQuery () {
      // 请求查询项里的select组建
      this.$store.dispatch('channelFetch')
      this.$store.dispatch('companyFetch')
    },
    timeHandler (res) {
      // 时间控件
      this.queryForm.startCreateDate = res ? res[0] : ''
      this.queryForm.endCreateDate = res ? res[1] : ''
    },
    async detailApi (data) {
      // 查
      let res = await getEtcDetail(data.id).then(res => res).catch(() => false)
      return res
    },
    async addApi (data) {
      // 增
      let res = await addEtc(data).then(res => true).catch(() => false)
      return res
    },
    async editApi (data) {
      // 改
      let postData = data
      postData.id = this.selectVal.id
      let res = await editEtc(postData).then(res => true).catch(() => false)
      return res
    },
    async deleteApi (data) {
      // 删
      let res = await deleteEtc(data).then(res => true).catch(() => false)
      return res
    }

  }
}
</script>
<style lang='scss' scoped>
</style>
