<template>
  <div>
    <el-row>
      <el-button type="primary" @click="addGroupButton" size="small">新增组</el-button>
      <el-tabs v-model="groupTabsValue" @tab-click="tabClick">
        <el-tab-pane
          :key="item.roleId"
          v-for="(item) in groupTabsArr"
          :label="item.roleName"
          :name="item.roleId"
        >
          <el-row v-if="item.roleId!=='2'">
            <el-button size="small" @click="editRoleButton({roleId:item.roleId,roleName:item.roleName})">修改组名称</el-button>
            <el-button size="small" @click="menuPermissionButton(item)">组菜单权限</el-button>
            <el-button  size="small" type="danger" @click="deleteGroup(item.roleId)">删除组</el-button>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <Tables
        :data="queryList"
        :config="queryListConfig"
        :page-show="pageShow"
      >
      </Tables>
      <el-row>
        <el-button size="small" @click="addGroupButton('role')">新增角色</el-button>
      </el-row>
    </el-row>
    <Dialog title="新增" :visible.sync="roleAddDialogVis" save :confirm="roleAddConfirmHandler" :open="addShow">
      <el-form label-width="80px" :model="roleAddForm" ref="roleAddForm" :rules="roleAddFormRules">
        <el-form-item label="名称：" prop="roleName" >
          <el-input placeholder="请输入名称" v-model="roleAddForm.roleName" ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog title="编辑" :visible.sync="roleEditDialogVis" save :confirm="roleEditConfirmHandler" :open="editShow">
      <el-form label-width="80px" :model="roleEditForm" ref="roleEditForm" :rules="roleEditFormRules">
        <el-form-item label="名称：" prop="roleName" >
          <el-input placeholder="请输入名称" v-model="roleEditForm.roleName"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog title="权限配置" :visible.sync="permissionDialogVis" save  :confirm="confirmHandler" :open="permissionDialogShow">
      <el-tree ref="menuTree" :data="menuData" :props="defaultProps" show-checkbox node-key="menuId" :default-checked-keys="checkedKeys"></el-tree>
    </Dialog>
  </div>
</template>
<script>
import { groupList, addRole, getList, deleteRole, editRole, authcEdit } from '@/api/role'
import Tables from '@/components/Tables'
import Dialog from '@/components/Dialog'
import query from '@/mixins/query'
import role from '@/mixins/Permission/role'
export default {
  components: {
    Tables, Dialog
  },
  mixins: [query, role],
  data () {
    return {
      groupTabsValue: '2', // 默认系统组
      groupTabsArr: [],
      roleAddDialogVis: false, // 新增弹窗vis
      roleEditDialogVis: false, // 编辑弹窗vis
      roleAddForm: {
        roleName: ''
      },
      roleEditForm: {
        roleName: ''
      },
      roleAddFormRules: {
        roleName: [{ required: true, message: '请输入名称' }]
      },
      roleEditFormRules: {
        roleName: [{ required: true, message: '请输入名称' }]
      },
      pageShow: false,
      queryForm: {
        roleId: '2'
      },
      mode: '',
      nowFormName: '',
      queryListConfig: [
        { label: '序号', type: 'index', width: 50, align: 'center' },
        { label: '角色', prop: 'roleName' },
        {
          prop: 'btns',
          label: '操作',
          width: 300,
          button: [
            {
              name: '菜单权限',
              type: 'primary',
              click: this.menuPermissionButton
            },
            {
              name: '编辑',
              type: 'primary',
              click: this.editRoleButton
            },
            {
              name: '删除',
              type: 'danger',
              click: this.deleteRoleButton
            }
          ]
        }
      ],
      permissionDialogVis: false,
      selectVal: null
    }
  },
  mounted () {
    this.fetchGroupList()
    this.fetchList()
  },
  watch: {
    groupTabsValue (newVal) {
      this.queryForm.roleId = newVal
    }
  },
  methods: {
    async businessFetch (queryData) {
      const res = await getList(queryData).then(res => res).catch(() => false)
      if (res) {
        return {
          rows: res
        }
      }
      return false
    },
    fetchGroupList () {
      groupList({ orgId: '' }).then(res => {
        this.groupTabsArr = res
      })
    },
    addGroupButton (val) {
      this.roleAddDialogVis = true
      if (val === 'role') {
        this.mode = 'role'
      } else {
        this.mode = 'group'
      }
    },
    async roleAddConfirmHandler () {
      let validate = await this.$refs['roleAddForm'].validate().then(() => true).catch(() => false)
      if (!validate) { return false }
      this.$confirm('确认提交？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let postData = this.lodash.cloneDeep(this.roleAddForm)
        let res
        if (this.mode === 'role') {
          postData.parentId = this.groupTabsValue
          res = await addRole(postData).then(() => true).catch(msg => msg)
        } else {
          postData.parentId = '0'
          res = await addRole(postData).then(() => true).catch(msg => msg)
        }

        if (res === true) {
          this.$message.success('提交成功')
          this.fetchGroupList()
          if (this.mode === 'role') {
            this.fetchList()
          }
        } else {
          this.$message.error(res)
        }
        this.roleAddDialogVis = false
      })
    },
    tabClick (self) {
      this.fetchList()
    },
    deleteHandler (roleId, cb) {
      this.$confirm('确认删除改组吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await deleteRole({ roleId: roleId }).then(() => true).catch(msg => msg)
        if (res === true) {
          this.$message.success('提交成功')
          this.fetchGroupList()
          if (cb) {
            cb()
          }
          this.fetchList()
        } else {
          this.$message.error(res)
        }
        this.roleAddDialogVis = false
      })
    },
    deleteGroup (roleId) {
      this.deleteHandler(roleId, () => {
        this.groupTabsValue = '2'
      })
    },
    deleteRoleButton (row) {
      this.deleteHandler(row.roleId)
    },
    editRoleButton (row) {
      this.roleEditDialogVis = true
      this.$nextTick(() => {
        this.roleEditForm = this.lodash.pick(row, ['roleName', 'roleId'])
      })
      // editRole
    },
    editHandler () {
      this.$confirm('确认修改名称吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await editRole(this.roleEditForm).then(() => true).catch(msg => msg)
        if (res === true) {
          this.$message.success('提交成功')
          this.fetchGroupList()
          this.fetchList()
        } else {
          this.$message.error(res)
        }
        this.roleEditDialogVis = false
      })
    },
    addShow () {
      this.$nextTick(() => {
        this.$refs['roleAddForm'].resetFields()
      })
    },
    editShow () {
      this.$nextTick(() => {
        this.$refs['roleEditForm'].resetFields()
      })
    },
    async roleEditConfirmHandler () {
      let validate = await this.$refs['roleEditForm'].validate().then(() => true).catch(() => false)
      if (!validate) { return false }
      this.editHandler()
    },
    permissionDialogShow () {
      // 权限配置弹窗弹出时重置
      this.resetAuthcMenu()
    },
    menuPermissionButton (row) {
      this.selectVal = row
      this.permissionDialogVis = true
      this.fetchAuthcMenu(row.roleId)
    },
    confirmHandler () {
      let editData = {
        menuIds: this.$refs['menuTree'].getCheckedKeys().join(','),
        roleId: this.selectVal.roleId
      }
      this.$confirm('确认提交吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await authcEdit(editData).then(() => true).catch(() => false)
        this.permissionDialogVis = false
        if (res) {
          this.$message.success('提交成功')
          this.$store.dispatch('updateMap')
        } else {
          this.$message.error('提交失败')
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
