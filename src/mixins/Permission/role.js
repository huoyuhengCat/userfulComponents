
// 菜单权限一系列操作
import { authcMenu } from '@/api/role'
const role = {
  data () {
    return {
      menuData: [], // 菜单数据
      defaultProps: {
        children: 'subMenu',
        label: 'menuName'
      },
      checkedKeys: []// 默认选中的keys
    }
  },
  methods: {
    fetchAuthcMenu (roleId) {
      this.resetAuthcMenu()
      authcMenu({ roleId: roleId }).then(res => {
        console.log(res)
        this.checkedKeys = res.idList
        this.menuData = res.menuList
      })
    },
    resetAuthcMenu () {
      this.checkedKeys = []
      this.menuData = []
    }
  }
}
export default role
