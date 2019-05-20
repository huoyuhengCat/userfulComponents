<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="渠道">
        <el-select v-model="queryForm.channelName" clearable>
          <el-option v-for="item in channelArr" :value="item.channelName" :label="item.channelName" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryForm.status" clearable>
          <el-option value="0" label="不可用" key="0"></el-option>
          <el-option value="1" label="可用" key="1"></el-option>
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
import { getChannel, addChannel, getChannelPage, editChannel, deleteChannel, getChannelDetail } from '@/api/channel'
import { isvalidPhone } from '@/utils/validate'
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
        { label: '渠道编号', prop: 'channelCode' },
        { label: '渠道名称', prop: 'channelName' },
        { label: '状态',
          prop: 'status',
          formatter: (col, row) => {
            if (col === '1') {
              return '可用'
            } else {
              return '不可用'
            }
          }
        },
        { label: '是否公共使用',
          prop: 'isPublic',
          formatter: (col, row) => {
            if (col === '1') {
              return '是'
            } else {
              return '否'
            }
          }
        },
        { label: '联系人', prop: 'contacts' },
        { label: '联系方式', prop: 'phone' },
        { label: '创建时间', prop: 'createTime' },
        { label: '修改时间', prop: 'updateTime' },
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
      queryForm: {
        channelName: '',
        endTime: '',
        startTime: '',
        status: ''
      },
      channelArr: [],
      businessForm: {
      }
    }
  },
  mounted () {
    this.fetchInit()
  },
  methods: {
    async businessFetch (queryData) {
      let res = await getChannelPage(queryData).then(res => res).catch(() => false)
      return res
    },
    fetchQuery () {
      // 请求查询项里的select组建
      getChannel().then(res => {
        this.channelArr = res
      })
    },
    async detailApi (data) {
      // 查
      this.businessForm = {
        'address': { name: '联系地址', required: true },
        'appKey': { name: 'APPKEY', required: true, copy: true },
        'channelCode': { name: '渠道编号', required: true },
        'channelName': { name: '渠道名称', required: true },
        'contacts': { name: '联系人', required: true },
        'isPublic': { name: '是否公共使用', type: 'select', data: [{ value: '1', label: '是' }, { value: '0', label: '否' }], default: '1', required: true },
        'status': { name: '状态', type: 'select', data: [{ value: '1', label: '可用' }, { value: '0', label: '不可用' }], default: '1', required: true },
        'phone': { name: '联系方式', rules: [{ required: true, message: '请先填写信息' }, { validator: isvalidPhone }] },
        'privateKey': { name: '私钥', required: true, copy: true },
        'publicKey': { name: '公钥', required: true, copy: true },
        'remark': { name: '备注', inpuType: 'textarea' }
      }
      let res = await getChannelDetail({ id: data.id }).then(res => res).catch(() => false)
      return res
    },
    async addApi (data) {
      // 增
      data.fee = parseInt(data.fee) * 100// 金额乘以100
      let res = await addChannel(data).then(res => true).catch(() => false)
      return res
    },
    addHandler () {
      this.businessForm = {
        'name': { name: '企业抬头名称', required: true, group: '企业信息' },
        'taxplayerCode': { name: '企业税号', required: true, group: '企业信息' },
        'bank': { name: '银行', required: true, group: '企业信息' },
        'bankAccount': { name: '开户行账号', required: true, group: '企业信息' },
        'titleType': { name: '默认抬头', required: true, group: '企业信息', type: 'select', data: [{ value: '0', label: '不是' }, { value: '1', label: '是' }] },
        'tel': { name: '单位电话', required: true, group: '企业信息' },
        'addr': { name: '单位地址', required: true, group: '企业信息' },
        'contact': { name: '联系人', required: true, group: '企业信息' },
        'contactTel': { name: '联系人手机', required: true, group: '企业信息', rules: [{ required: true, message: '请先填写信息' }, { validator: isvalidPhone }] },
        'address': { name: '联系地址', required: true, group: '企业信息' },
        'appKey': { name: 'apikey', required: true, copy: true, group: '渠道信息' },
        'channelName': { name: '渠道名称', required: true, group: '渠道信息' },
        'publicKey': { name: '公钥', required: true, copy: true, group: '渠道信息' },
        'privateKey': { name: '私钥', required: true, copy: true, group: '渠道信息' },
        'fee': {
          name: '运单费用',
          required: true,
          group: '渠道信息',
          formatter: (col) => {
            return col / 100 + '（元）'
          }
        },
        'isPublic': { name: '是否公共使用', type: 'select', data: [{ value: '1', label: '是' }, { value: '0', label: '否' }], default: '1', required: true, group: '渠道信息' },
        'remark': { name: '备注', required: true, copy: true, group: '渠道信息' }
      }
    },
    editHandler () {
      this.businessForm = {
        'address': { name: '联系地址', required: true },
        'appKey': { name: 'APPKEY', required: true, copy: true },
        'channelCode': { name: '渠道编号', required: true },
        'channelName': { name: '渠道名称', required: true },
        'contacts': { name: '联系人', required: true },
        'isPublic': { name: '是否公共使用', type: 'select', data: [{ value: '1', label: '是' }, { value: '0', label: '否' }], default: '1', required: true },
        'status': { name: '状态', type: 'select', data: [{ value: '1', label: '可用' }, { value: '0', label: '不可用' }], default: '1', required: true },
        'phone': { name: '联系方式', rules: [{ required: true, message: '请先填写信息' }, { validator: isvalidPhone }] },
        'privateKey': { name: '私钥', required: true, copy: true },
        'publicKey': { name: '公钥', required: true, copy: true },
        'remark': { name: '备注', inpuType: 'textarea' }
      }
    },
    async editApi (data) {
      // 改

      let postData = data
      postData.id = this.selectVal.id
      postData.fee = parseInt(data.fee) * 100// 金额乘以100
      let res = await editChannel(postData).then(res => true).catch(() => false)
      return res
    },
    async deleteApi (data) {
      // 删
      let res = await deleteChannel(data).then(res => true).catch(() => false)
      return res
    }

  }
}
</script>
<style lang='scss' scoped>
</style>
