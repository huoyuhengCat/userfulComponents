<template>
  <div>
    <el-form :inline="true" :model="queryForm">
      <el-button @click="queryHandler" size="medium" type="primary">查询</el-button>
      <el-button @click="resetHandler" size="medium">重置</el-button>
      <el-button @click="addeditHandler('add')" size="medium">新增</el-button>
    </el-form>
    <Tables
      :data="queryList"
      :config="queryListConfig"
      :page-config="config_page"
      :page-change="handleCurrentChange"
    >
    </Tables>
    <Dialog title="详情" :visible.sync="modalDialogVis" save :confirm="modalConfirm" :open="modalOpen">
      <el-form label-width="80px" :model="modalForm" ref="modalForm" :rules="modalFormRules">
        <el-form-item label="角色" prop="roleId" >
          <el-cascader
            :options="options"
            v-model="modalForm.roleId"
            :props="props" :show-all-levels="false">
          </el-cascader>
          <!-- <el-input placeholder="请输入中文名" v-model="modalForm.roleId"  ></el-input> -->
        </el-form-item>
        <el-form-item label="用户名" prop="username" >
          <el-input placeholder="请输入用户名" v-model="modalForm.username" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input type="password" placeholder="请输入密码" v-model="modalForm.password" ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" >
          <el-input placeholder="请输入邮箱" v-model="modalForm.email" ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" >
          <el-input placeholder="请输入姓名" v-model="modalForm.name" ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone" >
          <el-input placeholder="请输入手机" v-model="modalForm.phone" ></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="number" >
          <el-input placeholder="请输入编号" v-model="modalForm.number" ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="bz" >
          <el-input  v-model="modalForm.bz" ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>
<script>
import Tables from '@/components/Tables'
import Dialog from '@/components/Dialog'
import query from '@/mixins/query'
import { listAllRoles } from '@/api/role'
import { listUsers, userDetail, saveUser, editUser, deleteUser } from '@/api/user'
import { isvalidEmail, isvalidPhone, isPassword } from '@/utils/validate'
export default {
  components: {
    Tables,
    Dialog
  },
  mixins: [query],
  inject: ['reload'],
  data () {
    return {
      queryListConfig: [
        { label: '序号', type: 'index' },
        { label: '用户名', prop: 'username' },
        { label: '姓名', prop: 'name' },
        { label: '角色', prop: 'roleName' },
        { label: '邮箱', prop: 'email' },
        { label: '手机号码', prop: 'phone' },
        {
          prop: 'btns',
          label: '操作',
          width: 310,
          button: [
            {
              name: '编辑',
              type: 'primary',
              click: this.addeditHandler
            },
            {
              name: '删除',
              type: 'danger',
              click: this.deleteHanlder
            }
          ]
        }],
      queryForm: {
        keywords: '',
        lastLoginStart: ''
      },
      modalDialogVis: false,
      modalForm: {
        bz: '',
        email: '',
        name: '',
        password: '',
        phone: '',
        roleId: [],
        number: '',
        username: ''
      },
      modalFormRules: {
        roleId: [{ required: true, message: '请先选择角色' }],
        username: [{ required: true, message: '请先填写用户名' }],
        password: [{ required: true, message: '请先填写密码' }, { validator: isPassword }],
        email: [{ required: true, message: '请先填写邮箱' }, { validator: isvalidEmail }],
        name: [{ required: true, message: '请先填写姓名' }, { min: 2, max: 8, message: '长度在 2 到 8 个字符' }],
        phone: [{ required: true, message: '请先填写手机' }, { validator: isvalidPhone }]
      },
      options: [],
      selectedRowId: [],
      mode: '',
      props: {
        label: 'roleName',
        value: 'roleId',
        children: 'childRoleList'
      }
    }
  },
  mounted () {
    this.fetchAllRole()
    this.fetchList()
  },
  methods: {
    async businessFetch (queryData) {
      let res = await listUsers(queryData).then(res => res).catch(() => false)
      return res
    },
    addeditHandler (val) {
      this.modalDialogVis = true
      if (val !== 'add') {
        this.mode = 'edit'
        this.$nextTick(async () => {
          let res = await userDetail({ userId: val.userId }).then(res => res).catch(() => false)
          this.modalFormRules['password'][0].required = false
          this.modalForm = this.lodash.pick(res, ['roleName', 'username', 'email', 'bz', 'name', 'phone', 'number', 'userId'])
          this.modalForm.roleId = [res.parentRoleId, res.roleId]
        })
      } else {
        this.mode = 'add'
        this.modalFormRules['password'][0].required = true
      }
    },
    deleteHanlder (row) {
      this.$confirm('确认删除此条吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let postData = {
          userId: row.userId
        }
        let res = await deleteUser(postData).then(() => true).catch(msg => msg)
        if (res === true) {
          this.$message.success('提交成功')
          this.fetchList()
        } else {
          this.$message.error(res)
        }
      })
    },
    async modalConfirm () {
      let validate = await this.$refs['modalForm'].validate().then(() => true).catch(() => false)
      if (!validate) { return false }
      let postData = this.lodash.cloneDeep(this.modalForm)
      postData.roleId = (this.lodash.cloneDeep(this.modalForm.roleId)).pop()
      let res
      if (this.mode === 'add') {
        res = await saveUser(postData).then(res => true).catch(() => false)
      } else {
        res = await editUser(postData).then(res => true).catch(() => false)
        delete this.modalForm['userId']
      }

      this.modalDialogVis = false
      if (res === true) {
        this.$message.success('提交成功')
        this.fetchList()
        this.fetchAllRole()
      } else {
        this.$message.error(res)
      }
    },
    fetchAllRole () {
      listAllRoles().then(res => {
        this.options = res
      })
    },
    modalOpen () {
      this.$nextTick(() => {
        this.$refs['modalForm'].resetFields()
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
