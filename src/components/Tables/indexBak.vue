<!--
使用教程

如需在控件内插入自定义slot,请按如下操作:
传递的数组：config:[{prop:'id',slotName:'yourname',label:'序号'}]
页面内：<template slot="yourname" slot-scope="scope">
    <span>{{ scope.row[prop]}}</span>
</template>

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
 -->

<template>
  <div class="hyt-table" >
    <div class="table-wrapper">
      <el-table
        v-loading="loading"
        :data="data"
        border
        highlight-current-row
        header-cell-class-name="hyh-table-th"
      >
        <template
          v-for="(column,index) in config"
        >
          <!-- <el-table-column v-if="column.header" :label="column.header" v-once></el-table-column> -->
          <el-table-column
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :width="column.type==='index'?50:(column.width||null)"
            :align="column.align||'center'"
          >

            <!-- {{column.header}} -->
            <template slot-scope="scope">
              <template v-if="column.filter">
                {{ Vue.filter(column.filter)(scope.row[column.prop]) }}
              </template>
              <template v-else-if="column.formatter">
                {{ column.formatter(scope.row[column.prop],scope.row) }}
              </template>
              <template v-else-if="column.type==='index'">
                {{ scope.$index+1 }}
              </template>
              <template v-else-if="column.slotName">
                <slot :name="column.slotName" :row="scope.row" :$index="scope.$index" />
              </template>
              <template v-else-if="column.button">
                <template v-for="(btn,bindex) in column.button">
                  <template v-if="btn.express">
                    <!-- 表达式绑定 -->
                    <el-button size="small" v-if="btn.express(scope.row)" :key="bindex" :type="btn.type" @click="btn.click?btn.click(scope.row):tableButton()">
                      {{ btn.name }}
                    </el-button>
                  </template>
                  <template v-else-if="btn.bind">
                    <!-- 简单key值绑定 -->
                    <el-button size="small" v-if="scope.row[btn.bind.key]===btn.bind.value" :key="bindex" :type="btn.type" @click="btn.click?btn.click(scope.row):tableButton()">
                      {{ btn.name }}
                    </el-button>
                  </template>
                  <el-button size="small" v-else :key="bindex" :type="btn.type" @click="btn.click?btn.click(scope.row):tableButton()">
                    {{ btn.name }}
                  </el-button>
                </template>
              </template>
              <template v-else>
                {{ scope.row[column.prop] }}
              </template>
            </template>
          </el-table-column>
          <!-- </el-table-column> -->
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
import Vue from 'vue'

export default {
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
    pageChange: [Function]
  },
  data () {
    return {
      Vue
    }
  },
  methods: {
    handleCurrentChange (index) {
      this.pageChange(index)
    },
    tableButton () {
      console.log('你尚未设置按钮点击事件')
    }
  }
}
</script>
<style lang='scss' scoped>
.hyt-table /deep/ .hyh-table-th{
  color: #1f2d3d;
}
.hyt-table{
  width: 98%;
  overflow: hidden;
}
.table-wrapper{
  max-height: 800px;
  overflow: hidden;
  overflow-y:scroll;
  // min-height: 800px
}
// .table-wrapper{
//   max-height: 800px;
// }
</style>
