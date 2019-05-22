
// 菜单权限一系列操作
import { authcMenu } from '@/api/org'
const org = {
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
    fetchAuthcMenu (orgId) {
      this.resetAuthcMenu()
      authcMenu({ orgId: orgId }).then(res => {
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
export default org
