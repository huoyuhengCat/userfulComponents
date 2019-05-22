<script>
import Vue from 'vue'
export default {
  name: 'tableColumn',
  props: {
    column: {
      type: [Array, Object],
      default: null
    },
    value: {
      type: [Array, Object, String, Number],
      default: null
    },
    scope: {
      type: [Array, Object, String, Number],
      default: null
    }
  },
  data () {
    return {
      Vue
    }
  },
  mounted () {
  },
  render () {
    if (this.column.hasOwnProperty('type') && this.column.type === 'index') {
      return this.index()
    } else if (this.column.hasOwnProperty('type') && this.column.type === 'selection') {
      return this.selectType()
    } else if (this.column.hasOwnProperty('button')) {
      return this.createBtn()
    } else if (this.column.hasOwnProperty('children')) {
      return this.createChildren()
    } else if (this.column.hasOwnProperty('slotName')) {
      return this.createSlot()
    } else {
      return this.createNormal()
    }
  },
  methods: {
    createBtn () {
      // 创建表单字段为按钮
      let customOptions = {
        scopedSlots: {
          default: scope => {
            return this.$createElement('el-row', this.column.button.map((item) => {
              if (item.bind) {
                if (scope.row[item.bind.key] == item.bind.value) {
                  return this.createElButton(item, scope)
                }
              } else if (item.express) {
                if (item.express(scope.row)) {
                  return this.createElButton(item, scope)
                }
              } else {
                return this.createElButton(item, scope)
              }
            }))
          }
        }
      }
      return this.createTableColumn(customOptions)
    },
    index () {
      // 序列号
      let customizeOptions = {
        props: {
          width: this.column.width || 50, // 默认序列宽度为50
          type: 'index'
        }
      }
      return this.createTableColumn(customizeOptions)
    },
    selectType () {
      // 表单选择
      let customizeOptions = {
        props: {
          width: this.column.width || 50, // 默认序列宽度为50
          type: 'selection',
          selectable: this.column.selectable || null
        }
      }
      return this.createTableColumn(customizeOptions)
    },
    createChildren () {
      // 表单字段为多级表头
      return this.createTableColumn('span', {}, [this.column.children.map((item) => {
        // 不确定深度的表头自动递归
        return this.$createElement('table-column', {
          props: {
            column: item
          }
        })
      })
      ])
    },
    createSlot () {
      // 自定义插槽表单字段
      return this.createTableColumn({}, [this.$scopedSlots[this.column.slotName]])
    },
    createNormal () {
      // 常规表单字段
      let customizeOptions = {
        scopedSlots: {
          default: scope => {
            let value = scope.row[this.column.prop]
            if (this.column.hasOwnProperty('formatter')) {
              value = this.column.formatter(value, scope.row)
            } else if (this.column.hasOwnProperty('filter')) {
              value = Vue.filter(this.column.filter)(value)
            }
            return this.$createElement('span', {
              domProps: {
                innerHTML: value
              }
            })
          }
        }
      }
      return this.createTableColumn(customizeOptions)
    },
    createTableColumn (customizeOptions, vnode) {
      let baseOptions = {
        props: {
          label: this.column.label,
          prop: this.column.prop,
          type: this.column.type || null,
          align: this.column.align || 'center',
          width: this.column.width || null,
          sortable: this.column.sortable || false,
          'show-overflow-tooltip': true
        }
      }
      let finalOptions = this.lodash.merge(baseOptions, customizeOptions)
      return this.$createElement('el-table-column', finalOptions, vnode)
    },
    createElButton (item, scope) {
      return this.$createElement('el-button', {
        props: {
          size: item.size || 'small',
          type: item.type || 'primary'
        },
        on: {
          click: () => item.click(scope.row)
        },
        domProps: {
          innerHTML: item.name
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
