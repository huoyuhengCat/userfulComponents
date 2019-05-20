<template>
  <div>
    <el-form
      :inline="true"
      :model="queryForm"
    >
      <el-form-item label="运单编号">
        <el-input
          v-model="queryForm.num"
          placeholder="运单编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input
          v-model="queryForm.plateNum"
          placeholder="车牌号"
        ></el-input>
      </el-form-item>
      <el-form-item label="运单抬头名称">
        <el-input
          v-model="queryForm.titleName"
          placeholder="运单抬头名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="校验状态" prop="checkStatus">
        <el-select v-model="queryForm.checkStatus" clearable>
          <el-option value="-1" label="异常" key="-1"></el-option>
          <el-option value="0" label="初始化" key="0"></el-option>
          <el-option value="1" label="正常" key="1"></el-option>
          <el-option value="2" label="无轨迹" key="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开票日期">
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
      width="1000px"
      center
      v-loading="true"
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
        <span>当前状态为：{{selectVal?selectVal.statusDesc:''}}</span>
        <span style="margin-left:10px">可变更状态：</span>
        <async-btn :click="changeStatus.bind(this,1)">正常</async-btn>
        <async-btn :click="changeStatus.bind(this,2)">无轨迹</async-btn>
        <async-btn :click="changeStatus.bind(this,-1)" type="danger">异常</async-btn>
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
import AsyncBtn from '@/components/AsyncBtn'
import AMap from 'AMap'
import AMapUI from 'AMapUI'
import { getPagetrack, trackVali, editTrack } from '@/api/waybill'
export default {
  components: {
    Tables,
    Dialog,
    Forms,
    AsyncBtn
  },
  mixins: [query, business],
  inject: ['reload'],
  data () {
    return {
      queryListConfig: [
        { label: '序号', type: 'index' },
        { label: '运单号', prop: 'num' },
        { label: '车牌号', prop: 'plateNum' },
        { label: '抬头名称', prop: 'titleName' },
        { label: '开始时间', prop: 'startTime' },
        { label: '开始地址', prop: 'sourceAddr' },
        { label: '结束时间', prop: 'predictEndTime' },
        { label: '结束地址', prop: 'destAddr' },
        {
          label: '费用（元）',
          prop: 'fee',
          filter: 'divideFormat'
        },
        { label: '开票时间', prop: 'invoiceTime' },
        { label: '校验状态', prop: 'statusDesc' },
        {
          prop: 'btns',
          label: '操作',
          width: 200,
          button: [
            {
              name: '运单校验轨迹',
              type: 'info',
              click: this.valiRoad // 校验轨迹
            }
          ]
        }
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
        titleName: '',
        num: '',
        plateNum: '',
        endchargeDate: '',
        startchargeDate: '',
        checkStatus: ''
      },
      isCreateMap: false,
      mapVis: false,
      map: null,
      selectVal: null
    }
  },
  mounted () {
    this.fetchInit()
  },
  methods: {
    timeHandler (res) {
      // 时间控件
      this.queryForm.startCreateInvoiceDate = res ? res[0] : ''
      this.queryForm.endCreateInvoiceDate = res ? res[1] : ''
    },
    async changeStatus (status) {
      const res = await this.toAsync(editTrack({ id: this.selectVal.id, checkStatus: status }))
      if (!res) {
        return
      }
      this.mapVis = false
      this.fetchInit()
      this.$message({
        message: '改变状态成功',
        type: 'success'
      })
    },
    async valiRoad (row) {
      this.selectVal = row
      if (this.map) {
        this.map.clearMap()
      }
      let [success, res] = await this.toAsync(trackVali(this.selectVal.id))
      await this.$nextTick()
      if (!success) {
        this.mapVis = false
        return
      }
      let movePath = []
      this.mapVis = true
      if (!this.isCreateMap) {
        this.createMap()
      }
      let newArr = []
      res.forEach(item => {
        newArr = [parseInt(item.lon) / 600000, parseInt(item.lat) / 600000]
        movePath.push(newArr)
      })
      this.setMapMark(movePath)
    },
    async businessFetch (queryData) {
      let res = await getPagetrack(queryData)
        .then(res => res)
        .catch(() => false)
      return res
    },
    async createMap () {
      await this.$nextTick()
      this.map = new AMap.Map('container', {
        resizeEnable: true // 是否监控地图容器尺寸变化
      })
      this.isCreateMap = true
    },
    initPage (SimpleMarker, path) {
      let begin = new SimpleMarker({
        iconLabel: {
          // 普通文本
          innerHTML: '起',
          // 设置样式
          style: {
            color: '#fff',
            fontSize: '120%',
            marginTop: '2px'
          }
        },
        iconStyle: 'blue',
        map: this.map,
        position: path[0]
      })
      let end = new SimpleMarker({
        iconLabel: {
          // 普通文本
          innerHTML: '终',
          // 设置样式
          style: {
            color: '#fff',
            fontSize: '120%',
            marginTop: '2px'
          }
        },
        iconStyle: 'red',
        map: this.map,
        position: path[path.length - 1]
      })
      this.map.add(begin, end)
    },
    async setMapMark (path) {
      await this.$nextTick()

      let passedPolyline = new AMap.Polyline({
        // 真是行驶路径
        map: this.map,
        path: path,
        showDir: true,
        strokeColor: '#28F', // 行驶路径后的线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6 // 线宽
        // strokeStyle: "solid"  //线样式
      })
      AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
        this.initPage(SimpleMarker, path)
        this.map.add([passedPolyline])
        this.map.setFitView()
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.map-wrapper {
  height: 600px;
  width: 100%;
}
#container {
  width: 100%;
  height: 100%;
}
</style>
