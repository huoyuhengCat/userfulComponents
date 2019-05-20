<!--
使用教程

如需在控件内插入自定义slot,请按如下操作:
传递的数组：config:[{prop:'id',slotName:'yourname',label:'序号'}]
页面内：
<slot slot="slotName" slot-scope="scope">
    <span>{{ scope.row[prop]}}</span>
</slot>

如果想在表单内添加button 在config里添加如下json
        {
          prop: 'btns',
          label: '操作',
          button: [
            {
              name: '菜单权限',
              type: 'primary',
              bind: { key: 'type', value: '2' },//加bind字段来判断是否可以绑定
              express: (row) => {   //或者加express来进行判断  bind和express不要同时使用
                if (row.status === 0) {
                  return true
                } else {
                  return false
                }
              },
              click: this.menuPermissionButton
            },
            {
              name: '角色权限',
              type: 'info'
            }
          ]
        }],
        插槽使用
        <slot slot="imgSlot2">
        测试进来了没2
      </slot>
      表单select组件
      在table组件添加 :selection-change="handelSelect" 表单选择后的回调
       {
          label: '选择',
          type: 'selection',
          selectable: (row, index) => {
            if (row.checkStatus != -1) {
              return true
            } else {
              return false
            }
          }
        },
 -->

<template>
  <div class="hyt-table">
    <div class="table-wrapper">
      <el-table
        v-loading="loading"
        :data="data"
        border
        highlight-current-row
        header-cell-class-name="hyh-table-th"
        @selection-change="handleSelect"
      >
        <template
          v-for="(column,index) in config"
        >
          <table-column :column="column" :key="index">
            <template v-if="column.slotName" :slot="column.slotName" slot-scope="scope">
              <slot :name="column.slotName" :row="scope.row" :index="scope.$index">
              </slot>
            </template>
          </table-column>
        </template>
      </el-table>
    </div>
    <el-row class="text-center" v-if="pageShow">
      <el-pagination
        :current-page.sync="pageConfig.currentPage"
        :page-size="pageConfig.pageSize"
        layout="total,prev, pager, next, jumper"
        :total="pageConfig.total"
        class="float-right"
        style="margin-top:20px"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
  </div>
</template>
<script>
import TableColumn from '@/components/TableColumn'
export default {
  components: {
    TableColumn
  },
  props: {
    config: {
      type: [Array],
      default: null
    },
    data: {
      type: [Array],
      default: null
    },
    pageConfig: {
      type: [Object],
      default: null
    },
    pageShow: {
      type: [Boolean],
      default: true
    },
    loading: {
      type: [Boolean],
      default: false
    },
    selectionChange: [Function],
    pageChange: [Function]
  },
  data () {
    return {

    }
  },
  methods: {
    handleCurrentChange (index) {
      this.pageChange(index)
    },
    handleSelect (row) {
      this.selectionChange(row)
    }
  }
}
</script>
<style lang='scss' scoped>
.hyt-table /deep/ .hyh-table-th{
  color: #1f2d3d;
}
.hyt-table{
  overflow: hidden;
}
.table-wrapper{
  max-height: 800px;
  overflow: hidden;
  overflow-y:scroll;
}
</style>
