<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="车牌">
        <el-input v-model="queryForm.plateNum" placeholder="请输入车牌号"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryForm.status" clearable>
          <el-option value="-1" label="禁用" key="-1"></el-option>
          <el-option value="0" label="初始化" key="0"></el-option>
          <el-option value="1" label="启用" key="1"></el-option>
        </el-select>
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
import { addVehicel, deleteVehicel, detailVehicel, getVehicelPage, editVehicel } from '@/api/vehicel'
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
      // 企业名称、企业编号、车牌号、车牌颜色、车辆类型、渠道、状态、创建时间、备注
      queryListConfig: [
        { label: '序号', type: 'index' },
        { label: '车牌号', prop: 'plateNum' },
        { label: '车牌颜色',
          prop: 'plateColor',
          filter: 'formatCarColor'
        },
        { label: '车辆类型',
          prop: 'vehicleType',
          filter: 'formatCarType'
        },
        { label: '创建时间', prop: 'createTime' },
        { label: '状态',
          prop: 'status',
          formatter: (col) => {
            if (parseInt(col) === -1) {
              return '禁用'
            } else if (parseInt(col) === 0) {
              return '初始化'
            } else if (parseInt(col) === 1) {
              return '启用'
            }
          }
        },
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
        'plateNum': { name: '车牌', required: true },
        'plateColor': { name: '车辆颜色', type: 'select', data: [{ value: 0, label: '蓝色' }, { value: 1, label: '黄色' }, { value: 2, label: '黑色' }, { value: 3, label: '白色' }, { value: 4, label: '渐变绿色' }, { value: 5, label: '黄绿渐变色' }, { value: 6, label: '蓝白渐变色' }, { value: 9, label: '未确定' }], required: true },
        'vehicleType': {
          name: '车辆类型',
          type: 'select',
          required: true,
          data: [{ value: 1, label: '一型客车' }, { value: 2, label: '二型客车' }, { value: 3, label: '三型客车' }, { value: 4, label: '四型客车' },
            { value: 11, label: '一型货车' }, { value: 12, label: '二型货车' }, { value: 13, label: '三型货车' }, { value: 14, label: '四型货车' }, { value: 15, label: '五型货车' },
            { value: 0, label: '未确定' }
          ]
        },
        'status': { name: '状态', type: 'select', data: [{ value: -1, label: '禁用' }, { value: 0, label: '初始化' }, { value: 1, label: '启用' }], required: true },
        'remark': { name: '备注', inpuType: 'textarea' }
      },
      queryForm: {
        plateNum: '',
        status: ''
      }
    }
  },
  mounted () {
    this.fetchInit()
  },
  methods: {
    async businessFetch (queryData) {
      let res = await getVehicelPage(queryData).then(res => res).catch(() => false)
      console.log(res)
      return res
    },
    fetchQuery () {
      // 请求查询项里的select组建
    },
    fetchInit () {
      this.fetchList()
      this.fetchQuery()
    },
    async detailApi (data) {
      // 查
      let res = await detailVehicel(data.id).then(res => res).catch(() => false)
      return res
    },
    async addApi (data) {
      // 增
      let res = await addVehicel(data).then(res => true).catch(() => false)
      return res
    },
    async editApi (data) {
      // 改
      let postData = data
      postData.id = this.selectVal.id
      let res = await editVehicel(postData).then(res => true).catch(() => false)
      return res
    },
    async deleteApi (data) {
      // 删
      let res = await deleteVehicel(data).then(res => true).catch(() => false)
      return res
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
