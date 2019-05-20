<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="接口编号">
        <el-input v-model="queryForm.code" placeholder="请输入接口编号"></el-input>
      </el-form-item>
      <el-form-item label="接口名称">
        <el-input v-model="queryForm.name" placeholder="请输入接口名称"></el-input>
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
import { addInterface, deleteInterface, editInterface, getInterfaceDetail, getInterfacePage } from '@/api/interface'
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
        { label: '接口编号', prop: 'code' },
        { label: '接口名称', prop: 'name' },
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
        { label: '是否默认',
          prop: 'isDefault',
          formatter: (col, row) => {
            if (col === '1') {
              return '是'
            } else {
              return '否'
            }
          }
        },
        { label: '创建人', prop: 'createBy' },
        { label: '访问路径', prop: 'url' },
        { label: '版本', prop: 'version' },
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
      businessForm: {
        'code': { name: '接口编号', required: true, copy: true },
        'name': { name: '接口名称', required: true },
        'createBy': { name: '创建人', required: false },
        'url': { name: '访问路径', required: true, copy: true },
        'version': { name: '版本', required: true },
        'isDefault': { name: '是否默认', type: 'select', data: [{ value: '1', label: '是' }, { value: '0', label: '否' }], default: '1', required: true },
        'status': { name: '状态', type: 'select', data: [{ value: '1', label: '可用' }, { value: '0', label: '不可用' }], default: '1', required: true },
        'remark': { name: '备注', inpuType: 'textarea' }
      },
      queryForm: {
        code: '',
        name: '',
        status: ''
      }
    }
  },
  mounted () {
    this.fetchInit()
  },
  methods: {
    async businessFetch (queryData) {
      let res = await getInterfacePage(queryData).then(res => res).catch(() => false)
      return res
    },
    async detailApi (data) {
      // 查
      let res = await getInterfaceDetail({ id: data.id }).then(res => res).catch(() => false)
      return res
    },
    async addApi (data) {
      // 增
      let res = await addInterface(data).then(res => true).catch(() => false)
      return res
    },
    async editApi (data) {
      // 改
      let postData = data
      postData.id = this.selectVal.id
      let res = await editInterface(postData).then(res => true).catch(() => false)
      return res
    },
    async deleteApi (data) {
      // 删
      let res = await deleteInterface(data).then(res => true).catch(() => false)
      return res
    }

  }
}
</script>
<style lang='scss' scoped>
</style>
