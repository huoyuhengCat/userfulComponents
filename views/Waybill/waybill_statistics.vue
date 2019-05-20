<template>
  <div>
    <el-form
      :inline="true"
      :model="queryForm"
    >
      <el-form-item label="抬头名称">
        <el-input
          v-model="queryForm.titleName"
          placeholder="抬头名称"
        ></el-input>
      </el-form-item>
      <el-button
        @click="queryHandler"
        size="medium"
        type="primary"
      >查询</el-button>
      <el-button
        @click="resetHandler"
        size="medium"
      >重置</el-button>
    </el-form>
    <Tables
      :data="queryList"
      :config="queryListConfig"
      :page-config="config_page"
      :page-change="handleCurrentChange"
    >
    </Tables>
  </div>
</template>
<script>
import Tables from '@/components/Tables'
import query from '@/mixins/query'
import business from '@/mixins/business'
import { getStatisticsWaybill } from '@/api/waybill'
export default {
  components: {
    Tables
  },
  mixins: [query, business],
  inject: ['reload'],
  data () {
    return {
      queryListConfig: [
        { label: '序号', type: 'index' },
        { label: '抬头名称', prop: 'titleName' },
        { label: '当天',
          children: [
            {
              label: '运单', prop: 'addWaybill'
            },
            {
              label: '开票完成运单', prop: 'successInvoice'
            },
            {
              label: '失败运单', prop: 'failWaybill'
            },
            {
              label: '通行交易', prop: 'addWaybill'
            },
            {
              label: '总票数', prop: 'totalInvoiceNum'
            }
          ]
        },
        { label: '累计',
          children: [
            {
              label: '运单', prop: 'sumTotalInvoiceNum'
            },
            {
              label: '开票完成运单', prop: 'sumSucceedWaybill'
            },
            {
              label: '失败运单', prop: 'sumFailWaybill'
            },
            {
              label: '通行交易', prop: 'sumTransactionNum'
            },
            {
              label: '总票数', prop: 'sumTotalInvoiceNum'
            }
          ]
        }
      ],
      businessForm: {
      },
      queryForm: {
        titleName: ''
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
    },
    async businessFetch (queryData) {
      let res = await getStatisticsWaybill(queryData)
        .then(res => res)
        .catch(() => false)
      return res
    }
    // async detailApi (data) {
    // 查
    //   let res = await getWaybillDetail(data.id).then(res => res).catch(() => false)
    //   return res
    // }
  }
}
</script>
<style lang='scss' scoped>
.map-wrapper {
  height: 500px;
  width: 100%;
  border: 1px solid;
}
#container {
  width: 100%;
  height: 100%;
}
</style>
