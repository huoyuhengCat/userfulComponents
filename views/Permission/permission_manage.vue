<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="渠道">
        <el-select v-model="queryForm.channelCode" placeholder="渠道" clearable>
          <el-option v-for="item in $store.getters.channelArr" :value="item.value" :label="item.label" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryForm.status" clearable>
          <el-option value="0" label="不可用" key="0"></el-option>
          <el-option value="1" label="可用" key="1"></el-option>
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
import { getPermissionPage, editPermissionStstus, deletePermission, addPermission } from '@/api/permission'
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
        { label: '接口编号', prop: 'interfaceCode' },
        { label: '接口名称', prop: 'interfaceName' },
        { label: '接口访问路径', prop: 'interfaceUrl' },
        { label: '接口版本', prop: 'interfaceVersion' },
        { label: '权限状态',
          prop: 'status',
          formatter: (col, row) => {
            if (col === '1') {
              return '可用'
            } else {
              return '不可用'
            }
          }
        },
        { label: '权限创建时间', prop: 'createTime' },
        { label: '权限更新时间', prop: 'updateTime' },
        { label: '权限备注', prop: 'remark' },
        {
          prop: 'btns',
          label: '操作',
          width: 220,
          button: [
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
      businessForm: {},
      queryForm: {
        channelCode: '',
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
      this.$store.dispatch('interfaceFetch')
    },
    async businessFetch (queryData) {
      let res = await getPermissionPage(queryData).then(res => res).catch(() => false)
      return res
    },
    editHandler () {
      this.businessForm = {
        'status': { name: '状态', type: 'select', data: [{ value: '1', label: '可用' }, { value: '0', label: '不可用' }], default: '1', required: true }
      }
    },
    addHandler () {
      // 点击新增按钮时的一些操作
      this.businessForm = {
        'channelCode': { name: '渠道编码', required: true, type: 'select', store: 'channelArr' },
        'interfaceCode': { name: '接口编号', required: true }
      }
    },
    async addApi (data) {
      // 增
      let res = await addPermission(data).then(res => true).catch(() => false)
      return res
    },
    async editApi (data) {
      // 改
      let postData = data
      postData.id = this.selectVal.id
      let res = await editPermissionStstus(postData).then(res => true).catch(() => false)
      return res
    },
    async deleteApi (data) {
      // 删
      let res = await deletePermission(data).then(res => true).catch(() => false)
      return res
    }

  }
}
</script>
<style lang='scss' scoped>
</style>
