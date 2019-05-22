const business = {
  data () {
    return {
      selectVal: '',
      mode: '',
      modalDialogVis: false
    }
  },
  methods: {
    fetchQuery () {
      // 请求查询项里的select组建
    },
    fetchInit () {
      this.fetchList()
      this.fetchQuery()
    },
    async detailHandler (row) {
      this.modalDialogVis = true
      this.mode = 'detail'
      let res = await this.detailApi(row)
      await this.$nextTick()
      this.$refs['modalForm'].showDetail('list')
      this.$refs['modalForm'].setData(res)
    },
    editHandler () {

    },
    addHandler () {

    },
    async addeditHandler (val) {
      this.modalDialogVis = true
      await this.$nextTick()
      this.$refs['modalForm'].showDetail('form')
      if (val !== 'add') {
        this.mode = 'edit'
        this.selectVal = val
        this.editHandler()// 编辑方法 建议此处修改数据
        await this.$nextTick()
        this.$refs['modalForm'].setData(val)
      } else {
        this.mode = 'add'
        this.addHandler()// 新增方法 建议此处修改数据
        await this.$nextTick()
        this.$refs['modalForm'].setData()
      }
    },
    deleteHandler (row) {
      this.$confirm('确认删除此条吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let postData = {
          id: row.id
        }
        let res = await this.deleteApi(postData)
        if (res === true) {
          this.$message.success('提交成功')
          this.fetchInit()
        } else {
          this.$message.error(res)
        }
      })
    },
    async modalConfirm () {
      if (this.mode === 'detail') { this.modalDialogVis = false; return false }
      let validate = await this.$refs['modalForm'].validate()
      if (!validate) { return false }
      let postData = this.lodash.cloneDeep(this.$refs['modalForm'].getData())
      let res = false
      res = await this[`${this.mode}Api`](postData)
      this.modalDialogVis = false
      if (res === true) {
        this.$message.success('提交成功')
        this.fetchInit()// 完成增删改接口后回调
      } else {
        this.$message.error('提交失败')
        console.error(res)
      }
    },
    modalOpen () {
      try {
        this.$refs['modalForm'].resetFields()
      } catch (error) {
      }
    }
  }
}
export default business
