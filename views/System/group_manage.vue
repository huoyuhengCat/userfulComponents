<template>
  <div>
    <el-row>
      <el-button type="primary" @click="addOrgButton" size="small">新建组织</el-button>
    </el-row>
    <Tables
      :data="queryList"
      :config="queryListConfig"
      :loading="queryFormLoading"
      :page-config="config_page"
      :page-change="handleCurrentChange"
    >
    </Tables>
    <Dialog title="权限配置" :visible.sync="permissionDialogVis" save  :confirm="confirmHandler" :open="permissionDialogShow">
      <el-tree ref="menuTree" :data="menuData" :props="defaultProps" show-checkbox node-key="menuId" :default-checked-keys="checkedKeys"></el-tree>
    </Dialog>
    <Dialog title="编辑组织名字" :visible.sync="orgDialogVis" save :confirm="orgConfirmHandler" :open="orgDialogShow">
      <el-form label-width="80px" :model="orgForm" ref="orgForm" :rules="orgFormRules">
        <el-form-item label="中文名" prop="name" >
          <el-input placeholder="请输入中文名" v-model="orgForm.name"  ></el-input>
        </el-form-item>
        <el-form-item label="英文名" prop="nameEn" >
          <el-input placeholder="请输入英文名" v-model="orgForm.nameEn" ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>
<script>
import { ListOrgs, authcEdit, editOrg, addOrg } from '@/api/org'
import Tables from '@/components/Tables'
import Dialog from '@/components/Dialog'
import org from '@/mixins/System/org'
import query from '@/mixins/query'
import { isEnglishName } from '@/utils/validate'
export default {
  components: {
    Tables, Dialog
  },
  mixins: [org, query],
  data () {
    return {
      queryListConfig: [
        { prop: 'id', label: '序号', width: 50, align: 'center' },
        { prop: 'name', label: '中文名' },
        { prop: 'nameEn', label: '英文名' },
        { prop: 'type', label: '类型', filter: 'formatSystemType' },
        { prop: 'createTime', label: '创建时间' },
        {
          prop: 'btns',
          label: '操作',
          width: 310,
          button: [
            {
              name: '菜单权限',
              type: 'primary',
              click: this.menuPermissionButton
            },
            {
              name: '角色权限',
              type: 'danger',
              click: () => {
                this.$router.push({ path: '/root_manage' })
              }
            },
            {
              name: '编辑',
              click: this.editOrgNameButton
            }
          ]
        }],
      permissionDialogVis: false,
      orgDialogVis: false,
      orgForm: {
        name: '',
        nameEn: ''
      },
      orgFormRules: {
        name: [{ required: true, message: '请先填写中文名' }],
        nameEn: [{ required: true, message: '请先填写英文名' }, { validator: isEnglishName }, { min: 1, max: 50, message: '长度在 1 到 50 个字符' }]
      },
      selectVal: null
    }
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    async businessFetch (queryData) {
      const res = await ListOrgs(queryData).then(res => res).catch(() => false)
      return res
    },
    permissionDialogShow () {
      // 权限配置弹窗弹出时重置
      this.resetAuthcMenu()
    },
    confirmHandler () {
      let editData = {
        menuIds: this.$refs['menuTree'].getCheckedKeys().join(','),
        orgId: this.selectVal.id
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
    },
    menuPermissionButton (row) {
      this.selectVal = row
      this.permissionDialogVis = true
      this.fetchAuthcMenu(row.id)
    },
    orgDialogShow () {
      // 修改名字弹窗弹出时重置
      this.$nextTick(() => {
        this.$refs['orgForm'].resetFields()
        this.lodash.merge(this.orgForm, this.lodash.pick(this.selectVal, ['name', 'nameEn']))
      })
    },
    async orgConfirmHandler () {
      let validate = await this.$refs['orgForm'].validate().then(() => true).catch(() => false)
      if (!validate) { return false }
      this.$confirm('确认提交吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let postData = {
          orgName: this.orgForm['name'],
          orgNameEn: this.orgForm['nameEn']
        }
        let res
        if (this.selectVal) {
          postData['id'] = this.selectVal['id']
          res = await editOrg(postData).then(() => true).catch(msg => msg)
        } else {
          res = await addOrg(postData).then(() => true).catch(msg => msg)
        }
        this.orgDialogVis = false
        if (res === true) {
          this.$message.success('提交成功')
          this.fetchList()
        } else {
          this.$message.error(res)
        }
      })
    },
    editOrgNameButton (row) {
      this.selectVal = row
      this.orgDialogVis = true
    },
    addOrgButton () {
      this.selectVal = null
      this.orgDialogVis = true
    }

  }
}
</script>
<style lang='scss' scoped>
</style>
