<template>
  <div class="menu-manage">
    <div class="menu-flex">
      <el-tree class="menu-tree" ref="menuTree" :data="menuData" :props="defaultProps" node-key="menuId" @node-click="treeClickHandler" accordion></el-tree>
      <div class="menu-table-wrapper">
        <div class="menu-table">
          <Tables
            :data="queryList"
            :config="queryListConfig"
            :page-show="pageShow"
          >
          </Tables>
        </div>
        <el-row>
          <el-button @click="addButton" size="small">新增</el-button>
          <el-button @click="backButton" size="small">返回</el-button>
        </el-row>
      </div>
    </div>
    <Dialog title="编辑组织名字" :visible.sync="menuDialogVis" save :confirm="menuConfirmHandler" :open="menuDialogShow">
      <el-form label-width="80px" :model="menuForm" ref="menuForm" :rules="menuFromRules">
        <el-form-item label="上级：">
          <el-input disabled :value="preMenu.parentName"></el-input>
        </el-form-item>
        <el-form-item label="名称：" prop="menuName" >
          <el-input placeholder="请输入菜单名称" v-model="menuForm.menuName" ></el-input>
        </el-form-item>
        <el-form-item label="链接：" prop="menuUrl">
          <el-input  v-model="menuForm.menuUrl" ></el-input>
        </el-form-item>
        <el-form-item label="序号：" prop="menuOrder" >
          <el-input placeholder="请输入菜单序号" v-model="menuForm.menuOrder" ></el-input>
        </el-form-item>
        <el-form-item label="类型：" prop="menuType" >
          <el-radio-group v-model="menuForm.menuType">
            <el-radio label="1">系统菜单</el-radio>
            <el-radio label="2">业务菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态：" prop="menuState" >
          <el-radio-group v-model="menuForm.menuState">
            <el-radio label="1">显示</el-radio>
            <el-radio label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>
<script>
import { listAllMenu, getMenus, deleteMenu, editMenu, addMenu } from '@/api/menu'
import Tables from '@/components/Tables'
import Dialog from '@/components/Dialog'
import query from '@/mixins/query'
export default {
  components: {
    Tables, Dialog
  },
  mixins: [query],
  data () {
    return {
      menuData: [],
      defaultProps: {
        children: 'subMenu',
        label: 'menuName'
      },
      queryForm: {
        menuId: ''
      },
      pageShow: false,
      backId: '',
      queryListConfig: [
        { prop: 'id', label: '序号', type: 'index', width: 50, align: 'center' },
        { prop: 'menuName', label: '名称' },
        { prop: 'menuUrl', label: '资源路径' },
        { prop: 'menuType', label: '类型', filter: 'formatSystemType' },
        { prop: 'menuState', label: '状态', width: 50, filter: 'formatShowType' },
        {
          prop: 'btns',
          label: '操作',
          width: 175,
          button: [
            {
              name: '编辑',
              type: 'primary',
              click: this.editButton
            },
            {
              name: '删除',
              type: 'danger',
              click: this.menuDeleteButton
            }
          ]
        }],
      menuDialogVis: false,
      menuForm: {
        menuId: '',
        menuName: '',
        menuUrl: '',
        menuType: '1',
        menuState: '1',
        menuOrder: '',
        parentId: ''
      },
      mode: '',
      preMenu: {
        // 上级菜单的名字和id
        parentId: '',
        parentName: ''
      },
      menuFromRules: {
        menuName: [{ required: true, message: '请输入菜单名称' }],
        menuOrder: [{ required: true, message: '请输入菜单序号' }]
      }
    }
  },
  mounted () {
    this.fetchAllMenu()
    this.fetchList()
    this.setPreMenu()
  },
  methods: {
    fetchAllMenu () {
      listAllMenu().then(res => {
        this.menuData = res
      })
    },
    async businessFetch (queryData) {
      const res = await getMenus(queryData).then(res => res).catch(() => false)
      if (res) {
        this.backId = res.backId
        return {
          rows: res.menus
        }
      }
      return false
    },
    setPreMenu () {
      // 设置上级菜单
      try {
        let menuTree = this.$refs['menuTree']
        let preNode = menuTree.getNode(this.queryForm.menuId)
        this.preMenu = {
          parentId: preNode ? preNode.data.menuId : '0',
          parentName: preNode ? preNode.data.menuName : '顶级菜单'
        }
      } catch (error) {

      }
    },
    treeClickHandler (data, node, self) {
      if (self.expanded) {
        this.queryForm.menuId = data.parentId
      } else {
        this.queryForm.menuId = data.menuId
      }
      this.setPreMenu()
      this.fetchList()
    },
    backButton () {
      // 返回按钮
      this.queryForm.menuId = this.backId
      this.setPreMenu()
      this.fetchList()
    },
    menuDialogShow () {
      this.$nextTick(() => {
        this.$refs['menuForm'].resetFields()
      })
    },
    async menuConfirmHandler () {
      let validate = await this.$refs['menuForm'].validate().then(() => true).catch(() => false)
      if (!validate) { return false }
      let res
      if (this.mode === 'edit') {
        let editData = this.lodash.cloneDeep(this.menuForm)
        res = await editMenu(editData).then(() => true).catch(() => false)
      } else if (this.mode === 'add') {
        let addData = this.lodash.pick(this.menuForm, ['menuName', 'menuUrl', 'menuType', 'menuState', 'menuOrder'])
        addData.parentId = this.preMenu.parentId
        res = await addMenu(addData).then(() => true).catch(() => false)
      }
      this.menuDialogVis = false
      if (res === true) {
        this.$message.success('提交成功')
        this.$store.dispatch('updateMap')
        this.fetchList()
        this.fetchAllMenu()
        this.$store.dispatch('updateMap')
        return true
      } else {
        this.$message.error(res)
        return false
      }
    },
    editButton (row) {
      this.mode = 'edit'
      this.menuDialogVis = true
      this.$nextTick(() => {
        this.menuForm = this.lodash.pick(row, ['menuId', 'menuName', 'menuUrl', 'menuType', 'menuState', 'menuOrder', 'parentId'])
      })
    },
    addButton () {
      // 新建按钮
      this.mode = 'add'
      this.menuDialogVis = true
    },
    menuDeleteButton (row) {
      this.$confirm('确认删除此条吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let postData = {
          menuId: row.menuId
        }
        let res = await deleteMenu(postData).then(() => true).catch(msg => msg)
        if (res === true) {
          this.$message.success('提交成功')
          this.$refs['menuTree'].remove(row.menuId)
          this.fetchList()
          this.$store.dispatch('updateMap')
        } else {
          this.$message.error(res)
        }
      })
    }
  }

}
</script>
<style lang='scss' scoped>
.menu-manage{
  & .menu-tree{
    width: 250px;
    border: 1px solid #b5b5b5;
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: 20px;
  }
  & .menu-flex{
    display: flex;
    align-items:flex-start;
    justify-items: space-around;
    & .menu-table-wrapper{
      width: calc(100% - 250px - 20px);
      .menu-table{
        min-height: 300px;
      }
    }
  }
}
</style>
