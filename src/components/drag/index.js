import DragGroup from './src/drag-group.vue'
import Drag from './src/drag.vue'

DragGroup.install = function (Vue) {
  Vue.component(DragGroup.name, DragGroup)
}

Drag.install = function (Vue) {
  Vue.component(Drag.name, Drag)
}

export { DragGroup, Drag }
export default Drag
