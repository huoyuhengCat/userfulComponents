const query = {
  data () {
    return {
      config_page: {
        currentPage: 1,
        pageSize: 10, // 默认
        total: 0
      },
      queryFormLoading: false,
      pageShow: true,
      queryForm: {},
      prevQuery: {},
      queryList: [],
      queryListConfig: [],
      selectTime: ''
    }
  },
  methods: {
    timeHandler (res) {
      // 时间控件
      this.queryForm.startTime = res ? res[0] : ''
      this.queryForm.endTime = res ? res[1] : ''
    },
    resetHandler () {
      // 重置按钮
      this.reload()
    },
    queryHandler () {
      // 查询按钮
      this.config_page.currentPage = 1
      this.fetchList()
    },
    handleCurrentChange (index) {
      // 点分页时的查询
      this.fetchList(true)
    },
    async fetchList (bool) {
      // bool是true 代表点击分页回调时查询  false为点查询按钮查询
      try {
        this.queryForm = this.$refs['queryForm'].getQueryData()
      } catch (error) {

      }
      this.queryList = []
      this.queryFormLoading = true
      if (bool) {
        this.queryForm = this.lodash.cloneDeep(this.preQuery)
        try {
          this.$refs['queryForm'].setQueryData(this.queryForm)
        } catch (error) {

        }
      }
      let queryData
      if (this.pageShow) {
        // 需要page插件时
        queryData = this.lodash.merge({ currentPage: this.config_page.currentPage, showCount: this.config_page.pageSize }, this.queryForm)
      } else {
        // 不需要page插件时
        queryData = this.queryForm
      }
      const res = await this.businessFetch(queryData)
      if (!bool) {
        this.preQuery = this.lodash.cloneDeep(this.queryForm)
      }
      this.queryList = res.rows
      this.config_page.total = res.total
      this.queryFormLoading = false
    }
  }
}
export default query
