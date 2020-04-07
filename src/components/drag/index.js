import DragContainer from './src/drag-container.vue'
import Drag from './src/drag.vue'

DragContainer.install = function (Vue) {
  Vue.component(DragContainer.name, DragContainer)
}

Drag.install = function (Vue) {
  Vue.component(Drag.name, Drag)
}

export { DragContainer, Drag }
export default Drag
