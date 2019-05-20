<template>
  <div>
    <el-form
      :inline="true"
      :model="queryForm"
    >
      <el-form-item label="渠道">
        <el-select
          v-model="queryForm.channelCode"
          placeholder="渠道"
          clearable
        >
          <el-option
            v-for="item in $store.getters.channelArr"
            :value="item.value"
            :label="item.label"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运单编号">
        <el-input
          v-model="queryForm.waybillNum"
          placeholder="运单编号"
        ></el-input>
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
    <Dialog
      title="详情"
      :visible.sync="modalDialogVis"
      save
      :confirm="modalConfirm"
      :open="modalOpen"
      :sureText="mode==='detail'?'确认':'保存'"
    >

      <Forms
        formName="modalForm"
        :config="businessForm"
        ref="modalForm"
        labelWidth="135"
      ></Forms>
    </Dialog>
    <el-dialog
      title="校验轨迹"
      :visible.sync="mapVis"
      width="50%"
      center
    >
      <div class="map-wrapper">
        <div
          id="container"
          class="map"
          tabindex="0"
        ></div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="success"
          @click="centerDialogVisible = false"
        >正常</el-button>
        <el-button
          type="info"
          @click="centerDialogVisible = false"
        >无轨迹</el-button>
        <el-button
          type="danger"
          @click="centerDialogVisible = false"
        >异常</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import Tables from '@/components/Tables'
import Dialog from '@/components/Dialog'
import Forms from '@/components/Forms'
import query from '@/mixins/query'
import business from '@/mixins/business'
import { getWaybillProfitPage } from '@/api/waybillProfit'
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
        { label: '渠道', prop: 'channelName' },
        { label: '计费日期', prop: 'chargeDate' },
        { label: '创建人', prop: 'createBy' },
        {
          label: '交易（流水）费用（元）',
          prop: 'fee',
          filter: 'divideFormat'
        },
        { label: '创建时间', prop: 'createTime' },
        { label: '收益', prop: 'profit' },
        { label: '收益类型', prop: 'profitTypeDesc' },
        { label: '状态描述', prop: 'statusDesc' },
        { label: '交易数', prop: 'transCount' },
        { label: '更新人', prop: 'updateBy' },
        { label: '更新时间 ', prop: 'updateTime' },
        { label: '运单编号', prop: 'waybillNum' }
      ],
      businessForm: {
        titleName: { name: '运单抬头名称', required: true },
        titleTax: { name: '运单税号', required: true },
        titleType: {
          name: '发票抬头类型',
          required: true,
          type: 'select',
          data: [
            { value: '1', label: '默认发票抬头' },
            { value: '2', label: '自定义发票抬头' }
          ]
        },
        channelCode: {
          name: '渠道编码',
          required: true,
          type: 'select',
          store: 'channelArr'
        },
        fee: {
          name: '运单费用',
          required: true,
          formatter: col => {
            return col / 100 + '（元）'
          }
        },
        num: { name: '运单编号', required: true },
        plateColor: {
          name: '车辆颜色',
          type: 'select',
          data: [
            { value: 0, label: '蓝色' },
            { value: 1, label: '黄色' },
            { value: 2, label: '黑色' },
            { value: 3, label: '白色' },
            { value: 4, label: '渐变绿色' },
            { value: 5, label: '黄绿渐变色' },
            { value: 6, label: '蓝白渐变色' },
            { value: 9, label: '未确定' }
          ],
          required: true
        },
        plateNum: { name: '车牌号', required: true },
        startTime: { name: '运单开始时间', type: 'datetime', required: true },
        predictEndTime: {
          name: '运单预计完成时间',
          type: 'datetime',
          required: true
        },
        remark: { name: '备注', inpuType: 'textarea' }
      },
      queryForm: {
        channelCode: '',
        endchargeDate: '',
        startchargeDate: '',
        waybillNum: ''
      },
      isCreateMap: false,
      mapVis: false
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
    timeHandler (res) {
      // 时间控件
      this.queryForm.startchargeDate = res ? res[0] : ''
      this.queryForm.endchargeDate = res ? res[1] : ''
    },
    valiRoad () {
      this.mapVis = true
      if (!this.isCreateMap) {
        this.createMap()
      }
    },
    async businessFetch (queryData) {
      let res = await getWaybillProfitPage(queryData)
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
